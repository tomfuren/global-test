<!--
  User Dashboard - Personal activity overview and quick actions
  ユーザーダッシュボード - 個人アクティビティ概要とクイックアクション

  Features / 機能:
  - Welcome message with personalized greeting / パーソナライズされた挨拶とウェルカムメッセージ
  - Activity statistics cards (recipes, events, groups) / アクティビティ統計カード（レシピ、イベント、グループ）
  - Profile information display / プロフィール情報表示
  - Quick action buttons for common tasks / 一般的なタスク用のクイックアクションボタン
  - Recent activity timeline / 最近のアクティビティタイムライン
  - Membership duration tracking / メンバーシップ期間追跡
  - Responsive design for mobile and desktop / モバイルとデスクトップ対応のレスポンシブデザイン

  Data Sources / データソース:
  - Firebase Authentication for user identity / ユーザー識別用Firebase認証
  - Firestore for user profile and activity data / ユーザープロフィールとアクティビティデータ用Firestore
  - Real-time statistics aggregation / リアルタイム統計集約

  Components / コンポーネント:
  - Statistics Cards: Display user activity metrics / ユーザーアクティビティメトリクスを表示
  - Profile Card: Show user basic information / ユーザー基本情報を表示
  - Quick Actions: Provide shortcuts to key features / 主要機能へのショートカットを提供
  - Activity Timeline: Recent user actions / ユーザーの最近のアクション

  BR References / BR参照:
  - BR (C.1): Firebase Authentication - User session management / ユーザーセッション管理
  - BR (C.2): Firestore Database - User data and statistics / ユーザーデータと統計
-->

