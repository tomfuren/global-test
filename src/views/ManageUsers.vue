<!--
  Manage Users Page - User management interface for administrators
  ユーザー管理ページ - 管理者向けユーザー管理インターフェース

  Features / 機能:
  - Real-time user list display with Firestore / Firestoreによるリアルタイムユーザー一覧表示
  - User search and filtering by role / ユーザー検索とロールによるフィルタリング
  - Pagination support / ページネーション対応
  - Bulk user selection / 複数ユーザーの一括選択
  - Bulk email sending to selected users / 選択したユーザーへの一括メール送信

  BR (C.2): Role-based Authentication - Administrator role verification and user role display
  BR (C.2): ロールベース認証 - 管理者ロールの検証とユーザーロール表示

  BR (F.1): Innovation - Bulk Email Feature
  BR (F.1): イノベーション機能 - 一括メール送信機能
  Allows administrators to send emails to multiple selected users at once via Firebase Cloud Functions
  管理者が選択した複数のユーザーに Firebase Cloud Functions 経由で一括メール送信を可能にする

  BR (D.3): Interactive Table Data - User Management Table
  BR (D.3): インタラクティブなテーブルデータ - ユーザー管理テーブル
  Provides real-time user data with search, filter, and pagination capabilities
  検索、フィルター、ページネーション機能を備えたリアルタイムユーザーデータを提供

  BR (E.3): Accessibility - ARIA labels, roles, and keyboard navigation support
  BR (E.3): アクセシビリティ - ARIAラベル、ロール、キーボードナビゲーション対応
-->

