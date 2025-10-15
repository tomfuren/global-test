import { createRouter, createWebHistory } from 'vue-router'
// BR (D.1): Firebase Authentication のインポート
// ルートガードで認証状態を確認するために必要
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Lazy loading でコンポーネントをインポート
// パフォーマンス向上のため、必要になったタイミングでコンポーネントを読み込む
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Recipes = () => import('../views/Recipes.vue')
const Groups = () => import('../views/Groups.vue')
const Events = () => import('../views/Events.vue')
const Profile = () => import('../views/Profile.vue')
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
      guest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Register - Global Plate',
      requiresAuth: false,
      guest: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - Global Plate',
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

// Firebase Authentication 状態を取得する関数
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

// ナビゲーションガード
router.beforeEach(async (to, from, next) => {
  // ページタイトル設定
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Firebase Authentication の現在のユーザーを取得
  const currentUser = await getCurrentUser()

  // 認証が必要なページの処理
  if (to.meta.requiresAuth && !currentUser) {
    console.log('Authentication required, redirecting to login')
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 認証済みユーザーがゲストページ(Login/Register)にアクセスした場合
  if (to.meta.guest && currentUser) {
    console.log('Already authenticated, redirecting to dashboard')
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router