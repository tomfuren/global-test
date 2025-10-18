<template>
  <div class="admin-dashboard">
    <div class="container-fluid px-4 py-4">
      <!-- ヘッダー -->
      <div class="d-flex align-items-center mb-4">
        <i class="fas fa-crown text-warning me-3 fs-4"></i>
        <h1 class="h3 mb-0">Admin Dashboard</h1>
      </div>

      <!-- エラー表示 -->
      <div v-if="error" class="alert alert-danger mb-4">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
      </div>

      <!-- 統計カード -->
      <div class="row g-4 mb-4">
        <!-- Total Users カード -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-users text-primary fs-2 mb-2"></i>
              <h5>Total Users</h5>

              <!-- ローディング表示 -->
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>

              <!-- ユーザー数を表示 -->
              <h3 v-else class="text-primary">{{ stats.totalUsers }}</h3>
            </div>
          </div>
        </div>

        <!-- Recipes カード -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-utensils text-success fs-2 mb-2"></i>
              <h5>Recipes</h5>

              <!-- ローディング表示 -->
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm text-success"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>

              <!-- レシピ数を表示 -->
              <h3 v-else class="text-success">{{ stats.totalRecipes }}</h3>
            </div>
          </div>
        </div>

        <!-- Events カード -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-calendar text-info fs-2 mb-2"></i>
              <h5>Events</h5>

              <!-- ローディング表示 -->
              <div v-if="loading" class="spinner-border spinner-border-sm text-info" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>

              <!-- イベント数を表示 -->
              <h3 v-else class="text-info">{{ stats.totalEvents }}</h3>
            </div>
          </div>
        </div>

        <!-- Country Groups カード -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-globe text-warning fs-2 mb-2"></i>
              <h5>Country Groups</h5>

              <!-- ローディング表示 -->
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm text-warning"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>

              <!-- グループ数を表示 -->
              <h3 v-else class="text-warning">{{ stats.totalGroups }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- 詳細統計 -->
      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0"><i class="fas fa-users me-2"></i>User Statistics</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span> <i class="fas fa-user text-primary me-2"></i>Student Members: </span>
                <strong class="text-primary">{{ stats.studentUsers }}</strong>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span> <i class="fas fa-crown text-warning me-2"></i>Administrators: </span>
                <strong class="text-warning">{{ stats.adminUsers }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="fas fa-chart-line me-2"></i>Platform Activity
              </h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span> <i class="fas fa-utensils text-success me-2"></i>Total Recipes: </span>
                <strong class="text-success">{{ stats.totalRecipes }}</strong>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span> <i class="fas fa-calendar text-info me-2"></i>Active Events: </span>
                <strong class="text-info">{{ stats.totalEvents }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 管理アクション -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0"><i class="fas fa-tools me-2"></i>Quick Actions</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <router-link to="/admin/users" class="btn btn-outline-primary w-100">
                <i class="fas fa-users-cog me-2"></i>Manage Users
              </router-link>
            </div>
            <div class="col-md-6">
              <button class="btn btn-outline-success w-100">
                <i class="fas fa-shield-alt me-2"></i>Content Moderation
              </button>
            </div>
            <div class="col-md-6">
              <button class="btn btn-outline-info w-100">
                <i class="fas fa-chart-bar me-2"></i>View Reports
              </button>
            </div>
            <div class="col-md-6">
              <button class="btn btn-outline-warning w-100" @click="fetchStats" :disabled="loading">
                <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': loading }"></i>
                {{ loading ? 'Refreshing...' : 'Refresh Statistics' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// BR (E.1): Cloud Functions - 統計データ
const stats = ref({
  totalUsers: 0,
  studentUsers: 0,
  adminUsers: 0,
  totalRecipes: 0,
  totalEvents: 0,
  totalGroups: 0,
})

const loading = ref(true)
const error = ref(null)

/**
 * BR (E.1): Cloud Functionsから全統計を取得
 *
 * すべての統計を一度のリクエストで取得する効率的な方法
 * Cloud Function: getStats
 */
const fetchStats = async () => {
  loading.value = true
  error.value = null

  try {
    // Cloud FunctionのURL
    const url = 'https://us-central1-global-plate-dev.cloudfunctions.net/getStats'

    console.log('Fetching statistics from Cloud Function...')

    // HTTPリクエストでCloud Functionを呼び出し
    const response = await axios.get(url)

    console.log('Response from Cloud Function:', response.data)

    // レスポンスから統計データを取得
    if (response.data.success) {
      stats.value = response.data.stats
      console.log('Statistics loaded successfully:', stats.value)
    } else {
      error.value = 'Failed to load statistics'
    }
  } catch (err) {
    console.error('Error calling Cloud Function:', err)
    error.value = 'Failed to connect to server. Please try again later.'
  } finally {
    loading.value = false
  }
}

// コンポーネントマウント時に統計を取得
onMounted(() => {
  console.log('AdminDashboard mounted, loading statistics from Cloud Functions...')
  fetchStats()
})
</script>

<style scoped>
.admin-dashboard {
  padding-top: 3.5em;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* デスクトップでサイドバーがある場合の調整 */
@media (min-width: 992px) {
  .admin-dashboard {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

/* モバイル対応 */
@media (max-width: 768px) {
  .admin-dashboard {
    padding-bottom: 4em;
  }
}

.card {
  border-radius: 10px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.spinner-border-sm {
  width: 2rem;
  height: 2rem;
}

.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
