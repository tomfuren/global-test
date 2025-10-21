// =============================================================================
// Vue Router Configuration - Application routing and navigation
// Vue Router設定 - アプリケーションのルーティングとナビゲーション
//
// This file configures all application routes with authentication guards,
// lazy loading for performance optimization, and meta information.
// このファイルは、認証ガード、パフォーマンス最適化のための遅延読み込み、
// メタ情報を含むすべてのアプリケーションルートを設定します。
//
// Features / 機能:
// - Route definitions with lazy loading / 遅延読み込み付きルート定義
// - Authentication guards (requiresAuth) / 認証ガード
// - Admin role-based access control / 管理者ロールベースアクセス制御
// - Guest-only routes (login/register) / ゲスト専用ルート
// - Page title management / ページタイトル管理
// - Scroll behavior configuration / スクロール動作設定
// - 404 error handling / 404エラーハンドリング
//
// Performance Optimization / パフォーマンス最適化:
// - Lazy loading components reduce initial bundle size
// - 遅延読み込みコンポーネントで初期バンドルサイズを削減
// - Code splitting for better load times
// - より良い読み込み時間のためのコード分割
//
// BR References / BR参照:
// - BR (C.1): Firebase Authentication - User authentication and session management
// - BR (C.2): Role-based authentication - Admin access control
// - BR (D.2): Email sending feature routing
// - BR (E.2): Geo location feature routing
// - BR (F.1): Innovation
//             - Calender
// =============================================================================

import { createRouter, createWebHistory } from 'vue-router'

// BR (C.1): Firebase Authentication Import
// BR (C.1): Firebase認証インポート
// Required for route guards to verify authentication state
// ルートガードで認証状態を確認するために必要
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// =============================================================================
// Lazy Loading Component Imports / 遅延読み込みコンポーネントインポート
// =============================================================================

/**
 * Performance Optimization: Lazy Loading
 * パフォーマンス最適化: 遅延読み込み
 *
 * Components are loaded only when needed, reducing initial bundle size
 * コンポーネントは必要な時のみ読み込まれ、初期バンドルサイズを削減
 *
 * Benefits / 利点:
 * - Faster initial page load / より速い初期ページ読み込み
 * - Better user experience on slow connections / 低速接続でのより良いユーザー体験
 * - Efficient resource utilization / 効率的なリソース利用
 */

// Public pages / 公開ページ
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')

// Authenticated user pages / 認証済みユーザーページ
const Dashboard = () => import('../views/Dashboard.vue')
const Profile = () => import('../views/Profile.vue')

// BR (C.2): Admin-only pages / 管理者専用ページ
const AdminDashboard = () => import('../views/AdminDashboard.vue')
const ManageUsers = () => import('../views/ManageUsers.vue')

// Content pages / コンテンツページ
const Recipes = () => import('../views/Recipes.vue')
const RecipeDetail = () => import('../views/RecipeDetail.vue')
const Groups = () => import('../views/Groups.vue')
const Events = () => import('../views/Events.vue')

// Legal pages / 法的ページ
const TermsOfService = () => import('../views/TermsOfService.vue')
const PrivacyPolicy = () => import('../views/PrivacyPolicy.vue')

// Error pages / エラーページ
const NotFound = () => import('../views/NotFound.vue')

// BR (D.2): Email feature page / メール機能ページ
const SendEmail = () => import('../views/SendEmail.vue')

// BR (E.2): Geo location feature page / 地理位置情報機能ページ
const GeoLocation = () => import('../views/GeoLocation.vue')

// Calendar feature page (eager loading) / カレンダー機能ページ（即時読み込み）
import EventsCalendar from '@/views/EventsCalendar.vue'

// =============================================================================
// Route Definitions / ルート定義
// =============================================================================

/**
 * Application routes with meta information
 * メタ情報付きアプリケーションルート
 *
 * Meta properties / メタプロパティ:
 * - title: Page title for SEO and browser tab / SEOとブラウザタブ用のページタイトル
 * - requiresAuth: Requires user authentication / ユーザー認証が必要
 * - requiresAdmin: Requires admin role / 管理者ロールが必要
 * - guest: Only accessible to non-authenticated users / 未認証ユーザーのみアクセス可能
 */
