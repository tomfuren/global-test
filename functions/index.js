const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const sgMail = require('@sendgrid/mail')

// Firebase Admin初期化
admin.initializeApp()

// SendGrid API Key設定 - 環境変数から取得
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

console.log('=== SendGrid Configuration ===')
console.log('API Key loaded:', SENDGRID_API_KEY ? 'YES' : 'NO')

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
  console.log('SendGrid initialized successfully')
} else {
  console.error('SENDGRID_API_KEY is not set!')
}

// =============================================================================
// BR (D.2): Email - SendGrid API Integration (2nd Gen)
// =============================================================================

/**
 * メール送信機能
 */
exports.sendEmail = onRequest({ cors: true }, async (req, res) => {
  console.log('=== sendEmail function called ===')
  console.log('Method:', req.method)

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { to, subject, text, html, attachment } = req.body
    console.log('Email request:', { to, subject })

    if (!to || !subject || !text) {
      console.error('Missing required fields')
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, text',
      })
    }

    if (!SENDGRID_API_KEY) {
      console.error('SendGrid API Key is not configured')
      return res.status(500).json({
        success: false,
        error: 'SendGrid API Key is not configured',
      })
    }

    const msg = {
      to: to,
      from: {
        email: 'st.kosen.711@gmail.com',
        name: 'Global Plate Support',
      },
      subject: subject,
      text: text,
      html: html || text,
    }

    if (attachment && attachment.content && attachment.filename) {
      msg.attachments = [
        {
          content: attachment.content,
          filename: attachment.filename,
          type: attachment.type || 'application/octet-stream',
          disposition: 'attachment',
        },
      ]
      console.log('Attachment added:', attachment.filename)
    }

    console.log('Sending email via SendGrid...')
    await sgMail.send(msg)
    console.log('Email sent successfully!')

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      to: to,
      subject: subject,
    })
  } catch (error) {
    console.error('=== SendGrid Error ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Full error:', error)

    if (error.response) {
      console.error('SendGrid response:', error.response.body)
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

// =============================================================================
// BR (E.1): Cloud Functions - Firestore データカウント機能 (2nd Gen)
// =============================================================================

/**
 * レシピの総数をカウントする機能
 *
 * 機能概要:
 * - Firestoreの'recipes'コレクション内のドキュメント数をカウント
 * - HTTPリクエストで呼び出し可能
 * - CORS対応で外部からのアクセスを許可
 */
exports.countRecipes = onRequest({ cors: true }, async (req, res) => {
  console.log('=== countRecipes function called ===')

  try {
    // Firestoreから'recipes'コレクションを取得
    const recipesCollection = admin.firestore().collection('recipes')

    // コレクション内の全ドキュメントを取得
    const snapshot = await recipesCollection.get()

    // ドキュメント数をカウント
    const count = snapshot.size

    console.log(`Total recipes count: ${count}`)

    // 成功レスポンスを返す
    return res.status(200).json({
      success: true,
      count: count,
      message: 'Successfully counted recipes',
    })
  } catch (error) {
    // エラーハンドリング
    console.error('Error counting recipes:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to count recipes',
    })
  }
})

/**
 * ユーザーの総数をカウントする機能
 *
 * 機能概要:
 * - Firestoreの'users'コレクション内のドキュメント数をカウント
 * - ロール別（admin/user）の内訳も提供
 */
exports.countUsers = onRequest({ cors: true }, async (req, res) => {
  console.log('=== countUsers function called ===')

  try {
    const usersCollection = admin.firestore().collection('users')
    const snapshot = await usersCollection.get()

    // 総数とロール別カウント
    let totalUsers = snapshot.size
    let adminCount = 0
    let studentCount = 0

    snapshot.forEach((doc) => {
      const userData = doc.data()
      if (userData.role === 'admin') {
        adminCount++
      } else {
        studentCount++
      }
    })

    console.log(`Total users: ${totalUsers}, Admins: ${adminCount}, Students: ${studentCount}`)

    return res.status(200).json({
      success: true,
      totalUsers: totalUsers,
      adminUsers: adminCount,
      studentUsers: studentCount,
      message: 'Successfully counted users',
    })
  } catch (error) {
    console.error('Error counting users:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to count users',
    })
  }
})

/**
 * イベントの総数をカウントする機能
 */
exports.countEvents = onRequest({ cors: true }, async (req, res) => {
  console.log('=== countEvents function called ===')

  try {
    const eventsCollection = admin.firestore().collection('events')
    const snapshot = await eventsCollection.get()
    const count = snapshot.size

    console.log(`Total events count: ${count}`)

    return res.status(200).json({
      success: true,
      count: count,
      message: 'Successfully counted events',
    })
  } catch (error) {
    console.error('Error counting events:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to count events',
    })
  }
})

/**
 * 国別グループの総数をカウントする機能
 */
exports.countGroups = onRequest({ cors: true }, async (req, res) => {
  console.log('=== countGroups function called ===')

  try {
    const groupsCollection = admin.firestore().collection('groups')
    const snapshot = await groupsCollection.get()
    const count = snapshot.size

    console.log(`Total groups count: ${count}`)

    return res.status(200).json({
      success: true,
      count: count,
      message: 'Successfully counted groups',
    })
  } catch (error) {
    console.error('Error counting groups:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to count groups',
    })
  }
})

/**
 * すべての統計情報を一度に取得する機能
 *
 * 機能概要:
 * - 全コレクションの統計を一度のリクエストで取得
 * - 効率的なダッシュボード表示に最適
 */
exports.getStats = onRequest({ cors: true }, async (req, res) => {
  console.log('=== getStats function called ===')

  try {
    const db = admin.firestore()

    // 並列で全コレクションのデータを取得
    const [usersSnapshot, recipesSnapshot, eventsSnapshot, groupsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('recipes').get(),
      db.collection('events').get(),
      db.collection('groups').get(),
    ])

    // ユーザーのロール別カウント
    let adminCount = 0
    let studentCount = 0

    usersSnapshot.forEach((doc) => {
      const userData = doc.data()
      if (userData.role === 'admin') {
        adminCount++
      } else {
        studentCount++
      }
    })

    const stats = {
      totalUsers: usersSnapshot.size,
      adminUsers: adminCount,
      studentUsers: studentCount,
      totalRecipes: recipesSnapshot.size,
      totalEvents: eventsSnapshot.size,
      totalGroups: groupsSnapshot.size,
    }

    console.log('All stats collected:', stats)

    return res.status(200).json({
      success: true,
      stats: stats,
      message: 'Successfully retrieved all statistics',
    })
  } catch (error) {
    console.error('Error getting stats:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get statistics',
    })
  }
})

// =============================================================================
// BR バルクメール送信機能
// =============================================================================
exports.sendBulkEmail = onRequest({ cors: true }, async (req, res) => {
  console.log('=== sendBulkEmail function called ===')

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { recipients, subject, text, html } = req.body
    console.log('Bulk email request:', { recipientCount: recipients?.length, subject })

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

    if (!SENDGRID_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'SendGrid API Key is not configured',
      })
    }

    const emailPromises = recipients.map((recipient) => {
      const msg = {
        to: recipient,
        from: 'st.kosen.711@gmail.com',
        subject: subject,
        text: text,
        html: html || text,
      }
      return sgMail.send(msg)
    })

    console.log('Sending bulk emails...')
    await Promise.all(emailPromises)
    console.log('Bulk emails sent successfully!')

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
