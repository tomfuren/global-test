<!--
  ユーザー管理ページ - 管理者専用のユーザー一覧と管理画面
  Manage Users Page - Admin-only user list and management interface

  主要機能 / Key Features:
  - Firestoreリアルタイムリスナー: ユーザーデータの自動同期 / Firestore real-time listener: Auto-sync user data
  - 検索機能: 名前、メールアドレスで検索 / Search: by name and email address
  - ロールフィルタ: 管理者 / 学生で絞り込み / Role filter: filter by admin / student
  - ページネーション: 10件ずつ表示 / Pagination: display 10 items per page
  - アバター生成: UI Avatars APIで動的生成 / Avatar generation: dynamically generated using UI Avatars API

  セキュリティ / Security:
  - 管理者権限必須: router/index.jsで制御 / Admin permission required: controlled in router/index.js
  - Firebase Authentication: 認証済みユーザーのみアクセス可能 / Authenticated users only
-->
<template>
  <div class="manage-users">
    <div class="container-fluid px-4 py-4">
      <!--
        ページヘッダー - タイトルと戻るボタン
        Page Header - Title and back button
      -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center">
          <i class="fas fa-users-cog text-primary me-3 fs-4"></i>
          <h1 class="h3 mb-0">Manage Users</h1>
        </div>
        <router-link to="/admin" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
        </router-link>
      </div>

      <!--
        ローディング状態 - Firestoreからデータ取得中
        Loading State - Fetching data from Firestore
      -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading users ...</p>
      </div>

      <!--
        エラー表示 - Firestore接続エラーなど
        Error Display - Firestore connection errors, etc.
      -->
      <div v-if="error" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
      </div>

      <template v-if="!loading && !error">
        <!--
          検索とフィルターカード
          Search and Filter Card

          機能 / Features:
          - 検索: firstName, lastName, emailで部分一致検索 / Search: partial match on firstName, lastName, email
          - ロールフィルタ: 'user' (学生) または 'admin' (管理者) で絞り込み / Role filter: filter by 'user' (student) or 'admin' (administrator)
          - リアルタイム更新: 入力と同時にfilteredUsersが再計算 / Real-time update: filteredUsers recalculates on input
        -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <!-- 検索フィールド / Search Field -->
              <div class="col-md-6">
                <input
                  type="search"
                  class="form-control"
                  placeholder="Search users..."
                  v-model="searchQuery"
                />
              </div>
              <!-- ロールフィルター / Role Filter -->
              <div class="col-md-6">
                <select class="form-select" v-model="roleFilter">
                  <option value="">All Roles</option>
                  <option value="user">Student Members</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!--
          ユーザー一覧テーブル
          User List Table

          表示データ / Displayed Data:
          - フィルター後の件数 / Filtered count: filteredUsers.length
          - 全体の件数 / Total count: users.length
          - ページネーション適用後のユーザー / Paginated users: paginatedUsers

          列 / Columns:
          1. User: アバター + 氏名 + 大学名 / Avatar + Full Name + University
          2. Email: メールアドレス / Email Address
          3. Role: ロールバッジ (管理者 = 黄, 学生 = 青) / Role Badge (Admin = Yellow, Student = Blue)
          4. Country: 出身国 / Country of Origin
          5. Joined: 登録日 (Firestore Timestamp) / Registration Date (Firestore Timestamp)
        -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              Users ({{ filteredUsers.length }})
              <small class="text-muted">- Total: {{ users.length }}</small>
            </h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Country</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- ユーザー行 - paginatedUsersから各ユーザーを表示 / User Row - Display each user from paginatedUsers -->
                  <tr v-for="user in paginatedUsers" :key="user.id">
                    <!-- ユーザー情報列: アバター + 名前 + 大学 / User Info Column: Avatar + Name + University -->
                    <td>
                      <div class="d-flex align-items-center">
                        <!-- UI Avatars APIで動的生成されたアバター / Avatar dynamically generated by UI Avatars API -->
                        <img
                          :src="getUserAvatar(user)"
                          class="rounded-circle me-2"
                          width="32"
                          height="32"
                        />
                        <div>
                          <div class="fw-bold">{{ getFullName(user) }}</div>
                          <small class="text-muted">{{ user.university || 'No university' }}</small>
                        </div>
                      </div>
                    </td>
                    <td>{{ user.email }}</td>
                    <!-- ロールバッジ: 管理者は警告色、学生はプライマリ色 / Role Badge: Admin = Warning, Student = Primary -->
                    <td>
                      <span :class="getRoleBadgeClass(user.role)" class="badge">
                        {{ getRoleDisplay(user.role) }}
                      </span>
                    </td>
                    <td>{{ user.country || 'Unknown' }}</td>
                    <!-- 登録日: Firestore TimestampをフォーマットFormats / Joined Date: Firestore Timestamp formatted -->
                    <td>{{ formatDate(user.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>

              <!--
                空状態 - 検索結果なし
                Empty State - No search results
                フィルター条件を変更するよう促す
                Prompts user to adjust filter criteria
              -->
              <div v-if="filteredUsers.length === 0" class="text-center py-4">
                <i class="fas fa-users fs-1 text-muted mb-3"></i>
                <h5>No users found</h5>
                <p class="text-muted">Try adjusting your search criteria</p>
              </div>
            </div>

            <!--
              ページネーション - 10件ずつ表示
              Pagination - Display 10 items per page

              計算ロジック / Calculation Logic:
              - totalPages: Math.ceil(filteredUsers.length / 10) / Total pages
              - startIndex: (currentPage - 1) × 10 / Start index
              - endIndex: Math.min(startIndex + 10, filteredUsers.length) / End index
              - paginatedUsers: filteredUsers.slice(startIndex, endIndex) / Paginated users

              表示制御 / Display Control:
              - ページ数が1ページのみの場合は非表示 / Hidden when only 1 page
            -->
            <div
              v-if="totalPages > 1"
              class="d-flex justify-content-between align-items-center mt-3"
            >
              <div class="text-muted">
                Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredUsers.length }} users
              </div>
              <div class="btn-group">
                <!-- 前へボタン - 1ページ目では無効化 / Previous button - disabled on page 1 -->
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="previousPage"
                  :disabled="currentPage === 1"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <!-- ページ番号表示 / Page number display -->
                <span class="btn btn-outline-secondary btn-sm disabled">
                  {{ currentPage }} / {{ totalPages }}
                </span>
                <!-- 次へボタン - 最終ページでは無効化 / Next button - disabled on last page -->
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
/**
 * ManageUsers.vue - ユーザー管理スクリプト
 * ManageUsers.vue - User Management Script
 *
 * 管理者専用のユーザー一覧・管理画面
 * Admin-only user list and management interface
 *
 * 主要技術 / Key Technologies:
 * - Firestore Real-time Listener: onSnapshot()でリアルタイム同期 / Real-time sync with onSnapshot()
 * - Computed Properties: 検索・フィルタリングの自動再計算 / Auto-recalculation for search and filtering
 * - UI Avatars API: ユーザーアバターの動的生成 / Dynamic user avatar generation
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
// Firestore インポート / Firestore imports
// eslint-disable-next-line
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/init'

/**
 * リアクティブステート / Reactive State
 */

// ユーザーデータ (Firestoreから取得) / User data (fetched from Firestore)
const users = ref([])

// ローディング状態 / Loading state
const loading = ref(true)

// エラーメッセージ / Error message
const error = ref(null)

/**
 * フィルターとページネーション設定
 * Filter and Pagination Settings
 */

// 検索クエリ (firstName, lastName, emailで検索) / Search query (search by firstName, lastName, email)
const searchQuery = ref('')

// ロールフィルタ ('user' | 'admin' | '') / Role filter
const roleFilter = ref('')

// 現在のページ番号 / Current page number
const currentPage = ref(1)

// 1ページあたりの表示件数 / Items per page
const itemsPerPage = 10

/**
 * Firestoreリスナーのクリーンアップ用
 * Firestore listener cleanup
 */
let unsubscribe = null

/**
 * Firestoreからユーザーデータを取得 (リアルタイムリスナー)
 * Fetch user data from Firestore (Real-time listener)
 *
 * 処理フロー / Process Flow:
 * 1. Firestoreの'users'コレクションをクエリ / Query 'users' collection in Firestore
 * 2. createdAtで降順ソート (新しいユーザーが上) / Sort by createdAt descending (newest users first)
 * 3. onSnapshot()でリアルタイム監視開始 / Start real-time monitoring with onSnapshot()
 * 4. スナップショット受信時にusers配列を更新 / Update users array on snapshot received
 * 5. エラー時はerrorステートにメッセージ格納 / Store error message in error state on error
 */
const loadUsers = () => {
  try {
    console.log('Setting up Firestore listener for users...')

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('Firestore snapshot received, documents:', snapshot.docs.length)

        users.value = snapshot.docs.map((doc) => {
          const data = doc.data()
          console.log('User data:', data)

          return {
            id: doc.id,
            ...data,
          }
        })

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
 * 算出プロパティ: フィルター済みユーザー
 * Computed Property: Filtered Users
 *
 * 検索とロールフィルタを適用したユーザーリスト
 * User list with search and role filter applied
 *
 * フィルタリングロジック / Filtering Logic:
 * 1. 検索: firstName, lastName, emailのいずれかに部分一致 / Search: partial match on firstName, lastName, or email
 * 2. ロール: roleFilterが設定されている場合は完全一致 / Role: exact match if roleFilter is set
 * 3. 両方の条件を満たすユーザーのみ返す (AND条件) / Return only users matching both conditions (AND)
 */
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

/**
 * ページネーション関連の算出プロパティ
 * Pagination-related Computed Properties
 */

// 総ページ数 / Total pages
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

// 開始インデックス (0ベース) / Start index (0-based)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)

// 終了インデックス / End index
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage, filteredUsers.value.length),
)

// ページネーション適用後のユーザー配列 / Paginated user array
const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(startIndex.value, startIndex.value + itemsPerPage)
})

