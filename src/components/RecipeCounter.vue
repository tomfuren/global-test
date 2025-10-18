<template>
  <div class="card h-100">
    <div class="card-body text-center">
      <i class="fas fa-utensils text-success fs-2 mb-2"></i>
      <h5>Recipes</h5>

      <!-- ローディング表示 -->
      <div v-if="loading" class="spinner-border spinner-border-sm text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>

      <!-- レシピ数を表示 -->
      <h3 v-else-if="count !== null" class="text-success">
        {{ count }}
      </h3>

      <!-- エラー表示 -->
      <div v-else-if="error" class="text-danger">
        <small>{{ error }}</small>
      </div>

      <!-- 初期状態 -->
      <h3 v-else class="text-muted">--</h3>

      <!-- 更新ボタン（オプション） -->
      <button
        v-if="!loading"
        class="btn btn-sm btn-outline-success mt-2"
        @click="fetchRecipeCount"
        :disabled="loading"
      >
        <i class="fas fa-sync-alt me-1"></i>
        Refresh
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// データの状態管理
const count = ref(null)
const error = ref(null)
const loading = ref(false)

/**
 * Cloud Functionからレシピのカウントを取得
 * BR (E.1): Cloud Functions - HTTPリクエストでCloud Functionを呼び出し
 */
const fetchRecipeCount = async () => {
  loading.value = true
  error.value = null

  try {
    // Cloud FunctionのURL
    const url = 'ttps://us-central1-global-plate-dev.cloudfunctions.net/countRecipes'

    console.log('Fetching recipe count from Cloud Function...')

    // HTTPリクエストでCloud Functionを呼び出し
    const response = await axios.get(url)

    console.log('Response from Cloud Function:', response.data)

    // レスポンスからカウント数を取得
    if (response.data.success) {
      count.value = response.data.count
    } else {
      error.value = 'Failed to get count'
    }
  } catch (err) {
    console.error('Error calling Cloud Function:', err)
    error.value = 'Connection error'
  } finally {
    loading.value = false
  }
}

// コンポーネントマウント時に自動的にデータを取得
onMounted(() => {
  fetchRecipeCount()
})
</script>

<style scoped>
.card {
  border-radius: 10px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.spinner-border-sm {
  width: 2rem;
  height: 2rem;
}

.btn-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
}
</style>
