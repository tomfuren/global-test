/**
 * main.js - Application entry point and configuration
 * main.js - アプリケーションのエントリーポイントと設定
 *
 * Features / 機能:
 * - Vue application initialization / Vueアプリケーションの初期化
 * - Router configuration / ルーター設定
 * - Bootstrap integration / Bootstrap統合
 * - PrimeVue integration and component registration / PrimeVue統合とコンポーネント登録
 * - Firebase initialization / Firebase初期化
 * - Global error handling / グローバルエラーハンドリング
 * - Development environment configuration / 開発環境設定
 *
 * BR (D.3): Interactive Table Data - PrimeVue DataTable registration
 * BR (D.3): インタラクティブなテーブルデータ - PrimeVue DataTableの登録
 * Registers PrimeVue components for advanced table functionality
 * 高度なテーブル機能のためのPrimeVueコンポーネントを登録
 *
 * Dependencies / 依存関係:
 * - Vue 3 / Vue 3
 * - Vue Router / Vue Router
 * - Bootstrap 5 / Bootstrap 5
 * - PrimeVue / PrimeVue
 * - Firebase / Firebase
 */

// ============================================================================
// Core Imports / コアインポート
// ============================================================================
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ============================================================================
// Bootstrap Integration / Bootstrap統合
// CSS and JavaScript imports for Bootstrap 5
// Bootstrap 5用のCSSとJavaScriptインポート
// ============================================================================
import 'bootstrap/dist/css/bootstrap.css' // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Bootstrap JavaScript (includes Popper.js)

// ============================================================================
// BR (D.3): PrimeVue Integration / PrimeVue統合
// Advanced UI component library for Vue 3
// Vue 3用の高度なUIコンポーネントライブラリ
// ============================================================================
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura' // PrimeVue Aura theme

// PrimeVue Component Imports / PrimeVueコンポーネントインポート
// BR (D.3): DataTable and Column for interactive table functionality
// BR (D.3): インタラクティブなテーブル機能用のDataTableとColumn
import Card from 'primevue/card' // Card component for content containers / コンテンツコンテナ用カードコンポーネント
import DataTable from 'primevue/datatable' // Advanced data table / 高度なデータテーブル
import Column from 'primevue/column' // Table column definition / テーブルカラム定義
import Panel from 'primevue/panel' // Collapsible panel / 折りたたみパネル
import Badge from 'primevue/badge' // Badge for notifications / 通知用バッジ
import Avatar from 'primevue/avatar' // User avatar / ユーザーアバター
import AvatarGroup from 'primevue/avatargroup' // Grouped avatars / グループ化されたアバター
import Button from 'primevue/button' // Button component / ボタンコンポーネント
import ProgressBar from 'primevue/progressbar' // Progress indicator / 進捗インジケーター
import Tag from 'primevue/tag' // Tag component / タグコンポーネント

// ============================================================================
// Firebase Integration / Firebase統合
// Initializes Firebase services (Authentication, Firestore, etc.)
// Firebaseサービス（認証、Firestore等）を初期化
// ============================================================================
// Note: Currently using LocalStorage in some places, but Firebase is initialized for future use
// 注: 現在一部でLocalStorageを使用していますが、将来の使用のためにFirebaseを初期化します
import './firebase/init.js'

// ============================================================================
// Application Creation / アプリケーション作成
// ============================================================================
const app = createApp(App)

// ============================================================================
// BR (D.3): PrimeVue Configuration / PrimeVue設定
// Configure PrimeVue with Aura theme and custom options
// Auraテーマとカスタムオプションを使用してPrimeVueを設定
// ============================================================================
app.use(PrimeVue, {
  theme: {
    preset: Aura, // Use Aura theme preset / Auraテーマプリセットを使用
    options: {
      prefix: 'p', // Component prefix / コンポーネントプレフィックス
      darkModeSelector: 'none', // Disable dark mode / ダークモードを無効化
      cssLayer: false, // Disable CSS layers / CSSレイヤーを無効化
    },
  },
})

// ============================================================================
// BR (D.3): PrimeVue Component Registration / PrimeVueコンポーネント登録
// Register PrimeVue components globally for use throughout the application
// アプリケーション全体で使用するためにPrimeVueコンポーネントをグローバルに登録
// ============================================================================
app.component('Card', Card)
app.component('DataTable', DataTable) // BR (D.3): DataTable for interactive tables / インタラクティブテーブル用DataTable
app.component('Column', Column) // BR (D.3): Column for table structure / テーブル構造用Column
app.component('Panel', Panel)
app.component('Badge', Badge)
app.component('Avatar', Avatar)
app.component('AvatarGroup', AvatarGroup)
app.component('Button', Button)
app.component('ProgressBar', ProgressBar)
app.component('Tag', Tag)

// ============================================================================
// Router Configuration / ルーター設定
// Install Vue Router for application navigation
// アプリケーションナビゲーション用にVue Routerをインストール
// ============================================================================
app.use(router)

// ============================================================================
// Global Properties / グローバルプロパティ
// Define global properties accessible throughout the application
// アプリケーション全体でアクセス可能なグローバルプロパティを定義
// ============================================================================
app.config.globalProperties.$appName = 'Global Plate' // Application name / アプリケーション名
app.config.globalProperties.$version = '1.2.0' // Application version / アプリケーションバージョン

// ============================================================================
// Error Handling / エラーハンドリング
// Global error handler for Vue application errors
// Vueアプリケーションエラー用のグローバルエラーハンドラー
// ============================================================================
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Error Info:', info)
  // TODO: Send to error reporting service (e.g., Sentry, LogRocket)
  // TODO: エラーレポーティングサービスに送信（例: Sentry、LogRocket）
}

// ============================================================================
// Development Environment Configuration / 開発環境設定
// Enable performance tracking in development mode
// 開発モードでパフォーマンストラッキングを有効化
// ============================================================================
if (import.meta.env.DEV) {
  app.config.performance = true // Enable Vue performance tracking / Vueパフォーマンストラッキングを有効化
}

// ============================================================================
// Application Mount / アプリケーションマウント
// Mount the Vue application to the DOM element with id="app"
// id="app"のDOM要素にVueアプリケーションをマウント
// ============================================================================
app.mount('#app')
