<!--
  Manage Users Page - User management interface for administrators
  ユーザー管理ページ - 管理者向けユーザー管理インターフェース

  Features / 機能:
  - Real-time user list display with Firestore / Firestoreによるリアルタイムユーザー一覧表示
  - User search and filtering by role / ユーザー検索とロールによるフィルタリング
  - Pagination support / ページネーション対応
  - Bulk user selection / 複数ユーザーの一括選択
  - Bulk email sending to selected users / 選択したユーザーへの一括メール送信
  - PDF Export functionality / PDFエクスポート機能

  BR (C.2): Role-based Authentication - Administrator role verification and user role display
  BR (C.2): ロールベース認証 - 管理者ロールの検証とユーザーロール表示

  BR (D.3): Interactive Table Data - User Management Table (Table #2)
  BR (D.3): インタラクティブなテーブルデータ - ユーザー管理テーブル（テーブル#2）

  BR (E.4): Export - PDF export for user data
  BR (E.4): エクスポート - ユーザーデータのPDFエクスポート

  BR (F.1): Innovation - Bulk Email Feature
  BR (F.1): イノベーション機能 - 一括メール送信機能

  BR (E.3): Accessibility - ARIA labels, roles, and keyboard navigation support
  BR (E.3): アクセシビリティ - ARIAラベル、ロール、キーボードナビゲーション対応
-->

<template>
  <div class="manage-users">
    <div class="container-fluid px-4 py-4">
      <!-- Header Section / ヘッダーセクション -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center">
          <i class="fas fa-users-cog text-primary me-3 fs-4" aria-hidden="true"></i>
          <h1 class="h3 mb-0">Manage Users</h1>
        </div>
        <div class="d-flex gap-2">
          <!-- BR (F.1): Bulk Email Button -->
          <button
            class="btn btn-primary"
            @click="openBulkEmailModal"
            :disabled="selectedUsers.length === 0"
            :aria-label="`Send bulk email to ${selectedUsers.length} selected users`"
          >
            <i class="fas fa-envelope-bulk me-2" aria-hidden="true"></i>
            Send Bulk Email ({{ selectedUsers.length }})
          </button>
          <router-link to="/admin" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2" aria-hidden="true"></i>
            Back to Dashboard
          </router-link>
        </div>
      </div>

      <!-- Loading State / ローディング状態 -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading users...</p>
      </div>

      <!-- Error Display / エラー表示 -->
      <div v-if="error" class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
        {{ error }}
      </div>

      <!-- Main Content / メインコンテンツ -->
      <template v-if="!loading && !error">
        <!-- Search and Filter Card / 検索とフィルターカード -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <!-- Search Box / 検索ボックス -->
              <div class="col-md-4">
                <label for="searchInput" class="visually-hidden">Search users</label>
                <input
                  id="searchInput"
                  type="search"
                  class="form-control"
                  placeholder="Search by name or email..."
                  v-model="searchQuery"
                  aria-label="Search users by name or email"
                />
              </div>

              <!-- Role Filter / ロールフィルター -->
              <div class="col-md-3">
                <label for="roleFilter" class="visually-hidden">Filter by role</label>
                <select
                  id="roleFilter"
                  class="form-select"
                  v-model="roleFilter"
                  aria-label="Filter users by role"
                >
                  <option value="">All Roles</option>
                  <option value="user">Student Members</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>

              <!-- BR (F.1): Select All/Deselect All Button -->
              <div class="col-md-3">
                <button
                  class="btn btn-outline-primary w-100"
                  @click="toggleSelectAll"
                  :aria-label="allSelected ? 'Deselect all users' : 'Select all users'"
                >
                  <i class="fas fa-check-square me-1" aria-hidden="true"></i>
                  {{ allSelected ? 'Deselect All' : 'Select All' }}
                </button>
              </div>

              <!-- BR (E.4): PDF Export Button -->
              <div class="col-md-2">
                <button
                  class="btn btn-danger w-100"
                  @click="exportToPDF"
                  :disabled="filteredUsers.length === 0"
                  aria-label="Export users to PDF"
                >
                  <i class="fas fa-file-pdf me-1" aria-hidden="true"></i>
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Users List Table -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              Users ({{ filteredUsers.length }})
              <small class="text-muted">- Total: {{ users.length }}</small>
            </h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover" aria-label="Users table">
                <thead>
                  <tr>
                    <th scope="col" style="width: 50px">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="allSelected"
                        @change="toggleSelectAll"
                        :aria-label="allSelected ? 'Deselect all' : 'Select all'"
                      />
                    </th>
                    <th scope="col">User</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Country</th>
                    <th scope="col">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in paginatedUsers" :key="user.id">
                    <td>
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :value="user.id"
                        v-model="selectedUsers"
                        :aria-label="`Select ${getFullName(user)}`"
                      />
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <img
                          :src="getUserAvatar(user)"
                          class="rounded-circle me-2"
                          width="32"
                          height="32"
                          :alt="`${getFullName(user)} avatar`"
                        />
                        <div>
                          <div class="fw-bold">{{ getFullName(user) }}</div>
                          <small class="text-muted">{{ user.university || 'No university' }}</small>
                        </div>
                      </div>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span
                        :class="getRoleBadgeClass(user.role)"
                        class="badge"
                        :aria-label="`User role: ${getRoleDisplay(user.role)}`"
                      >
                        {{ getRoleDisplay(user.role) }}
                      </span>
                    </td>
                    <td>{{ user.country || 'Unknown' }}</td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- No Data Display -->
              <div v-if="filteredUsers.length === 0" class="text-center py-4">
                <i class="fas fa-users fs-1 text-muted mb-3" aria-hidden="true"></i>
                <h5>No users found</h5>
                <p class="text-muted">Try adjusting your search criteria</p>
              </div>
            </div>

            <!-- Pagination -->
            <nav v-if="totalPages > 1" aria-label="User list pagination">
              <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="text-muted">
                  Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredUsers.length) }} of
                  {{ filteredUsers.length }} users
                </div>
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button
                      class="page-link"
                      @click="previousPage"
                      :disabled="currentPage === 1"
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                  </li>
                  <li class="page-item active" aria-current="page">
                    <span class="page-link">
                      {{ currentPage }}
                      <span class="visually-hidden">(current)</span>
                    </span>
                  </li>
                  <li class="page-item disabled">
                    <span class="page-link">of {{ totalPages }}</span>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button
                      class="page-link"
                      @click="nextPage"
                      :disabled="currentPage === totalPages"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </template>
    </div>

    <!-- BR (F.1): Bulk Email Modal -->
    <div
      class="modal fade"
      id="bulkEmailModal"
      tabindex="-1"
      aria-labelledby="bulkEmailModalLabel"
      aria-hidden="true"
      ref="bulkEmailModalRef"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bulkEmailModalLabel">
              <i class="fas fa-envelope-bulk me-2" aria-hidden="true"></i>
              Send Bulk Email to {{ selectedUsers.length }} Users
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Success Message -->
            <div v-if="bulkEmailSuccess" class="alert alert-success" role="alert">
              <i class="fas fa-check-circle me-2" aria-hidden="true"></i>
              {{ bulkEmailSuccess }}
            </div>

            <!-- Error Message -->
            <div v-if="bulkEmailError" class="alert alert-danger" role="alert">
              <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
              {{ bulkEmailError }}
            </div>

            <!-- Bulk Email Form -->
            <form @submit.prevent="sendBulkEmail">
              <div class="mb-3">
                <label for="bulkSubject" class="form-label">Subject *</label>
                <input
                  type="text"
                  class="form-control"
                  id="bulkSubject"
                  v-model="bulkEmailData.subject"
                  required
                  placeholder="Email subject"
                  aria-required="true"
                />
              </div>

              <div class="mb-3">
                <label for="bulkText" class="form-label">Message *</label>
                <textarea
                  class="form-control"
                  id="bulkText"
                  v-model="bulkEmailData.text"
                  required
                  rows="6"
                  placeholder="Enter your message here..."
                  aria-required="true"
                ></textarea>
              </div>

              <div class="mb-3">
                <label for="bulkHtml" class="form-label">HTML Message (Optional)</label>
                <textarea
                  class="form-control"
                  id="bulkHtml"
                  v-model="bulkEmailData.html"
                  rows="4"
                  placeholder="<p>HTML formatted message...</p>"
                ></textarea>
              </div>

              <!-- Recipients List -->
              <div class="mb-3">
                <label class="form-label">Recipients ({{ selectedUserEmails.length }})</label>
                <div
                  class="p-3 bg-light rounded"
                  style="max-height: 150px; overflow-y: auto"
                  role="list"
                  aria-label="List of recipient email addresses"
                >
                  <div
                    v-for="email in selectedUserEmails"
                    :key="email"
                    class="badge bg-primary me-1 mb-1"
                    role="listitem"
                  >
                    {{ email }}
                  </div>
                </div>
              </div>

              <!-- Send Button -->
              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSendingBulk"
                  :aria-label="`Send bulk email to ${selectedUsers.length} users`"
                >
                  <span v-if="isSendingBulk">
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </span>
                  <span v-else>
                    <i class="fas fa-paper-plane me-2" aria-hidden="true"></i>
                    Send to {{ selectedUsers.length }} Users
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { Modal } from 'bootstrap'