<template>
  <div class="manage-users">
    <div class="container-fluid px-4 py-4">
      <!-- ============================================================================
           Header Section / ヘッダーセクション
           Displays page title and back button to admin dashboard
           ページタイトルと管理ダッシュボードへ戻るボタンを配置
           ============================================================================ -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center">
          <i class="fas fa-users-cog text-primary me-3 fs-4" aria-hidden="true"></i>
          <h1 class="h3 mb-0">Manage Users</h1>
        </div>
        <div class="d-flex gap-2">
          <!--
            BR (F.1): Innovation - Bulk Email Button
            BR (F.1): イノベーション機能 - 一括メールボタン
            Allows bulk email sending to selected users
            選択されたユーザーに一括メール送信する機能
          -->
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

      <!-- ============================================================================
           Loading State Display / ローディング状態表示
           Shows spinner while data is being loaded
           データ読み込み中のスピナー表示
           ============================================================================ -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading users...</p>
      </div>

      <!-- ============================================================================
           Error Display / エラー表示
           Shows error message when data loading fails
           データ読み込み失敗時のエラーメッセージ
           ============================================================================ -->
      <div v-if="error" class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
        {{ error }}
      </div>

      <!-- ============================================================================
           Main Content / メインコンテンツ
           User search, filtering, and list display
           ユーザー検索、フィルター、一覧表示
           ============================================================================ -->
      <template v-if="!loading && !error">
        <!-- Search and Filter Card / 検索とフィルターカード -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <!--
                Search Box / 検索ボックス
                Search by name or email address
                名前、メールアドレスで検索可能
              -->
              <div class="col-md-5">
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

              <!--
                Role Filter / ロールフィルター
                Filter by administrator/student member
                管理者/学生メンバーで絞り込み
              -->
              <div class="col-md-5">
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

              <!--
                BR (F.1): Select All/Deselect All Button
                BR (F.1): 全選択/全解除ボタン
                Select/deselect all users on current page at once
                現在のページの全ユーザーを一括選択/解除
              -->
              <div class="col-md-2">
                <button
                  class="btn btn-outline-primary w-100"
                  @click="toggleSelectAll"
                  :aria-label="
                    allSelected
                      ? 'Deselect all users on current page'
                      : 'Select all users on current page'
                  "
                >
                  <i class="fas fa-check-square me-1" aria-hidden="true"></i>
                  {{ allSelected ? 'Deselect All' : 'Select All' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================================================
             Users List Table / ユーザー一覧テーブル
             BR (D.3): Interactive Table Data - Displays all user information in table format
             BR (D.3): インタラクティブなテーブルデータ - 全ユーザー情報を表形式で表示
             ============================================================================ -->
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
                    <!--
                      BR (F.1): Checkbox Column / チェックボックス列
                      For selecting target users for bulk email sending
                      Bulk Email送信対象ユーザーの選択用
                    -->
                    <th scope="col" style="width: 50px">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="allSelected"
                        @change="toggleSelectAll"
                        :aria-label="
                          allSelected
                            ? 'Deselect all users on this page'
                            : 'Select all users on this page'
                        "
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
                  <!--
                    User Row / ユーザー行
                    Display paginated user list
                    ページネーションされたユーザーリストを表示
                  -->
                  <tr v-for="user in paginatedUsers" :key="user.id">
                    <!-- BR (F.1): User Checkbox / 各ユーザーのチェックボックス -->
                    <td>
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :value="user.id"
                        v-model="selectedUsers"
                        :aria-label="`Select ${getFullName(user)}`"
                      />
                    </td>

                    <!--
                      User Information Column / ユーザー情報列
                      Display avatar, name, and university
                      アバター、名前、大学名を表示
                    -->
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

                    <!-- Email Column / メールアドレス列 -->
                    <td>{{ user.email }}</td>

                    <!--
                      Role Column / ロール列
                      BR (C.2): Role-based authentication - Role display
                      BR (C.2): ロールベース認証 - ロール表示
                    -->
                    <td>
                      <span
                        :class="getRoleBadgeClass(user.role)"
                        class="badge"
                        :aria-label="`User role: ${getRoleDisplay(user.role)}`"
                      >
                        {{ getRoleDisplay(user.role) }}
                      </span>
                    </td>

                    <!-- Country Column / 国列 -->
                    <td>{{ user.country || 'Unknown' }}</td>

                    <!-- Registration Date Column / 登録日列 -->
                    <td>{{ formatDate(user.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>

              <!--
                No Data Display / データなし表示
                When no users match the filter criteria
                フィルター条件に一致するユーザーがいない場合
              -->
              <div v-if="filteredUsers.length === 0" class="text-center py-4">
                <i class="fas fa-users fs-1 text-muted mb-3" aria-hidden="true"></i>
                <h5>No users found</h5>
                <p class="text-muted">Try adjusting your search criteria</p>
              </div>
            </div>

            <!-- ============================================================================
                 Pagination / ページネーション
                 Page navigation for user list
                 ユーザーリストのページ送り機能
                 ============================================================================ -->
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

    <!-- ============================================================================
         BR (F.1): Innovation - Bulk Email Modal
         BR (F.1): イノベーション機能 - 一括メールモーダル

         Modal dialog for sending bulk emails to selected users
         選択されたユーザーに一括でメールを送信するためのモーダルダイアログ

         Features / 機能:
         - Input subject, text, and HTML message / 件名、本文、HTMLメッセージの入力
         - Display list of selected user email addresses / 選択されたユーザーのメールアドレス一覧表示
         - Calls Firebase Cloud Functions sendBulkEmail / Firebase Cloud Functionsの sendBulkEmail を呼び出し

         Process / 処理:
         1. Collect email content (subject, body, HTML) / メール内容を収集（件名、本文、HTML）
         2. Send POST request to Cloud Function / Cloud FunctionにPOSTリクエスト送信
         3. Display success/error messages / 成功/エラーメッセージを表示
         4. Reset form and close modal on success / 成功時はフォームリセットとモーダルを閉じる
         ============================================================================ -->
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
            <!-- Success Message / 成功メッセージ -->
            <div v-if="bulkEmailSuccess" class="alert alert-success" role="alert">
              <i class="fas fa-check-circle me-2" aria-hidden="true"></i>
              {{ bulkEmailSuccess }}
            </div>

            <!-- Error Message / エラーメッセージ -->
            <div v-if="bulkEmailError" class="alert alert-danger" role="alert">
              <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
              {{ bulkEmailError }}
            </div>

            <!-- Bulk Email Form / 一括メールフォーム -->
            <form @submit.prevent="sendBulkEmail">
              <!-- Subject Input / 件名入力 -->
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

              <!-- Message Text Input / メッセージ本文入力 -->
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

              <!-- HTML Message Input (Optional) / HTMLメッセージ入力 (オプション) -->
              <div class="mb-3">
                <label for="bulkHtml" class="form-label"> HTML Message (Optional) </label>
                <textarea
                  class="form-control"
                  id="bulkHtml"
                  v-model="bulkEmailData.html"
                  rows="4"
                  placeholder="<p>HTML formatted message...</p>"
                ></textarea>
              </div>

              <!--
                Recipients List Display / 受信者リスト表示
                Display email addresses of selected users
                選択されたユーザーのメールアドレスを表示
              -->
              <div class="mb-3">
                <label class="form-label"> Recipients ({{ selectedUserEmails.length }}) </label>
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

              <!-- Send Button / 送信ボタン -->
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
// ============================================================================
// Imports / インポート
// ============================================================================
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { Modal } from 'bootstrap'

// ============================================================================
// State Management / 状態管理
// ============================================================================

// User Data Management / ユーザーデータ管理
const users = ref([]) // List of all users / 全ユーザーのリスト
const loading = ref(true) // Loading state / ローディング状態
const error = ref(null) // Error message / エラーメッセージ
let unsubscribe = null // For Firestore listener cleanup / Firestoreリスナーのクリーンアップ用

// Search and Filter / 検索とフィルター
const searchQuery = ref('') // Search keyword / 検索キーワード
const roleFilter = ref('') // Role filter / ロールフィルター

// Pagination / ページネーション
const currentPage = ref(1) // Current page number / 現在のページ番号
const itemsPerPage = 10 // Items per page / 1ページあたりの表示件数

// BR (F.1): Innovation - State management for Bulk Email feature
// BR (F.1): イノベーション機能 - Bulk Email機能の状態管理
const selectedUsers = ref([]) // Array of selected user IDs / 選択されたユーザーIDの配列
const bulkEmailData = ref({
  subject: '', // Email subject / メール件名
  text: '', // Email body / メール本文
  html: '', // HTML email body (optional) / HTMLメール本文(オプション)
})
const bulkEmailSuccess = ref('') // Success message / 成功メッセージ
const bulkEmailError = ref('') // Error message / エラーメッセージ
const isSendingBulk = ref(false) // Sending flag / 送信中フラグ
const bulkEmailModalRef = ref(null) // Reference to modal element / モーダル要素への参照
let bulkEmailModal = null // Bootstrap modal instance / Bootstrapモーダルインスタンス

// Cloud Function URL - Firebase Cloud Functions endpoint
const BULK_EMAIL_URL = 'https://us-central1-global-plate-dev.cloudfunctions.net/sendBulkEmail'

// ============================================================================
// Computed Properties / 算出プロパティ
// ============================================================================

/**
 * Filtered Users List / フィルター済みユーザーリスト
 * User list with search keywords and role filters applied
 * 検索キーワードとロールフィルターを適用したユーザーリスト
 */
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    // Search criteria matching / 検索条件のマッチング
    // Search by name (firstName, lastName) or email address
    // 名前(firstName, lastName)またはメールアドレスで検索
    const matchesSearch =
      !searchQuery.value ||
      (user.firstName && user.firstName.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.value.toLowerCase()))

    // Role filter matching / ロールフィルターのマッチング
    const matchesRole = !roleFilter.value || user.role === roleFilter.value

    return matchesSearch && matchesRole
  })
})

