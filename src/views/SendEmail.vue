<template>
  <div class="send-email-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0"><i class="fas fa-envelope me-2"></i>Send Email with Attachment</h3>
              <p class="mb-0 small">BR (D.2): Email functionality using SendGrid API</p>
            </div>

            <div class="card-body p-4">
              <!-- Success/Error Message -->
              <div
                v-if="message"
                :class="messageClass"
                class="alert alert-dismissible fade show"
                role="alert"
              >
                <i :class="messageIcon" class="me-2"></i>
                {{ message }}
                <button type="button" class="btn-close" @click="message = ''"></button>
              </div>

              <!-- Email Form -->
              <form @submit.prevent="sendEmail">
                <!-- Recipient Email -->
                <div class="mb-3">
                  <label for="to" class="form-label"
                    >Recipient Email <span class="text-danger">*</span></label
                  >
                  <input
                    type="email"
                    class="form-control"
                    id="to"
                    v-model="emailData.to"
                    placeholder="recipient@example.com"
                    required
                  />
                </div>

                <!-- Subject -->
                <div class="mb-3">
                  <label for="subject" class="form-label"
                    >Subject <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="subject"
                    v-model="emailData.subject"
                    placeholder="Email subject"
                    required
                  />
                </div>

                <!-- Message Body -->
                <div class="mb-3">
                  <label for="text" class="form-label"
                    >Message <span class="text-danger">*</span></label
                  >
                  <textarea
                    class="form-control"
                    id="text"
                    v-model="emailData.text"
                    rows="5"
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </div>

                <!-- File Attachment -->
                <div class="mb-3">
                  <label for="attachment" class="form-label">
                    Attachment (Optional)
                    <small class="text-muted">- Max 5MB</small>
                  </label>
                  <input
                    type="file"
                    class="form-control"
                    id="attachment"
                    @change="handleFileUpload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  <small class="text-muted">
                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG
                  </small>
                </div>

                <!-- Selected File Info -->
                <div v-if="selectedFile" class="alert alert-info">
                  <i class="fas fa-paperclip me-2"></i>
                  Selected: <strong>{{ selectedFile.name }}</strong> ({{
                    formatFileSize(selectedFile.size)
                  }})
                </div>

                <!-- Submit Button -->
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fas fa-paper-plane me-2"></i>
                    {{ isLoading ? 'Sending...' : 'Send Email' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Info Card -->
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title"><i class="fas fa-info-circle me-2"></i>How it works</h5>
              <ul class="mb-0">
                <li>This feature uses SendGrid API to send emails with attachments</li>
                <li>Files are converted to Base64 format before sending</li>
                <li>Maximum attachment size: 5MB</li>
                <li>Sender email: tsak0007@student.monash.edu (verified)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Form data
const emailData = ref({
  to: '',
  subject: '',
  text: '',
})

const selectedFile = ref(null)
const fileBase64 = ref('')
const message = ref('')
const messageType = ref('success')
const isLoading = ref(false)

// Computed properties for message styling
const messageClass = computed(() => {
  return messageType.value === 'error' ? 'alert-danger' : 'alert-success'
})

const messageIcon = computed(() => {
  return messageType.value === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'
})

/**
 * Handle file upload and convert to Base64
 */
const handleFileUpload = (event) => {
  const file = event.target.files[0]

  if (!file) {
    selectedFile.value = null
    fileBase64.value = ''
    return
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    showMessage('File size must be less than 5MB', 'error')
    event.target.value = '' // Reset input
    return
  }

  selectedFile.value = file

  // Convert file to Base64
  const reader = new FileReader()
  reader.onload = () => {
    // Remove data URL prefix (e.g., "data:image/png;base64,")
    fileBase64.value = reader.result.split(',')[1]
  }
  reader.onerror = () => {
    showMessage('Error reading file', 'error')
  }
  reader.readAsDataURL(file)
}

/**
 * Format file size for display
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * Show message to user
 */
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type

  // Auto-hide after 5 seconds
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

/**
 * Send email via SendGrid API
 * BR (D.2): Email with attachment functionality
 */
const sendEmail = async () => {
  isLoading.value = true

  try {
    // Prepare email payload
    const payload = {
      personalizations: [
        {
          to: [{ email: emailData.value.to }],
          subject: emailData.value.subject,
        },
      ],
      from: {
        email: 'tsak0007@student.monash.edu',
        name: 'Global Plate',
      },
      content: [
        {
          type: 'text/plain',
          value: emailData.value.text,
        },
      ],
    }

    // Add attachment if file is selected
    if (selectedFile.value && fileBase64.value) {
      payload.attachments = [
        {
          content: fileBase64.value,
          filename: selectedFile.value.name,
          type: selectedFile.value.type || 'application/octet-stream',
          disposition: 'attachment',
        },
      ]
    }

    // Send email via SendGrid API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok || response.status === 202) {
      showMessage('Email sent successfully!', 'success')

      // Reset form
      emailData.value = {
        to: '',
        subject: '',
        text: '',
      }
      selectedFile.value = null
      fileBase64.value = ''
      document.getElementById('attachment').value = ''
    } else {
      const errorData = await response.json()
      console.error('SendGrid Error:', errorData)
      showMessage(
        `Failed to send email: ${errorData.errors?.[0]?.message || 'Unknown error'}`,
        'error',
      )
    }
  } catch (error) {
    console.error('Error sending email:', error)
    showMessage('Network error. Please check your connection and try again.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.send-email-page {
  padding-top: 3.5em;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* Desktop sidebar adjustment */
@media (min-width: 992px) {
  .send-email-page {
    margin-left: 4.5em;
  }
}

/* Mobile bottom nav adjustment */
@media (max-width: 768px) {
  .send-email-page {
    padding-bottom: 5em;
  }
}

.card {
  border: none;
  border-radius: 15px;
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
