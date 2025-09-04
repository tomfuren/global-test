
import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from '../firebase/init'

// Lazy loading でコンポーネントをインポート
// Import the component with lazy loading
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Recipes = () => import('../views/Recipes.vue')
const Groups = () => import('../views/Groups.vue')
const Events = () => import('../views/Events.vue')
const Profile = () => import('../views/Profile.vue')
const AdminDashboard = () => import('../views/AdminDashboard.vue')
const ManageUsers = () => import('../views/ManageUsers.vue')
const TermsOfService = () => import('../views/TermsOfService.vue')
const PrivacyPolicy = () => import('../views/PrivacyPolicy.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Global Plate - A nutritional food community that connects international students with the world',
            requiresAuth: false
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: 'Login - Global Plate',
            requiresAuth: false,
            // No access for authenticated users
            requiresGuest: true // 認証済みユーザーはアクセス不可
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: 'Register - Global Plate',
            requiresAuth: false,
            // No access for authenticated users
            requiresGuest: true // 認証済みユーザーはアクセス不可
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
            title: 'Dashboard- Global Plate',
            // No access for authenticated users
            requiresAuth: true // 認証済みユーザーはアクセス不可
        }
    },
    {
        path: '/recipes',
        name: 'Recipes',
        component: Recipes,
        meta: {
            title: 'Recipes - Global Plate',
            requiresAuth: false
        }
    },
    {
        path: '/groups',
        name: 'Groups',
        component: Groups,
        meta: {
            title: 'Groups - Global Plate',
            // No access for authenticated users
            requiresAuth: true // 認証済みユーザーはアクセス不可
        }
    },
    {
        path: '/events',
        name: 'Events',
        component: Events,
        meta: {
            title: 'Events - Global Plate',
            requiresAuth: false
        }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
            title: 'Profile - Global Plate',
            // No access for authenticated users
            requiresAuth: true // 認証済みユーザーはアクセス不可
        }
    },
    // 管理者専用ルート - BR (C.2): Role-based authentication
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
            title: 'Admin Dashboard - Global Plate',
            requiresAuth: true,
            requiresRole: 'admin' // 管理者権限が必要
        }
    },
    {
        path: '/admin/users',
        name: 'ManageUsers',
        component: ManageUsers,
        meta: {
            title: 'Manage Users - Global Plate',
            requiresAuth: true,
            requiresRole: 'admin' // 管理者権限が必要
        }
    },
    {
        path: '/terms',
        name: 'TermsOfService',
        component: TermsOfService,
            meta: {
            title: 'Terms of Service - Global Plate'
        }
    },
    {
        path: '/privacy',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy,
            meta: {
            title: 'Privacy Policy - Global Plate'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: {
            title: 'NotFound - Global Plate'
        }
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})


// // LocalStorageの認証チェック。これはもう要らない。
// // LocalStorage authentication check
// function isAuthenticated() {
//   try {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'))
//     return !!currentUser
//   } catch {
//     return false
//   }
// }

// Firebase認証の現在のユーザーを取得
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            getAuth(),
            (user) => {
                unsubscribe()
                resolve(user)
            },
            reject
        )
    })
}

// Firestoreからユーザーの役割を取得
const getUserRole = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid))
        if (userDoc.exists()) {
            return userDoc.data().role || 'user' // デフォルトは'user'
        }
        return 'user'
    } catch (error) {
        console.error('Error getting user role:', error)
        return 'user'
    }
}


// ナビゲーションガード
// Navigation guard
// ナビゲーションガード（Firebase認証対応 + 役割ベース対応）
router.beforeEach(async (to, from, next) => {
    try {
        // ページタイトル設定
        if (to.meta.title) {
            document.title = to.meta.title
        }

        // Firebase認証状態を取得
        const currentUser = await getCurrentUser()
        const isAuthenticated = !!currentUser

        console.log(`Navigating to: ${to.path}`)
        console.log(`Is authenticated: ${isAuthenticated}`)

        // 認証が必要なルートへのアクセス
        if (to.meta.requiresAuth && !isAuthenticated) {
            console.log('Redirecting to login: Authentication required')
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
            return
        }

        // ゲスト専用ルート（ログイン済みユーザーのアクセス制限）
        if (to.meta.requiresGuest && isAuthenticated) {
            console.log('Redirecting to dashboard: User already authenticated')
            next('/dashboard')
            return
        }

        // 役割ベースのアクセス制御 - BR (C.2): Role-based authentication
        if (to.meta.requiresRole && isAuthenticated) {
            const userRole = await getUserRole(currentUser.uid)
            console.log(`User role: ${userRole}`)
            console.log(`Required role: ${to.meta.requiresRole}`)

            if (userRole !== to.meta.requiresRole) {
                console.log('Access denied: Insufficient role permissions')
                // 権限不足の場合、ダッシュボードにリダイレクト
                next({
                    path: '/dashboard',
                    query: { error: 'access-denied' }
                })
                return
            }
        }

        // 通常のルートアクセス
        next()

    } catch (error) {
        console.error('Route guard error:', error)
        
        // エラー時の処理
        if (to.meta.requiresAuth) {
            next('/login')
        } else {
            next()
        }
    }
})

export default router