// ============================================================================
// State Management / 状態管理
// ============================================================================

const users = ref([])
const loading = ref(true)
const error = ref(null)
let unsubscribe = null

const searchQuery = ref('')
const roleFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// BR (F.1): Bulk Email State
const selectedUsers = ref([])
const bulkEmailData = ref({
  subject: '',
  text: '',
  html: '',
})
const bulkEmailSuccess = ref('')
const bulkEmailError = ref('')
const isSendingBulk = ref(false)
const bulkEmailModalRef = ref(null)
let bulkEmailModal = null

const BULK_EMAIL_URL = 'https://us-central1-global-plate-dev.cloudfunctions.net/sendBulkEmail'

// ============================================================================
// Computed Properties / 算出プロパティ
// ============================================================================

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      !searchQuery.value ||
      (user.firstName && user.firstName.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesRole = !roleFilter.value || user.role === roleFilter.value

    return matchesSearch && matchesRole
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(startIndex.value, startIndex.value + itemsPerPage)
})

const allSelected = computed(() => {
  if (paginatedUsers.value.length === 0) return false
  return paginatedUsers.value.every((user) => selectedUsers.value.includes(user.id))
})

const selectedUserEmails = computed(() => {
  return users.value
    .filter((user) => selectedUsers.value.includes(user.id))
    .map((user) => user.email)
    .filter((email) => email)
})

