<!--
  Admin Dashboard - Administrative control panel with platform statistics
  管理者ダッシュボード - プラットフォーム統計を含む管理制御パネル

  Features / 機能:
  - Real-time platform statistics display / リアルタイムプラットフォーム統計表示
  - Interactive charts using Chart.js / Chart.jsを使用したインタラクティブチャート
  - User analytics (total, students, admins) / ユーザー分析（合計、学生、管理者）
  - Content metrics (recipes, events, groups) / コンテンツメトリクス（レシピ、イベント、グループ）
  - Quick action buttons for admin tasks / 管理タスク用のクイックアクションボタン

  BR (C.2): Role-based authentication - Admin-only access
  BR (E.1): Cloud Functions - Statistics data retrieval
  BR (F.1): Innovation - Interactive Charts with Firestore data
-->

<template>
  <div class="admin-dashboard">
    <div class="container-fluid px-4 py-4">
      <!-- Dashboard Header / ダッシュボードヘッダー -->
      <div class="d-flex align-items-center mb-4">
        <i class="fas fa-crown text-warning me-3 fs-4"></i>
        <h1 class="h3 mb-0">Admin Dashboard</h1>
      </div>

      <!-- Error Display / エラー表示 -->
      <div v-if="error" class="alert alert-danger mb-4">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
      </div>

      <!-- Statistics Cards Section / 統計カードセクション -->
      <div class="row g-4 mb-4">
        <!-- Total Users Card -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-users text-primary fs-2 mb-2"></i>
              <h5>Total Users</h5>
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              <h3 v-else class="text-primary">{{ stats.totalUsers }}</h3>
            </div>
          </div>
        </div>

        <!-- Recipes Card -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-utensils text-success fs-2 mb-2"></i>
              <h5>Recipes</h5>
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm text-success"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              <h3 v-else class="text-success">{{ stats.totalRecipes }}</h3>
            </div>
          </div>
        </div>

        <!-- Events Card -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-calendar text-info fs-2 mb-2"></i>
              <h5>Events</h5>
              <div v-if="loading" class="spinner-border spinner-border-sm text-info" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <h3 v-else class="text-info">{{ stats.totalEvents }}</h3>
            </div>
          </div>
        </div>

        <!-- Country Groups Card -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-globe text-warning fs-2 mb-2"></i>
              <h5>Country Groups</h5>
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm text-warning"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              <h3 v-else class="text-warning">{{ stats.totalGroups }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- BR (F.1): Interactive Charts Section / インタラクティブチャートセクション -->
      <!-- Displays Firestore data visually using Chart.js -->
      <div class="row g-4 mb-4">
        <!-- User Distribution Pie Chart / ユーザー分布円グラフ -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="fas fa-chart-pie me-2"></i>User Distribution by Role
              </h5>
            </div>
            <div class="card-body">
              <canvas id="userRoleChart" style="max-height: 300px"></canvas>
            </div>
          </div>
        </div>

        <!-- Platform Content Bar Chart / プラットフォームコンテンツ棒グラフ -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="fas fa-chart-bar me-2"></i>Platform Content Overview
              </h5>
            </div>
            <div class="card-body">
              <canvas id="contentChart" style="max-height: 300px"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Statistics Section -->
      <div class="row g-4 mb-4">
        <!-- User Statistics Card -->
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

        <!-- Platform Activity Card -->
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

      <!-- Admin Quick Actions Section -->
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
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

// ============================================================================
// Component State / コンポーネント状態
// ============================================================================

/**
 * BR (E.1): Cloud Functions - Statistics data object
 * Stores aggregated platform statistics from Cloud Function
 */
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
 * BR (F.1): Chart.js instances
 * Stores Chart.js chart instances for cleanup
 */
let userRoleChart = null
let contentChart = null

// ============================================================================
// Data Fetching Methods / データ取得メソッド
// ============================================================================

/**
 * BR (E.1): Fetch all statistics from Cloud Function
 * Retrieves aggregated statistics in a single efficient API call
 */
