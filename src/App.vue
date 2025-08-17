<template>
  <div id="app">
    <!-- ナビゲーションバー -->
    <NavBar />
    
    <!-- メインコンテンツ -->
    <main>
      <router-view />
    </main>
    
    <!-- フッター -->
    <AppFooter />
  </div>
</template>

<script setup>
  import NavBar from './components/NavBar.vue'
  import AppFooter from './components/AppFooter.vue'
</script>

<style scoped>
/* Bootstrap読み込み */
@import 'bootstrap/dist/css/bootstrap.min.css';

/* Font Awesome読み込み（CDN使用） */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

</style>
