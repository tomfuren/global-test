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
  - BR (F.1): Innovation - Admin Dashboard link / 管理者ダッシュボードリンク
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
            <i class="fas fa-bars" aria-hidden="true"></i>
          </button>

          <!-- Brand logo and name / ブランドロゴと名前 -->
          <router-link class="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
            <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
            <i class="fas fa-globe me-2" aria-hidden="true"></i>
            <span class="brand-text">Global Plate</span>
          </router-link>
        </div>

        <!-- Center Section: Spacer / 中央セクション: スペーサー -->
        <div class="navbar-center"></div>

        <!-- Right Section: User menu and actions / 右側セクション: ユーザーメニューとアクション -->
        <div class="navbar-right">
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
            <!-- User profile dropdown menu / ユーザープロフィールドロップダウンメニュー -->
            <div class="dropdown" ref="dropdownContainer">
              <!-- User avatar button / ユーザーアバターボタン -->
              <button
                class="btn btn-ghost d-flex align-items-center"
                type="button"
                @click="toggleDropdown"
              >
                <img
                  :src="userAvatar"
                  alt="profile"
                  class="rounded-circle"
                  width="32"
                  height="32"
                />
              </button>
              <!-- Dropdown menu items / ドロップダウンメニュー項目 -->
              <ul class="dropdown-menu dropdown-menu-end" :class="{ show: isDropdownOpen }">
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
                    <i class="fas fa-user me-2" aria-hidden="true"></i>Your Profile
                  </router-link>
                </li>

                <!-- Dashboard link / ダッシュボードリンク -->
                <li>
                  <router-link class="dropdown-item" to="/dashboard">
                    <i class="fas fa-tachometer-alt me-2" aria-hidden="true"></i>Dashboard
                  </router-link>
                </li>

                <!--
                  BR (C.2): Role-based authentication - Admin-only menu section
                  BR (C.2): ロールベース認証 - 管理者専用メニューセクション

                  BR (F.1): Innovation - Admin Dashboard access
                  BR (F.1): イノベーション - 管理者ダッシュボードアクセス

                  Admin Dashboard and User Management
                  管理者ダッシュボードとユーザー管理

                  Only visible when user has 'admin' role
                  'admin'ロールを持つユーザーのみ表示
                -->
                <template v-if="isAdmin">
                  <li><hr class="dropdown-divider" /></li>
                  <li class="dropdown-header">
                    <small class="text-warning fw-bold">
                      <i class="fas fa-crown me-1" aria-hidden="true"></i>
                      Admin Tools
                    </small>
                  </li>
                  <!-- Admin Dashboard link / 管理者ダッシュボードリンク -->
                  <li>
                    <router-link class="dropdown-item text-warning" to="/admin/dashboard">
                      <i class="fas fa-chart-line me-2" aria-hidden="true"></i>Admin Dashboard
                    </router-link>
                  </li>
                  <!-- User management link / ユーザー管理リンク -->
                  <li>
                    <router-link class="dropdown-item text-warning" to="/admin/users">
                      <i class="fas fa-users-cog me-2" aria-hidden="true"></i>Manage Users
                    </router-link>
                  </li>
                </template>

                <li><hr class="dropdown-divider" /></li>
                <!-- Sign out button / サインアウトボタン -->
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                    <i class="fas fa-sign-out-alt me-2" aria-hidden="true"></i>Sign out
                  </a>
                </li>
              </ul>
            </div>
          </template>
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
              <i class="fas fa-home" aria-hidden="true"></i>
              <span class="nav-text">Home</span>
            </router-link>
          </li>

          <!-- Recipes page link / レシピページリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/recipes" active-class="active">
              <i class="fas fa-utensils" aria-hidden="true"></i>
              <span class="nav-text">Recipes</span>
            </router-link>
          </li>

          <!-- Events page link / イベントページリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/events" active-class="active">
              <i class="fas fa-calendar-alt" aria-hidden="true"></i>
              <span class="nav-text">Events</span>
            </router-link>
          </li>

          <!--
            BR (E.2): Geo Location - Restaurant search feature link
            BR (E.2): 地理位置情報 - レストラン検索機能リンク
          -->
          <li class="nav-item">
            <router-link class="nav-link" to="/geo-location" active-class="active">
              <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
              <span class="nav-text">Restaurant Finder</span>
            </router-link>
          </li>

          <!--
            BR (F.1): Innovation - Calendar feature link
            BR (F.1): イノベーション - カレンダー機能リンク
          -->
          <li class="nav-item">
            <router-link class="nav-link" to="/events-calendar" active-class="active">
              <i class="fas fa-calendar-check" aria-hidden="true"></i>
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
              <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
              <span class="nav-text">Dashboard</span>
            </router-link>
          </li>

          <!-- Groups page link / グループページリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/groups" active-class="active">
              <i class="fas fa-users" aria-hidden="true"></i>
              <span class="nav-text">Groups</span>
            </router-link>
          </li>

          <!--
            BR (D.2): Email - Email sending feature link
            BR (D.2): メール送信 - メール送信機能リンク
          -->
          <li class="nav-item">
            <router-link class="nav-link" to="/send-email" active-class="active">
              <i class="fas fa-envelope" aria-hidden="true"></i>
              <span class="nav-text">Send Email</span>
            </router-link>
          </li>
        </ul>

        <!--
          BR (C.2): Role-based authentication - Admin section in sidebar
          BR (C.2): ロールベース認証 - サイドバーの管理者セクション

          BR (F.1): Innovation - Admin Dashboard sidebar access
          BR (F.1): イノベーション - サイドバーからの管理者ダッシュボードアクセス
        -->
        <template v-if="isAdmin">
          <div class="nav-divider"></div>
          <div class="nav-section-header" v-if="sidebarExpanded">
            <small class="text-warning fw-bold ps-3">
              <i class="fas fa-crown me-1" aria-hidden="true"></i>
              <span class="nav-text">Admin Tools</span>
            </small>
          </div>
          <ul class="nav flex-column">
            <!-- Admin Dashboard link / 管理者ダッシュボードリンク -->
            <li class="nav-item">
              <router-link
                class="nav-link text-warning"
                to="/admin/dashboard"
                active-class="active"
              >
                <i class="fas fa-chart-line" aria-hidden="true"></i>
                <span class="nav-text">Admin Dashboard</span>
              </router-link>
            </li>
            <!-- User management link / ユーザー管理リンク -->
            <li class="nav-item">
              <router-link class="nav-link text-warning" to="/admin/users" active-class="active">
                <i class="fas fa-users-cog" aria-hidden="true"></i>
                <span class="nav-text">Manage Users</span>
              </router-link>
            </li>
          </ul>
        </template>
      </div>

      <!-- Footer Section / フッターセクション -->
      <div class="sidebar-footer">
        <div class="nav-divider"></div>
        <ul class="nav flex-column">
          <!-- Logout button (visible when authenticated) / ログアウトボタン（認証時表示） -->
          <li v-if="isAuthenticated" class="nav-item">
            <a class="nav-link text-danger" href="#" @click.prevent="handleLogout">
              <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
              <span class="nav-text">Sign out</span>
            </a>
          </li>

          <!-- Terms of Service link / 利用規約リンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/terms">
              <i class="fas fa-file-contract" aria-hidden="true"></i>
              <span class="nav-text">Terms</span>
            </router-link>
          </li>

          <!-- Privacy Policy link / プライバシーポリシーリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/privacy">
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
        <i class="fas fa-home" aria-hidden="true"></i>
        <span>Home</span>
      </router-link>

      <!-- Recipes button / レシピボタン -->
      <router-link class="bottom-nav-item" to="/recipes" active-class="active">
        <i class="fas fa-utensils" aria-hidden="true"></i>
        <span>Recipes</span>
      </router-link>

      <!-- BR (E.2): Geo Location - Mobile map navigation button -->
      <router-link class="bottom-nav-item" to="/geo-location" active-class="active">
        <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
        <span>Map</span>
      </router-link>

      <!-- Events button / イベントボタン -->
      <router-link class="bottom-nav-item" to="/events" active-class="active">
        <i class="fas fa-calendar-alt" aria-hidden="true"></i>
        <span>Events</span>
      </router-link>

      <!-- Dashboard button (authenticated) or Login button (unauthenticated) -->
      <router-link
        v-if="isAuthenticated"
        class="bottom-nav-item"
        to="/dashboard"
        active-class="active"
      >
        <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
        <span>Dashboard</span>
      </router-link>

      <router-link v-else class="bottom-nav-item" to="/login" active-class="active">
        <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
        <span>Login</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const isNavbarVisible = ref(true)
