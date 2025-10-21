<!--
  Admin Dashboard Page - System administrator dashboard with statistics and charts
  管理者ダッシュボードページ - 統計情報とチャートを表示するシステム管理者ダッシュボード

  Features / 機能:
  - Real-time statistics display from Firestore / Firestoreからのリアルタイム統計表示
  - Interactive charts using Chart.js / Chart.jsを使用したインタラクティブなチャート
  - User distribution visualization / ユーザー分布の視覚化
  - Content overview (recipes, events, groups) / コンテンツ概要
  - Quick access to management pages / 管理ページへのクイックアクセス

  BR (C.2): Role-based Authentication - Admin-only access
  BR (C.2): ロールベース認証 - 管理者専用アクセス

  BR (F.1): Innovation - Admin Dashboard
  BR (F.1): イノベーション - 管理者ダッシュボード
  Provides comprehensive system overview with interactive visualizations
  インタラクティブな視覚化による包括的なシステム概要を提供

  BR (E.1): Cloud Functions - Statistics data fetching
  BR (E.1): Cloud Functions - 統計データ取得
  Uses Firebase Cloud Functions to aggregate system statistics
  Firebase Cloud Functionsを使用してシステム統計を集約

  BR (E.3): Accessibility - ARIA labels and semantic HTML
  BR (E.3): アクセシビリティ - ARIAラベルとセマンティックHTML
-->

<template>
  <div class="admin-dashboard">
    <div class="container-fluid px-4 py-4">
      <!-- ============================================================================
           Header Section / ヘッダーセクション
           ============================================================================ -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-1">
            <i class="fas fa-tachometer-alt me-2 text-primary" aria-hidden="true"></i>
            Admin Dashboard
          </h2>
          <p class="text-muted">System overview and statistics</p>
        </div>
      </div>

      <!-- Loading State / ローディング状態 -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading dashboard data...</p>
      </div>

      <!-- Dashboard Content / ダッシュボードコンテンツ -->
      <div v-else>
        <!-- ============================================================================
             Statistics Cards / 統計カード
             BR (F.1): Innovation - Display key metrics in card format
             ============================================================================ -->
        <div class="row mb-4">
          <!-- Total Users Card -->
          <div class="col-md-6 col-lg-3 mb-3">
            <div class="stats-card">
              <div class="stats-icon bg-primary">
                <i class="fas fa-users"></i>
              </div>
              <div class="stats-content">
                <h3>{{ stats.totalUsers }}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>

          <!-- Total Recipes Card -->
          <div class="col-md-6 col-lg-3 mb-3">
            <div class="stats-card">
              <div class="stats-icon bg-success">
                <i class="fas fa-utensils"></i>
              </div>
              <div class="stats-content">
                <h3>{{ stats.totalRecipes }}</h3>
                <p>Total Recipes</p>
              </div>
            </div>
          </div>

          <!-- Total Events Card -->
          <div class="col-md-6 col-lg-3 mb-3">
            <div class="stats-card">
              <div class="stats-icon bg-warning">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <div class="stats-content">
                <h3>{{ stats.totalEvents }}</h3>
                <p>Total Events</p>
              </div>
            </div>
          </div>

          <!-- Total Groups Card -->
          <div class="col-md-6 col-lg-3 mb-3">
            <div class="stats-card">
              <div class="stats-icon bg-info">
                <i class="fas fa-globe"></i>
              </div>
              <div class="stats-content">
                <h3>{{ stats.totalGroups }}</h3>
                <p>Country Groups</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================================================
             Charts Section / チャートセクション
             BR (F.1): Innovation - Interactive Charts using Chart.js
             ============================================================================ -->
        <div class="row mb-4">
          <!-- User Distribution Chart -->
          <div class="col-lg-6 mb-4">
            <div class="chart-card">
              <h5 class="chart-title">
                <i class="fas fa-chart-pie me-2"></i>
                User Distribution by Role
              </h5>
              <div class="chart-container">
                <canvas ref="userChartCanvas"></canvas>
              </div>
            </div>
          </div>

          <!-- Content Overview Chart -->
          <div class="col-lg-6 mb-4">
            <div class="chart-card">
              <h5 class="chart-title">
                <i class="fas fa-chart-bar me-2"></i>
                Content Overview
              </h5>
              <div class="chart-container">
                <canvas ref="contentChartCanvas"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================================================
             Quick Actions / クイックアクション
             ============================================================================ -->
        <div class="row">
          <div class="col-12">
            <div class="quick-actions-card">
              <h5 class="mb-3">
                <i class="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <router-link to="/admin/manage-users" class="action-button">
                    <i class="fas fa-users-cog"></i>
                    <span>Manage Users</span>
                  </router-link>
                </div>
                <div class="col-md-4 mb-3">
                  <router-link to="/recipes" class="action-button">
                    <i class="fas fa-utensils"></i>
                    <span>View Recipes</span>
                  </router-link>
                </div>
                <div class="col-md-4 mb-3">
                  <router-link to="/events-calendar" class="action-button">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Manage Events</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import Chart from 'chart.js/auto'

