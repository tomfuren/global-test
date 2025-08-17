
import { createRouter, createWebHistory } from 'vue-router'

// Lazy loading でコンポーネントをインポート
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Recipes = () => import('../views/Recipes.vue')
const Groups = () => import('../views/Groups.vue')
const Events = () => import('../views/Events.vue')
const Profile = () => import('../views/Profile.vue')
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
        guest: true // 認証済みユーザーはアクセス不可
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
        title: 'Register - Global Plate',
        requiresAuth: false,
        guest: true // 認証済みユーザーはアクセス不可
        }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
        title: 'Dashboard- Global Plate',
        requiresAuth: true
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
        requiresAuth: true
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
        requiresAuth: true
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

// 認証状態チェック（後でFirebase Authと連携）
function isAuthenticated() {
  // TODO: Firebase Auth実装後に置き換え
  return localStorage.getItem('isAuthenticated') === 'true'
}

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  // ページタイトル設定
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 認証が必要なページの処理
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 認証済みユーザーがゲストページにアクセスした場合
  if (to.meta.guest && isAuthenticated()) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router