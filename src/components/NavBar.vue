<template>
  <!-- トップナビゲーションバー -->
  <!-- Top Navigation Bar -->
  <nav 
    class="top-navbar bg-white"
    :class="{ 'navbar-hidden': !isNavbarVisible }"
  >
    <div class="container-fluid">
      <!-- 通常モード -->
      <!-- Normal mode -->
      <template v-if="!isSearchMode">
        <!-- 左側セクション: メニューボタン + ロゴ -->
        <!-- Left section: Menu button + logo -->
        <div class="navbar-left">
          <!-- ハンバーガーメニュー（デスクトップでサイドバー切り替え） -->
          <!-- Hamburger menu (sidebar toggle on desktop) -->
          <button 
            class="btn btn-ghost me-3 d-none d-lg-block"
            @click="toggleSidebar"
          >
            <i class="fas fa-bars"></i>
          </button>
          
          <!-- ロゴ -->
          <!-- logo -->
          <router-link class="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
            <i class="fas fa-globe me-2"></i>
            <span class="brand-text">Global Plate</span>
          </router-link>
        </div>

        <!-- 中央セクション: 検索バー（デスクトップのみ） -->
        <!-- Center section: Search bar (desktop only) -->
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
        <!-- Right section: User menu -->
        <div class="navbar-right">
          <!-- 検索アイコン（モバイルのみ） -->
          <!-- Search icon (mobile only) -->
          <button class="btn btn-ghost me-2 d-md-none" @click="enterSearchMode">
            <i class="fas fa-search"></i>
          </button>

          <!-- 未認証ユーザー -->
          <!-- Unauthenticated Users -->
          <template v-if="!isAuthenticated">
            <router-link class="btn btn-outline-primary btn-sm" to="/login">
              Log in
            </router-link>
            <router-link class="btn btn-primary btn-sm ms-2 d-none d-sm-inline-block" to="/register">
              Sign up
            </router-link>
          </template>

          <!-- 認証済みユーザー -->
          <!-- Authenticated Users -->
          <template v-else>
            <!-- 通知 -->
            <!-- notification -->
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
            <!-- profile -->
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
      <!-- Search mode (mobile only) -->
      <template v-else>
        <div class="search-mode-container d-flex align-items-center w-100">
          <!-- 戻るボタン -->
          <!-- Back button -->
          <button class="btn btn-ghost me-3" @click="exitSearchMode">
            <i class="fas fa-arrow-left"></i>
          </button>
          
          <!-- 検索入力 -->
          <!-- search input -->
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
  <!-- Sidebar (Desktop only) -->
  <nav 
    class="sidebar d-none d-lg-block"
    :class="{ 'sidebar-expanded': sidebarExpanded }"
  >
    <div class="sidebar-content">
      <!-- メインナビゲーション -->
      <!-- Main Navigation -->
      <div class="nav-section">
        <ul class="nav flex-column">
          <li class="nav-item" >
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
      <!-- Authenticated users only section -->
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
      <!-- Footer section -->
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
  <!-- Bottom navigation (mobile only) -->
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
const isSearchMode = ref(false)

// 検索モード制御関数
// Search mode control function
const enterSearchMode = () => {
  isSearchMode.value = true
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
}

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
  
  if (sidebarExpanded.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  
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
  
  console.log('logout complate')
}

// Lifecycle
onMounted(() => {
  loadCurrentUser()
  
  const savedSidebarState = localStorage.getItem('sidebarExpanded')
  if (savedSidebarState !== null) {
    sidebarExpanded.value = savedSidebarState === 'true'
  }
  
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
/* トップナビゲーション - em/%単位使用版 */
/* Top navigation - em/% unit version */
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3.5em;
  z-index: 1030;
  border-bottom: 1px solid #e5e5e5;
}

.top-navbar .container-fluid {
  height: 100%;
  padding: 0 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100vw;
}

/* === Layout Alignment System === */

/* Left section - logo area */
.navbar-left {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  width: 20%;
  min-width: 12em;
  max-width: 18em;
  margin-right: 1em;
}

/* Center section - search bar area */
.navbar-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
  width: 60%;
  max-width: 40em;
  padding: 0 1em;
}

/* Right section - User menu area */
.navbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
  width: 20%;
  min-width: 8em;
  max-width: 12em;
  margin-left: 1em;
}

/* === Button Style === */
.btn-ghost {
  background: none;
  border: none;
  color: #666;
  padding: 0.5em 0.75em;
  border-radius: 50%;
  transition: background-color 0.2s;
  font-size: 1rem;
}

.btn-ghost:hover {
  background-color: #f1f3f4;
  color: #333;
}

/* === Search bar === */
.search-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
}

.search-container .input-group {
  width: 100%;
  max-width: 35em;
}

.search-input {
  border-right: none;
  border-radius: 1.25em 0 0 1.25em;
  padding-left: 1em;
  font-size: 0.95rem;
  min-height: 2.5em;
}

.search-btn {
  border-left: none;
  border-radius: 0 1.25em 1.25em 0;
  width: 3.75em;
  min-width: 3.75em;
}

/* === Notification Badge === */
.notification-badge {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  width: 0.5em;
  height: 0.5em;
  background-color: #ff4444;
  border-radius: 50%;
}