const isDropdownOpen = ref(false)
const dropdownContainer = ref(null)

// ============================================================================
// Computed Properties / 算出プロパティ
// ============================================================================

/**
 * User Avatar URL Generator
 * ユーザーアバターURL生成
 */
const userAvatar = computed(() => {
  if (currentUser.value?.photoURL) {
    return currentUser.value.photoURL
  }

  let name = 'User'

  if (userName.value && userName.value !== 'User') {
    name = userName.value
  } else if (currentUser.value?.displayName) {
    name = currentUser.value.displayName
  } else if (currentUser.value?.email) {
    name = currentUser.value.email.split('@')[0]
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=007bff&color=ffffff&bold=true`
})

/**
 * BR (C.2): Role-based authentication - Admin role check
 * BR (C.2): ロールベース認証 - 管理者ロールチェック
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
 */
const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value
  localStorage.setItem('sidebarExpanded', sidebarExpanded.value)

  window.dispatchEvent(
    new CustomEvent('sidebar-state-changed', {
      detail: { isExpanded: sidebarExpanded.value },
    }),
  )
}

/**
 * Enter mobile search mode
 * モバイル検索モードに入る
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
 */
const exitSearchMode = () => {
  isSearchMode.value = false
  searchQuery.value = ''
}

/**
 * Toggle dropdown menu open/close
 * ドロップダウンメニューの開閉を切り替え
 */
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  console.log('Dropdown toggled:', isDropdownOpen.value)
}

/**
 * Close dropdown when clicking outside
 * 外側クリック時にドロップダウンを閉じる
 */
const closeDropdown = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

/**
 * Handle user logout
 * ユーザーログアウト処理
 */
const handleLogout = async () => {
  try {
    await signOut(auth)
    console.log('Logout successful')
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

/**
 * BR (C.2): Load user profile and role from Firestore
 * BR (C.2): Firestoreからユーザープロフィールとロールを読み込み
 */
const loadUserProfile = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      userName.value = userData.displayName || user.displayName || 'User'
      userRole.value = userData.role || 'student'

      console.log('User role loaded:', userRole.value)
    } else {
      userName.value = user.displayName || 'User'
      userRole.value = 'student'
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
    userName.value = user.displayName || 'User'
    userRole.value = 'student'
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

onMounted(() => {
  // Restore sidebar expansion state
  const savedState = localStorage.getItem('sidebarExpanded')
  if (savedState !== null) {
    sidebarExpanded.value = savedState === 'true'
  }

  // Add click listener to close dropdown when clicking outside
  // 外側クリック時にドロップダウンを閉じるリスナーを追加
  document.addEventListener('click', closeDropdown)

  // Monitor Firebase authentication state changes
  onAuthStateChanged(auth, async (user) => {
    isAuthenticated.value = !!user
    currentUser.value = user

    if (user) {
      await loadUserProfile(user)
    } else {
      userName.value = 'User'
      userRole.value = null
    }
  })
})

// Cleanup event listener on unmount
// アンマウント時にイベントリスナーをクリーンアップ
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
/* ============================================================================
   Top Navigation Bar Styles / トップナビゲーションバースタイル
   ============================================================================ */

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

.top-navbar .container-fluid {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
}

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

/* Remove default dropdown arrow / デフォルトのドロップダウン矢印を削除 */
.dropdown-toggle::after {
  display: none;
}

/* Ensure dropdown menu is positioned correctly / ドロップダウンメニューの位置を正しく設定 */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  display: none;
  min-width: 15rem;
  margin-top: 0.5rem;
}

.dropdown-menu.show {
  display: block;
}

.navbar-brand {
  text-decoration: none;
  font-size: 1.25rem;
}

/* ============================================================================
   Sidebar Navigation Styles (Desktop) / サイドバーナビゲーションスタイル
   ============================================================================ */

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

.sidebar-expanded {
  width: 15em;
}

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

.sidebar .nav-link.active {
  background-color: #e8f0fe;
  color: #1976d2;
  font-weight: 500;
}

/* Admin links styling / 管理者リンクスタイル */
.sidebar .nav-link.text-warning.active {
  background-color: #fff3cd;
  color: #856404;
  font-weight: 500;
}

.sidebar .nav-link i {
  width: 1.5em;
  text-align: center;
  margin-right: 1.5em;
  font-size: 1rem;
}

.nav-text {
  white-space: nowrap;
  overflow: hidden;
}

.nav-section-header {
  padding: 0.5em 0;
  margin-top: 0.5em;
}

.nav-divider {
  height: 1px;
  background-color: #e5e5e5;
  margin: 0.75em 0;
}

/* ============================================================================
   Bottom Navigation Styles (Mobile) / ボトムナビゲーションスタイル
   ============================================================================ */

.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e5e5;
  z-index: 1030;
}

.bottom-nav-container {
  display: flex;
  height: 3.75em;
}

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

.bottom-nav-item.active {
  color: #1976d2;
  font-weight: 500;
}

.bottom-nav-item i {
  font-size: 1.25rem;
  margin-bottom: 0.25em;
}

/* ============================================================================
   BR (E.3): Accessibility - Focus Styles / フォーカススタイル
   ============================================================================ */
.btn-ghost:focus,
.nav-link:focus,
.bottom-nav-item:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Dropdown menu improvements / ドロップダウンメニュー改善 */
.dropdown-header {
  padding: 0.75rem 1rem;
}
</style>
