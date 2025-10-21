<!--
  Navigation Component - Application-wide navigation system with responsive design
  ナビゲーションコンポーネント - レスポンシブデザインのアプリケーション全体ナビゲーションシステム

  Features / 機能:
  - Top navigation bar with logo, search, and user menu / ロゴ、検索、ユーザーメニュー付きトップナビゲーションバー
  - Collapsible sidebar navigation (desktop) / 折りたたみ可能なサイドバーナビゲーション（デスクトップ）
  - Bottom navigation bar (mobile) / ボトムナビゲーションバー（モバイル）
  - Role-based menu items / ロールベースのメニュー項目
  - Mobile search mode / モバイル検索モード
  - User authentication status handling / ユーザー認証状態の処理

  Responsive Behavior / レスポンシブ動作:
  - Desktop (lg+): Top bar + Sidebar / デスクトップ: トップバー + サイドバー
  - Mobile (<lg): Top bar + Bottom navigation / モバイル: トップバー + ボトムナビゲーション
  - Tablet (md-lg): Hybrid layout / タブレット: ハイブリッドレイアウト

  BR References / BR参照:
  - BR (C.2): Role-based authentication - Admin menu visibility control / 管理者メニュー表示制御
  - BR (D.2): Email - Link to email sending feature / メール送信機能へのリンク
  - BR (E.2): Geo Location - Restaurant finder navigation / レストラン検索ナビゲーション
  - BR (E.3): Accessibility - ARIA attributes and keyboard navigation / ARIA属性とキーボードナビゲーション
-->

