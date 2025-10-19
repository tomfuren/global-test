<template>
  <!-- トップナビゲーションバー / Top Navigation Bar -->
  <nav class="top-navbar bg-white" :class="{ 'navbar-hidden': !isNavbarVisible }">
    <div class="container-fluid">
      <!-- 通常モード / Normal mode -->
      <template v-if="!isSearchMode">
        <!-- 左側セクション: メニューボタン + ロゴ/Left section: Menu button + logo -->
        <div class="navbar-left">
          <button class="btn btn-ghost me-3 d-none d-lg-block" @click="toggleSidebar">
            <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
            <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
            <i class="fas fa-bars" aria-hidden="true"></i>
          </button>

          <router-link class="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
            <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
            <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
            <i class="fas fa-globe me-2" aria-hidden="true"></i>
            <span class="brand-text">Global Plate</span>
          </router-link>
        </div>

        <!-- 中央セクション: 検索バー（デスクトップのみ）/Center section: Search bar (desktop only) -->
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
                <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                <i class="fas fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 右側セクション: ユーザーメニュー/Side section: User menu -->
        <div class="navbar-right">
          <button class="btn btn-ghost me-2 d-md-none" @click="enterSearchMode">
            <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
            <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
            <i class="fas fa-search" aria-hidden="true"></i>
          </button>

          <!-- 未認証ユーザー/Unauthenticated Users -->
          <template v-if="!isAuthenticated">
            <router-link class="btn btn-outline-primary btn-sm" to="/login"> Log in </router-link>
            <router-link
              class="btn btn-primary btn-sm ms-2 d-none d-sm-inline-block"
              to="/register"
            >
              Sign up
            </router-link>
          </template>

          <!-- 認証済みユーザー/Authenticated Users -->
          <template v-else>
            <!-- 通知ボタン（将来の実装用にコメントアウト） -->
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
                    <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                    <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                    <i class="fas fa-user me-2" aria-hidden="true"></i>Your Profile
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/dashboard">
                    <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                    <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                    <i class="fas fa-tachometer-alt me-2" aria-hidden="true"></i>Dashboard
                  </router-link>
                </li>
                <!--
                  BR (C.2): Role-based authentication - Admin専用メニュー
                  管理者ロールのユーザーのみ表示されるメニュー項目

                  BR (C.2): Role-based authentication - Admin-only menu
                  Menu items visible only to users with admin role
                -->
                <template v-if="isAdmin">
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <router-link class="dropdown-item text-warning" to="/admin">
                      <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                      <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                      <i class="fas fa-crown me-2" aria-hidden="true"></i>Admin Dashboard
                    </router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item text-warning" to="/admin/users">
                      <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                      <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                      <i class="fas fa-users-cog me-2" aria-hidden="true"></i>Manage Users
                    </router-link>
                  </li>
                </template>
                <li><hr class="dropdown-divider" /></li>
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

      <!-- 検索モード（モバイルのみ）/Search Mode (Mobile Only) -->
      <template v-else>
        <div class="search-mode-container d-flex align-items-center w-100">
          <button class="btn btn-ghost me-3" @click="exitSearchMode">
            <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
            <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
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

  <!-- サイドバー（デスクトップのみ）/ Sidebar (Desktop Only) -->
  <nav class="sidebar d-none d-lg-block" :class="{ 'sidebar-expanded': sidebarExpanded }">
    <div class="sidebar-content">
      <!-- 公開ページセクション -->
      <div class="nav-section">
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-home" aria-hidden="true"></i>
              <span class="nav-text">Home</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/recipes" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-utensils" aria-hidden="true"></i>
              <span class="nav-text">Recipes</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/events" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-calendar-alt" aria-hidden="true"></i>
              <span class="nav-text">Events</span>
            </router-link>
          </li>
          <!--
            BR (E.2): Geo Location - レストラン検索機能へのリンク
            地図ベースの機能を提供するページへのナビゲーション

            BR (E.2): Geo Location - Link to restaurant search feature
            Navigation to page providing map-based functionality
          -->
          <li class="nav-item">
            <router-link class="nav-link" to="/geo-location" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
              <span class="nav-text">Restaurant Finder</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 認証済みユーザー専用 / Authenticated users only -->
      <div v-if="isAuthenticated" class="nav-section">
        <div class="nav-divider"></div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
              <span class="nav-text">Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/groups" active-class="active">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-users" aria-hidden="true"></i>
              <span class="nav-text">Groups</span>
            </router-link>
          </li>
          <!--
            BR (D.2): Email - メール送信機能へのリンク
            添付ファイル付きメール送信ページへのナビゲーション

            BR (D.2): Email - Link to email sending feature
            Navigation to page for sending emails with attachments
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

      <!-- フッターセクション / footer section -->
      <div class="sidebar-footer">
        <div class="nav-divider"></div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link class="nav-link" to="/terms">
              <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
              <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
              <i class="fas fa-file-contract" aria-hidden="true"></i>
              <span class="nav-text">Terms</span>
            </router-link>
          </li>
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

  <!-- ボトムナビゲーション（モバイルのみ）/ bottom navigation for mobile -->
  <nav class="bottom-navbar d-lg-none">
    <div class="bottom-nav-container">
      <router-link class="bottom-nav-item" to="/" exact-active-class="active">
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-home" aria-hidden="true"></i>
        <span>Home</span>
      </router-link>

      <router-link class="bottom-nav-item" to="/recipes" active-class="active">
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-utensils" aria-hidden="true"></i>
        <span>Recipes</span>
      </router-link>

      <!-- BR (E.2): Geo Location - モバイルナビゲーション用の地図リンク -->
      <router-link class="bottom-nav-item" to="/geo-location" active-class="active">
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-map-marked-alt" aria-hidden="true"></i>
        <span>Map</span>
      </router-link>

      <router-link class="bottom-nav-item" to="/events" active-class="active">
        <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
        <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
        <i class="fas fa-calendar-alt" aria-hidden="true"></i>
        <span>Events</span>
      </router-link>

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

