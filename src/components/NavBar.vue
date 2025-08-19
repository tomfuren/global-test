<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div class="container">
            <!-- ブランドロゴ -->
            <router-link class="navbar-brand fw-bold text-primary" to="/">
                <i class="fas fa-globe me-2"></i>
                Global Plate
            </router-link>

            <!-- モバイルトグルボタン -->
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- ナビゲーションメニュー -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <!-- パブリックページ -->
                    <li class="nav-item">
                        <router-link class="nav-link" to="/" exact-active-class="active">
                            Home
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/recipes" active-class="active">
                            Recipe
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/events" active-class="active">
                            Event
                        </router-link>
                    </li>

                    <!-- 認証済みユーザー限定 -->
                    <template v-if="isAuthenticated">
                        <li class="nav-item">
                        <router-link class="nav-link" to="/dashboard" active-class="active">
                            Dashboard
                        </router-link>
                        </li>
                        <li class="nav-item">
                        <router-link class="nav-link" to="/groups" active-class="active">
                            Group
                        </router-link>
                        </li>
                    </template>
                </ul>

                <!-- 右側メニュー -->
                <ul class="navbar-nav">
                    <!-- 未認証ユーザー -->
                    <template v-if="!isAuthenticated">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/login">
                                Log in
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="btn btn-primary ms-2" to="/register">
                                Registration
                            </router-link>
                        </li>
                    </template>

                    <!-- 認証済みユーザー -->
                    <template v-else>
                        <!-- 通知アイコン -->
                        <li class="nav-item dropdown">
                            <a
                                class="nav-link position-relative"
                                href="#"
                                id="notificationDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i class="fas fa-bell"></i>
                                <span v-if="hasNotifications" class="notification-badge"></span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                                <li><h6 class="dropdown-header">notification</h6></li>
                                <li><a class="dropdown-item" href="#">New recipe posted</a></li>
                                <li><a class="dropdown-item" href="#">The event is approaching</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-center" href="#">See All</a></li>
                            </ul>
                        </li>

                        <!-- プロフィールドロップダウン -->
                        <li class="nav-item dropdown">
                            <a
                                class="nav-link dropdown-toggle d-flex align-items-center"
                                href="#"
                                id="profileDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <img
                                :src="userAvatar"
                                alt="profile"
                                class="rounded-circle me-2"
                                width="32"
                                height="32"
                                >
                                {{ userName }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                <li>
                                    <router-link class="dropdown-item" to="/profile">
                                        <i class="fas fa-user me-2"></i>Profile
                                    </router-link>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#">
                                        <i class="fas fa-cog me-2"></i>Setting
                                    </a>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <a class="dropdown-item text-danger" href="#" @click="handleLogout">
                                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()

    const hasNotifications = ref(true)
    const currentUser = ref(null)

    // LocalStorageから現在のユーザーを読み込み
    onMounted(() => {
    currentUser.value = JSON.parse(localStorage.getItem('currentUser'))
    })

    const isAuthenticated = computed(() => {
    return !!currentUser.value
    })

    const userName = computed(() => {
    if (!currentUser.value) return 'Guest'
    return `${currentUser.value.firstName} ${currentUser.value.lastName}`.trim()
    })

    const userAvatar = computed(() => {
    if (currentUser.value) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&size=32&background=007bff&color=ffffff`
    }
    return 'https://ui-avatars.com/api/?name=Guest&size=32&background=6c757d&color=ffffff'
    })

    const handleLogout = () => {
    localStorage.removeItem('currentUser')
    currentUser.value = null
    
    // ダッシュボードページにいる場合はホームにリダイレクト
    if (route.meta.requiresAuth) {
        router.push('/')
    }
    
    console.log('ログアウト完了')
    }

// Firebase用のログイン機能を一旦、コメントアウト
// export default {
//   name: 'NavBar',
//   data() {
//     return {
//       hasNotifications: true // TODO: 実際の通知状態と連携
//     }
//   },
//   computed: {
//     isAuthenticated() {
//       // TODO: Firebase Auth実装後に置き換え
//       return localStorage.getItem('isAuthenticated') === 'true'
//     },
//     userName() {
//       // TODO: Firebase Authから実際のユーザー名を取得
//       return 'UserName'
//     },
//     userAvatar() {
//       // TODO: Firebase Authから実際のアバターを取得
//       return 'https://via.placeholder.com/32x32?text=U'
//     }
//   },
//   methods: {
//     async handleLogout() {
//       try {
//         // TODO: Firebase Auth logout実装
//         localStorage.removeItem('isAuthenticated')
        
//         // ダッシュボードページにいる場合はホームにリダイレクト
//         if (this.$route.meta.requiresAuth) {
//           this.$router.push('/')
//         }
        
//         console.log('ログアウト完了')
//       } catch (error) {
//         console.error('ログアウトエラー:', error)
//       }
//     }
//   }
// }
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}

.nav-link.active {
  color: #007bff !important;
  font-weight: 500;
}

.btn-primary {
  border-radius: 20px;
  padding: 0.375rem 1rem;
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: #dc3545;
  border-radius: 50%;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

@media (max-width: 991.98px) {
  .navbar-nav .btn {
    margin-top: 0.5rem;
    margin-left: 0 !important;
  }
}
</style>