/**
 * ユーティリティ関数 / Utility Functions
 */

/**
 * ユーザーのフルネームを取得
 * Get user's full name
 *
 * @param {Object} user - ユーザーオブジェクト / User object
 * @returns {string} フルネームまたはフォールバック文字列 / Full name or fallback string
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
 * ユーザーのアバターURLを取得 (UI Avatars API)
 * Get user's avatar URL (UI Avatars API)
 *
 * @param {Object} user - ユーザーオブジェクト / User object
 * @returns {string} UI Avatars APIのURL / UI Avatars API URL
 *
 * UI Avatars API: https://ui-avatars.com/
 * パラメータ / Parameters:
 * - name: ユーザー名またはメールアドレス / User name or email address
 * - size: 32px
 * - background: 007bff (Bootstrapのプライマリブルー) / Primary blue
 * - color: ffffff (白) / White
 */
const getUserAvatar = (user) => {
  const name = getFullName(user) !== 'No name' ? getFullName(user) : user.email || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=32&background=007bff&color=ffffff`
}

/**
 * ロールに応じたバッジクラスを返す
 * Return badge class based on role
 *
 * @param {string} role - ユーザーロール ('admin' | 'user') / User role
 * @returns {string} Bootstrapバッジクラス / Bootstrap badge class
 */
const getRoleBadgeClass = (role) => {
  return role === 'admin' ? 'bg-warning text-dark' : 'bg-primary'
}

/**
 * ロールの表示名を返す
 * Return display name for role
 *
 * @param {string} role - ユーザーロール / User role
 * @returns {string} 表示用ロール名 / Display role name
 */
const getRoleDisplay = (role) => {
  return role === 'admin' ? 'Administrator' : 'Student Member'
}

/**
 * Firestoreタイムスタンプを日付文字列にフォーマット
 * Format Firestore timestamp to date string
 *
 * @param {Timestamp|Date|string} timestamp - Firestoreタイムスタンプまたは日付 / Firestore timestamp or date
 * @returns {string} フォーマットされた日付文字列 (例: 'Oct 21, 2025') / Formatted date string (e.g., 'Oct 21, 2025')
 */
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'

  try {
    // Firestore Timestampかどうかチェック
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
 * 次のページに移動
 * Move to next page
 */
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

/**
 * 前のページに移動
 * Move to previous page
 */
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

/**
 * ライフサイクルフック / Lifecycle Hooks
 */

/**
 * コンポーネントマウント時
 * On component mount
 *
 * Firestoreリアルタイムリスナーを起動
 * Start Firestore real-time listener
 */
onMounted(() => {
  console.log('Manage Users page loaded - loading from Firestore')
  loadUsers()
})

/**
 * コンポーネントアンマウント時
 * On component unmount
 *
 * Firestoreリスナーをクリーンアップしてメモリリークを防ぐ
 * Clean up Firestore listener to prevent memory leaks
 */
onUnmounted(() => {
  // Firestoreリスナーをクリーンアップ / Clean up Firestore listener
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

/* デスクトップでサイドバーがある場合の調整 */
@media (min-width: 992px) {
  .manage-users {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

/* モバイル対応 */
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
</style>
