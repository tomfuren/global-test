<template>
  <!-- トップナビゲーションバー / Top Navigation Bar -->
  <nav class="top-navbar bg-white" :class="{ 'navbar-hidden': !isNavbarVisible }">
    <div class="container-fluid">
      <!-- 通常モード / Normal mode -->
      <template v-if="!isSearchMode">
        <!-- 左側セクション: メニューボタン + ロゴ -->
        <div class="navbar-left">
          <button class="btn btn-ghost me-3 d-none d-lg-block" @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>

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
              />
              <button class="btn btn-outline-secondary search-btn" type="button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 右側セクション: ユーザーメニュー -->
        <div class="navbar-right">
          <button class="btn btn-ghost me-2 d-md-none" @click="enterSearchMode">
            <i class="fas fa-search"></i>
          </button>

          <!-- 未認証ユーザー -->
          <template v-if="!isAuthenticated">
            <router-link class="btn btn-outline-primary btn-sm" to="/login"> Log in </router-link>
            <router-link
              class="btn btn-primary btn-sm ms-2 d-none d-sm-inline-block"
              to="/register"
            >
              Sign up
            </router-link>
          </template>

          <!-- 認証済みユーザー -->
          <template v-else>
            <div class="dropdown me-2">
              <button class="btn btn-ghost position-relative" data-bs-toggle="dropdown">
                <i class="fas fa-bell"></i>
                <span v-if="hasNotifications" class="notification-badge"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><h6 class="dropdown-header">Notifications</h6></li>
                <li><a class="dropdown-item" href="#">New recipe posted</a></li>
                <li><a class="dropdown-item" href="#">Event reminder</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item text-center" href="#">See all</a></li>
              </ul>
            </div>

            <div class="dropdown">
              <button class="btn btn-ghost d-flex align-items-center" data-bs-toggle="dropdown">
                <img
                  :src="userAvatar"
                  alt="profile"
                  class="rounded-circle"
                  width="32"
                  height="32"
                />
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <div class="dropdown-header">
                    <div class="fw-bold">{{ userName }}</div>
                    <small class="text-muted">{{ currentUser?.email }}</small>
                    <div v-if="userRole" class="mt-1">
                      <span :class="roleClass" class="badge">
                        {{ roleDisplay }}
                      </span>
                    </div>
                  </div>
                </li>
                <li><hr class="dropdown-divider" /></li>
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
                <template v-if="isAdmin">
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <router-link class="dropdown-item text-warning" to="/admin">
                      <i class="fas fa-crown me-2"></i>Admin Dashboard
                    </router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item text-warning" to="/admin/users">
                      <i class="fas fa-users-cog me-2"></i>Manage Users
                    </router-link>
                  </li>
                </template>
                <li>
                  <a class="dropdown-item" href="#"> <i class="fas fa-cog me-2"></i>Settings </a>
                </li>
                <li><hr class="dropdown-divider" /></li>
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
          <button class="btn btn-ghost me-3" @click="exitSearchMode">
            <i class="fas fa-arrow-left"></i>
          </button>

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

  <!-- サイドバー（デスクトップのみ） -->
  <nav class="sidebar d-none d-lg-block" :class="{ 'sidebar-expanded': sidebarExpanded }">
    <div class="sidebar-content">
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

      <!-- 認証済みユーザー専用 -->
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
          <!-- BR (D.2): Email 機能へのリンク -->
          <li class="nav-item">
            <router-link class="nav-link" to="/send-email" active-class="active">
              <i class="fas fa-envelope"></i>
              <span class="nav-text">Send Email</span>
            </router-link>
          </li>
        </ul>
      </div>

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
              <i class="fas fa-envelope-open"></i>
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
        to="/dashboard"
        active-class="active"
      >
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </router-link>

      <router-link v-else class="bottom-nav-item" to="/login" active-class="active">
        <i class="fas fa-sign-in-alt"></i>
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

const router = useRouter()
const auth = getAuth()

// State
const isAuthenticated = ref(false)
const currentUser = ref(null)
const userName = ref('User')
const userRole = ref(null)
const sidebarExpanded = ref(false)
const isSearchMode = ref(false)
const searchQuery = ref('')
const isNavbarVisible = ref(true)
const hasNotifications = ref(true)
const searchInput = ref(null)

// Computed
const userAvatar = computed(() => {
  if (currentUser.value?.photoURL) {
    return currentUser.value.photoURL
  }
  const name = userName.value || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=007bff&color=ffffff`
})

const isAdmin = computed(() => userRole.value === 'admin')

const roleDisplay = computed(() => {
  if (userRole.value === 'admin') return 'Admin'
  return 'User'
})

const roleClass = computed(() => {
  if (userRole.value === 'admin') return 'bg-warning text-dark'
  return 'bg-primary'
})

// Methods
const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value
  localStorage.setItem('sidebarExpanded', sidebarExpanded.value)
  window.dispatchEvent(
    new CustomEvent('sidebar-state-changed', {
      detail: { isExpanded: sidebarExpanded.value },
    }),
  )
}

const enterSearchMode = () => {
  isSearchMode.value = true
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const exitSearchMode = () => {
  isSearchMode.value = false
  searchQuery.value = ''
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const loadUserProfile = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      userName.value = userData.displayName || user.displayName || 'User'
      userRole.value = userData.role || 'user'
    } else {
      userName.value = user.displayName || 'User'
      userRole.value = 'user'
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
    userName.value = user.displayName || 'User'
    userRole.value = 'user'
  }
}

// Lifecycle
onMounted(() => {
  const savedState = localStorage.getItem('sidebarExpanded')
  if (savedState !== null) {
    sidebarExpanded.value = savedState === 'true'
  }

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
</script>

<style scoped>
/* ... 既存のスタイルをそのまま保持 ... */
/* トップナビゲーション */
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

.navbar-brand {
  text-decoration: none;
  font-size: 1.25rem;
}

.notification-badge {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  width: 0.5em;
  height: 0.5em;
  background-color: #ff0000;
  border-radius: 50%;
}

/* サイドバー */
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

.nav-divider {
  height: 1px;
  background-color: #e5e5e5;
  margin: 0.75em 0;
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
</style>
