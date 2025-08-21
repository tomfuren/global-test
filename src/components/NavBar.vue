<template>
  <!-- トップナビゲーションバー -->
  <nav 
    class="top-navbar bg-white shadow-sm"
    :class="{ 'navbar-hidden': !isNavbarVisible }"
  >
    <div class="container-fluid">
      <!-- 通常モード -->
      <template v-if="!isSearchMode">
        <!-- 左側セクション: メニューボタン + ロゴ -->
        <div class="navbar-left">
          <!-- ハンバーガーメニュー（デスクトップでサイドバー切り替え） -->
          <button 
            class="btn btn-ghost me-3 d-none d-lg-block"
            @click="toggleSidebar"
          >
            <i class="fas fa-bars"></i>
          </button>
          
          <!-- ロゴ -->
          <router-link class="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
            <i class="fas fa-globe me-2"></i>
            <span class="brand-text">Global Plate</span>
          </router-link>
        </div>

        <!-- 中央セクション: 検索バー（デスクトップのみ） -->
        <div class="navbar-center">
          <div class="search-container d-none d-md-flex">
            <div class="input-group">
              <input 
                type="search" 
                class="form-control search-input" 
                placeholder="Search recipes, events..."
                v-model="searchQuery"
              >
              <button class="btn btn-outline-secondary search-btn" type="button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 右側セクション: ユーザーメニュー -->
        <div class="navbar-right">
          <!-- 検索アイコン（モバイルのみ） -->
          <button class="btn btn-ghost me-2 d-md-none" @click="enterSearchMode">
            <i class="fas fa-search"></i>
          </button>

          <!-- 未認証ユーザー -->
          <template v-if="!isAuthenticated">
            <router-link class="btn btn-outline-primary btn-sm" to="/login">
              Log in
            </router-link>
            <router-link class="btn btn-primary btn-sm ms-2 d-none d-sm-inline-block" to="/register">
              Sign up
            </router-link>
          </template>

          <!-- 認証済みユーザー -->
          <template v-else>
            <!-- 通知 -->
            <div class="dropdown me-2">
              <button 
                class="btn btn-ghost position-relative"
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-bell"></i>
                <span v-if="hasNotifications" class="notification-badge"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><h6 class="dropdown-header">Notifications</h6></li>
                <li><a class="dropdown-item" href="#">New recipe posted</a></li>
                <li><a class="dropdown-item" href="#">Event reminder</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-center" href="#">See all</a></li>
              </ul>
            </div>

            <!-- プロフィール -->
            <div class="dropdown">
              <button 
                class="btn btn-ghost d-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <img
                  :src="userAvatar"
                  alt="profile"
                  class="rounded-circle"
                  width="32"
                  height="32"
                >
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <div class="dropdown-header">
                    <div class="fw-bold">{{ userName }}</div>
                    <small class="text-muted">{{ currentUser?.email }}</small>
                  </div>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="fas fa-user me-2"></i>Your Profile
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/dashboard">
                    <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                  </router-link>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="fas fa-cog me-2"></i>Settings
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click="handleLogout">
                    <i class="fas fa-sign-out-alt me-2"></i>Sign out
                  </a>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </template>

      <!-- 検索モード（モバイルのみ） -->
      <template v-else>
        <div class="search-mode-container d-flex align-items-center w-100">
          <!-- 戻るボタン -->
          <button class="btn btn-ghost me-3" @click="exitSearchMode">
            <i class="fas fa-arrow-left"></i>
          </button>
          
          <!-- 検索入力 -->
          <div class="flex-grow-1">
            <input 
              type="search" 
              class="form-control search-mode-input" 
              placeholder="Search recipes, events..."
              v-model="searchQuery"
              ref="searchInput"
            >
          </div>
        </div>
      </template>
    </div>
  </nav>

  <!-- サイドバー（デスクトップのみ） -->
  <nav 
    class="sidebar d-none d-lg-block"
    :class="{ 'sidebar-expanded': sidebarExpanded }"
  >
    <div class="sidebar-content">
      <!-- メインナビゲーション -->
      <div class="nav-section">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">
              <i class="fas fa-home"></i>
              <span class="nav-text">Home</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/recipes" active-class="active">
              <i class="fas fa-utensils"></i>
              <span class="nav-text">Recipes</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/events" active-class="active">
              <i class="fas fa-calendar-alt"></i>
              <span class="nav-text">Events</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 認証済みユーザー専用セクション -->
      <div v-if="isAuthenticated" class="nav-section">
        <div class="nav-divider"></div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard" active-class="active">
              <i class="fas fa-tachometer-alt"></i>
              <span class="nav-text">Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/groups" active-class="active">
              <i class="fas fa-users"></i>
              <span class="nav-text">Groups</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- フッターセクション -->
      <div class="sidebar-footer">
        <div class="nav-divider"></div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link class="nav-link" to="/about">
              <i class="fas fa-info-circle"></i>
              <span class="nav-text">About</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contact">
              <i class="fas fa-envelope"></i>
              <span class="nav-text">Contact</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- ボトムナビゲーション（モバイルのみ） -->
  <nav class="bottom-navbar d-lg-none">
    <div class="bottom-nav-container">
      <router-link class="bottom-nav-item" to="/" exact-active-class="active">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </router-link>
      
      <router-link class="bottom-nav-item" to="/recipes" active-class="active">
        <i class="fas fa-utensils"></i>
        <span>Recipes</span>
      </router-link>
      
      <router-link class="bottom-nav-item" to="/events" active-class="active">
        <i class="fas fa-calendar-alt"></i>
        <span>Events</span>
      </router-link>
      
      <router-link 
        v-if="isAuthenticated" 
        class="bottom-nav-item" 
        to="/groups" 
        active-class="active"
      >
        <i class="fas fa-users"></i>
        <span>Groups</span>
      </router-link>
      
      <router-link 
        v-if="isAuthenticated" 
        class="bottom-nav-item" 
        to="/dashboard" 
        active-class="active"
      >
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </router-link>
      
      <router-link 
        v-if="!isAuthenticated" 
        class="bottom-nav-item" 
        to="/login" 
        active-class="active"
      >
        <i class="fas fa-sign-in-alt"></i>
        <span>Login</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// State