/**
 * Calculations for Pagination / ページネーション用の計算
 */
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

/**
 * User list to display on current page / 現在のページに表示するユーザーリスト
 */
const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(startIndex.value, startIndex.value + itemsPerPage)
})

/**
 * BR (F.1): Check if all users are selected / 全選択状態の判定
 * Determines if all users on the current page are selected
 * 現在のページの全ユーザーが選択されているかを判定
 */
const allSelected = computed(() => {
  if (paginatedUsers.value.length === 0) return false
  return paginatedUsers.value.every((user) => selectedUsers.value.includes(user.id))
})

/**
 * BR (F.1): List of selected user email addresses / 選択されたユーザーのメールアドレス一覧
 * Recipient list used when sending bulk emails
 * Bulk Email送信時に使用する受信者リスト
 */
const selectedUserEmails = computed(() => {
  return users.value
    .filter((user) => selectedUsers.value.includes(user.id))
    .map((user) => user.email)
    .filter((email) => email) // Exclude empty email addresses / 空のメールアドレスを除外
})

// ============================================================================
// Methods / メソッド
// ============================================================================

/**
 * Load user data from Firestore / Firestoreからユーザーデータを読み込む
 * Set up real-time listener to automatically reflect data changes
 * リアルタイムリスナーを設定し、データ変更を自動的に反映
 */
