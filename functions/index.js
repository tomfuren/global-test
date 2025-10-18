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