/* === Sidebar === */
.sidebar {
  position: fixed;
  top: 3.5em;
  left: 0;
  width: 4.5em;
  height: calc(100vh - 3.5em);
  background: white;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
  z-index: 1020;
  transition: width 0.2s ease;
}

.sidebar.sidebar-expanded {
  width: 15em;
}

/* Hide text in collapsed state */
.sidebar:not(.sidebar-expanded) .nav-text {
  display: none;
}

.sidebar:not(.sidebar-expanded) .nav-link {
  padding: 0.625em;
  justify-content: center;
}

.sidebar:not(.sidebar-expanded) .nav-link i {
  margin-right: 0;
}

.sidebar-content {
  padding: 0.75em 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nav-section {
  margin-bottom: 0.5em;
}

.sidebar-footer {
  margin-top: auto;
}

.nav-divider {
  height: 1px;
  background-color: #e5e5e5;
  margin: 0.75em 0;
}

.sidebar .nav-link {
  display: flex;
  align-items: center;
  padding: 0.625em 1.5em;
  color: #0f0f0f;
  text-decoration: none;
  border-radius: 0;
  transition: background-color 0.2s;
  min-height: 2.5em;
  white-space: nowrap;
  font-size: 0.9rem;
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
  width: 1.5em;
  text-align: center;
  margin-right: 1.5em;
  font-size: 1rem;
  flex-shrink: 0;
}

/* === Bottom Navigation === */
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
  height: 3.75em; /* 60px → 3.75em */
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
  font-size: 1.25rem;
  margin-bottom: 0.25em;
}

/* === Drop-down menu === */
.dropdown-menu {
  border: none;
  box-shadow: 0 0.25em 0.375em rgba(0,0,0,0.1);
  border-radius: 0.5em;
  min-width: 12.5em;
}

.dropdown-item {
  padding: 0.5em 1em;
  font-size: 0.875rem;
}

.dropdown-header {
  padding: 0.5em 1em;
  font-size: 0.75rem;
}

/* === Responsive === */

/* Tablet - Medium size */
@media (max-width: 991.98px) and (min-width: 768px) {
  .top-navbar .container-fluid {
    padding: 0 1.5em;
  }
  
  .navbar-left {
    width: 25%;
    min-width: 10em;
  }
  
  .navbar-center {
    width: 50%;
  }
  
  .navbar-right {
    width: 25%;
    min-width: 6em;
  }
}

/* Mobile - Larger */
@media (max-width: 767.98px) and (min-width: 576px) {
  .top-navbar .container-fluid {
    padding: 0 1em;
  }
  
  .navbar-left {
    width: 30%;
    min-width: 8em;
  }
  
  .navbar-center {
    width: 40%;
  }
  
  .navbar-right {
    width: 30%;
    min-width: 5em;
  }
  
  .search-container {
    display: none !important;
  }
  
  .bottom-nav-item {
    font-size: 0.6rem;
  }
  
  .bottom-nav-item i {
    font-size: 1.125rem;
  }
}

/* Mobile - Smaller */
@media (max-width: 575.98px) {
  .top-navbar .container-fluid {
    padding: 0 0.5em;
  }
  
  .navbar-left {
    width: 35%;
    min-width: 7em;
    margin-right: 0.5em;
  }
  
  .navbar-center {
    width: 30%;
    padding: 0 0.25em;
  }
  
  .navbar-right {
    width: 35%;
    min-width: 4em;
    margin-left: 0.5em;
  }
  
  .btn-ghost {
    padding: 0.375em 0.5em;
  }
  
  .brand-text {
    font-size: 0.9rem;
  }
  
  .btn-sm {
    padding: 0.25em 0.5em;
    font-size: 1 rem;
    white-space: nowrap;
  }
}

/* Tiny screen */
@media (max-width: 400px) {
  .top-navbar .container-fluid {
    padding: 0 0.25em;
  }
  
  .navbar-left {
    width: 40%;
    min-width: 6em;
  }
  
  .navbar-right {
    width: 40%;
    min-width: 3.5em;
  }
  
  .brand-text {
    font-size: 0.8rem;
  }
  
  .btn-sm {
    padding: 0.2em 0.4em;
    font-size: 0.7rem;
  }
  
  .btn-ghost {
    padding: 0.3em 0.4em;
  }
}

/* === Search mode === */
.search-mode-container {
  width: 100%;
}

.search-mode-input {
  border: 1px solid #dee2e6;
  border-radius: 1.25em;
  padding: 0.5em 1em;
  font-size: 0.875rem;
}

.search-mode-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.125rem rgba(0, 123, 255, 0.25);
}

.btn-outline-secondary {
  --bs-btn-border-color: #dee2e6;
  border-color: #dee2e6;
}

/* === Button size adjustment === */
.btn-sm {
  padding: 0.25em 0.7em;
  font-size: 1.2rem;
  border-radius: 0.25em;
}

/* Adjust the interval between authentication buttons */
.navbar-right .btn-sm + .btn-sm {
  margin-left: 0.5em;
}

@media (max-width: 576px) {
  .navbar-right .btn-sm + .btn-sm {
    margin-left: 0.25em;
  }
}

/* === Content adjustment on desktop === */
@media (min-width: 992px) {
  .main-content {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
  
  .main-content.sidebar-expanded {
    margin-left: 15em;
  }
}
</style>