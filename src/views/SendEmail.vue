<!--
  Send Email Page - Email sending interface with Firebase Cloud Functions
  メール送信ページ - Firebase Cloud Functionsを使用したメール送信インターフェース

  Features / 機能:
  - Send emails via Firebase Cloud Functions / Firebase Cloud Functions経由でメールを送信
  - Support for plain text and HTML messages / プレーンテキストとHTMLメッセージのサポート
  - File attachment support (up to 5MB) / 添付ファイルのサポート（最大5MB）
  - Real-time form validation / リアルタイムフォームバリデーション
  - Email sending history / メール送信履歴
  - Base64 encoding for attachments / 添付ファイルのBase64エンコーディング

  BR (D.2): Email Sending - Email sending functionality via Cloud Functions
  BR (D.2): メール送信機能 - Cloud Functions経由でのメール送信機能
  Implements email sending through Firebase Cloud Functions using Nodemailer
  Nodemailerを使用したFirebase Cloud Functions経由のメール送信を実装

  BR (B.1): Validations - Form field validation (email, subject, message length)
  BR (B.1): バリデーション機能 - フォームフィールドの検証（メール、件名、メッセージ長）

  BR (E.3): Accessibility - Semantic HTML structure and ARIA attributes
  BR (E.3): アクセシビリティ - セマンティックHTML構造とARIA属性

  Implementation Reference / 実装の参考:
  - Week 9 Studio: Integration with Cloud Functions
  - Firebase Cloud Functions documentation
  - Nodemailer documentation
-->

<template>
  <div class="send-email-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!--
            BR (D.2): Email Sending Form / メール送信フォーム
            Main form for composing and sending emails via Cloud Functions
            Cloud Functions経由でメールを作成・送信するメインフォーム
          -->
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="fas fa-envelope me-2" aria-hidden="true"></i>
                Send Email
              </h3>
            </div>
            <div class="card-body">
              <!--
                Success Message / 成功メッセージ
                Displayed when email is sent successfully
                メールが正常に送信されたときに表示
              -->
              <div v-if="successMessage" class="alert alert-success" role="alert">
                <i class="fas fa-check-circle me-2" aria-hidden="true"></i>
                {{ successMessage }}
              </div>

              <!--
                Error Message / エラーメッセージ
                Displayed when email sending fails or validation errors occur
                メール送信失敗時またはバリデーションエラー発生時に表示
              -->
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2" aria-hidden="true"></i>
                {{ errorMessage }}
              </div>

              <form @submit.prevent="sendEmail">
                <!--
                  To Email Address Field / 宛先メールアドレスフィールド
                  BR (B.1): Validations - Email address format validation
                  BR (B.1): バリデーション機能 - メールアドレス形式の検証
                -->
                <div class="mb-3">
                  <label for="to" class="form-label">To Email Address *</label>
                  <input
                    type="email"
                    class="form-control"
                    id="to"
                    v-model="emailData.to"
                    :class="{ 'is-invalid': validation.to }"
                    required
                    placeholder="recipient@example.com"
                    aria-label="Recipient email address"
                  />
                  <div v-if="validation.to" class="invalid-feedback" role="alert">
                    {{ validation.to }}
                  </div>
                </div>

                <!--
                  Subject Field / 件名フィールド
                  BR (B.1): Validations - Subject length validation (minimum 3 characters)
                  BR (B.1): バリデーション機能 - 件名長の検証（最小3文字）
                -->
                <div class="mb-3">
                  <label for="subject" class="form-label">Subject *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="subject"
                    v-model="emailData.subject"
                    :class="{ 'is-invalid': validation.subject }"
                    required
                    placeholder="Email subject"
                    aria-label="Email subject"
                  />
                  <div v-if="validation.subject" class="invalid-feedback" role="alert">
                    {{ validation.subject }}
                  </div>
                </div>

                <!--
                  Message Body Field / メッセージ本文フィールド
                  BR (B.1): Validations - Message length validation (minimum 10 characters)
                  BR (B.1): バリデーション機能 - メッセージ長の検証（最小10文字）
                -->
                <div class="mb-3">
                  <label for="text" class="form-label">Message *</label>
                  <textarea
                    class="form-control"
                    id="text"
                    v-model="emailData.text"
                    :class="{ 'is-invalid': validation.text }"
                    required
                    rows="6"
                    placeholder="Enter your message here..."
                    aria-label="Email message body"
                  ></textarea>
                  <div v-if="validation.text" class="invalid-feedback" role="alert">
                    {{ validation.text }}
                  </div>
                </div>

                <!--
                  HTML Message Field (Optional) / HTMLメッセージフィールド（オプション）
                  Allows sending HTML-formatted emails
                  HTML形式のメール送信を可能にする
                -->
                <div class="mb-3">
                  <label for="html" class="form-label">
                    HTML Message (Optional)
                    <small class="text-muted">- Override plain text with HTML</small>
                  </label>
                  <textarea
                    class="form-control"
                    id="html"
                    v-model="emailData.html"
                    rows="4"
                    placeholder="<p>HTML formatted message...</p>"
                    aria-label="HTML formatted email message"
                  ></textarea>
                </div>

                <!--
                  Attachment Field / 添付ファイルフィールド
                  Supports file attachments up to 5MB
                  最大5MBの添付ファイルをサポート

                  Supported formats / サポート形式:
                  - Documents: PDF, DOC, DOCX, TXT
                  - Images: JPG, PNG
                -->
                <div class="mb-3">
                  <label for="attachment" class="form-label"> Attachment (Optional) </label>
                  <input
                    type="file"
                    class="form-control"
                    id="attachment"
                    @change="handleFileUpload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    aria-label="Email attachment"
                  />
                  <div class="form-text">
                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max: 5MB)
                  </div>

                  <!-- Attachment Info Display / 添付ファイル情報表示 -->
                  <div v-if="attachmentInfo" class="mt-2">
                    <small class="text-muted">
                      <i class="fas fa-paperclip me-1" aria-hidden="true"></i>
                      {{ attachmentInfo.filename }} ({{ formatFileSize(attachmentInfo.size) }})
                      <button
                        type="button"
                        class="btn btn-sm btn-link text-danger p-0 ms-2"
                        @click="removeAttachment"
                        aria-label="Remove attachment"
                      >
                        <i class="fas fa-times" aria-hidden="true"></i>
                      </button>
                    </small>
                  </div>
                </div>

                <!--
                  Send Button / 送信ボタン
                  Triggers email sending via Cloud Function
                  Cloud Function経由でメール送信をトリガー
                -->
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg" :disabled="isSending">
                    <span v-if="isSending">
                      <span
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </span>
                    <span v-else>
                      <i class="fas fa-paper-plane me-2" aria-hidden="true"></i>
                      Send Email
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!--
            Email Sending History / 送信履歴
            Displays recently sent emails in the current session
            現在のセッションで最近送信されたメールを表示
          -->
          <div class="card shadow mt-4">
            <div class="card-header bg-secondary text-white">
              <h5 class="mb-0">
                <i class="fas fa-history me-2" aria-hidden="true"></i>
                Recent Emails
              </h5>
            </div>
            <div class="card-body">
              <!-- Empty State / 空の状態 -->
              <div v-if="emailHistory.length === 0" class="text-center text-muted py-4">
                <i class="fas fa-inbox fa-3x mb-3" aria-hidden="true"></i>
                <p>No emails sent yet</p>
              </div>

              <!-- Email History List / メール履歴リスト -->
              <ul v-else class="list-group" role="list">
                <li
                  v-for="(email, index) in emailHistory"
                  :key="index"
                  class="list-group-item"
                  role="listitem"
                >
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="mb-1">{{ email.subject }}</h6>
                      <small class="text-muted"> To: {{ email.to }} • {{ email.timestamp }} </small>
                    </div>
                    <span class="badge bg-success">Sent</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ============================================================================