// ============================================================================
// Methods / メソッド
// ============================================================================

const loadUsers = () => {
  try {
    const usersCollection = collection(db, 'users')

    unsubscribe = onSnapshot(
      usersCollection,
      (snapshot) => {
        users.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        loading.value = false
        console.log('Loaded users from Firestore:', users.value.length)
      },
      (err) => {
        console.error('Error loading users:', err)
        error.value = `Failed to load users: ${err.message}`
        loading.value = false
      },
    )
  } catch (err) {
    console.error('Error setting up users listener:', err)
    error.value = `Failed to connect to database: ${err.message}`
    loading.value = false
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    const currentPageIds = paginatedUsers.value.map((u) => u.id)
    selectedUsers.value = selectedUsers.value.filter((id) => !currentPageIds.includes(id))
  } else {
    const currentPageIds = paginatedUsers.value.map((u) => u.id)
    selectedUsers.value = [...new Set([...selectedUsers.value, ...currentPageIds])]
  }
}

const openBulkEmailModal = () => {
  if (selectedUsers.value.length === 0) {
    alert('Please select at least one user')
    return
  }

  if (!bulkEmailModal) {
    bulkEmailModal = new Modal(bulkEmailModalRef.value)
  }
  bulkEmailModal.show()

  bulkEmailSuccess.value = ''
  bulkEmailError.value = ''
}

const sendBulkEmail = async () => {
  if (selectedUserEmails.value.length === 0) {
    bulkEmailError.value = 'No valid email addresses selected'
    return
  }

  isSendingBulk.value = true
  bulkEmailSuccess.value = ''
  bulkEmailError.value = ''

  try {
    const response = await fetch(BULK_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients: selectedUserEmails.value,
        subject: bulkEmailData.value.subject,
        text: bulkEmailData.value.text,
        html: bulkEmailData.value.html || undefined,
      }),
    })

    const result = await response.json()

    if (result.success) {
      bulkEmailSuccess.value = `Successfully sent emails to ${result.count} users!`

      bulkEmailData.value = {
        subject: '',
        text: '',
        html: '',
      }
      selectedUsers.value = []

      setTimeout(() => {
        bulkEmailModal.hide()
        bulkEmailSuccess.value = ''
      }, 3000)
    } else {
      bulkEmailError.value = result.error || 'Failed to send bulk emails'
    }
  } catch (error) {
    console.error('Error sending bulk email:', error)
    bulkEmailError.value = 'Failed to send bulk emails. Please try again.'
  } finally {
    isSendingBulk.value = false
  }
}

