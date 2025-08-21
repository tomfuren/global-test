<template>
  <div id="app">
    <!-- ナビゲーション -->
    <NavBar />
    
    <!-- オーバーレイ（サイドバー展開時の背景暗化） -->
    <div 
      v-if="sidebarExpanded" 
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
    
    <!-- メインコンテンツエリア -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- フッター -->
    <AppFooter class="app-footer" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'

const sidebarExpanded = ref(false)

const closeSidebar = () => {
  // スクロール有効化
  document.body.style.overflow = ''
  
  // サイドバーを閉じるイベントを発火
  window.dispatchEvent(new Event('close-sidebar'))
  sidebarExpanded.value = false
}

onMounted(() => {
  // 初期状態を設定
  const savedState = localStorage.getItem('sidebarExpanded')
  sidebarExpanded.value = savedState === 'true'
  
  // サイドバー状態の変更を監視
  window.addEventListener('sidebar-state-changed', (e) => {
    sidebarExpanded.value = e.detail.isExpanded
  })
})
</script>

<style>
/* Bootstrap読み込み */
@import 'bootstrap/dist/css/bootstrap.min.css';

/* Font Awesome読み込み（CDN使用） */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* === グローバルレイアウトスタイル === */

/* アプリ全体の構造 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* メインコンテンツエリア */
.main-content {
  flex: 1;
  width: 100%;
  /* padding-topを削除してナビバーと隙間をなくす */
}

/* デスクトップレイアウト - オーバーレイ方式 */
@media (min-width: 992px) {
  .main-content {
    margin-left: 0; /* コンテンツ位置は固定 */
    margin-top:56px;
  }
  
  .app-footer {
    margin-left: 0; /* フッターも固定 */
  }
}

/* サイドバーオーバーレイ */
.sidebar-overlay {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1019;
  transition: opacity 0.3s ease;
}

/* タブレットレイアウト */
@media (min-width: 768px) and (max-width: 991.98px) {
  .main-content {
    margin-left: 0;
    margin-top:56px;
  }
  
  .app-footer {
    margin-left: 0;
  }
}

/* モバイルレイアウト */
@media (max-width: 767.98px) {
  .main-content {
    margin-bottom: 60px; /* ボトムナビゲーションの高さ分 */
    margin-left: 0;
    margin-top:56px;
  }
  
  .app-footer {
    margin-left: 0;
    margin-bottom: 60px; /* フッターもボトムナビ分上げる */
  }
}

/* === コンテンツ内部の調整 === */

/* コンテナの最大幅制限 */
.main-content .container,
.main-content .container-fluid {
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;
}

@media (min-width: 1200px) {
  .main-content .container {
    max-width: 1140px;
  }
}

@media (min-width: 1400px) {
  .main-content .container {
    max-width: 1320px;
  }
}

/* === ページ固有の調整 === */

/* ホームページのヒーローセクション */
.hero-section {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
}

@media (max-width: 767.98px) {
  .hero-section {
    min-height: calc(100vh - 120px); /* トップナビ + ボトムナビ */
  }
}

/* ダッシュボードの調整 */
.dashboard-container {
  padding-top: 20px;
  min-height: calc(100vh - 60px);
}

@media (max-width: 767.98px) {
  .dashboard-container {
    min-height: calc(100vh - 120px);
    padding-top: 15px;
  }
}

/* === スクロール調整 === */

/* サイドバーがある時のスクロール調整 */
@media (min-width: 992px) {
  .main-content {
    overflow-x: hidden;
  }
}

/* モバイルでのスクロール改善 */
@media (max-width: 767.98px) {
  /* iOS Safari対応 */
  .main-content {
    -webkit-overflow-scrolling: touch;
  }
  
  /* 安全エリア対応 */
  .main-content {
    margin-bottom: calc(60px + env(safe-area-inset-bottom));
  }
}

/* === アニメーション === */

/* ページ遷移時のスムーズ移行 */
.main-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.app-footer {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

/* オーバーレイのアニメーション */
.sidebar-overlay {
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* サイドバーが閉じられる時のアニメーション */
.sidebar-overlay.fade-out {
  opacity: 0;
}
</style>