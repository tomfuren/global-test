<template>
  <div class="send-email-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- BR (D.2): Email送信フォーム -->
          <!-- BR (D.2): Email Sending Form -->
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="fas fa-envelope me-2"></i>
                Send Email
              </h3>
            </div>
            <div class="card-body">
              <!-- 成功メッセージ -->
              <!-- Success message -->
              <div v-if="successMessage" class="alert alert-success" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                {{ successMessage }}
              </div>

              <!-- エラーメッセージ -->
              <!-- Error message -->
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                {{ errorMessage }}
              </div>

              <form @submit.prevent="sendEmail">
                <!-- 宛先 To -->
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
                  />
                  <div v-if="validation.to" class="invalid-feedback">
                    {{ validation.to }}
                  </div>
                </div>

                <!-- 件名 Subject -->
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
                  />
                  <div v-if="validation.subject" class="invalid-feedback">
                    {{ validation.subject }}
                  </div>
                </div>

                <!-- メッセージ本文 Message -->
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
                  ></textarea>
                  <div v-if="validation.text" class="invalid-feedback">
                    {{ validation.text }}
                  </div>
                </div>

                <!-- HTMLメッセージ (オプション) HTML Message (Optional) -->
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
                  ></textarea>
                </div>

                <!-- 添付ファイル Attachment -->
                <div class="mb-3">
                  <label for="attachment" class="form-label"> Attachment (Optional) </label>
                  <input
                    type="file"
                    class="form-control"
                    id="attachment"
                    @change="handleFileUpload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                  />
                  <div class="form-text">
                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max: 5MB)
                  </div>
                  <div v-if="attachmentInfo" class="mt-2">
                    <small class="text-muted">
                      <i class="fas fa-paperclip me-1"></i>
                      {{ attachmentInfo.filename }} ({{ formatFileSize(attachmentInfo.size) }})
                      <button
                        type="button"
                        class="btn btn-sm btn-link text-danger p-0 ms-2"
                        @click="removeAttachment"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </small>
                  </div>
                </div>

                <!-- 送信ボタン Send Button -->
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
                      <i class="fas fa-paper-plane me-2"></i>
                      Send Email
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- 送信履歴 Sending History -->
          <div class="card shadow mt-4">
            <div class="card-header bg-secondary text-white">
              <h5 class="mb-0">
                <i class="fas fa-history me-2"></i>
                Recent Emails
              </h5>
            </div>
            <div class="card-body">
              <div v-if="emailHistory.length === 0" class="text-center text-muted py-4">
                <i class="fas fa-inbox fa-3x mb-3"></i>
                <p>No emails sent yet</p>
              </div>
              <ul v-else class="list-group">
                <li v-for="(email, index) in emailHistory" :key="index" class="list-group-item">
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
import { ref, reactive } from 'vue'

// Week 9 Studio: Cloud Functionsとの連携
// Week 9 Studio: Integration with Cloud Functions

// Cloud Function URL (デプロイ後に更新)
// Cloud Function URL (Update after deployment)
// 例: https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/sendEmail
const CLOUD_FUNCTION_URL = 'YOUR_CLOUD_FUNCTION_URL_HERE'

// フォームデータ
// Form data
const emailData = reactive({
  to: '',
  subject: '',
  text: '',
  html: '',
  attachment: null,
})

// バリデーション
// Validation
const validation = reactive({
  to: '',
  subject: '',
  text: '',
})

// 状態管理
// State management
const isSending = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const attachmentInfo = ref(null)
const emailHistory = ref([])

/**
 * ファイルアップロード処理
 * Handle file upload
 */
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // ファイルサイズチェック (5MB制限)
  // File size check (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    errorMessage.value = 'File size must be less than 5MB'
    event.target.value = ''
    return
  }

  // ファイルをBase64に変換
  // Convert file to Base64
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
 * 添付ファイル削除
 * Remove attachment
 */
const removeAttachment = () => {
  emailData.attachment = null
  attachmentInfo.value = null
  document.getElementById('attachment').value = ''
}

/**
 * ファイルサイズをフォーマット
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * バリデーション実行
 * Validate form
 */
const validateForm = () => {
  let isValid = true
  validation.to = ''
  validation.subject = ''
  validation.text = ''

  // メールアドレスのバリデーション
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailData.to)) {
    validation.to = 'Please enter a valid email address'
    isValid = false
  }

  // 件名のバリデーション
  // Subject validation
  if (emailData.subject.trim().length < 3) {
    validation.subject = 'Subject must be at least 3 characters'
    isValid = false
  }

  // メッセージのバリデーション
  // Message validation
  if (emailData.text.trim().length < 10) {
    validation.text = 'Message must be at least 10 characters'
    isValid = false
  }

  return isValid
}

/**
 * メール送信処理
 * Send email
 * BR (D.2): Email送信機能の実装
 */
const sendEmail = async () => {
  // バリデーション
  // Validation
  if (!validateForm()) {
    return
  }

  isSending.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // Cloud Functionへのリクエスト
    // Request to Cloud Function
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

      // 送信履歴に追加
      // Add to history
      emailHistory.value.unshift({
        to: emailData.to,
        subject: emailData.subject,
        timestamp: new Date().toLocaleString(),
        status: 'sent',
      })

      // フォームをリセット
      // Reset form
      emailData.to = ''
      emailData.subject = ''
      emailData.text = ''
      emailData.html = ''
      removeAttachment()

      // 3秒後に成功メッセージを消す
      // Clear success message after 3 seconds
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
.send-email-page {
  min-height: calc(100vh - 56px);
  background-color: #f8f9fa;
}

.card {
  border: none;
  border-radius: 8px;
}

.card-header {
  border-radius: 8px 8px 0 0 !important;
}

.form-label {
  font-weight: 600;
  color: #495057;
}

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

.list-group-item {
  border-left: 4px solid #28a745;
  transition: all 0.2s ease;
}

.list-group-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}
</style>
