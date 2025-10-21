<!--
  App.vue - Main application layout component
  App.vue - メインアプリケーションレイアウトコンポーネント

  Features / 機能:
  - Global application layout structure / グローバルアプリケーションレイアウト構造
  - Navigation bar integration / ナビゲーションバー統合
  - Responsive sidebar management / レスポンシブサイドバー管理
  - Footer integration / フッター統合
  - Router view for page content / ページコンテンツ用のルータービュー
  - Sidebar overlay for mobile / モバイル用サイドバーオーバーレイ

  BR (A.2): Responsiveness - Responsive design for desktop, tablet, and mobile
  BR (A.2): レスポンシブ対応 - デスクトップ、タブレット、モバイル向けのレスポンシブデザイン
  - Desktop: Sidebar navigation with collapsible functionality
    デスクトップ: 折りたたみ可能なサイドバーナビゲーション
  - Tablet: Top navigation bar / トップナビゲーションバー
  - Mobile: Bottom navigation bar / ボトムナビゲーションバー

  Layout Structure / レイアウト構造:
  - NavBar (top) / ナビゲーションバー（上部）
  - Sidebar (desktop, left side) / サイドバー（デスクトップ、左側）
  - Main content area / メインコンテンツエリア
  - Footer / フッター
-->

<template>
  <div id="app">
    <!--
      Navigation Bar / ナビゲーションバー
      Top navigation component visible on all screen sizes
      すべての画面サイズで表示されるトップナビゲーションコンポーネント
    -->
    <NavBar />

    <!--
      Overlay (Sidebar Background Darken) / オーバーレイ（サイドバー展開時の背景暗化）
      BR (A.2): Responsiveness - Darkens background when sidebar is expanded on mobile
      BR (A.2): レスポンシブ対応 - モバイルでサイドバー展開時に背景を暗くする

      Clicking the overlay closes the sidebar
      オーバーレイをクリックするとサイドバーが閉じる
    -->
    <div
      v-if="sidebarExpanded"
      class="sidebar-overlay"
      @click="closeSidebar"
      role="button"
      aria-label="Close sidebar"
      tabindex="0"
      @keydown.enter="closeSidebar"
      @keydown.space.prevent="closeSidebar"
    ></div>

    <!--
      Main Content Area / メインコンテンツエリア
      BR (A.2): Responsiveness - Adjusts layout based on screen size
      BR (A.2): レスポンシブ対応 - 画面サイズに基づいてレイアウトを調整

      Contains router-view for page content
      ページコンテンツ用のルータービューを含む
    -->
    <main class="main-content">
      <router-view />
    </main>

    <!--
      Footer Component / フッターコンポーネント
      Application footer displayed at the bottom
      下部に表示されるアプリケーションフッター
    -->
    <AppFooter class="app-footer" />
  </div>
</template>

<script setup>
// ============================================================================
// Imports / インポート
// ============================================================================
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'

// ============================================================================
// State Management / 状態管理
// ============================================================================

/**
 * Sidebar expanded state / サイドバー展開状態
 * Tracks whether the sidebar is currently expanded
 * サイドバーが現在展開されているかどうかを追跡
 */
const sidebarExpanded = ref(false)

// ============================================================================
// Methods / メソッド
// ============================================================================

/**
 * Close sidebar / サイドバーを閉じる
 *
 * Closes the sidebar and restores body scroll
 * サイドバーを閉じ、bodyのスクロールを復元
 */
