<!--
  Admin Dashboard - Administrative control panel with platform statistics
  管理者ダッシュボード - プラットフォーム統計を含む管理制御パネル

  Features / 機能:
  - Real-time platform statistics display / リアルタイムプラットフォーム統計表示
  - User analytics (total, students, admins) / ユーザー分析（合計、学生、管理者）
  - Content metrics (recipes, events, groups) / コンテンツメトリクス（レシピ、イベント、グループ）
  - Quick action buttons for admin tasks / 管理タスク用のクイックアクションボタン
  - Manual statistics refresh / 手動統計更新
  - Responsive design for mobile and desktop / モバイルとデスクトップ対応のレスポンシブデザイン
  - Error handling and loading states / エラーハンドリングとローディング状態

  Data Sources / データソース:
  - Cloud Functions API for aggregated statistics / 集約統計用Cloud Functions API
  - Single endpoint for efficient data retrieval / 効率的なデータ取得のための単一エンドポイント

  Access Control / アクセス制御:
  - Admin role required (enforced by router guard) / 管理者ロールが必要（ルーターガードで強制）
  - Protected route accessible only to admin users / 管理者ユーザーのみアクセス可能な保護ルート

  BR References / BR参照:
  - BR (C.2): Role-based authentication - Admin-only access / 管理者専用アクセス
  - BR (E.1): Cloud Functions - Statistics data retrieval / 統計データ取得
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
      <!-- Shows error messages if API call fails / APIコールが失敗した場合にエラーメッセージを表示 -->
      <div v-if="error" class="alert alert-danger mb-4">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
      </div>

      <!-- Statistics Cards Section / 統計カードセクション -->
      <!-- Displays key platform metrics in card format / 主要なプラットフォームメトリクスをカード形式で表示 -->
      <div class="row g-4 mb-4">
        <!-- Total Users Card / 総ユーザー数カード -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-users text-primary fs-2 mb-2"></i>
              <h5>Total Users</h5>

              <!-- Loading spinner / ローディングスピナー -->
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>

              <!-- Display user count / ユーザー数を表示 -->
              <h3 v-else class="text-primary">{{ stats.totalUsers }}</h3>
            </div>
          </div>
        </div>

        <!-- Recipes Card / レシピ数カード -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-utensils text-success fs-2 mb-2"></i>
              <h5>Recipes</h5>

              <!-- Loading spinner / ローディングスピナー -->
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm text-success"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>

              <!-- Display recipe count / レシピ数を表示 -->
              <h3 v-else class="text-success">{{ stats.totalRecipes }}</h3>
            </div>
          </div>
        </div>

        <!-- Events Card / イベント数カード -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-calendar text-info fs-2 mb-2"></i>
              <h5>Events</h5>

              <!-- Loading spinner / ローディングスピナー -->
              <div v-if="loading" class="spinner-border spinner-border-sm text-info" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>

              <!-- Display event count / イベント数を表示 -->
              <h3 v-else class="text-info">{{ stats.totalEvents }}</h3>
            </div>
          </div>
        </div>

        <!-- Country Groups Card / 国別グループ数カード -->
        <div class="col-md-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <i class="fas fa-globe text-warning fs-2 mb-2"></i>
              <h5>Country Groups</h5>

              <!-- Loading spinner / ローディングスピナー -->
              <div
                v-if="loading"
                class="spinner-border spinner-border-sm text-warning"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>

              <!-- Display group count / グループ数を表示 -->
              <h3 v-else class="text-warning">{{ stats.totalGroups }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Statistics Section / 詳細統計セクション -->
      <!-- Provides breakdown of user types and platform activity / ユーザータイプとプラットフォームアクティビティの内訳を提供 -->
      <div class="row g-4 mb-4">
        <!-- User Statistics Card / ユーザー統計カード -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0"><i class="fas fa-users me-2"></i>User Statistics</h5>
            </div>
            <div class="card-body">
              <!-- Student members count / 学生メンバー数 -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span> <i class="fas fa-user text-primary me-2"></i>Student Members: </span>
                <strong class="text-primary">{{ stats.studentUsers }}</strong>
              </div>
              <!-- Administrator count / 管理者数 -->
              <div class="d-flex justify-content-between align-items-center">
                <span> <i class="fas fa-crown text-warning me-2"></i>Administrators: </span>
                <strong class="text-warning">{{ stats.adminUsers }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Platform Activity Card / プラットフォームアクティビティカード -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="fas fa-chart-line me-2"></i>Platform Activity
              </h5>
            </div>
            <div class="card-body">
              <!-- Total recipes / 総レシピ数 -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span> <i class="fas fa-utensils text-success me-2"></i>Total Recipes: </span>
                <strong class="text-success">{{ stats.totalRecipes }}</strong>
              </div>
              <!-- Active events / アクティブイベント数 -->
              <div class="d-flex justify-content-between align-items-center">
                <span> <i class="fas fa-calendar text-info me-2"></i>Active Events: </span>
                <strong class="text-info">{{ stats.totalEvents }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Quick Actions Section / 管理クイックアクションセクション -->
      <!-- Provides quick access to common admin tasks / 一般的な管理タスクへのクイックアクセスを提供 -->
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0"><i class="fas fa-tools me-2"></i>Quick Actions</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <!-- Navigate to user management / ユーザー管理に移動 -->
            <div class="col-md-6">
              <router-link to="/admin/users" class="btn btn-outline-primary w-100">
                <i class="fas fa-users-cog me-2"></i>Manage Users
              </router-link>
            </div>

            <!-- Content moderation (placeholder) / コンテンツモデレーション（プレースホルダー） -->
            <div class="col-md-6">
              <button class="btn btn-outline-success w-100">
                <i class="fas fa-shield-alt me-2"></i>Content Moderation
              </button>
            </div>

            <!-- View reports (placeholder) / レポート表示（プレースホルダー） -->
            <div class="col-md-6">
              <button class="btn btn-outline-info w-100">
                <i class="fas fa-chart-bar me-2"></i>View Reports
              </button>
            </div>

            <!-- Refresh statistics button / 統計更新ボタン -->
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

// ============================================================================
// Component State / コンポーネント状態
// ============================================================================

/**
 * BR (E.1): Cloud Functions - Statistics data object
 * BR (E.1): Cloud Functions - 統計データオブジェクト
 *
 * Stores aggregated platform statistics from Cloud Function
 * Cloud Functionからの集約されたプラットフォーム統計を保存
 *
 * Properties / プロパティ:
 * - totalUsers: Total number of registered users / 登録ユーザーの総数
 * - studentUsers: Number of users with student role / 学生ロールのユーザー数
 * - adminUsers: Number of users with admin role / 管理者ロールのユーザー数
 * - totalRecipes: Total number of recipes / レシピの総数
 * - totalEvents: Total number of events / イベントの総数
 * - totalGroups: Total number of country groups / 国別グループの総数
 */
const stats = ref({
  totalUsers: 0,
  studentUsers: 0,
  adminUsers: 0,
  totalRecipes: 0,
  totalEvents: 0,
  totalGroups: 0,
})

// UI state / UI状態
const loading = ref(true)
const error = ref(null)

// ============================================================================
// Data Fetching Methods / データ取得メソッド
// ============================================================================

/**
 * BR (E.1): Fetch all statistics from Cloud Function
 * BR (E.1): Cloud Functionから全統計を取得
 *
 * Retrieves aggregated statistics in a single efficient API call
 * 単一の効率的なAPIコールで集約された統計を取得
 *
 * Cloud Function Endpoint: getStats
 * Cloud Functionエンドポイント: getStats
 *
 * Process flow / 処理フロー:
 * 1. Set loading state / ローディング状態を設定
 * 2. Call Cloud Function via HTTP GET / HTTP GETでCloud Functionを呼び出し
 * 3. Parse response and update stats / レスポンスを解析し統計を更新
 * 4. Handle errors gracefully / エラーを適切に処理
 *
 * Benefits of using Cloud Function / Cloud Function使用の利点:
 * - Single API call for all data / すべてのデータに対する単一のAPIコール
 * - Server-side aggregation / サーバー側での集約
 * - Reduced client-side processing / クライアント側処理の削減
 * - Consistent data snapshot / 一貫したデータスナップショット
 */
const fetchStats = async () => {
  // Set loading state and clear previous errors / ローディング状態を設定し、前のエラーをクリア
  loading.value = true
  error.value = null

  try {
    // Cloud Function URL / Cloud Function URL
    // Production endpoint for statistics aggregation / 統計集約用の本番エンドポイント
    const url = 'https://us-central1-global-plate-dev.cloudfunctions.net/getStats'

    console.log('Fetching statistics from Cloud Function...')

    // Make HTTP GET request to Cloud Function / Cloud FunctionへのHTTP GETリクエスト
    const response = await axios.get(url)

    console.log('Response from Cloud Function:', response.data)

    // Parse response and update statistics / レスポンスを解析し統計を更新
    if (response.data.success) {
      // Update all statistics at once / すべての統計を一度に更新
      stats.value = response.data.stats
      console.log('Statistics loaded successfully:', stats.value)
    } else {
      // Handle unsuccessful response / 失敗したレスポンスを処理
      error.value = 'Failed to load statistics'
    }
  } catch (err) {
    // Error handling for network or server issues / ネットワークまたはサーバーの問題のエラーハンドリング
    console.error('Error calling Cloud Function:', err)
    error.value = 'Failed to connect to server. Please try again later.'
  } finally {
    // Always clear loading state / 常にローディング状態をクリア
    loading.value = false
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * Component mounted lifecycle hook
 * コンポーネントマウント時のライフサイクルフック
 *
 * Fetches statistics when dashboard loads
 * ダッシュボード読み込み時に統計を取得
 *
 * Automatically refreshes data on component mount
 * コンポーネントマウント時に自動的にデータを更新
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

/* Main dashboard container / メインダッシュボードコンテナ */
.admin-dashboard {
  padding-top: 3.5em; /* Account for fixed navbar / 固定ナビゲーションバー用のスペース */
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Desktop layout adjustment for sidebar / サイドバー用のデスクトップレイアウト調整 */
@media (min-width: 992px) {
  .admin-dashboard {
    margin-left: 4.5em; /* Account for sidebar width / サイドバー幅用のマージン */
    transition: margin-left 0.2s ease;
  }
}

/* Mobile layout adjustment for bottom navigation / ボトムナビゲーション用のモバイルレイアウト調整 */
@media (max-width: 768px) {
  .admin-dashboard {
    padding-bottom: 4em; /* Account for bottom navigation / ボトムナビゲーション用のパディング */
  }
}

/* ============================================================================
   Card Styles / カードスタイル
   ============================================================================ */

/* Statistics card styling with hover effect / ホバーエフェクト付き統計カードスタイル */
.card {
  border-radius: 10px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

/* Card hover animation / カードホバーアニメーション */
.card:hover {
  transform: translateY(-5px); /* Lift card on hover / ホバー時にカードを持ち上げる */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Add shadow effect / シャドウエフェクトを追加 */
}

/* ============================================================================
   Loading Spinner Styles / ローディングスピナースタイル
   ============================================================================ */

/* Small spinner for card statistics / カード統計用の小さいスピナー */
.spinner-border-sm {
  width: 2rem;
  height: 2rem;
}

/* Spinning animation for refresh button / 更新ボタン用のスピニングアニメーション */
.fa-spin {
  animation: fa-spin 1s infinite linear;
}

/* Rotation keyframes animation / 回転キーフレームアニメーション */
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