const hasNotifications = ref(true)
const currentUser = ref(null)
const sidebarExpanded = ref(true)
const searchQuery = ref('')
const isSearchMode = ref(false) // 検索モード状態を追加

// 検索モード制御関数
const enterSearchMode = () => {
  isSearchMode.value = true
  // 次のティックで検索入力にフォーカス
  nextTick(() => {
    const searchInput = document.querySelector('.search-mode-input')
    if (searchInput) {
      searchInput.focus()
    }
  })
}

const exitSearchMode = () => {
  isSearchMode.value = false
  searchQuery.value = ''
} // スクロール感度調整

// Functions
const loadCurrentUser = () => {
  try {
    const userData = localStorage.getItem('currentUser')
    currentUser.value = userData ? JSON.parse(userData) : null
    console.log('Current user loaded:', currentUser.value)
  } catch (error) {
    console.error('Error loading current user:', error)
    currentUser.value = null
  }
}

const handleAuthChange = () => {
  console.log('Auth change detected')
  loadCurrentUser()
}

const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value
  localStorage.setItem('sidebarExpanded', sidebarExpanded.value.toString())
  
  // スクロール制御
  if (sidebarExpanded.value) {
    // サイドバー開く時：スクロール無効化
    document.body.style.overflow = 'hidden'
  } else {
    // サイドバー閉じる時：スクロール有効化
    document.body.style.overflow = ''
  }
  
  // App.vueに状態変更を通知
  window.dispatchEvent(new CustomEvent('sidebar-state-changed', {
    detail: { isExpanded: sidebarExpanded.value }
  }))
}

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  currentUser.value = null
  window.dispatchEvent(new Event('auth-changed'))
  
  if (route.meta.requiresAuth) {
    router.push('/')
  }
  
  console.log('ログアウト完了')
}