<template>
  <div class="user-dashboard">
    <div class="container-fluid px-4 py-4">
      <!-- ============================================================================
           Header Section / ヘッダーセクション
           Personalized welcome message for the user
           ユーザー向けのパーソナライズされたウェルカムメッセージ
           ============================================================================ -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-1">
            <i class="fas fa-home me-2 text-primary" aria-hidden="true"></i>
            Welcome back, {{ userName }}!
          </h2>
          <p class="text-muted">Here's what's happening with your account</p>
        </div>
      </div>

      <!-- ============================================================================
           Statistics Cards Section / 統計カードセクション
           Display user activity summary with counts and links
           カウントとリンク付きのユーザーアクティビティサマリーを表示
           ============================================================================ -->
      <div class="row mb-4">
        <!-- My Recipes Card / マイレシピカード -->
        <!-- Shows total recipes created by the user / ユーザーが作成した総レシピ数を表示 -->
        <div class="col-md-3 mb-3">
          <div class="card stats-card h-100">
            <div class="card-body text-center">
              <i class="fas fa-utensils text-success fs-2 mb-2" aria-hidden="true"></i>
              <h5>My Recipes</h5>
              <h3 class="text-success">{{ myRecipesCount }}</h3>
              <router-link to="/recipes" class="btn btn-sm btn-outline-success mt-2">
                View All
              </router-link>
            </div>
          </div>
        </div>

        <!-- Booked Events Card / 予約イベントカード -->
        <!-- Shows total events user has registered for / ユーザーが登録した総イベント数を表示 -->
        <div class="col-md-3 mb-3">
          <div class="card stats-card h-100">
            <div class="card-body text-center">
              <i class="fas fa-calendar-check text-info fs-2 mb-2" aria-hidden="true"></i>
              <h5>Booked Events</h5>
              <h3 class="text-info">{{ bookedEventsCount }}</h3>
              <router-link to="/events-calendar" class="btn btn-sm btn-outline-info mt-2">
                View Calendar
              </router-link>
            </div>
          </div>
        </div>

        <!-- Joined Groups Card / 参加グループカード -->
        <!-- Shows total groups user is member of / ユーザーがメンバーである総グループ数を表示 -->
        <div class="col-md-3 mb-3">
          <div class="card stats-card h-100">
            <div class="card-body text-center">
              <i class="fas fa-users text-warning fs-2 mb-2" aria-hidden="true"></i>
              <h5>My Groups</h5>
              <h3 class="text-warning">{{ joinedGroupsCount }}</h3>
              <router-link to="/groups" class="btn btn-sm btn-outline-warning mt-2">
                View Groups
              </router-link>
            </div>
          </div>
        </div>

        <!-- Membership Duration Card / メンバー期間カード -->
        <!-- Shows how long user has been a member / ユーザーがメンバーである期間を表示 -->
        <div class="col-md-3 mb-3">
          <div class="card stats-card h-100">
            <div class="card-body text-center">
              <i class="fas fa-clock text-primary fs-2 mb-2" aria-hidden="true"></i>
              <h5>Member Since</h5>
              <p class="mb-0">
                <strong>{{ memberSince }}</strong>
              </p>
              <small class="text-muted">{{ daysSinceMember }} days ago</small>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================================
           Profile and Quick Actions Section / プロフィールとクイックアクションセクション
           Two-column layout with user info and action buttons
           ユーザー情報とアクションボタンの2カラムレイアウト
           ============================================================================ -->
      <div class="row mb-4">
        <!-- Profile Information Card / プロフィール情報カード -->
        <!-- Displays user's personal information from Firestore / Firestoreからのユーザー個人情報を表示 -->
        <div class="col-lg-6 mb-3">
          <div class="card h-100">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="fas fa-user me-2" aria-hidden="true"></i>
                My Profile
              </h5>
            </div>
            <div class="card-body">
              <!-- Loading state / ローディング状態 -->
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Profile data display / プロフィールデータ表示 -->
              <div v-else-if="currentUser">
                <div class="row">
                  <!-- User name / ユーザー名 -->
                  <div class="col-md-6 mb-3">
                    <p>
                      <i class="fas fa-user me-2 text-primary" aria-hidden="true"></i>
                      <strong>Name:</strong><br />
                      {{ currentUser.firstName }} {{ currentUser.lastName }}
                    </p>
                  </div>

                  <!-- Email address / メールアドレス -->
                  <div class="col-md-6 mb-3">
                    <p>
                      <i class="fas fa-envelope me-2 text-primary" aria-hidden="true"></i>
                      <strong>Email:</strong><br />
                      {{ currentUser.email }}
                    </p>
                  </div>

                  <!-- Country / 国 -->
                  <div class="col-md-6 mb-3">
                    <p>
                      <i class="fas fa-globe me-2 text-primary" aria-hidden="true"></i>
                      <strong>Country:</strong><br />
                      {{ currentUser.country || 'Not specified' }}
                    </p>
                  </div>

                  <!-- University / 大学 -->
                  <div class="col-md-6 mb-3">
                    <p>
                      <i class="fas fa-university me-2 text-primary" aria-hidden="true"></i>
                      <strong>University:</strong><br />
                      {{ currentUser.university || 'Not specified' }}
                    </p>
                  </div>
                </div>

                <!-- Edit profile button / プロフィール編集ボタン -->
                <router-link to="/profile" class="btn btn-primary w-100">
                  <i class="fas fa-edit me-2" aria-hidden="true"></i>
                  Edit Profile
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card / クイックアクションカード -->
        <!-- Provides shortcuts to frequently used features / 頻繁に使用される機能へのショートカットを提供 -->
        <div class="col-lg-6 mb-3">
          <div class="card h-100">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="fas fa-bolt me-2" aria-hidden="true"></i>
                Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <!-- Create new recipe / 新規レシピ作成 -->
                <router-link to="/recipes/create" class="btn btn-outline-success">
                  <i class="fas fa-plus me-2" aria-hidden="true"></i>
                  Create New Recipe
                </router-link>

                <!-- Browse events / イベント閲覧 -->
                <router-link to="/events-calendar" class="btn btn-outline-info">
                  <i class="fas fa-calendar-plus me-2" aria-hidden="true"></i>
                  Browse Events
                </router-link>

                <!-- Join a group / グループ参加 -->
                <router-link to="/groups" class="btn btn-outline-warning">
                  <i class="fas fa-users me-2" aria-hidden="true"></i>
                  Join a Group
                </router-link>

                <!-- Find restaurants / レストラン検索 -->
                <router-link to="/geo-location" class="btn btn-outline-primary">
                  <i class="fas fa-map-marker-alt me-2" aria-hidden="true"></i>
                  Find Restaurants
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================================
           Recent Activity Section / 最近のアクティビティセクション
           Timeline of user's recent actions and interactions
           ユーザーの最近のアクションとインタラクションのタイムライン
           ============================================================================ -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="fas fa-history me-2" aria-hidden="true"></i>
                Recent Activity
              </h5>
            </div>
            <div class="card-body">
              <!-- Empty state / 空状態 -->
              <div v-if="recentActivities.length === 0" class="text-center py-4">
                <i class="fas fa-inbox fs-1 text-muted mb-3" aria-hidden="true"></i>
                <p class="text-muted">No recent activity</p>
                <p class="text-muted">Start by creating a recipe or joining an event!</p>
              </div>

              <!-- Activity list / アクティビティリスト -->
              <ul v-else class="list-group list-group-flush">
                <li v-for="activity in recentActivities" :key="activity.id" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <!-- Activity icon / アクティビティアイコン -->
                      <i
                        :class="`fas ${activity.icon} me-2 text-${activity.color}`"
                        aria-hidden="true"
                      ></i>
                      <!-- Activity title and description / アクティビティタイトルと説明 -->
                      <strong>{{ activity.title }}</strong>
                      <br />
                      <small class="text-muted">{{ activity.description }}</small>
                    </div>
                    <!-- Relative timestamp / 相対タイムスタンプ -->
                    <small class="text-muted">{{ formatTimeAgo(activity.timestamp) }}</small>
                  </div>
                </li>
              </ul>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'

