import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css'
// Bootstrap JavaScript  
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// PrimeVue components
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Panel from 'primevue/panel'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import AvatarGroup from 'primevue/avatargroup'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'

// 現在、LocalStorageを使用しているため、使っていない
// Firebase設定のインポート（既存のfirebase.jsを使用）
// import './firebase/config'

// Vueアプリの作成
const app = createApp(App)

// PrimeVue設定
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'none',
            cssLayer: false
        }
    }
})

// PrimeVue components登録
app.component('Card', Card)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Panel', Panel)
app.component('Badge', Badge)
app.component('Avatar', Avatar)
app.component('AvatarGroup', AvatarGroup)
app.component('Button', Button)
app.component('ProgressBar', ProgressBar)
app.component('Tag', Tag)

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
if (import.meta.env.DEV) {
  app.config.performance = true
}

// アプリをマウント
app.mount('#app')