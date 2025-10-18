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
      from: 'st.kosen.711@gmail.com',
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

/**
 * バルクメール送信機能
 */
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
