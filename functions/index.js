/**
 * Firebase Cloud Functions for Global Plate
 * Week 9 Studio: Cloud Functions Implementation
 *
 * BR (E.1): Cloud Functions - Serverless functionality
 * BR (D.2): Email - SendGrid API Integration
 */

// eslint-disable-next-line
const { onRequest } = require('firebase-functions/v2/https')
// eslint-disable-next-line
const { onDocumentCreated } = require('firebase-functions/v2/firestore')
// eslint-disable-next-line
const admin = require('firebase-admin')
// eslint-disable-next-line
const sgMail = require('@sendgrid/mail')
// eslint-disable-next-line
const cors = require('cors')({ origin: true })

// Firebase Admin初期化
// Initialize Firebase Admin
admin.initializeApp()

// Firestore参照
// Firestore reference
const db = admin.firestore()

// SendGrid API Keyの設定
// SendGrid API Key configuration
// 注意: functions.config()は非推奨なので、環境変数を使用します
// Note: functions.config() is deprecated, use environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

if (!SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not set. Email functions will not work.')
}

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

// =============================================================================
// BR (E.1): Cloud Functions - Example Function
// Week 9 Studio: countBooks function
// =============================================================================

/**
 * HTTP Cloud Function to count books in Firestore
 * Week 9 Studio 教材に基づく実装
 */
exports.countBooks = onRequest({ cors: true }, async (req, res) => {
  try {
    // Firestoreから'books'コレクションを取得
    // Get 'books' collection from Firestore
    const booksCollection = db.collection('books')
    const snapshot = await booksCollection.get()

    const count = snapshot.size
    const books = []

    snapshot.forEach((doc) => {
      books.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return res.status(200).json({
      success: true,
      count: count,
      books: books,
    })
  } catch (error) {
    console.error('Error counting books:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to count books',
      details: error.message,
    })
  }
})

// =============================================================================
// BR (E.1): Cloud Functions - Firestore Trigger
// Week 9 Studio: Capitalize book data on creation
// =============================================================================

/**
 * Firestore Trigger: 新しい本が追加されたときにデータを大文字化
 * Firestore Trigger: Capitalize data when new book is added
 */
exports.capitalizeBookData = onDocumentCreated('books/{bookId}', async (event) => {
  try {
    const snapshot = event.data
    if (!snapshot) {
      console.log('No data associated with the event')
      return
    }

    const newBook = snapshot.data()

    // タイトルと著者名を大文字化
    // Capitalize title and author name
    const capitalizedData = {
      name: newBook.name ? newBook.name.toUpperCase() : '',
      isbn: newBook.isbn,
    }

    // Firestoreを更新
    // Update Firestore
    await snapshot.ref.update(capitalizedData)

    console.log(`Book ${event.params.bookId} capitalized successfully`)
  } catch (error) {
    console.error('Error capitalizing book data:', error)
  }
})

// =============================================================================
// BR (D.2): Email - SendGrid API Integration
// =============================================================================

/**
 * HTTP Cloud Function to send email with attachment
 * Week 9教材とプロジェクトに基づく実装
 */
exports.sendEmail = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { to, subject, text, html, attachment } = req.body

    // 必須フィールドのバリデーション
    // Validate required fields
    if (!to || !subject || !text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, text',
      })
    }

    // メールメッセージの構築
    // Build email message
    const msg = {
      to: to,
      from: 'tsak0007@student.monash.edu', // 認証済みのSendGrid送信者アドレス
      subject: subject,
      text: text,
      html: html || text,
    }

    // 添付ファイルがある場合は追加
    // Add attachment if provided
    if (attachment && attachment.content && attachment.filename) {
      msg.attachments = [
        {
          content: attachment.content, // Base64エンコードされたコンテンツ
          filename: attachment.filename,
          type: attachment.type || 'application/octet-stream',
          disposition: 'attachment',
        },
      ]
    }

    // SendGrid経由でメール送信
    // Send email via SendGrid
    await sgMail.send(msg)

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      to: to,
      subject: subject,
    })
  } catch (error) {
    console.error('SendGrid Error:', error)

    if (error.response) {
      return res.status(error.response.statusCode || 500).json({
        success: false,
        error: 'Failed to send email',
        details: error.response.body,
      })
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    })
  }
})

/**
 * HTTP Cloud Function to send bulk emails
 * BR (F.1): Innovation - Bulk Email機能
 */
exports.sendBulkEmail = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { recipients, subject, text, html } = req.body

    // バリデーション
    // Validation
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Recipients array is required and must not be empty',
      })
    }

    if (!subject || !text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: subject, text',
      })
    }

    // 各受信者へのメール送信
    // Send email to each recipient
    const emailPromises = recipients.map((recipient) => {
      const msg = {
        to: recipient,
        from: 'tsak0007@student.monash.edu',
        subject: subject,
        text: text,
        html: html || text,
      }
      return sgMail.send(msg)
    })

    await Promise.all(emailPromises)

    return res.status(200).json({
      success: true,
      message: `Bulk email sent successfully to ${recipients.length} recipients`,
      count: recipients.length,
    })
  } catch (error) {
    console.error('Bulk Email Error:', error)

    return res.status(500).json({
      success: false,
      error: 'Failed to send bulk emails',
      details: error.message,
    })
  }
})

// =============================================================================
// BR (E.1): Cloud Functions - Recipe関連機能
// =============================================================================

/**
 * Cloud Function: レシピの栄養情報を自動計算
 * Calculate nutrition information for recipes
 */
exports.calculateNutrition = onDocumentCreated('recipes/{recipeId}', async (event) => {
  try {
    const snapshot = event.data
    if (!snapshot) {
      console.log('No data associated with the event')
      return
    }

    const recipe = snapshot.data()

    // 簡易的な栄養計算（実際のプロジェクトでは外部APIを使用）
    // Simple nutrition calculation (use external API in actual project)
    const estimatedCalories = recipe.ingredients?.length * 100 || 0

    const nutritionData = {
      calories: estimatedCalories,
      calculatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    await snapshot.ref.update({ nutrition: nutritionData })

    console.log(`Nutrition calculated for recipe ${event.params.recipeId}`)
  } catch (error) {
    console.error('Error calculating nutrition:', error)
  }
})

/**
 * HTTP Cloud Function: ユーザー統計を取得
 * Get user statistics for Admin Dashboard
 * BR (F.1): Innovation - Admin Dashboard機能
 */
exports.getUserStats = onRequest({ cors: true }, async (req, res) => {
  try {
    // ユーザー数を取得
    // Get user count
    const usersSnapshot = await db.collection('users').get()
    const totalUsers = usersSnapshot.size

    // ロール別のユーザー数を集計
    // Count users by role
    let adminCount = 0
    let userCount = 0

    usersSnapshot.forEach((doc) => {
      const userData = doc.data()
      if (userData.role === 'admin') {
        adminCount++
      } else {
        userCount++
      }
    })

    // レシピ数を取得
    // Get recipe count
    const recipesSnapshot = await db.collection('recipes').get()
    const totalRecipes = recipesSnapshot.size

    // イベント数を取得
    // Get event count
    const eventsSnapshot = await db.collection('events').get()
    const totalEvents = eventsSnapshot.size

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: totalUsers,
        adminUsers: adminCount,
        regularUsers: userCount,
        totalRecipes: totalRecipes,
        totalEvents: totalEvents,
      },
    })
  } catch (error) {
    console.error('Error getting user stats:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to get user statistics',
      details: error.message,
    })
  }
})