// Imports / インポート
// ============================================================================
import { ref, reactive } from 'vue'

// ============================================================================
// Cloud Function Configuration / Cloud Function設定
// ============================================================================
// Week 9 Studio: Integration with Cloud Functions
// Firebase Cloud Functions endpoint for sending emails
// メール送信用のFirebase Cloud Functionsエンドポイント
const CLOUD_FUNCTION_URL = 'https://us-central1-global-plate-dev.cloudfunctions.net/sendEmail'

// ============================================================================
// State Management / 状態管理
// ============================================================================

// Form Data / フォームデータ
// Stores email composition data
// メール作成データを保存
const emailData = reactive({
  to: '', // Recipient email address / 受信者メールアドレス
  subject: '', // Email subject / メール件名
  text: '', // Plain text message / プレーンテキストメッセージ
  html: '', // HTML message (optional) / HTMLメッセージ（オプション）
  attachment: null, // File attachment data / 添付ファイルデータ
})

// Validation Errors / バリデーションエラー
// BR (B.1): Validation error messages for form fields
// BR (B.1): フォームフィールドのバリデーションエラーメッセージ
const validation = reactive({
  to: '',
  subject: '',
  text: '',
})

// UI State / UI状態
const isSending = ref(false) // Sending state / 送信中状態
const successMessage = ref('') // Success message / 成功メッセージ
const errorMessage = ref('') // Error message / エラーメッセージ
const attachmentInfo = ref(null) // Attachment information / 添付ファイル情報
const emailHistory = ref([]) // Email sending history / メール送信履歴

// ============================================================================
// Methods / メソッド
// ============================================================================

/**
 * Handle file upload / ファイルアップロード処理
 *
 * Converts uploaded file to Base64 encoding for transmission
 * アップロードされたファイルを送信用にBase64エンコーディングに変換
 *
 * @param {Event} event - File input change event / ファイル入力変更イベント
 */
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // File size check (5MB limit) / ファイルサイズチェック（5MB制限）
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    errorMessage.value = 'File size must be less than 5MB'
    event.target.value = ''
    return
  }

  // Convert file to Base64 / ファイルをBase64に変換
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64Content = e.target.result.split(',')[1]
    emailData.attachment = {
      content: base64Content,
      filename: file.name,
      type: file.type,
    }
    attachmentInfo.value = {
      filename: file.name,
      size: file.size,
    }
  }
  reader.readAsDataURL(file)
}