// ============================================================================
// BR (E.4): PDF Export Functionality / PDFエクスポート機能
// ============================================================================

const exportToPDF = () => {
  try {
    console.log('Starting PDF export for', filteredUsers.value.length, 'users')

    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      alert('Please allow popups to export PDF')
      return
    }

    const currentDate = new Date()
    const dateString = currentDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    const yearString = currentDate.getFullYear()

    const tableRows = filteredUsers.value
      .map(
        (user) => `
      <tr>
        <td>${getFullName(user)}</td>
        <td>${user.email || 'N/A'}</td>
        <td>${getRoleDisplay(user.role)}</td>
        <td>${user.country || 'N/A'}</td>
        <td>${user.university || 'N/A'}</td>
        <td>${formatDate(user.createdAt)}</td>
      </tr>
    `,
      )
      .join('')

    const htmlContent =
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Global Plate - Users Export</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            color: #333;
          }

          .header {
            border-bottom: 3px solid #007bff;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }

          .header h1 {
            color: #007bff;
            font-size: 28px;
            margin-bottom: 5px;
          }

          .header .subtitle {
            color: #666;
            font-size: 14px;
          }

          .doc-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .doc-info-item {
            font-size: 14px;
          }

          .doc-info-item strong {
            color: #007bff;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
          }

          thead {
            background-color: #007bff;
            color: white;
          }

          th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #dee2e6;
          }

          th {
            font-weight: 600;
            font-size: 13px;
          }

          tbody tr:nth-child(even) {
            background-color: #f8f9fa;
          }

          tbody tr:hover {
            background-color: #e9ecef;
          }

          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #dee2e6;
            text-align: center;
            color: #666;
            font-size: 12px;
          }

          @media print {
            body {
              margin: 0;
              padding: 15px;
            }

            .header {
              page-break-after: avoid;
            }

            table {
              page-break-inside: auto;
            }

            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }

            thead {
              display: table-header-group;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌍 Global Plate - Users Report</h1>
          <div class="subtitle">User Management System Export</div>
        </div>

        <div class="doc-info">
          <div class="doc-info-item">
            <strong>Export Date:</strong> ${dateString}
          </div>
          <div class="doc-info-item">
            <strong>Total Users:</strong> ${filteredUsers.value.length}
          </div>
          <div class="doc-info-item">
            <strong>Generated By:</strong> Admin Dashboard
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Country</th>
              <th>University</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          <p>This document was generated by Global Plate Admin Dashboard</p>
          <p>© ${yearString} Global Plate - All Rights Reserved</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </` +
      `script>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    console.log('PDF export window opened successfully')
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    alert('Failed to export PDF. Please try again.')
  }
}

// ============================================================================
// Utility Functions / ユーティリティ関数
// ============================================================================

const getFullName = (user) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  } else if (user.firstName) {
    return user.firstName
  } else if (user.lastName) {
    return user.lastName
  } else {
    return 'No name'
  }
}

const getUserAvatar = (user) => {
  const name = getFullName(user) !== 'No name' ? getFullName(user) : user.email || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=32&background=007bff&color=ffffff`
}

const getRoleBadgeClass = (role) => {
  return role === 'admin' ? 'bg-warning text-dark' : 'bg-primary'
}

const getRoleDisplay = (role) => {
  return role === 'admin' ? 'Administrator' : 'Student Member'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (err) {
    console.error('Error formatting date:', err)
    return 'Invalid date'
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

onMounted(() => {
  console.log('Manage Users page loaded - loading from Firestore')
  loadUsers()
})

onUnmounted(() => {
  if (unsubscribe) {
    console.log('Cleaning up Firestore listener')
    unsubscribe()
  }
})
</script>

<style scoped>
.manage-users {
  padding-top: 3.5em;
  min-height: 100vh;
  background-color: #f8f9fa;
}

@media (min-width: 992px) {
  .manage-users {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

@media (max-width: 768px) {
  .manage-users {
    padding-bottom: 4em;
  }
}

.badge {
  font-size: 0.75rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.form-check-input {
  cursor: pointer;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}
</style>