const closeSidebar = () => {
  document.body.style.overflow = ''
  window.dispatchEvent(new Event('close-sidebar'))
  sidebarExpanded.value = false
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * On Component Mount / コンポーネントマウント時
 *
 * Initializes sidebar state from localStorage
 * Sets up event listener for sidebar state changes
 *
 * localStorageからサイドバー状態を初期化
 * サイドバー状態変更用のイベントリスナーを設定
 */
onMounted(() => {
  // Load saved sidebar state from localStorage / localStorageから保存されたサイドバー状態を読み込む
  const savedState = localStorage.getItem('sidebarExpanded')
  sidebarExpanded.value = savedState === 'true'

  // Listen for sidebar state change events / サイドバー状態変更イベントをリッスン
  window.addEventListener('sidebar-state-changed', (e) => {
    sidebarExpanded.value = e.detail.isExpanded
  })
})
</script>

<style>
/* ============================================================================
   Global Styles / グローバルスタイル
   BR (A.2): Responsiveness - Responsive layout styles for all screen sizes
   BR (A.2): レスポンシブ対応 - すべての画面サイズ向けのレスポンシブレイアウトスタイル
   ============================================================================ */

/* Load Bootstrap / Bootstrap読み込み */
@import 'bootstrap/dist/css/bootstrap.min.css';

/* Load Font Awesome (using CDN) / Font Awesome読み込み（CDN使用） */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* ============================================================================
   Global Layout Styles / グローバルレイアウトスタイル
   ============================================================================ */

/* Overall app structure / アプリ全体の構造 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main content area / メインコンテンツエリア */
.main-content {
  flex: 1;
  width: 100%;
}

/* ============================================================================
   BR (A.2): Desktop Layout - Sidebar Support
   BR (A.2): デスクトップレイアウト - サイドバー対応

   Desktop screens (≥992px) have a collapsible sidebar on the left
   デスクトップ画面（≥992px）は左側に折りたたみ可能なサイドバーを持つ
   ============================================================================ */
@media (min-width: 992px) {
  .main-content {
    margin-top: 3.5em; /* NavBar height / NavBarの高さ */
    padding-left: 4.5em; /* Width of sidebar when collapsed / サイドバー縮小時の幅 */
    transition: padding-left 0.2s ease;
    width: 100%;
  }

  /* When the sidebar is expanded / サイドバー展開時 */
  .main-content.sidebar-expanded {
    padding-left: 15em; /* Width when sidebar is expanded / サイドバー展開時の幅 */
  }

  .app-footer {
    padding-left: 4.5em; /* Width of sidebar when collapsed / サイドバー縮小時の幅 */
    transition: padding-left 0.2s ease;
  }

  .app-footer.sidebar-expanded {
    padding-left: 15em; /* Width when sidebar is expanded / サイドバー展開時の幅 */
  }
}

/* ============================================================================
   Sidebar Overlay / サイドバーオーバーレイ

   Dark overlay that appears when sidebar is open on mobile
   モバイルでサイドバーが開いているときに表示される暗いオーバーレイ
   ============================================================================ */
.sidebar-overlay {
  position: fixed;
  top: 3.5em;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1019;
  transition: opacity 0.3s ease;
}

/* ============================================================================
   BR (A.2): Tablet Layout / タブレットレイアウト

   Tablet screens (768px - 991.98px) use top navigation only
   タブレット画面（768px - 991.98px）はトップナビゲーションのみを使用
   ============================================================================ */
@media (min-width: 768px) and (max-width: 991.98px) {
  .main-content {
    margin-left: 0;
    margin-top: 3.5em;
    padding-left: 1em;
    padding-right: 1em;
  }

  .app-footer {
    margin-left: 0;
    padding-left: 1em;
    padding-right: 1em;
  }
}

/* ============================================================================
   BR (A.2): Mobile Layout / モバイルレイアウト

   Mobile screens (≤767.98px) use bottom navigation bar
   モバイル画面（≤767.98px）はボトムナビゲーションバーを使用
   ============================================================================ */
@media (max-width: 767.98px) {
  .main-content {
    margin-bottom: 3.75em; /* Bottom navigation height / ボトムナビゲーションの高さ分 */
    margin-left: 0;
    margin-top: 3.5em;
    padding-left: 0.75em;
    padding-right: 0.75em;
  }

  .app-footer {
    margin-left: 0;
    margin-bottom: 3.75em; /* Raise the footer by the amount of bottom navigation / フッターもボトムナビ分上げる */
    padding-left: 0.75em;
    padding-right: 0.75em;
  }
}

/* ============================================================================
   Internal Content Adjustment / コンテンツ内部の調整
   ============================================================================ */

/* Maximum container width limit / コンテナの最大幅制限 */
.main-content .container,
.main-content .container-fluid {
  max-width: 100%;
  padding-left: 0.9375em;
  padding-right: 0.9375em;
}

@media (min-width: 1200px) {
  .main-content .container {
    max-width: 71.25em;
  }
}

@media (min-width: 1400px) {
  .main-content .container {
    max-width: 82.5em;
  }
}

/* ============================================================================
   Page-specific Adjustments / ページ固有の調整
   ============================================================================ */

/* Home page hero section / ホームページのヒーローセクション */
.hero-section {
  min-height: calc(100vh - 3.75em); /* Consider the height of the NavBar / NavBarの高さを考慮 */
  display: flex;
  align-items: center;
  padding: 2em 0;
}

@media (max-width: 767.98px) {
  .hero-section {
    min-height: calc(
      100vh - 7.25em
    ); /* Top Navigation + Bottom Navigation / トップナビ + ボトムナビ */
    padding: 1.5em 0;
  }
}

/* Dashboard adjustments / ダッシュボードの調整 */
.dashboard-container {
  padding-top: 1.25em;
  min-height: calc(100vh - 3.75em);
}

@media (max-width: 767.98px) {
  .dashboard-container {
    min-height: calc(100vh - 7.25em);
    padding-top: 0.9375em;
  }
}

/* ============================================================================
   Scroll Adjustment / スクロール調整
   ============================================================================ */

/* Scroll adjustment when there is a sidebar / サイドバーがある時のスクロール調整 */
@media (min-width: 992px) {
  .main-content {
    overflow-x: hidden;
  }
}

/* Improved scrolling on mobile / モバイルでのスクロール改善 */
@media (max-width: 767.98px) {
  /* iOS Safari compatible / iOS Safari対応 */
  .main-content {
    -webkit-overflow-scrolling: touch;
  }

  /* Safe area compatible / 安全エリア対応 */
  .main-content {
    margin-bottom: calc(3.75em + env(safe-area-inset-bottom));
  }

  .app-footer {
    margin-bottom: calc(3.75em + env(safe-area-inset-bottom));
  }
}

/* ============================================================================
   Animation / アニメーション
   ============================================================================ */

/* Smooth transitions when transitioning pages / ページ遷移時のスムーズ移行 */
.main-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.app-footer {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

/* Overlay animation / オーバーレイのアニメーション */
.sidebar-overlay {
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* Animation when the sidebar is closed / サイドバーが閉じられる時のアニメーション */
.sidebar-overlay.fade-out {
  opacity: 0;
}

/* ============================================================================
   Content Margin Adjustment / コンテンツ余白の調整
   ============================================================================ */

/* General page content / 一般的なページコンテンツ */
.page-content {
  padding: 1.5em 0;
}

@media (max-width: 767.98px) {
  .page-content {
    padding: 1em 0;
  }
}

/* Card Container / カードコンテナ */
.card-container {
  margin-bottom: 1.5em;
}

@media (max-width: 767.98px) {
  .card-container {
    margin-bottom: 1em;
  }
}

/* ============================================================================
   Text and Font Size Adjustment / テキストとフォントサイズ調整
   BR (A.2): Responsiveness - Responsive typography
   BR (A.2): レスポンシブ対応 - レスポンシブタイポグラフィ
   ============================================================================ */

/* Responsive font size / レスポンシブフォントサイズ */
.main-content h1 {
  font-size: 2.25rem; /* Desktop / デスクトップ */
}

.main-content h2 {
  font-size: 1.875rem;
}

.main-content h3 {
  font-size: 1.5rem;
}

@media (max-width: 767.98px) {
  .main-content h1 {
    font-size: 1.875rem; /* Mobile / モバイル */
  }

  .main-content h2 {
    font-size: 1.5rem;
  }

  .main-content h3 {
    font-size: 1.25rem;
  }
}

/* ============================================================================
   Utility Classes / ユーティリティクラス
   ============================================================================ */

/* Margin utilities (em units) / 余白ユーティリティ（em単位） */
.mt-em-1 {
  margin-top: 1em !important;
}
.mt-em-2 {
  margin-top: 2em !important;
}
.mt-em-3 {
  margin-top: 3em !important;
}

.mb-em-1 {
  margin-bottom: 1em !important;
}
.mb-em-2 {
  margin-bottom: 2em !important;
}
.mb-em-3 {
  margin-bottom: 3em !important;
}

.pt-em-1 {
  padding-top: 1em !important;
}
.pt-em-2 {
  padding-top: 2em !important;
}
.pt-em-3 {
  padding-top: 3em !important;
}

.pb-em-1 {
  padding-bottom: 1em !important;
}
.pb-em-2 {
  padding-bottom: 2em !important;
}
.pb-em-3 {
  padding-bottom: 3em !important;
}

/* Form and button unification / フォームとボタンの統一 */
.main-content .btn {
  padding: 0.5em 1em;
  font-size: 0.875rem;
  border-radius: 0.375em;
}

.main-content .btn-lg {
  padding: 0.75em 1.5em;
  font-size: 1rem;
  border-radius: 0.5em;
}

.main-content .btn-sm {
  padding: 0.25em 0.75em;
  font-size: 0.8rem;
  border-radius: 0.25em;
}

/* Adjust input fields / 入力フィールドの調整 */
.main-content .form-control {
  padding: 0.5em 0.75em;
  font-size: 0.875rem;
  border-radius: 0.375em;
}

.main-content .form-control-lg {
  padding: 0.75em 1em;
  font-size: 1rem;
  border-radius: 0.5em;
}

.main-content .form-control-sm {
  padding: 0.375em 0.5em;
  font-size: 0.8rem;
  border-radius: 0.25em;
}
</style>