// ============================================================================
// Component State / 状態管理
// ============================================================================

// BR (C.1): Firebase Authentication instance / Firebase認証インスタンス
const auth = getAuth()

// User data state / ユーザーデータ状態
const currentUser = ref(null)
const loading = ref(true)

// BR (C.2): User activity statistics / ユーザーアクティビティ統計
const myRecipesCount = ref(0)
const bookedEventsCount = ref(0)
const joinedGroupsCount = ref(0)
const recentActivities = ref([])

// ============================================================================
// Computed Properties / 算出プロパティ
// ============================================================================

/**
 * Get user's display name
 * ユーザーの表示名を取得
 *
 * Priority order / 優先順位:
 * 1. firstName from Firestore / FirestoreのfirstName
 * 2. displayName from Firebase Auth / Firebase認証のdisplayName
 * 3. Email username / メールのユーザー名部分
 * 4. Default "User" / デフォルト「User」
 *
 * @returns {string} Display name / 表示名
 */
const userName = computed(() => {
  if (!currentUser.value) return 'User'
  if (currentUser.value.firstName) {
    return currentUser.value.firstName
  }
  if (currentUser.value.displayName) {
    return currentUser.value.displayName
  }
  return currentUser.value.email?.split('@')[0] || 'User'
})

/**
 * Format membership registration date
 * メンバー登録日をフォーマット
 *
 * @returns {string} Formatted date / フォーマットされた日付
 */
const memberSince = computed(() => {
  if (!currentUser.value?.createdAt) return 'Unknown'
  return formatDate(currentUser.value.createdAt)
})

/**
 * Calculate days since user registration
 * ユーザー登録からの日数を計算
 *
 * @returns {number} Number of days / 日数
 */
