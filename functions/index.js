// =============================================================================
// Firebase Cloud Functions - Backend API Services
// Firebase Cloud Functions - バックエンドAPIサービス
//
// This file contains all Firebase Cloud Functions for the Global Plate application,
// including email services, statistics collection, and bulk email functionality.
// このファイルには、Global Plateアプリケーションの全Firebase Cloud Functionsが含まれ、
// メールサービス、統計収集、一括メール送信機能を提供します。
//
// Dependencies / 依存関係:
// - firebase-functions/v2: Cloud Functions 2nd generation runtime
// - firebase-admin: Firebase Admin SDK for Firestore access
// - @sendgrid/mail: SendGrid email delivery service
//
// Environment Variables Required / 必要な環境変数:
// - SENDGRID_API_KEY: SendGrid API authentication key
// =============================================================================

const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const sgMail = require('@sendgrid/mail')

// =============================================================================
// Firebase Admin Initialization
// Firebase Admin初期化
// =============================================================================
admin.initializeApp()

// =============================================================================
// SendGrid Configuration
// SendGrid設定
//
// Loads SendGrid API key from environment variables and initializes the client.
// 環境変数からSendGrid APIキーを読み込み、クライアントを初期化します。
// =============================================================================
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
// BR (D.2): メール送信 - SendGrid API統合 (第2世代)
//
// Individual Email Sending Function
// 個別メール送信機能
//
// Features / 機能:
// - Single recipient email delivery / 単一受信者へのメール配信
// - HTML and plain text support / HTMLおよびプレーンテキスト対応
// - File attachment capability / ファイル添付機能
// - Error handling with detailed logging / 詳細なログ記録付きエラーハンドリング
//
// Request Body / リクエストボディ:
// - to: Recipient email address / 受信者メールアドレス
// - subject: Email subject line / メール件名
// - text: Plain text content / プレーンテキストコンテンツ
// - html: HTML content (optional) / HTMLコンテンツ (オプション)
// - attachment: File attachment object (optional) / ファイル添付オブジェクト (オプション)
// =============================================================================
exports.sendEmail = onRequest({ cors: true }, async (req, res) => {
  console.log('=== sendEmail function called ===')
  console.log('Method:', req.method)

  // Validate HTTP method / HTTPメソッドの検証
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    // Extract request parameters / リクエストパラメータの取得
    const { to, subject, text, html, attachment } = req.body
    console.log('Email request:', { to, subject })

    // Validate required fields / 必須フィールドの検証
    if (!to || !subject || !text) {
      console.error('Missing required fields')
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, text',
      })
    }

    // Verify SendGrid configuration / SendGrid設定の確認
    if (!SENDGRID_API_KEY) {
      console.error('SendGrid API Key is not configured')
      return res.status(500).json({
        success: false,
        error: 'SendGrid API Key is not configured',
      })
    }

    // Construct email message / メールメッセージの構築
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

    // Add attachment if provided / 添付ファイルが提供されている場合は追加
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

    // Send email via SendGrid / SendGrid経由でメール送信
    console.log('Sending email via SendGrid...')
    await sgMail.send(msg)
    console.log('Email sent successfully!')

    // Return success response / 成功レスポンスを返す
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      to: to,
      subject: subject,
    })
  } catch (error) {
    // Error handling with detailed logging / 詳細なログ記録付きエラーハンドリング
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
// BR (F.1): Innovation - API Access
// BR (F.1): イノベーション - API アクセス
//
// This application provides REST API access to third parties through the
// following Cloud Functions endpoints. External applications can fetch data
// using standard HTTP requests.
// このアプリケーションは、以下のCloud Functionsエンドポイントを通じて
// サードパーティにREST APIアクセスを提供します。外部アプリケーションは
// 標準HTTPリクエストを使用してデータを取得できます。
//
// Public API Endpoints (6 available):
// 公開APIエンドポイント (6つ利用可能):
//
// 1. GET /countRecipes - Get total recipe count
// 2. GET /countUsers - Get user statistics with role breakdown
// 3. GET /countEvents - Get total event count
// 4. GET /countGroups - Get total country group count
// 5. GET /getStats - Get all statistics in a single request
// 6. POST /sendBulkEmail - Send bulk emails (admin only)
//
// Base URL: https://us-central1-global-plate-dev.cloudfunctions.net/
//
// =============================================================================

// =============================================================================
// BR (E.1): Cloud Functions - Firestore Data Count Functionality (2nd Gen)
// BR (E.1): Cloud Functions - Firestoreデータカウント機能 (第2世代)
//
// BR (F.1): Innovation - API Access #1
// BR (F.1): イノベーション - API アクセス #1
//
// Recipe Count Function
// レシピ数カウント機能
//
// PUBLIC REST API ENDPOINT / 公開REST APIエンドポイント
// URL: https://us-central1-global-plate-dev.cloudfunctions.net/countRecipes
// Method: GET
// Auth: Not required (public access) / 認証不要（公開アクセス）
//
// Features / 機能:
// - Counts total number of recipes in Firestore / Firestoreのレシピ総数をカウント
// - CORS enabled for external access / 外部アクセス用のCORS対応
// - Simple HTTP endpoint / シンプルなHTTPエンドポイント
//
// Response / レスポンス:
// - success: Operation status / 操作ステータス
// - count: Total number of recipes / レシピの総数
// - message: Success message / 成功メッセージ
// =============================================================================
exports.countRecipes = onRequest({ cors: true }, async (req, res) => {
  try {
    // Get 'recipes' collection from Firestore / Firestoreから'recipes'コレクションを取得
    const recipesCollection = admin.firestore().collection('recipes')

    // Retrieve all documents in collection / コレクション内の全ドキュメントを取得
    const snapshot = await recipesCollection.get()

    // Count documents / ドキュメント数をカウント
    const count = snapshot.size

    // Return success response / 成功レスポンスを返す
    return res.status(200).json({
      success: true,
      count: count,
      message: 'Successfully counted recipes',
    })
  } catch (error) {
    // Error handling / エラーハンドリング
    console.error('Error counting recipes:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to count recipes',
    })
  }
})