const router = useRouter()
const auth = getAuth()

// State
const isAuthenticated = ref(false)
const currentUser = ref(null)
const userName = ref('User')
// BR (C.2): Role-based authentication - ユーザーロール
// BR (C.2): Role-based authentication - User role
const userRole = ref(null)
const sidebarExpanded = ref(false)
const isSearchMode = ref(false)
const searchQuery = ref('')
const isNavbarVisible = ref(true)
const searchInput = ref(null)

// Computed
const userAvatar = computed(() => {
  // Google認証のphotoURLがある場合はそれを使用
  // Use Google-authenticated photo URL if available
  if (currentUser.value?.photoURL) {
    return currentUser.value.photoURL
  }

  // displayNameまたはuserNameから頭文字を取得
  // Get initials from displayName or userName
  let name = 'User'

  if (userName.value && userName.value !== 'User') {
    name = userName.value
  } else if (currentUser.value?.displayName) {
    name = currentUser.value.displayName
  } else if (currentUser.value?.email) {
    // メールアドレスから名前を生成
    // Generate a name from an email address
    name = currentUser.value.email.split('@')[0]
  }

  // UI Avatarsで頭文字のアバターを生成
  // Generate an initial avatar with UI Avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=007bff&color=ffffff&bold=true`
})

// BR (C.2): Role-based authentication - 管理者権限の判定
// BR (C.2): Role-based authentication - Check if user has admin role
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

/**
 * BR (C.2): Role-based authentication - Firestoreからユーザープロフィールとロールを取得
 * ユーザーのロール情報をFirestoreから読み込み、ナビゲーションメニューの表示を制御
 *
 * BR (C.2): Role-based authentication - Load user profile and role from Firestore
 * Load user role information from Firestore to control navigation menu display
 */
const loadUserProfile = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      userName.value = userData.displayName || user.displayName || 'User'
      // BR (C.2): ロールを取得
      // BR (C.2): Get user role
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
  // サイドバーの展開状態をlocalStorageから復元
  // Restore sidebar expansion state from localStorage
  const savedState = localStorage.getItem('sidebarExpanded')
  if (savedState !== null) {
    sidebarExpanded.value = savedState === 'true'
  }

  // Firebase認証状態の監視
  // Monitor Firebase authentication state
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
/* トップナビゲーション/ top navigation */
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

/* サイドバー/ side bar */
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

/*
  BR (E.3): Accessibility - フォーカス時の視覚的フィードバック強化
  キーボード操作時にフォーカスが明確に見えるようにアウトラインを追加

  BR (E.3): Accessibility - Enhanced visual feedback on focus
  Add outline to make focus clearly visible during keyboard navigation
*/
.btn-ghost:focus,
.nav-link:focus,
.bottom-nav-item:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style>