const routes = [
  // =========================================================================
  // Public Routes / 公開ルート
  // =========================================================================

  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title:
        'Global Plate - A nutritional food community that connects international students with the world',
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login - Global Plate',
      requiresAuth: false,
      guest: true, // Redirects to dashboard if already authenticated / 既に認証済みの場合はダッシュボードにリダイレクト
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Register - Global Plate',
      requiresAuth: false,
      guest: true, // Redirects to dashboard if already authenticated / 既に認証済みの場合はダッシュボードにリダイレクト
    },
  },

  // =========================================================================
  // Content Routes (Mixed Access) / コンテンツルート（混合アクセス）
  // =========================================================================

  {
    path: '/recipes',
    name: 'Recipes',
    component: Recipes,
    meta: {
      title: 'Recipes - Global Plate',
      requiresAuth: false, // Public access / 公開アクセス
    },
  },
  {
    path: '/recipes/:id',
    name: 'RecipeDetail',
    component: RecipeDetail,
    meta: {
      title: 'Recipe Details - Global Plate',
      requiresAuth: false, // Public access / 公開アクセス
    },
  },
  {
    path: '/events',
    name: 'Events',
    component: Events,
    meta: {
      title: 'Events - Global Plate',
      requiresAuth: false, // Public access / 公開アクセス
    },
  },

  // =========================================================================
  // Authenticated User Routes / 認証済みユーザールート
  // =========================================================================

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - Global Plate',
      requiresAuth: true, // Requires authentication / 認証が必要
    },
  },
  {
    path: '/groups',
    name: 'Groups',
    component: Groups,
    meta: {
      title: 'Groups - Global Plate',
      requiresAuth: true, // Requires authentication / 認証が必要
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profile - Global Plate',
      requiresAuth: true, // Requires authentication / 認証が必要
    },
  },

  // =========================================================================
  // BR (D.2): Email Feature Route / メール機能ルート
  // =========================================================================

  {
    path: '/send-email',
    name: 'SendEmail',
    component: SendEmail,
    meta: {
      title: 'Send Email - Global Plate',
      requiresAuth: true, // Requires authentication / 認証が必要
    },
  },

  // =========================================================================
  // BR (E.2): Geo Location Feature Route / 地理位置情報機能ルート
  // =========================================================================

  {
    path: '/geo-location',
    name: 'GeoLocation',
    component: GeoLocation,
    meta: {
      title: 'Restaurant Finder - Global Plate',
      requiresAuth: true, // Requires authentication / 認証が必要
    },
  },

  // =========================================================================
  // BR (F.1): Innovation Calendar Feature Route / カレンダー機能ルート
  // =========================================================================

  {
    path: '/events-calendar',
    name: 'EventsCalendar',
    component: EventsCalendar,
    meta: {
      title: 'Events Calendar - Global Plate',
      requiresAuth: true, // Authenticated users only / 認証済みユーザーのみアクセス可能
    },
  },

  // =========================================================================
  // BR (C.2): Admin Routes (Role-based Access) / 管理者ルート（ロールベースアクセス）
  // =========================================================================

  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      title: 'Admin Dashboard - Global Plate',
      requiresAuth: true, // Requires authentication / 認証が必要
      requiresAdmin: true, // Admin role required / 管理者ロールが必要
    },
  },
  {
    path: '/admin/users',
    name: 'ManageUsers',
    component: ManageUsers,
    meta: {
      title: 'Manage Users - Global Plate',
      requiresAuth: true, // Requires authentication / 認証が必要
      requiresAdmin: true, // Admin role required / 管理者ロールが必要
    },
  },

  // =========================================================================
  // Legal and Static Pages / 法的および静的ページ
  // =========================================================================

  {
    path: '/terms',
    name: 'TermsOfService',
    component: TermsOfService,
    meta: {
      title: 'Terms of Service - Global Plate',
    },
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: {
      title: 'Privacy Policy - Global Plate',
    },
  },

  // =========================================================================
  // 404 Error Route (Catch-all) / 404エラールート（キャッチオール）
  // =========================================================================

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'NotFound - Global Plate',
    },
  },
]

// =============================================================================
// Router Instance Creation / ルーターインスタンス作成
// =============================================================================

/**
 * Create Vue Router instance with configuration
 * 設定を使用してVue Routerインスタンスを作成
 *
 * Uses HTML5 History mode for clean URLs without hash
 * ハッシュなしのクリーンなURLのためにHTML5 Historyモードを使用
 */