const loadUsers = () => {
  try {
    const usersCollection = collection(db, 'users')

    // onSnapshot: Firestore real-time listener
    // onSnapshot: Firestoreのリアルタイムリスナー
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

/**
 * BR (F.1): Toggle select all/deselect all / 全選択/全解除トグル
 * Select or deselect all users on the current page
 * 現在のページの全ユーザーを選択または選択解除
 */
const toggleSelectAll = () => {
  if (allSelected.value) {
    // Deselect all users on current page / 現在のページの全ユーザーを選択から外す
    const currentPageIds = paginatedUsers.value.map((u) => u.id)
    selectedUsers.value = selectedUsers.value.filter((id) => !currentPageIds.includes(id))
  } else {
    // Select all users on current page / 現在のページの全ユーザーを選択
    const currentPageIds = paginatedUsers.value.map((u) => u.id)
    selectedUsers.value = [...new Set([...selectedUsers.value, ...currentPageIds])]
  }
}

/**
 * BR (F.1): Open Bulk Email Modal / 一括メールモーダルを開く
 * Display modal if at least one user is selected
 * 選択されたユーザーが1人以上いる場合にモーダルを表示
 */
const openBulkEmailModal = () => {
  if (selectedUsers.value.length === 0) {
    alert('Please select at least one user')
    return
  }

  // Create and display Bootstrap modal instance
  // Bootstrapモーダルインスタンスを作成して表示
  if (!bulkEmailModal) {
    bulkEmailModal = new Modal(bulkEmailModalRef.value)
  }
  bulkEmailModal.show()

  // Reset messages / メッセージをリセット
  bulkEmailSuccess.value = ''
  bulkEmailError.value = ''
}

/**
 * BR (F.1): Send Bulk Email / 一括メール送信処理
 *
 * Calls Firebase Cloud Functions sendBulkEmail function to
 * send emails to all selected users at once
 *
 * Firebase Cloud Functionsの sendBulkEmail 関数を呼び出し、
 * 選択されたユーザー全員にメールを一括送信する
 *
 * Process Flow / 処理フロー:
 * 1. Validation / バリデーション
 * 2. Send request to Cloud Function / Cloud Functionへリクエスト送信
 * 3. On success: Reset form, close modal / 成功時: フォームリセット、モーダル閉じる
 * 4. On failure: Display error message / 失敗時: エラーメッセージ表示
 */
const sendBulkEmail = async () => {
  if (selectedUserEmails.value.length === 0) {
    bulkEmailError.value = 'No valid email addresses selected'
    return
  }

  isSendingBulk.value = true
  bulkEmailSuccess.value = ''
  bulkEmailError.value = ''

  try {
    // Send request to Cloud Function / Cloud Functionへリクエスト送信
    const response = await fetch(BULK_EMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients: selectedUserEmails.value, // Recipient list / 受信者リスト
        subject: bulkEmailData.value.subject, // Subject / 件名
        text: bulkEmailData.value.text, // Body / 本文
        html: bulkEmailData.value.html || undefined, // HTML body (optional) / HTML本文(オプション)
      }),
    })

    const result = await response.json()

    if (result.success) {
      bulkEmailSuccess.value = `Successfully sent emails to ${result.count} users!`

      // Reset form / フォームをリセット
      bulkEmailData.value = {
        subject: '',
        text: '',
        html: '',
      }
      selectedUsers.value = []

      // Close modal after 3 seconds / 3秒後にモーダルを閉じる
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
// Utility Functions / ユーティリティ関数
// ============================================================================

/**
 * Get user's full name / ユーザーのフルネームを取得
 * Concatenate firstName and lastName, use email if unavailable
 * firstName と lastName を連結、なければメールアドレスを使用
 */
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

/**
 * Generate user avatar image URL / ユーザーアバター画像URLを生成
 * Generate avatar from name initials using UI Avatars API
 * UI Avatars APIを使用して、名前の頭文字からアバターを生成
 */
const getUserAvatar = (user) => {
  const name = getFullName(user) !== 'No name' ? getFullName(user) : user.email || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=32&background=007bff&color=ffffff`
}

/**
 * BR (C.2): Get role badge CSS class / ロールバッジのCSSクラスを取得
 * Display yellow badge for administrators, blue for student members
 * 管理者は黄色、学生メンバーは青色のバッジを表示
 */
const getRoleBadgeClass = (role) => {
  return role === 'admin' ? 'bg-warning text-dark' : 'bg-primary'
}

/**
 * BR (C.2): Get role display name / ロールの表示名を取得
 * 'admin' → 'Administrator', 'user' → 'Student Member'
 */
const getRoleDisplay = (role) => {
  return role === 'admin' ? 'Administrator' : 'Student Member'
}

/**
 * Date Formatting / 日付フォーマット
 * Convert Firestore Timestamp to readable format
 * Firestore Timestampを読みやすい形式に変換
 */
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'

  try {
    // Check if Firestore Timestamp / Firestore Timestampかどうかチェック
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

/**
 * Pagination: Next Page / ページネーション: 次のページへ
 */
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

/**
 * Pagination: Previous Page / ページネーション: 前のページへ
 */
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================
/**
 * On Component Mount / コンポーネントマウント時
 * Load user data from Firestore
 * Firestoreからユーザーデータを読み込む
 */
onMounted(() => {
  console.log('Manage Users page loaded - loading from Firestore')
  loadUsers()
})

/**
 * On Component Unmount / コンポーネントアンマウント時
 * Clean up Firestore listener to prevent memory leaks
 * Firestoreリスナーをクリーンアップしてメモリリークを防ぐ
 */
onUnmounted(() => {
  if (unsubscribe) {
    console.log('Cleaning up Firestore listener')
    unsubscribe()
  }
})
</script>

<style scoped>
/* Overall page layout / ページ全体のレイアウト */
.manage-users {
  padding-top: 3.5em; /* Padding for NavBar height / NavBarの高さ分のパディング */
  min-height: 100vh; /* Minimum height to full screen / 最小高さを画面全体に */
  background-color: #f8f9fa; /* Background color / 背景色 */
}

/* Adjustment for desktop with sidebar / デスクトップでサイドバーがある場合の調整 */
@media (min-width: 992px) {
  .manage-users {
    margin-left: 4.5em; /* Margin for sidebar width / サイドバーの幅分のマージン */
    transition: margin-left 0.2s ease; /* Smooth transition / スムーズな遷移 */
  }
}

/* Mobile Support / モバイル対応 */
@media (max-width: 768px) {
  .manage-users {
    padding-bottom: 4em; /* Padding for bottom navigation / ボトムナビゲーション分のパディング */
  }
}

/* Badge size adjustment / バッジのサイズ調整 */
.badge {
  font-size: 0.75rem;
}

/* Loading spinner size / ローディングスピナーのサイズ */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Checkbox cursor / チェックボックスのカーソル */
.form-check-input {
  cursor: pointer;
}

/* Enhance table row hover effect / テーブル行のホバー効果を強化 */
.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}
</style>