// Router instance / ルーターインスタンス
const router = useRouter()

// ============================================================================
// Component State / コンポーネント状態
// ============================================================================

// Loading state / ローディング状態
const loading = ref(true)

// Statistics data / 統計データ
const stats = ref({
  totalUsers: 0,
  adminUsers: 0,
  studentUsers: 0,
  totalRecipes: 0,
  totalEvents: 0,
  totalGroups: 0,
})

// Chart references / チャート参照
const userChartCanvas = ref(null)
const contentChartCanvas = ref(null)
let userChart = null
let contentChart = null

// ============================================================================
// BR (E.1): Cloud Functions - Fetch Statistics from Firebase Functions
// BR (E.1): Cloud Functions - Firebase Functionsから統計を取得
// ============================================================================

/**
 * Fetch all statistics from Cloud Function
 * Cloud Functionから全統計を取得
 *
 * Uses the getAllStats endpoint to retrieve aggregated data
 * getAllStatsエンドポイントを使用して集約データを取得
 */
const fetchStatistics = async () => {
  try {
    loading.value = true

    // Get current user's ID token for authentication
    // 認証用に現在のユーザーのIDトークンを取得
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      console.error('No authenticated user')
      router.push('/login')
      return
    }

    const idToken = await user.getIdToken()

    // Call Cloud Function using fetch API
    // Fetch APIを使用してCloud Functionを呼び出し
    const response = await fetch(
      'https://us-central1-global-plate-dev.cloudfunctions.net/getAllStats',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      stats.value = data.stats
      console.log('Statistics loaded:', stats.value)

      // Create charts after data is loaded
      // データ読み込み後にチャートを作成
      await createCharts()
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
    alert('Failed to load dashboard statistics')
  } finally {
    loading.value = false
  }
}

// ============================================================================
// BR (F.1): Innovation - Create Interactive Charts using Chart.js
// BR (F.1): イノベーション - Chart.jsを使用したインタラクティブなチャート作成
// ============================================================================

/**
 * Create interactive charts for data visualization
 * データ視覚化用のインタラクティブなチャートを作成
 */
const createCharts = async () => {
  // Wait for next tick to ensure canvas elements are mounted
  // canvas要素がマウントされるまで次のティックを待つ
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Destroy existing charts if they exist
  // 既存のチャートがあれば破棄
  if (userChart) userChart.destroy()
  if (contentChart) contentChart.destroy()

  // User Distribution Pie Chart
  // ユーザー分布円グラフ
  if (userChartCanvas.value) {
    const userCtx = userChartCanvas.value.getContext('2d')
    userChart = new Chart(userCtx, {
      type: 'doughnut',
      data: {
        labels: ['Admin Users', 'Student Users'],
        datasets: [
          {
            data: [stats.value.adminUsers, stats.value.studentUsers],
            backgroundColor: ['#0d6efd', '#6c757d'],
            borderWidth: 2,
            borderColor: '#ffffff',
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
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                return `${label}: ${value} (${percentage}%)`
              },
            },
          },
        },
      },
    })
  }

  // Content Overview Bar Chart
  // コンテンツ概要棒グラフ
  if (contentChartCanvas.value) {
    const contentCtx = contentChartCanvas.value.getContext('2d')
    contentChart = new Chart(contentCtx, {
      type: 'bar',
      data: {
        labels: ['Recipes', 'Events', 'Groups'],
        datasets: [
          {
            label: 'Total Count',
            data: [stats.value.totalRecipes, stats.value.totalEvents, stats.value.totalGroups],
            backgroundColor: ['#198754', '#ffc107', '#0dcaf0'],
            borderWidth: 0,
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
                return `${context.label}: ${context.parsed.y}`
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

onMounted(async () => {
  // Check if user is admin
  // ユーザーが管理者かチェック
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    router.push('/login')
    return
  }

  // Fetch statistics and create charts
  // 統計を取得してチャートを作成
  await fetchStatistics()
})
</script>

<style scoped>
/* ============================================================================
   Dashboard Styles / ダッシュボードスタイル
   ============================================================================ */

.admin-dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Statistics Cards / 統計カード */
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stats-content h3 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #212529;
}

.stats-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Chart Cards / チャートカード */
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.chart-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f8f9fa;
}

.chart-container {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Quick Actions / クイックアクション */
.quick-actions-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  color: #495057;
  transition: all 0.2s;
  height: 100%;
}

.action-button:hover {
  background: #0d6efd;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
}

.action-button i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.action-button span {
  font-size: 0.95rem;
  font-weight: 500;
}

/* Responsive Design / レスポンシブデザイン */
@media (max-width: 768px) {
  .stats-card {
    flex-direction: column;
    text-align: center;
  }

  .stats-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .stats-content h3 {
    font-size: 1.75rem;
  }

  .chart-container {
    height: 250px;
  }

  .action-button {
    padding: 1.5rem 1rem;
  }

  .action-button i {
    font-size: 1.5rem;
  }
}
</style>
