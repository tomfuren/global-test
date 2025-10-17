/**
 * Firebase Cloud Functions for Email Sending
 * BR (D.2): Email - SendGrid API Integration
 */

// eslint-disable-next-line
const functions = require('firebase-functions')
// eslint-disable-next-line
const sgMail = require('@sendgrid/mail')
// eslint-disable-next-line
const cors = require('cors')({ origin: true })

// SendGrid API Key is loaded from environment variable
// Set via: firebase functions:config:set sendgrid.key="YOUR_API_KEY"
const sendgridKey = functions.config().sendgrid?.key
if (sendgridKey) {
  sgMail.setApiKey(sendgridKey)
}

/**
 * HTTP Cloud Function to send email with attachment
 */
// eslint-disable-next-line
exports.sendEmail = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed. Use POST.',
      })
    }

    try {
      const { to, subject, text, html, attachment } = req.body

      if (!to || !subject || !text) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: to, subject, text',
        })
      }

      const msg = {
        to: to,
        from: 'tsak0007@student.monash.edu',
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
      }

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
})

/**
 * HTTP Cloud Function to send bulk emails
 */
// eslint-disable-next-line
exports.sendBulkEmail = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed. Use POST.',
      })
    }

    try {
      const { recipients, attachment } = req.body

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid recipients array',
        })
      }

      const messages = recipients.map((recipient) => {
        const msg = {
          to: recipient.to,
          from: 'tsak0007@student.monash.edu',
          subject: recipient.subject,
          text: recipient.text,
          html: recipient.html || recipient.text,
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
        }

        return msg
      })

      await sgMail.send(messages)

      return res.status(200).json({
        success: true,
        message: `Successfully sent ${messages.length} emails`,
        count: messages.length,
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
})