const router = createRouter({
  history: createWebHistory(),
  routes,

  /**
   * Scroll behavior configuration
   * スクロール動作設定
   *
   * Controls page scroll position on navigation
   * ナビゲーション時のページスクロール位置を制御
   *
   * - Returns to saved position when using browser back/forward
   * - ブラウザの戻る/進むを使用時は保存された位置に戻る
   * - Scrolls to top for new page navigation
   * - 新しいページナビゲーションではトップにスクロール
   */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// =============================================================================
// Authentication Helper Function / 認証ヘルパー関数
// =============================================================================

/**
 * BR (C.1): Get current authenticated user
 * BR (C.1): 現在の認証済みユーザーを取得
 *
 * Returns a Promise that resolves with the current Firebase user
 * 現在のFirebaseユーザーで解決するPromiseを返す
 *
 * This function waits for Firebase Auth to initialize before resolving
 * この関数はFirebase Authの初期化を待ってから解決します
 *
 * @returns {Promise<User|null>} Current user or null if not authenticated
 * @returns {Promise<User|null>} 現在のユーザーまたは未認証の場合はnull
 */
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe() // Clean up listener after first callback / 最初のコールバック後にリスナーをクリーンアップ
        resolve(user)
      },
      reject,
    )
  })
}

// =============================================================================
// Navigation Guards / ナビゲーションガード
// =============================================================================

/**
 * Global before navigation guard
 * グローバルナビゲーション前ガード
 *
 * Executes before every route navigation to:
 * すべてのルートナビゲーションの前に実行して以下を行う:
 *
 * 1. Set page title from route meta / ルートメタからページタイトルを設定
 * 2. Check authentication requirements / 認証要件をチェック
 * 3. Redirect unauthenticated users to login / 未認証ユーザーをログインにリダイレクト
 * 4. Redirect authenticated users away from guest pages / 認証済みユーザーをゲストページから離す
 *
 * BR (C.1): Firebase Authentication integration
 * BR (C.1): Firebase認証統合
 */
router.beforeEach(async (to, from, next) => {
  // -------------------------------------------------------------------------
  // Page Title Management / ページタイトル管理
  // -------------------------------------------------------------------------

  /**
   * Set document title from route meta
   * ルートメタからドキュメントタイトルを設定
   *
   * Improves SEO and user experience
   * SEOとユーザー体験を向上
   */
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // -------------------------------------------------------------------------
  // BR (C.1): Authentication State Check / 認証状態チェック
  // -------------------------------------------------------------------------

  /**
   * Get current authenticated user from Firebase
   * Firebaseから現在の認証済みユーザーを取得
   *
   * Waits for Firebase Auth initialization to complete
   * Firebase Auth初期化の完了を待つ
   */
  const currentUser = await getCurrentUser()

  // -------------------------------------------------------------------------
  // Protected Routes Guard / 保護されたルートガード
  // -------------------------------------------------------------------------

  /**
   * Redirect to login if authentication required but user not logged in
   * 認証が必要だがユーザーがログインしていない場合、ログインにリダイレクト
   *
   * Preserves intended destination in query parameter for redirect after login
   * ログイン後のリダイレクトのため、意図した宛先をクエリパラメータに保存
   */
  if (to.meta.requiresAuth && !currentUser) {
    console.log('Authentication required, redirecting to login')
    next({
      name: 'Login',
      query: { redirect: to.fullPath }, // Save redirect path / リダイレクトパスを保存
    })
    return
  }

  // -------------------------------------------------------------------------
  // Guest Routes Guard / ゲストルートガード
  // -------------------------------------------------------------------------

  /**
   * Redirect to dashboard if authenticated user tries to access guest pages
   * 認証済みユーザーがゲストページにアクセスしようとした場合、ダッシュボードにリダイレクト
   *
   * Prevents logged-in users from seeing login/register pages
   * ログイン済みユーザーがログイン/登録ページを見るのを防ぐ
   */
  if (to.meta.guest && currentUser) {
    console.log('Already authenticated, redirecting to dashboard')
    next({ name: 'Dashboard' })
    return
  }

  // -------------------------------------------------------------------------
  // Allow Navigation / ナビゲーションを許可
  // -------------------------------------------------------------------------

  /**
   * All checks passed, proceed with navigation
   * すべてのチェックに合格、ナビゲーションを続行
   */
  next()
})

// =============================================================================
// Export Router Instance / ルーターインスタンスをエクスポート
// =============================================================================

export default router
