<template>
  <div id="app">
    <!-- ナビゲーション -->
    <!-- navigation -->
    <NavBar />
    
    <!-- オーバーレイ（サイドバー展開時の背景暗化） -->
    <!-- Overlay (darken background when sidebar is expanded) -->
    <div 
      v-if="sidebarExpanded" 
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
    
    <!-- メインコンテンツエリア -->
    <!-- main content area -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- フッター -->
    <!-- Footer -->
    <AppFooter class="app-footer" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'

const sidebarExpanded = ref(false)

const closeSidebar = () => {
  document.body.style.overflow = ''
  window.dispatchEvent(new Event('close-sidebar'))
  sidebarExpanded.value = false
}

onMounted(() => {
  const savedState = localStorage.getItem('sidebarExpanded')
  sidebarExpanded.value = savedState === 'true'
  
  window.addEventListener('sidebar-state-changed', (e) => {
    sidebarExpanded.value = e.detail.isExpanded
  })
})
</script>

<style>
/* Bootstrap読み込み */
/* Load Bootstrap */
@import 'bootstrap/dist/css/bootstrap.min.css';

/* Font Awesome読み込み（CDN使用） */
/* Load Font Awesome (using CDN) */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* === グローバルレイアウトスタイル === */
/* === Global layout styles === */

/* アプリ全体の構造 */
/* Overall app structure */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* メインコンテンツエリア */
/* Main content area */
.main-content {
  flex: 1;
  width: 100%;
}

/* === デスクトップレイアウト - サイドバー対応 === */
/* === Desktop Layout - Sidebar Support === */
@media (min-width: 992px) {
  .main-content {
    margin-top: 3.5em; /* NavBar height */
    /* Width of sidebar when collapsed */
    padding-left: 4.5em; /* サイドバー縮小時の幅 */
    transition: padding-left 0.2s ease;
    width: 100%;
  }
  
  /* サイドバー展開時 */
  /* When the sidebar is expanded */
  .main-content.sidebar-expanded {
    /* Width when sidebar is expanded */
    padding-left: 15em; /* サイドバー展開時の幅 */
  }
  
  .app-footer {
    /* Width of sidebar when collapsed */
    padding-left: 4.5em; /* サイドバー縮小時の幅 */
    transition: padding-left 0.2s ease;
  }
  
  .app-footer.sidebar-expanded {
    /* Width when sidebar is expanded */
    padding-left: 15em; /* サイドバー展開時の幅 */
  }
}

/* === サイドバーオーバーレイ === */
/* === Sidebar Overlay === */
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

/* === タブレットレイアウト === */
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

/* === モバイルレイアウト === */
/* === Mobile Layout === */
@media (max-width: 767.98px) {
  .main-content {
    /* Bottom navigation height */
    margin-bottom: 3.75em; /* ボトムナビゲーションの高さ分 */
    margin-left: 0;
    margin-top: 3.5em;
    padding-left: 0.75em;
    padding-right: 0.75em;
  }
  
  .app-footer {
    margin-left: 0;
    /* Raise the footer by the amount of bottom navigation */
    margin-bottom: 3.75em; /* フッターもボトムナビ分上げる */
    padding-left: 0.75em;
    padding-right: 0.75em;
  }
}

/* === コンテンツ内部の調整 === */
/* === Internal content adjustment === */

/* コンテナの最大幅制限 */
/* Maximum container width limit */
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

/* === ページ固有の調整 === */
/* === Page-specific adjustments === */

/* ホームページのヒーローセクション */
/* Home page hero section */
.hero-section {
  /* Consider the height of the NavBar */
  min-height: calc(100vh - 3.75em); /* NavBarの高さを考慮 */
  display: flex;
  align-items: center;
  padding: 2em 0;
}

@media (max-width: 767.98px) {
  .hero-section {
    /* Top Navigation + Bottom Navigation */
    min-height: calc(100vh - 7.25em); /* トップナビ + ボトムナビ */
    padding: 1.5em 0;
  }
}

/* ダッシュボードの調整 */
/* Dashboard adjustments */
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

/* === スクロール調整 === */
/* === Scroll adjustment === */

/* サイドバーがある時のスクロール調整 */
/* Scroll adjustment when there is a sidebar */
@media (min-width: 992px) {
  .main-content {
    overflow-x: hidden;
  }
}

/* モバイルでのスクロール改善 */
/* Improved scrolling on mobile */
@media (max-width: 767.98px) {
  /* iOS Safari対応 */
  /* iOS Safari compatible */
  .main-content {
    -webkit-overflow-scrolling: touch;
  }
  
  /* 安全エリア対応 */
  /* Safe area compatible */
  .main-content {
    margin-bottom: calc(3.75em + env(safe-area-inset-bottom));
  }
  
  .app-footer {
    margin-bottom: calc(3.75em + env(safe-area-inset-bottom));
  }
}

/* === アニメーション === */
/* === Animation === */

/* ページ遷移時のスムーズ移行 */
/* Smooth transitions when transitioning pages */
.main-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.app-footer {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

/* オーバーレイのアニメーション */
/* Overlay animation */
.sidebar-overlay {
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* サイドバーが閉じられる時のアニメーション */
/* Animation when the sidebar is closed */
.sidebar-overlay.fade-out {
  opacity: 0;
}

/* === コンテンツ余白の調整 === */
/* === Content margin adjustment === */

/* 一般的なページコンテンツ */
/* General page content */
.page-content {
  padding: 1.5em 0;
}

@media (max-width: 767.98px) {
  .page-content {
    padding: 1em 0;
  }
}

/* カードコンテナ */
/* Card Container */
.card-container {
  margin-bottom: 1.5em;
}

@media (max-width: 767.98px) {
  .card-container {
    margin-bottom: 1em;
  }
}

/* === テキストとフォントサイズ調整 === */
/* === Text and font size adjustment === */

/* レスポンシブフォントサイズ */
/* Responsive font size */
.main-content h1 {
  font-size: 2.25rem; /* Desktop */
}

.main-content h2 {
  font-size: 1.875rem;
}

.main-content h3 {
  font-size: 1.5rem;
}

@media (max-width: 767.98px) {
  .main-content h1 {
    font-size: 1.875rem; /* Mobile */
  }
  
  .main-content h2 {
    font-size: 1.5rem;
  }
  
  .main-content h3 {
    font-size: 1.25rem;
  }
}

/* === ユーティリティクラス === */
/* === Utility Class === */

/* 余白ユーティリティ（em単位） */
/* Margin utilities (em units) */
.mt-em-1 { margin-top: 1em !important; }
.mt-em-2 { margin-top: 2em !important; }
.mt-em-3 { margin-top: 3em !important; }

.mb-em-1 { margin-bottom: 1em !important; }
.mb-em-2 { margin-bottom: 2em !important; }
.mb-em-3 { margin-bottom: 3em !important; }

.pt-em-1 { padding-top: 1em !important; }
.pt-em-2 { padding-top: 2em !important; }
.pt-em-3 { padding-top: 3em !important; }

.pb-em-1 { padding-bottom: 1em !important; }
.pb-em-2 { padding-bottom: 2em !important; }
.pb-em-3 { padding-bottom: 3em !important; }

/* === 特別な調整 === */
/* === Special tweaks === */

/* フォームとボタンの統一 */
/* Form and button unification */
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

/* 入力フィールドの調整 */
/* Adjust input fields */
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