<template>
  <!-- Top Navigation Bar / トップナビゲーションバー -->
  <nav class="top-navbar bg-white" :class="{ 'navbar-hidden': !isNavbarVisible }">
    <div class="container-fluid">
      <!-- Normal Mode Layout / 通常モードレイアウト -->
      <template v-if="!isSearchMode">
        <!-- Left Section: Menu button and logo / 左側セクション: メニューボタンとロゴ -->
        <div class="navbar-left">
          <!-- Sidebar toggle button (desktop only) / サイドバー切り替えボタン（デスクトップのみ） -->
          <button class="btn btn-ghost me-3 d-none d-lg-block" @click="toggleSidebar">
            <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
            <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
            <i class="fas fa-bars" aria-hidden="true"></i>
          </button>

          <!-- Brand logo and name / ブランドロゴと名前 -->
          <router-link class="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
            <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
            <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
            <i class="fas fa-globe me-2" aria-hidden="true"></i>
            <span class="brand-text">Global Plate</span>
          </router-link>
        </div>

        <!-- Center Section: Search bar (desktop only) / 中央セクション: 検索バー（デスクトップのみ） -->
        <div class="navbar-center">
          <div class="search-container d-none d-md-flex">
            <div class="input-group">
              <!-- Search input field / 検索入力フィールド -->
              <input
                type="search"
                class="form-control search-input"
                placeholder="Search recipes, events..."
                v-model="searchQuery"
              />
              <!-- Search button / 検索ボタン -->
              <button class="btn btn-outline-secondary search-btn" type="button">
                <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                <i class="fas fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Section: User menu and actions / 右側セクション: ユーザーメニューとアクション -->
        <div class="navbar-right">
          <!-- Mobile search toggle button / モバイル検索切り替えボタン -->
          <button class="btn btn-ghost me-2 d-md-none" @click="enterSearchMode">
            <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
            <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
            <i class="fas fa-search" aria-hidden="true"></i>
          </button>

          <!-- Unauthenticated User Actions / 未認証ユーザーアクション -->
          <template v-if="!isAuthenticated">
            <!-- Login button / ログインボタン -->
            <router-link class="btn btn-outline-primary btn-sm" to="/login"> Log in </router-link>
            <!-- Sign up button (hidden on small screens) / サインアップボタン（小画面では非表示） -->
            <router-link
              class="btn btn-primary btn-sm ms-2 d-none d-sm-inline-block"
              to="/register"
            >
              Sign up
            </router-link>
          </template>

          <!-- Authenticated User Menu / 認証済みユーザーメニュー -->
          <template v-else>
            <!-- Notification dropdown (commented out for future implementation) / 通知ドロップダウン（将来の実装用にコメントアウト） -->
            <!-- <div class="dropdown me-2">
              <button class="btn btn-ghost position-relative" data-bs-toggle="dropdown">
                <i class="fas fa-bell" aria-hidden="true"></i>
                <span v-if="hasNotifications" class="notification-badge"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><h6 class="dropdown-header">Notifications</h6></li>
                <li><a class="dropdown-item" href="#">New recipe posted</a></li>
                <li><a class="dropdown-item" href="#">Event reminder</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item text-center" href="#">See all</a></li>
              </ul>
            </div> -->

            <!-- User profile dropdown menu / ユーザープロフィールドロップダウンメニュー -->
            <div class="dropdown">
              <!-- User avatar button / ユーザーアバターボタン -->
              <button class="btn btn-ghost d-flex align-items-center" data-bs-toggle="dropdown">
                <img
                  :src="userAvatar"
                  alt="profile"
                  class="rounded-circle"
                  width="32"
                  height="32"
                />
              </button>
              <!-- Dropdown menu items / ドロップダウンメニュー項目 -->
              <ul class="dropdown-menu dropdown-menu-end">
                <!-- User information header / ユーザー情報ヘッダー -->
                <li>
                  <div class="dropdown-header">
                    <div class="fw-bold">{{ userName }}</div>
                    <small class="text-muted">{{ currentUser?.email }}</small>
                    <!-- User role badge / ユーザーロールバッジ -->
                    <div v-if="userRole" class="mt-1">
                      <span :class="roleClass" class="badge">
                        {{ roleDisplay }}
                      </span>
                    </div>
                  </div>
                </li>
                <li><hr class="dropdown-divider" /></li>

                <!-- Profile link / プロフィールリンク -->
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                    <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                    <i class="fas fa-user me-2" aria-hidden="true"></i>Your Profile
                  </router-link>
                </li>

                <!-- Dashboard link / ダッシュボードリンク -->
                <li>
                  <router-link class="dropdown-item" to="/dashboard">
                    <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                    <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                    <i class="fas fa-tachometer-alt me-2" aria-hidden="true"></i>Dashboard
                  </router-link>
                </li>

                <!--
                  BR (C.2): Role-based authentication - Admin-only menu section
                  BR (C.2): ロールベース認証 - 管理者専用メニューセクション

                  Admin Dashboard and User Management
                  管理者ダッシュボードとユーザー管理

                  Only visible when user has 'admin' role
                  'admin'ロールを持つユーザーのみ表示
                -->
                <template v-if="isAdmin">
                  <li><hr class="dropdown-divider" /></li>
                  <!-- Admin Dashboard link / 管理者ダッシュボードリンク -->
                  <li>
                    <router-link class="dropdown-item text-warning" to="/admin">
                      <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                      <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                      <i class="fas fa-crown me-2" aria-hidden="true"></i>Admin Dashboard
                    </router-link>
                  </li>
                  <!-- User management link / ユーザー管理リンク -->
                  <li>
                    <router-link class="dropdown-item text-warning" to="/admin/users">
                      <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                      <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                      <i class="fas fa-users-cog me-2" aria-hidden="true"></i>Manage Users
                    </router-link>
                  </li>
                </template>

                <li><hr class="dropdown-divider" /></li>
                <!-- Sign out button / サインアウトボタン -->
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                    <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                    <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                    <i class="fas fa-sign-out-alt me-2" aria-hidden="true"></i>Sign out
                  </a>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </template>

      <!-- Mobile Search Mode / モバイル検索モード -->
      <template v-else>
        <div class="search-mode-container d-flex align-items-center w-100">
          <!-- Back button to exit search mode / 検索モード終了用の戻るボタン -->
          <button class="btn btn-ghost me-3" @click="exitSearchMode">
            <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
            <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
          </button>

          <!-- Full-width search input / 全幅検索入力 -->
          <div class="flex-grow-1">
            <input
              type="search"
              class="form-control search-mode-input"
              placeholder="Search recipes, events..."
              v-model="searchQuery"
              ref="searchInput"
            />
          </div>
        </div>
      </template>
    </div>
  </nav>

  <!-- Sidebar Navigation (Desktop Only) / サイドバーナビゲーション（デスクトップのみ） -->
  <nav class="sidebar d-none d-lg-block" :class="{ 'sidebar-expanded': sidebarExpanded }">
    <div class="sidebar-content">
      <!-- Public Pages Section / 公開ページセクション -->
      <div class="nav-section">
        <ul class="nav flex-column">
          <!-- Home page link / ホームページリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-home" aria-hidden="true"></i>
              <span class="nav-text">Home</span>
            </router-link>
          </li>

          <!-- Recipes page link / レシピページリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/recipes" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-utensils" aria-hidden="true"></i>
              <span class="nav-text">Recipes</span>
            </router-link>
          </li>

          <!-- Events page link / イベントページリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/events" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-calendar-alt" aria-hidden="true"></i>
              <span class="nav-text">Events</span>
            </router-link>
          </li>

          <!--
            BR (E.2): Geo Location - Restaurant search feature link
            BR (E.2): 地理位置情報 - レストラン検索機能リンク

            Google Maps integration for finding nearby restaurants
            Google Maps統合による近隣レストラン検索

            Provides map-based navigation and search functionality
            地図ベースのナビゲーションと検索機能を提供
          -->
          <li class="nav-item">
            <router-link class="nav-link" to="/geo-location" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
              <span class="nav-text">Restaurant Finder</span>
            </router-link>
          </li>

          <!-- Events calendar page link / イベントカレンダーページリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/events-calendar" active-class="active">
              <i class="fas fa-calendar-alt" aria-hidden="true"></i>
              <span class="nav-text">Events Calendar</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Authenticated Users Section / 認証済みユーザーセクション -->
      <div v-if="isAuthenticated" class="nav-section">
        <div class="nav-divider"></div>
        <ul class="nav flex-column">
          <!-- Dashboard link / ダッシュボードリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
              <span class="nav-text">Dashboard</span>
            </router-link>
          </li>

          <!-- Groups page link / グループページリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/groups" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-users" aria-hidden="true"></i>
              <span class="nav-text">Groups</span>
            </router-link>
          </li>

          <!--
            BR (D.2): Email - Email sending feature link
            BR (D.2): メール送信 - メール送信機能リンク

            Access to email composition page with attachment support
            添付ファイル対応のメール作成ページへのアクセス

            SendGrid API integration for email delivery
            SendGrid API統合によるメール配信
          -->
          <li class="nav-item">
            <router-link class="nav-link" to="/send-email" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-envelope" aria-hidden="true"></i>
              <span class="nav-text">Send Email</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Footer Section / フッターセクション -->
      <div class="sidebar-footer">
        <div class="nav-divider"></div>
        <ul class="nav flex-column">
          <!-- Terms of Service link / 利用規約リンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/terms">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-file-contract" aria-hidden="true"></i>
              <span class="nav-text">Terms</span>
            </router-link>
          </li>

          <!-- Privacy Policy link / プライバシーポリシーリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/privacy">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-shield-alt" aria-hidden="true"></i>
              <span class="nav-text">Privacy</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Bottom Navigation Bar (Mobile Only) / ボトムナビゲーションバー（モバイルのみ） -->
  <nav class="bottom-navbar d-lg-none">
    <div class="bottom-nav-container">
      <!-- Home button / ホームボタン -->
      <router-link class="bottom-nav-item" to="/" exact-active-class="active">
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-home" aria-hidden="true"></i>
        <span>Home</span>
      </router-link>

      <!-- Recipes button / レシピボタン -->
      <router-link class="bottom-nav-item" to="/recipes" active-class="active">
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-utensils" aria-hidden="true"></i>
        <span>Recipes</span>
      </router-link>

      <!-- BR (E.2): Geo Location - Mobile map navigation button / モバイル地図ナビゲーションボタン -->
      <router-link class="bottom-nav-item" to="/geo-location" active-class="active">
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
        <span>Map</span>
      </router-link>

      <!-- Events button / イベントボタン -->
      <router-link class="bottom-nav-item" to="/events" active-class="active">
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-calendar-alt" aria-hidden="true"></i>
        <span>Events</span>
      </router-link>

      <!-- Dashboard button (authenticated) or Login button (unauthenticated) -->
      <!-- ダッシュボードボタン（認証済み）またはログインボタン（未認証） -->
      <router-link
        v-if="isAuthenticated"
        class="bottom-nav-item"
        to="/dashboard"
        active-class="active"
      >
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
        <span>Dashboard</span>
      </router-link>

      <router-link v-else class="bottom-nav-item" to="/login" active-class="active">
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
        <span>Login</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

