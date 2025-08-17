import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css'
// Bootstrap JavaScript  
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Firebase設定のインポート（既存のfirebase.jsを使用）
import './firebase/config'

// Vueアプリの作成
const app = createApp(App)

// ルーターの設定
app.use(router)

// グローバルプロパティの設定
app.config.globalProperties.$appName = 'Global Plate'
app.config.globalProperties.$version = '1.0.0'

// エラーハンドリング
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Error Info:', info)
  // TODO: エラーレポーティングサービスに送信
}

// 開発環境での設定
if (process.env.NODE_ENV === 'development') {
  app.config.performance = true
}

// アプリをマウント
app.mount('#app')