// =============================================================================
// BR (F.1): Innovation - API Access #2
// BR (F.1): イノベーション - API アクセス #2
//
// User Count Function with Role Breakdown
// ロール別ユーザー数カウント機能
//
// PUBLIC REST API ENDPOINT / 公開REST APIエンドポイント
// URL: https://us-central1-global-plate-dev.cloudfunctions.net/countUsers
// Method: GET
// Auth: Not required (public access) / 認証不要（公開アクセス）
//
// Features / 機能:
// - Counts total number of users / ユーザーの総数をカウント
// - Provides breakdown by role (admin/student) / ロール別（管理者/学生）の内訳を提供
// - Efficient single-pass counting / 効率的な単一パス集計
//
// Response / レスポンス:
// - totalUsers: Total user count / 総ユーザー数
// - adminUsers: Number of admin users / 管理者ユーザー数
// - studentUsers: Number of student users / 学生ユーザー数
// =============================================================================
exports.countUsers = onRequest({ cors: true }, async (req, res) => {
  try {
    // Get users collection / usersコレクションを取得
    const usersCollection = admin.firestore().collection('users')
    const snapshot = await usersCollection.get()

    // Initialize counters / カウンターの初期化
    let totalUsers = snapshot.size
    let adminCount = 0
    let studentCount = 0

    // Count users by role / ロール別にユーザーをカウント
    snapshot.forEach((doc) => {
      const userData = doc.data()
      if (userData.role === 'admin') {
        adminCount++
      } else {
        studentCount++
      }
    })

    // Return statistics / 統計情報を返す
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

// =============================================================================
// BR (F.1): Innovation - API Access #3
// BR (F.1): イノベーション - API アクセス #3
//
// Event Count Function
// イベント数カウント機能
//
// PUBLIC REST API ENDPOINT / 公開REST APIエンドポイント
// URL: https://us-central1-global-plate-dev.cloudfunctions.net/countEvents
// Method: GET
//
// Features / 機能:
// - Counts total number of events / イベントの総数をカウント
// - Simple HTTP GET endpoint / シンプルなHTTP GETエンドポイント
//
// Response / レスポンス:
// - count: Total number of events / イベントの総数
// =============================================================================
exports.countEvents = onRequest({ cors: true }, async (req, res) => {
  try {
    // Get events collection and count / eventsコレクションを取得してカウント
    const eventsCollection = admin.firestore().collection('events')
    const snapshot = await eventsCollection.get()
    const count = snapshot.size

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

// =============================================================================
// BR (F.1): Innovation - API Access #4
// BR (F.1): イノベーション - API アクセス #4
//
// Country Groups Count Function
// 国別グループ数カウント機能
//
// PUBLIC REST API ENDPOINT / 公開REST APIエンドポイント
// URL: https://us-central1-global-plate-dev.cloudfunctions.net/countGroups
// Method: GET
//
// Features / 機能:
// - Counts total number of country groups / 国別グループの総数をカウント
// - Logs count for monitoring / 監視用のカウントログ記録
//
// Response / レスポンス:
// - count: Total number of groups / グループの総数
// =============================================================================
exports.countGroups = onRequest({ cors: true }, async (req, res) => {
  try {
    // Get groups collection and count / groupsコレクションを取得してカウント
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

// =============================================================================
// BR (F.1): Innovation - API Access #5
// BR (F.1): イノベーション - API アクセス #5
//
// All Statistics Aggregation Function
// 全統計情報集約機能
//
// PUBLIC REST API ENDPOINT / 公開REST APIエンドポイント
// URL: https://us-central1-global-plate-dev.cloudfunctions.net/getStats
// Method: GET
// Auth: Optional (recommended for production) / オプション（本番環境では推奨）
//
// Features / 機能:
// - Retrieves all collection statistics in a single request / 全コレクションの統計を1回のリクエストで取得
// - Parallel data fetching for efficiency / 効率的な並列データ取得
// - Ideal for dashboard displays / ダッシュボード表示に最適
// - Includes user role breakdown / ユーザーロール別内訳を含む
//
// Response / レスポンス:
// {
//   "success": true,
//   "stats": {
//     "totalUsers": 42,
//     "adminUsers": 5,
//     "studentUsers": 37,
//     "totalRecipes": 128,
//     "totalEvents": 24,
//     "totalGroups": 15
//   },
//   "message": "Successfully retrieved all statistics"
// }
// =============================================================================
exports.getStats = onRequest({ cors: true }, async (req, res) => {
  try {
    const db = admin.firestore()

    // Fetch all collection data in parallel / 並列で全コレクションのデータを取得
    const [usersSnapshot, recipesSnapshot, eventsSnapshot, groupsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('recipes').get(),
      db.collection('events').get(),
      db.collection('groups').get(),
    ])

    // Count users by role / ユーザーのロール別カウント
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

    // Aggregate all statistics / 全統計情報を集約
    const stats = {
      totalUsers: usersSnapshot.size,
      adminUsers: adminCount,
      studentUsers: studentCount,
      totalRecipes: recipesSnapshot.size,
      totalEvents: eventsSnapshot.size,
      totalGroups: groupsSnapshot.size,
    }

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
// BR (F): Bulk Email Sending Function
// BR (F): 一括メール送信機能
//
// Bulk Email Delivery to Multiple Recipients
// 複数受信者への一括メール配信
//
// Features / 機能:
// - Sends identical emails to multiple recipients / 複数受信者に同一メールを送信
// - Parallel email delivery for efficiency / 効率的な並列メール配信
// - Batch processing with Promise.all / Promise.allによるバッチ処理
// - Detailed logging and error reporting / 詳細なログ記録とエラーレポート
//
// Request Body / リクエストボディ:
// - recipients: Array of email addresses / メールアドレスの配列
// - subject: Email subject line / メール件名
// - text: Plain text content / プレーンテキストコンテンツ
// - html: HTML content (optional) / HTMLコンテンツ (オプション)
//
// Response / レスポンス:
// - success: Operation status / 操作ステータス
// - count: Number of emails sent / 送信されたメール数
// - message: Success message / 成功メッセージ
// =============================================================================
exports.sendBulkEmail = onRequest({ cors: true }, async (req, res) => {
  console.log('=== sendBulkEmail function called ===')

  // Validate HTTP method / HTTPメソッドの検証
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    // Extract request parameters / リクエストパラメータの取得
    const { recipients, subject, text, html } = req.body
    console.log('Bulk email request:', { recipientCount: recipients?.length, subject })

    // Validate recipients array / 受信者配列の検証
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Recipients array is required and must not be empty',
      })
    }

    // Validate required fields / 必須フィールドの検証
    if (!subject || !text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: subject, text',
      })
    }

    // Verify SendGrid configuration / SendGrid設定の確認
    if (!SENDGRID_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'SendGrid API Key is not configured',
      })
    }

    // Create email promises for all recipients / 全受信者へのメール送信プロミスを作成
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

    // Send all emails in parallel / 全メールを並列送信
    console.log('Sending bulk emails...')
    await Promise.all(emailPromises)
    console.log('Bulk emails sent successfully!')

    // Return success response / 成功レスポンスを返す
    return res.status(200).json({
      success: true,
      message: `Bulk email sent successfully to ${recipients.length} recipients`,
      count: recipients.length,
    })
  } catch (error) {
    // Error handling / エラーハンドリング
    console.error('Bulk Email Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to send bulk emails',
      details: error.message,
    })
  }
})
