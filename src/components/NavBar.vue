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

<script setup>
    import { ref, computed, onMounted, onUnmounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    // ルーターの初期化
    const router = useRouter()
    const route = useRoute()

    // 通知の有無を管理する状態（現在は固定値、将来的に動的に変更予定）
    const hasNotifications = ref(true)
    const currentUser = ref(null)

    // LocalStorageから現在のユーザーを読み込み
    const loadCurrentUser = () => {
        try {
            // LocalStorageからユーザーデータを取得
            const userData = localStorage.getItem('currentUser')

            // データが存在する場合はJSONパースして設定、なければnull
            currentUser.value = userData ? JSON.parse(userData) : null

            console.log('Current user loaded:', currentUser.value)
        } catch (error) {
            // JSONパースエラーなどの場合のエラーハンドリング
            console.error('Error loading current user:', error)
            currentUser.value = null
        }
    }

    // 認証状態の変更を監視する関数
    const handleAuthChange = () => {
        console.log('Auth change detected')
        // 他の画面やタブでログイン/ログアウトが発生した時に最新のユーザー情報を再読み込みしてNavBarを更新
        loadCurrentUser()
    }

    // onMounted(): コンポーネントが画面に表示された時の初期化処理
    // 初期読み込みとイベントリスナーの設定
    onMounted(() => {
        // 初回読み込み: LocalStorageからユーザー情報を取得
        loadCurrentUser()
        
        // カスタムイベントリスナーを追加
        // Login.vueやLogout処理で発火される'auth-changed'イベントを監視
        window.addEventListener('auth-changed', handleAuthChange)
        
        // storage イベントリスナーも追加（他のタブでの変更を検知）
        window.addEventListener('storage', handleAuthChange)
    })

    // onUnmounted(): コンポーネントが削除される時のクリーンアップ処理
    // クリーンアップ
    onUnmounted(() => {
        // メモリリーク防止のため、追加したイベントリスナーを削除
        window.removeEventListener('auth-changed', handleAuthChange)
        window.removeEventListener('storage', handleAuthChange)
    })

    // computed(): currentUserの状態に基づいて自動計算される値
    // ユーザーがログインしているかどうかを判定
    // currentUser.valueがnull以外の値を持っている場合にtrue
    const isAuthenticated = computed(() => {
        return !!currentUser.value
    })

    // ナビゲーションバーに表示するユーザー名を生成
    const userName = computed(() => {
        // ログインしていない場合は'Guest'を表示
        if (!currentUser.value) return 'Guest'

        // ファーストネームとラストネームを結合、空の場合はemailを使用
        return `${currentUser.value.firstName} ${currentUser.value.lastName}`.trim() || currentUser.value.email
    })

    // ユーザーのイニシャルを生成（アバター表示などで使用予定）
    const userInitials = computed(() => {
        if (!currentUser.value) return 'G' // Guestの場合は'G'

        // ファーストネームとラストネームの最初の文字を取得
        const first = currentUser.value.firstName?.charAt(0) || ''
        const last = currentUser.value.lastName?.charAt(0) || ''

        // 両方の文字を大文字で結合、なければemailの最初の文字を使用
        return (first + last).toUpperCase() || currentUser.value.email?.charAt(0).toUpperCase()
    })

    // プロフィール画像のURLを動的生成
    const userAvatar = computed(() => {
    if (currentUser.value) {
        // ログイン済み: UI Avatars APIを使用してユーザー名から画像生成
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&size=32&background=007bff&color=ffffff`
    }
    // 未ログイン: ゲスト用の画像を生成
    return 'https://ui-avatars.com/api/?name=Guest&size=32&background=6c757d&color=ffffff'
    })

    // ログアウト処理
    const handleLogout = () => {
        // LocalStorageからユーザー情報を削除
        localStorage.removeItem('currentUser')

        // コンポーネント内の状態をクリア
        currentUser.value = null
        
        // 他のコンポーネントに認証状態変更を通知
        // 認証状態変更イベントを発火
        window.dispatchEvent(new Event('auth-changed'))
        
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