const daysSinceMember = computed(() => {
  if (!currentUser.value?.createdAt) return 0
  const createdDate = new Date(currentUser.value.createdAt)
  const today = new Date()
  const diffTime = Math.abs(today - createdDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// ============================================================================
// Data Loading Methods / データ読み込みメソッド
// ============================================================================

/**
 * BR (C.2): Load user data from Firestore
 * BR (C.2): Firestoreからユーザーデータを読み込み
 *
 * Fetches complete user profile information
 * 完全なユーザープロフィール情報を取得
 *
 * @param {string} uid - User ID / ユーザーID
 */
const loadUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      currentUser.value = { uid, ...userDoc.data() }
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

/**
 * BR (C.2): Load user's recipe count
 * BR (C.2): ユーザーのレシピ数を読み込み
 *
 * Queries Firestore for recipes authored by the user
 * ユーザーが作成したレシピをFirestoreでクエリ
 *
 * @param {string} uid - User ID / ユーザーID
 */
const loadMyRecipesCount = async (uid) => {
  try {
    const recipesRef = collection(db, 'recipes')
    const q = query(recipesRef, where('author.uid', '==', uid))
    const snapshot = await getDocs(q)
    myRecipesCount.value = snapshot.size
  } catch (error) {
    console.error('Error loading recipes count:', error)
  }
}

/**
 * Load user's booked events count
 * ユーザーの予約イベント数を読み込み
 *
 * Placeholder for future implementation
 * 将来の実装用プレースホルダー
 *
 * TODO: Implement booking storage in Firestore
 * TODO: Firestoreに予約情報を保存する実装が必要
 */
const loadBookedEventsCount = async () => {
  // Future implementation: Query event bookings
  // 将来の実装: イベント予約をクエリ
  bookedEventsCount.value = 0
}

/**
 * BR (C.2): Load user's joined groups count
 * BR (C.2): ユーザーの参加グループ数を読み込み
 *
 * Checks all groups to see if user is a member
 * すべてのグループをチェックしてユーザーがメンバーかどうか確認
 *
 * @param {string} uid - User ID / ユーザーID
 */
const loadJoinedGroupsCount = async (uid) => {
  try {
    const groupsRef = collection(db, 'groups')
    // Check if user is included in group members array
    // グループメンバーの配列にユーザーが含まれているかチェック
    const snapshot = await getDocs(groupsRef)
    let count = 0
    snapshot.forEach((doc) => {
      const members = doc.data().members || []
      if (members.includes(uid)) {
        count++
      }
    })
    joinedGroupsCount.value = count
  } catch (error) {
    console.error('Error loading groups count:', error)
  }
}

/**
 * Load recent user activities
 * 最近のユーザーアクティビティを読み込み
 *
 * Currently displays sample data
 * 現在はサンプルデータを表示
 *
 * TODO: Fetch actual activity logs from Firestore
 * TODO: Firestoreから実際のアクティビティログを取得
 */
const loadRecentActivities = () => {
  // Sample activity data / サンプルアクティビティデータ
  recentActivities.value = [
    {
      id: 1,
      title: 'Joined Global Plate',
      description: 'Welcome to the community!',
      icon: 'fa-user-plus',
      color: 'success',
      timestamp: currentUser.value?.createdAt || new Date(),
    },
  ]
}

// ============================================================================
// Utility Functions / ユーティリティ関数
// ============================================================================

/**
 * Format date to readable string
 * 日付を読みやすい文字列にフォーマット
 *
 * @param {string|Date|Timestamp} dateString - Date to format / フォーマットする日付
 * @returns {string} Formatted date string / フォーマットされた日付文字列
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString.toDate()
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format relative time (time ago)
 * 相対時間をフォーマット（〜前）
 *
 * Converts timestamp to human-readable relative time
 * タイムスタンプを人間が読みやすい相対時間に変換
 *
 * @param {Date|Timestamp} timestamp - Timestamp to format / フォーマットするタイムスタンプ
 * @returns {string} Relative time string (e.g., "2 days ago") / 相対時間文字列（例: "2日前"）
 */
const formatTimeAgo = (timestamp) => {
  const date =
    typeof timestamp === 'string' ? new Date(timestamp) : timestamp.toDate?.() || timestamp
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * Component mounted lifecycle hook
 * コンポーネントマウント時のライフサイクルフック
 *
 * BR (C.1): Monitor Firebase authentication state
 * BR (C.1): Firebase認証状態を監視
 *
 * Loads all user data when authenticated
 * 認証済みの場合、すべてのユーザーデータを読み込み
 */
onMounted(() => {
  // Monitor authentication state changes / 認証状態の変更を監視
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Load all user-related data / すべてのユーザー関連データを読み込み
      await loadUserData(user.uid)
      await loadMyRecipesCount(user.uid)
      await loadBookedEventsCount()
      await loadJoinedGroupsCount(user.uid)
      loadRecentActivities()
    }
    loading.value = false
  })
})
</script>

<style scoped>
/* ============================================================================
   Dashboard Layout Styles / ダッシュボードレイアウトスタイル
   ============================================================================ */

/* Main dashboard container / メインダッシュボードコンテナ */
.user-dashboard {
  padding-top: 3.5em; /* Account for fixed navbar / 固定ナビゲーションバー用のスペース */
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Desktop layout adjustment for sidebar / サイドバー用のデスクトップレイアウト調整 */
@media (min-width: 992px) {
  .user-dashboard {
    margin-left: 4.5em; /* Account for sidebar width / サイドバー幅用のマージン */
    transition: margin-left 0.2s ease;
  }
}

/* Mobile layout adjustment for bottom navigation / ボトムナビゲーション用のモバイルレイアウト調整 */
@media (max-width: 768px) {
  .user-dashboard {
    padding-bottom: 4em; /* Account for bottom navigation / ボトムナビゲーション用のパディング */
  }
}

/* ============================================================================
   Statistics Card Styles / 統計カードスタイル
   ============================================================================ */

/* Statistics card hover effect / 統計カードホバーエフェクト */
.stats-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: none;
}

/* Card lift animation on hover / ホバー時のカードリフトアニメーション */
.stats-card:hover {
  transform: translateY(-5px); /* Lift card up / カードを持ち上げる */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Add shadow depth / シャドウの深さを追加 */
}

/* ============================================================================
   Activity List Styles / アクティビティリストスタイル
   ============================================================================ */

/* List item hover effect with border accent / ボーダーアクセント付きリスト項目ホバーエフェクト */
.list-group-item {
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

/* Highlight list item on hover / ホバー時にリスト項目をハイライト */
.list-group-item:hover {
  background-color: #f8f9fa; /* Light background / 薄い背景色 */
  border-left-color: #007bff; /* Blue accent border / 青いアクセントボーダー */
}
</style>