// Router instance / ルーターインスタンス
const router = useRouter()
// Firebase Auth instance / Firebase認証インスタンス
const auth = getAuth()

// ============================================================================
// Component State / コンポーネント状態
// ============================================================================

// Authentication state / 認証状態
const isAuthenticated = ref(false)
const currentUser = ref(null)

// User profile data / ユーザープロフィールデータ
const userName = ref('User')

// BR (C.2): Role-based authentication - User role state
// BR (C.2): ロールベース認証 - ユーザーロール状態
const userRole = ref(null)

// UI state / UI状態
const sidebarExpanded = ref(false)
const isSearchMode = ref(false)
const searchQuery = ref('')
const isNavbarVisible = ref(true)
const searchInput = ref(null)

// ============================================================================
// Computed Properties / 算出プロパティ
// ============================================================================

/**
 * User Avatar URL Generator
 * ユーザーアバターURL生成
 *
 * Returns either Google account photo or generated avatar with initials
 * Googleアカウント写真または頭文字付き生成アバターを返す
 */
const userAvatar = computed(() => {
  // Use Google-authenticated photo URL if available
  // Google認証のphotoURLがある場合はそれを使用
  if (currentUser.value?.photoURL) {
    return currentUser.value.photoURL
  }

  // Get initials from displayName or userName
  // displayNameまたはuserNameから頭文字を取得
  let name = 'User'

  if (userName.value && userName.value !== 'User') {
    name = userName.value
  } else if (currentUser.value?.displayName) {
    name = currentUser.value.displayName
  } else if (currentUser.value?.email) {
    // Generate name from email address
    // メールアドレスから名前を生成
    name = currentUser.value.email.split('@')[0]
  }

  // Generate initial avatar with UI Avatars service
  // UI Avatarsサービスで頭文字のアバターを生成
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=007bff&color=ffffff&bold=true`
})

/**
 * BR (C.2): Role-based authentication - Admin role check
 * BR (C.2): ロールベース認証 - 管理者ロールチェック
 *
 * Returns true if user has admin role
 * ユーザーが管理者ロールを持っている場合trueを返す
 */
const isAdmin = computed(() => userRole.value === 'admin')

/**
 * User role display text
 * ユーザーロール表示テキスト
 */
const roleDisplay = computed(() => {
  if (userRole.value === 'admin') return 'Admin'
  return 'User'
})

/**
 * Badge CSS class based on user role
 * ユーザーロールに基づくバッジCSSクラス
 */
const roleClass = computed(() => {
  if (userRole.value === 'admin') return 'bg-warning text-dark'
  return 'bg-primary'
})

// ============================================================================
// Methods / メソッド
// ============================================================================

/**
 * Toggle sidebar expanded/collapsed state
 * サイドバーの展開/折りたたみ状態を切り替え
 *
 * Saves state to localStorage and dispatches custom event
 * localStorageに状態を保存し、カスタムイベントを発行
 */
const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value
  localStorage.setItem('sidebarExpanded', sidebarExpanded.value)

  // Dispatch event for other components to respond
  // 他のコンポーネントが応答できるようにイベントを発行
  window.dispatchEvent(
    new CustomEvent('sidebar-state-changed', {
      detail: { isExpanded: sidebarExpanded.value },
    }),
  )
}

/**
 * Enter mobile search mode
 * モバイル検索モードに入る
 *
 * Shows full-width search input and focuses it
 * 全幅検索入力を表示してフォーカス
 */
const enterSearchMode = () => {
  isSearchMode.value = true
  nextTick(() => {
    searchInput.value?.focus()
  })
}

/**
 * Exit mobile search mode
 * モバイル検索モードを終了
 *
 * Returns to normal navigation layout and clears search query
 * 通常のナビゲーションレイアウトに戻り、検索クエリをクリア
 */
const exitSearchMode = () => {
  isSearchMode.value = false
  searchQuery.value = ''
}

/**
 * Handle user logout
 * ユーザーログアウト処理
 *
 * Signs out from Firebase Auth and redirects to login page
 * Firebase認証からサインアウトし、ログインページにリダイレクト
 */
const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

/**
 * BR (C.2): Role-based authentication - Load user profile and role from Firestore
 * BR (C.2): ロールベース認証 - Firestoreからユーザープロフィールとロールを読み込み
 *
 * Fetches user data including role from Firestore 'users' collection
 * Firestore 'users'コレクションからロールを含むユーザーデータを取得
 *
 * Used to control navigation menu visibility based on user role
 * ユーザーロールに基づいてナビゲーションメニューの表示を制御するために使用
 *
 * @param {Object} user - Firebase Auth user object / Firebase認証ユーザーオブジェクト
 */
const loadUserProfile = async (user) => {
  try {
    // Get user document from Firestore / Firestoreからユーザードキュメントを取得
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      // Set display name / 表示名を設定
      userName.value = userData.displayName || user.displayName || 'User'

      // BR (C.2): Get user role from Firestore / Firestoreからユーザーロールを取得
      userRole.value = userData.role || 'user'
    } else {
      // Fallback if no Firestore document exists / Firestoreドキュメントが存在しない場合のフォールバック
      userName.value = user.displayName || 'User'
      userRole.value = 'user'
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
    userName.value = user.displayName || 'User'
    userRole.value = 'user'
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * Component mounted lifecycle hook
 * コンポーネントマウント時のライフサイクルフック
 */
onMounted(() => {
  // Restore sidebar expansion state from localStorage
  // localStorageからサイドバーの展開状態を復元
  const savedState = localStorage.getItem('sidebarExpanded')
  if (savedState !== null) {
    sidebarExpanded.value = savedState === 'true'
  }

  // Monitor Firebase authentication state changes
  // Firebase認証状態の変更を監視
  onAuthStateChanged(auth, async (user) => {
    isAuthenticated.value = !!user
    currentUser.value = user

    if (user) {
      // Load user profile data if authenticated / 認証済みの場合、ユーザープロフィールデータを読み込み
      await loadUserProfile(user)
    } else {
      // Reset user data if not authenticated / 未認証の場合、ユーザーデータをリセット
      userName.value = 'User'
      userRole.value = null
    }
  })
})
</script>

<style scoped>
/* ============================================================================
   Top Navigation Bar Styles / トップナビゲーションバースタイル
   ============================================================================ */

/* Fixed top navigation bar / 固定トップナビゲーションバー */
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3.5em;
  border-bottom: 1px solid #e5e5e5;
  z-index: 1040;
  transition: transform 0.3s ease;
}

/* Top navbar container layout / トップナビゲーションバーコンテナレイアウト */
.top-navbar .container-fluid {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
}

/* Navigation sections / ナビゲーションセクション */
.navbar-left,
.navbar-center,
.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-left {
  flex: 0 0 auto;
}

.navbar-center {
  flex: 1 1 auto;
  justify-content: center;
  max-width: 40em;
  margin: 0 1em;
}

.navbar-right {
  flex: 0 0 auto;
  gap: 0.5em;
}

/* Ghost button style for icon buttons / アイコンボタン用のゴーストボタンスタイル */
.btn-ghost {
  background: none;
  border: none;
  padding: 0.5em;
  cursor: pointer;
  color: #0f0f0f;
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-ghost:hover {
  background-color: #f1f3f4;
}

/* Brand logo styling / ブランドロゴスタイル */
.navbar-brand {
  text-decoration: none;
  font-size: 1.25rem;
}

/* Notification badge indicator / 通知バッジインジケーター */
.notification-badge {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  width: 0.5em;
  height: 0.5em;
  background-color: #ff0000;
  border-radius: 50%;
}

/* ============================================================================
   Sidebar Navigation Styles (Desktop) / サイドバーナビゲーションスタイル（デスクトップ）
   ============================================================================ */

/* Fixed sidebar navigation / 固定サイドバーナビゲーション */
.sidebar {
  position: fixed;
  top: 3.5em;
  left: 0;
  bottom: 0;
  width: 4.5em;
  background: white;
  border-right: 1px solid #e5e5e5;
  z-index: 1030;
  transition: width 0.2s ease;
  overflow: hidden;
}

/* Expanded sidebar state / 展開されたサイドバー状態 */
.sidebar-expanded {
  width: 15em;
}

/* Sidebar navigation link styling / サイドバーナビゲーションリンクスタイル */
.sidebar .nav-link {
  display: flex;
  align-items: center;
  padding: 0.625em 1.5em;
  color: #0f0f0f;
  text-decoration: none;
  border-radius: 0;
  transition: background-color 0.2s;
}

.sidebar .nav-link:hover {
  background-color: #f1f3f4;
}

/* Active navigation link / アクティブなナビゲーションリンク */
.sidebar .nav-link.active {
  background-color: #e8f0fe;
  color: #1976d2;
  font-weight: 500;
}

/* Navigation link icon styling / ナビゲーションリンクアイコンスタイル */
.sidebar .nav-link i {
  width: 1.5em;
  text-align: center;
  margin-right: 1.5em;
  font-size: 1rem;
}

/* Navigation text (hidden when collapsed) / ナビゲーションテキスト（折りたたみ時は非表示） */
.nav-text {
  white-space: nowrap;
  overflow: hidden;
}

/* Section divider line / セクション区切り線 */
.nav-divider {
  height: 1px;
  background-color: #e5e5e5;
  margin: 0.75em 0;
}

/* ============================================================================
   Bottom Navigation Styles (Mobile) / ボトムナビゲーションスタイル（モバイル）
   ============================================================================ */

/* Fixed bottom navigation bar / 固定ボトムナビゲーションバー */
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e5e5;
  z-index: 1030;
}

/* Bottom navigation container / ボトムナビゲーションコンテナ */
.bottom-nav-container {
  display: flex;
  height: 3.75em;
}

/* Bottom navigation item styling / ボトムナビゲーション項目スタイル */
.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  text-decoration: none;
  font-size: 0.625rem;
}

.bottom-nav-item:hover {
  color: #1976d2;
}

/* Active bottom navigation item / アクティブなボトムナビゲーション項目 */
.bottom-nav-item.active {
  color: #1976d2;
  font-weight: 500;
}

/* Bottom navigation icon / ボトムナビゲーションアイコン */
.bottom-nav-item i {
  font-size: 1.25rem;
  margin-bottom: 0.25em;
}

/* ============================================================================
   BR (E.3): Accessibility - Focus Styles / アクセシビリティ - フォーカススタイル
   ============================================================================

   Enhanced visual feedback for keyboard navigation
   キーボードナビゲーション用の強化された視覚的フィードバック

   Ensures focus is clearly visible for keyboard users
   キーボードユーザーにフォーカスが明確に見えるようにする
   ============================================================================ */
.btn-ghost:focus,
.nav-link:focus,
.bottom-nav-item:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style>
