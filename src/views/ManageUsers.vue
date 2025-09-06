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
              >
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="roleFilter">
                <option value="">All Roles</option>
                <option value="user">Student Members</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="statusFilter">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- ユーザー一覧 -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">Users ({{ filteredUsers.length }})</h5>
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
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
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
                      >
                      <div>
                        <div class="fw-bold">{{ user.firstName }} {{ user.lastName }}</div>
                        <small class="text-muted">{{ user.university }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="getRoleBadgeClass(user.role)" class="badge">
                      {{ getRoleDisplay(user.role) }}
                    </span>
                  </td>
                  <td>{{ user.country }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(user.status)" class="badge">
                      {{ user.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary btn-sm" @click="editUser(user)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn btn-outline-danger btn-sm" @click="toggleUserStatus(user)">
                        <i class="fas fa-ban"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ページネーション -->
          <div class="d-flex justify-content-between align-items-center mt-3">
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Test User data
// To do. 
const users = ref([
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    role: 'user',
    country: 'Japan',
    university: 'Tokyo University',
    status: 'active',
    createdAt: new Date('2024-01-15')
  }
])

// フィルターとページネーション
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// フィルター済みユーザー
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      user.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    const matchesStatus = !statusFilter.value || user.status === statusFilter.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

// ページネーション
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredUsers.value.length))
const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(startIndex.value, startIndex.value + itemsPerPage)
})

// ユーティリティ関数
const getUserAvatar = (user) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&size=32&background=007bff&color=ffffff`
}

const getRoleBadgeClass = (role) => {
  return role === 'admin' ? 'bg-warning text-dark' : 'bg-primary'
}

const getRoleDisplay = (role) => {
  return role === 'admin' ? 'Administrator' : 'Student Member'
}

const getStatusBadgeClass = (status) => {
  return status === 'active' ? 'bg-success' : 'bg-secondary'
}

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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

// アクション関数
const editUser = (user) => {
  console.log('Edit user:', user)
  // 実際のアプリケーションでは編集モーダルを表示
}

// ここでstatusを追加させることで、USERの状態を管理させる事が可能。管理者は、ユーザーアカウントの状態を管理可能。
const toggleUserStatus = (user) => {
  console.log('Toggle user status:', user)
  // 実際のアプリケーションではAPIを呼び出してステータス変更
  user.status = user.status === 'active' ? 'inactive' : 'active'
}

onMounted(() => {
  console.log('Manage Users page loaded')
  // 実際のアプリケーションでは、ここでAPIからユーザーデータを取得
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
</style>