// Lifecycle
onMounted(() => {
  loadCurrentUser()
  
  // サイドバーの状態を復元
  const savedSidebarState = localStorage.getItem('sidebarExpanded')
  if (savedSidebarState !== null) {
    sidebarExpanded.value = savedSidebarState === 'true'
  }
  
  // サイドバーを閉じるイベントを監視
  window.addEventListener('close-sidebar', () => {
    sidebarExpanded.value = false
    localStorage.setItem('sidebarExpanded', 'false')
  })
  
  window.addEventListener('auth-changed', handleAuthChange)
  window.addEventListener('storage', handleAuthChange)
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', handleAuthChange)
  window.removeEventListener('storage', handleAuthChange)
  window.removeEventListener('close-sidebar', () => {
    sidebarExpanded.value = false
  })
})

// Computed
const isAuthenticated = computed(() => !!currentUser.value)

const userName = computed(() => {
  if (!currentUser.value) return 'Guest'
  return `${currentUser.value.firstName} ${currentUser.value.lastName}`.trim() || currentUser.value.email
})

const userAvatar = computed(() => {
  if (currentUser.value) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&size=32&background=007bff&color=ffffff`
  }
  return 'https://ui-avatars.com/api/?name=Guest&size=32&background=6c757d&color=ffffff'
})
</script>

<style scoped>
/* トップナビゲーション - YouTube風 */
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  z-index: 1030;
}

.top-navbar .container-fluid {
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  /* justify-contentは使わず、各セクションで明示的に制御 */
}

/* 小さな画面でのパディング調整 */
@media (max-width: 455px) {
  .top-navbar .container-fluid {
    padding: 0 0; /* 左右のパディングを完全に削除 */
  }
  
  .navbar-left,
  .navbar-center,
  .navbar-right {
    padding-left: 8px;
    padding-right: 8px;
  }
  
  .navbar-brand {
    font-size: 1.2rem;
  }
  
  .btn-ghost {
    padding: 6px 8px;
  }
}

/* より小さな画面での調整 */
@media (max-width: 576px) {
  .top-navbar .container-fluid {
    padding: 0 !important;
    margin: 0 !important;
    width: 100vw;
    max-width: 100vw;
  }
  
  .navbar-left {
    padding-left: 4px;
  }
  
  .navbar-right {
    padding-right: 4px;
  }
}

/* 左側セクション - 固定幅 */
.navbar-left {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  min-width: 200px;
}

/* 中央セクション - 伸縮可能 */
.navbar-center {
  display: flex;
  justify-content: center;
  flex: 1 1 auto;
  max-width: 600px;
  margin: 0 20px;
}

/* 右側セクション - 固定幅 */
.navbar-right {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  min-width: 200px;
  justify-content: flex-end;
}

.btn-ghost {
  background: none;
  border: none;
  color: #666;
  padding: 8px 12px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-ghost:hover {
  background-color: #f1f3f4;
  color: #333;
}

/* 検索バー */
.search-container {
  max-width: 600px;
  flex: 1;
  margin: 0 20px;
}

.search-input {
  border-right: none;
  border-radius: 20px 0 0 20px;
  padding-left: 16px;
}

.search-btn {
  border-left: none;
  border-radius: 0 20px 20px 0;
  width: 60px;
}

/* 通知バッジ */
.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: #ff4444;
  border-radius: 50%;
}

/* サイドバー */
.sidebar {
  position: fixed;
  top: 56px; /* NavBarの下から開始 */
  left: 0;
  width: 240px;
  height: calc(100vh - 56px); /* NavBar分を除いた高さ */
  background: white;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
  z-index: 1020; /* NavBarより低く設定 */
  transform: translateX(-100%); /* 初期状態は隠す */
  transition: transform 0.3s ease;
}

/* サイドバー展開時 */
.sidebar.sidebar-expanded {
  transform: translateX(0); /* 表示 */
}

.sidebar-content {
  padding: 12px 0; /* 上部パディングを元に戻す */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nav-section {
  margin-bottom: 8px;
}

.sidebar-footer {
  margin-top: auto;
}

.nav-divider {
  height: 1px;
  background-color: #e5e5e5;
  margin: 12px 0;
}

.sidebar .nav-link {
  display: flex;
  align-items: center;
  padding: 10px 24px;
  color: #0f0f0f;
  text-decoration: none;
  border-radius: 0;
  transition: background-color 0.2s;
  min-height: 40px;
  white-space: nowrap;
}

.sidebar .nav-link:hover {
  background-color: #f1f3f4;
}

.sidebar .nav-link.active {
  background-color: #e8f0fe;
  color: #1976d2;
  font-weight: 500;
}

.sidebar .nav-link i {
  width: 24px;
  text-align: center;
  margin-right: 24px;
  font-size: 16px;
  flex-shrink: 0;
}

/* ボトムナビゲーション */
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e5e5;
  z-index: 1030;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav-container {
  display: flex;
  height: 60px;
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  text-decoration: none;
  font-size: 10px;
  transition: color 0.2s;
}

.bottom-nav-item:hover {
  color: #1976d2;
}

.bottom-nav-item.active {
  color: #1976d2;
  font-weight: 500;
}

.bottom-nav-item i {
  font-size: 20px;
  margin-bottom: 4px;
}

/* ドロップダウンメニュー */
.dropdown-menu {
  border: none;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 8px;
  min-width: 200px;
}

.dropdown-item {
  padding: 8px 16px;
  font-size: 14px;
}

.dropdown-header {
  padding: 8px 16px;
  font-size: 12px;
}

/* レスポンシブ調整 */
@media (max-width: 991.98px) {
  body {
    padding-bottom: 60px; /* ボトムナビの高さ分 */
  }
}

@media (min-width: 992px) {
  .main-content {
    margin-left: 240px;
    transition: margin-left 0.2s ease;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 72px;
  }
}

@media (max-width: 767.98px) {
  .search-container {
    display: none !important;
  }
  
  .bottom-nav-item {
    font-size: 9px;
  }
  
  .bottom-nav-item i {
    font-size: 18px;
  }
}

/* 小さな画面での追加調整 */
@media (max-width: 576px) {
  .top-navbar .container-fluid {
    padding: 0 4px; /* さらに小さく */
  }
  
  .navbar-left {
    min-width: 60px;
    max-width: 80px;
  }
  
  .navbar-right {
    min-width: 60px;
    max-width: 80px;
  }
  
  .navbar-center {
    margin: 0 4px;
  }
  
  /* 検索バーをモバイルでは完全に隠す */
  .search-container {
    display: none !important;
  }
}

/* 極小画面での調整 */
@media (max-width: 400px) {
  .navbar-left {
    min-width: 50px;
    max-width: 70px;
  }
  
  .navbar-right {
    min-width: 50px;
    max-width: 70px;
  }
  
  /* ロゴテキストは保持（削除しない） */
  .brand-text {
    font-size: 0.9rem; /* 小さくするが表示は維持 */
  }
  
  .btn-sm {
    padding: 2px 6px; /* ボタンサイズを縮小 */
    font-size: 0.75rem;
    white-space: nowrap; /* 改行を防ぐ */
  }
}

/* 検索モードのスタイル */
.search-mode-container {
  width: 100%;
}

.search-mode-input {
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
}

.search-mode-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-outline-secondary {
    --bs-btn-border-color: #dee2e6;
    border-color: #dee2e6;
}

/* ボタンサイズの調整 */
.btn-sm {
  padding: 4px 8px;
  font-size: 0.8rem;
  border-radius: 4px;
}

/* モバイルでのLogin/Sign upボタンの調整 */
@media (max-width: 576px) {
  .navbar-right .btn-sm {
    padding: 3px 6px;
    font-size: 0.75rem;
    margin: 0 1px; /* ボタン間の余白を縮小 */
    white-space: nowrap; /* 改行を防ぐ */
  }
  
  .navbar-right {
    gap: 2px; /* フレックスアイテム間の間隔 */
  }
}

/* 中間サイズ（400px-576px）での追加調整 */
@media (min-width: 401px) and (max-width: 576px) {
  .navbar-right .btn-sm {
    padding: 2px 4px;
    font-size: 0.7rem;
    white-space: nowrap;
  }
  
  .navbar-right {
    min-width: 70px;
    max-width: 100px;
  }
}
</style>