/**
 * Remove attachment / 添付ファイル削除
 *
 * Clears attached file from form
 * フォームから添付ファイルをクリア
 */
const removeAttachment = () => {
  emailData.attachment = null
  attachmentInfo.value = null
  document.getElementById('attachment').value = ''
}

/**
 * Format file size / ファイルサイズをフォーマット
 *
 * Converts bytes to human-readable format (B, KB, MB)
 * バイトを人間が読める形式に変換（B、KB、MB）
 *
 * @param {number} bytes - File size in bytes / バイト単位のファイルサイズ
 * @returns {string} Formatted file size / フォーマットされたファイルサイズ
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * BR (B.1): Validate form / フォームバリデーション実行
 *
 * Validates all form fields before submission
 * 送信前にすべてのフォームフィールドを検証
 *
 * Validation Rules / 検証ルール:
 * - Email: Valid email format / 有効なメール形式
 * - Subject: Minimum 3 characters / 最小3文字
 * - Message: Minimum 10 characters / 最小10文字
 *
 * @returns {boolean} True if form is valid / フォームが有効な場合はtrue
 */
const validateForm = () => {
  let isValid = true
  validation.to = ''
  validation.subject = ''
  validation.text = ''

  // Email validation / メールアドレスのバリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailData.to)) {
    validation.to = 'Please enter a valid email address'
    isValid = false
  }

  // Subject validation / 件名のバリデーション
  if (emailData.subject.trim().length < 3) {
    validation.subject = 'Subject must be at least 3 characters'
    isValid = false
  }

  // Message validation / メッセージのバリデーション
  if (emailData.text.trim().length < 10) {
    validation.text = 'Message must be at least 10 characters'
    isValid = false
  }

  return isValid
}

/**
 * BR (D.2): Email Sending - Send email via Cloud Function
 * BR (D.2): メール送信機能 - Cloud Function経由でメールを送信
 *
 * Sends email through Firebase Cloud Functions using Nodemailer
 * Nodemailerを使用したFirebase Cloud Functions経由でメールを送信
 *
 * Process Flow / 処理フロー:
 * 1. Validate form fields / フォームフィールドを検証
 * 2. Send POST request to Cloud Function with email data / メールデータでCloud FunctionにPOSTリクエスト送信
 * 3. Handle success: Add to history, reset form / 成功時: 履歴に追加、フォームリセット
 * 4. Handle error: Display error message / エラー時: エラーメッセージを表示
 *
 * Cloud Function Payload / Cloud Functionペイロード:
 * - to: Recipient email address / 受信者メールアドレス
 * - subject: Email subject / メール件名
 * - text: Plain text message / プレーンテキストメッセージ
 * - html: HTML message (optional) / HTMLメッセージ（オプション）
 * - attachment: File attachment data (optional) / 添付ファイルデータ（オプション）
 */
const sendEmail = async () => {
  // Validation / バリデーション
  if (!validateForm()) {
    return
  }

  isSending.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // Request to Cloud Function / Cloud Functionへのリクエスト
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html || undefined,
        attachment: emailData.attachment || undefined,
      }),
    })

    const result = await response.json()

    if (result.success) {
      successMessage.value = 'Email sent successfully!'

      // Add to history / 送信履歴に追加
      emailHistory.value.unshift({
        to: emailData.to,
        subject: emailData.subject,
        timestamp: new Date().toLocaleString(),
        status: 'sent',
      })

      // Reset form / フォームをリセット
      emailData.to = ''
      emailData.subject = ''
      emailData.text = ''
      emailData.html = ''
      removeAttachment()

      // Clear success message after 3 seconds / 3秒後に成功メッセージを消す
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      errorMessage.value = result.error || 'Failed to send email'
    }
  } catch (error) {
    console.error('Error sending email:', error)
    errorMessage.value = 'Failed to send email. Please check your Cloud Function URL and try again.'
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
/* Overall page layout / ページ全体のレイアウト */
.send-email-page {
  min-height: calc(100vh - 56px);
  background-color: #f8f9fa;
}

/* Card styling / カードのスタイリング */
.card {
  border: none;
  border-radius: 8px;
}

.card-header {
  border-radius: 8px 8px 0 0 !important;
}

/* Form label styling / フォームラベルのスタイリング */
.form-label {
  font-weight: 600;
  color: #495057;
}

/* Primary button styling / プライマリボタンのスタイリング */
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
  border-color: #004085;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Email history list styling / メール履歴リストのスタイリング */
.list-group-item {
  border-left: 4px solid #28a745;
  transition: all 0.2s ease;
}

.list-group-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}
</style>
