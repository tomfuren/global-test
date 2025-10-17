<template>
  <div class="manage-users">
    <div class="container-fluid px-4 py-4">
      <!-- ヘッダー -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center">
          <i class="fas fa-users-cog text-primary me-3 fs-4"></i>
          <h1 class="h3 mb-0">Manage Users</h1>
        </div>
        <router-link to="/admin" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
        </router-link>
      </div>

      <!-- ローディング表示 -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading users ...</p>
      </div>

      <!-- エラー表示 -->
      <div v-if="error" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
      </div>

      <template v-if="!loading && !error">
        <!-- 検索とフィルター -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <input
                  type="search"
                  class="form-control"
                  placeholder="Search users..."
                  v-model="searchQuery"
                />
              </div>
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

        <!-- ユーザー一覧 -->
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
                  <tr v-for="user in paginatedUsers" :key="user.id">
                    <td>
                      <div class="d-flex align-items-center">
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
                    <td>
                      <span :class="getRoleBadgeClass(user.role)" class="badge">
                        {{ getRoleDisplay(user.role) }}
                      </span>
                    </td>
                    <td>{{ user.country || 'Unknown' }}</td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>

              <!-- データがない場合 -->
              <div v-if="filteredUsers.length === 0" class="text-center py-4">
                <i class="fas fa-users fs-1 text-muted mb-3"></i>
                <h5>No users found</h5>
                <p class="text-muted">Try adjusting your search criteria</p>
              </div>
            </div>

            <!-- ページネーション -->
            <div
              v-if="totalPages > 1"
              class="d-flex justify-content-between align-items-center mt-3"
            >
              <div class="text-muted">
                Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredUsers.length }} users
              </div>
              <div class="btn-group">
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="previousPage"
                  :disabled="currentPage === 1"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="btn btn-outline-secondary btn-sm disabled">
                  {{ currentPage }} / {{ totalPages }}
                </span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
// eslint-disable-next-line
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/init'

// ユーザーデータ（Firestoreから取得）
const users = ref([])
const loading = ref(true)
const error = ref(null)

// フィルターとページネーション
const searchQuery = ref('')
const roleFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Firestoreリスナー
let unsubscribe = null

// Firestoreからユーザーデータを取得
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

// フィルター済みユーザー
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

// ページネーション
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage, filteredUsers.value.length),
)
const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(startIndex.value, startIndex.value + itemsPerPage)
})

// ユーティリティ関数
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

// ライフサイクル
onMounted(() => {
  console.log('Manage Users page loaded - loading from Firestore')
  loadUsers()
})

onUnmounted(() => {
  // Firestoreリスナーをクリーンアップ
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