const fetchStats = async () => {
  loading.value = true
  error.value = null

  try {
    // FIXED: Updated Cloud Function URL to match deployment
    const url = 'https://getstats-ozumaphooq-uc.a.run.app'

    console.log('Fetching statistics from Cloud Function...')

    const response = await axios.get(url)

    console.log('Response from Cloud Function:', response.data)

    if (response.data.success) {
      stats.value = response.data.stats
      console.log('Statistics loaded successfully:', stats.value)

      // BR (F.1): Update charts after stats are loaded
      // Wait for DOM to update before creating/updating charts
      await nextTick()
      createCharts()
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

// ============================================================================
// BR (F.1): Chart.js Interactive Charts / インタラクティブチャート
// ============================================================================

/**
 * Create Interactive Charts using Chart.js
 * Chart.jsを使用してインタラクティブチャートを作成
 *
 * Creates two charts:
 * 1. Pie Chart: User distribution by role (Admin vs Student)
 * 2. Bar Chart: Platform content overview (Recipes, Events, Groups)
 */
const createCharts = () => {
  // Clean up existing charts / 既存のチャートをクリーンアップ
  if (userRoleChart) {
    userRoleChart.destroy()
  }
  if (contentChart) {
    contentChart.destroy()
  }

  // ===================================================================
  // Chart 1: User Role Distribution Pie Chart / ユーザーロール分布円グラフ
  // ===================================================================
  const userRoleCtx = document.getElementById('userRoleChart')
  if (userRoleCtx) {
    userRoleChart = new Chart(userRoleCtx, {
      type: 'pie',
      data: {
        labels: ['Student Members', 'Administrators'],
        datasets: [
          {
            label: 'Users',
            data: [stats.value.studentUsers, stats.value.adminUsers],
            backgroundColor: [
              'rgba(13, 110, 253, 0.8)', // Bootstrap primary blue
              'rgba(255, 193, 7, 0.8)', // Bootstrap warning yellow
            ],
            borderColor: ['rgba(13, 110, 253, 1)', 'rgba(255, 193, 7, 1)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || ''
                const value = context.parsed || 0
                const total = stats.value.totalUsers
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: ${value} (${percentage}%)`
              },
            },
          },
        },
      },
    })
  }

  // ===================================================================
  // Chart 2: Platform Content Bar Chart / プラットフォームコンテンツ棒グラフ
  // ===================================================================
  const contentCtx = document.getElementById('contentChart')
  if (contentCtx) {
    contentChart = new Chart(contentCtx, {
      type: 'bar',
      data: {
        labels: ['Recipes', 'Events', 'Country Groups'],
        datasets: [
          {
            label: 'Total Count',
            data: [stats.value.totalRecipes, stats.value.totalEvents, stats.value.totalGroups],
            backgroundColor: [
              'rgba(25, 135, 84, 0.8)', // Bootstrap success green
              'rgba(13, 202, 240, 0.8)', // Bootstrap info cyan
              'rgba(255, 193, 7, 0.8)', // Bootstrap warning yellow
            ],
            borderColor: ['rgba(25, 135, 84, 1)', 'rgba(13, 202, 240, 1)', 'rgba(255, 193, 7, 1)'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Count: ${context.parsed.y}`
              },
            },
          },
        },
      },
    })
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * Component mounted lifecycle hook
 * Fetches statistics when dashboard loads
 */
onMounted(() => {
  console.log('AdminDashboard mounted, loading statistics from Cloud Functions...')
  fetchStats()
})
</script>

<style scoped>
/* ============================================================================
   Admin Dashboard Layout Styles / 管理者ダッシュボードレイアウトスタイル
   ============================================================================ */

.admin-dashboard {
  padding-top: 3.5em;
  min-height: 100vh;
  background-color: #f8f9fa;
}

@media (min-width: 992px) {
  .admin-dashboard {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding-bottom: 4em;
  }
}

/* ============================================================================
   Card Styles / カードスタイル
   ============================================================================ */

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

/* ============================================================================
   Loading Spinner Styles / ローディングスピナースタイル
   ============================================================================ */

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

/* ============================================================================
   BR (F.1): Chart Container Styles / チャートコンテナスタイル
   ============================================================================ */

canvas {
  max-width: 100%;
  height: auto !important;
}
</style>
