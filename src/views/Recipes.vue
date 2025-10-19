<template>
  <div class="recipes-page">
    <div class="container-fluid py-4">
      <!-- ヘッダー / Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-1">
            <i class="fas fa-utensils me-2 text-primary"></i>
            Recipes
          </h2>
          <p class="text-muted">Browse and discover delicious recipes from around the world</p>
        </div>
      </div>

      <!-- BR (D.3): Interactive Table Data - Table #1 -->
      <!-- インタラクティブテーブルデータ - テーブル#1 -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <!-- グローバル検索とエクスポートボタン / Global Search and Export Button -->
              <div class="row mb-3">
                <!-- グローバル検索バー / Global Search Bar -->
                <div class="col-md-8">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search recipes..."
                      v-model="filters['global'].value"
                    />
                  </div>
                </div>

                <!-- BR (E.4): Export - CSV Export Button -->
                <!-- CSVエクスポートボタン / CSV Export Button -->
                <div class="col-md-4 text-end">
                  <button class="btn btn-success" @click="exportToCSV">
                    <i class="fas fa-file-csv me-2"></i>
                    Export to CSV
                  </button>
                </div>
              </div>

              <!-- PrimeVue DataTable -->
              <!-- BR (D.3): ソート、検索、ページネーション機能付きのインタラクティブテーブル -->
              <!-- BR (D.3): Interactive table with sort, search, and pagination features -->
              <DataTable
                v-model:filters="filters"
                :value="recipes"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50]"
                filterDisplay="row"
                :globalFilterFields="['title', 'cuisine', 'difficulty', 'author.name']"
                sortMode="multiple"
                removableSort
                :loading="loading"
                responsiveLayout="scroll"
                class="modern-table"
              >
                <!-- Title Column / タイトル列 -->
                <Column
                  field="title"
                  header="Recipe Name"
                  :sortable="true"
                  style="min-width: 250px"
                >
                  <template #body="{ data }">
                    <div class="d-flex align-items-center">
                      <img
                        :src="data.image"
                        class="rounded me-2"
                        width="40"
                        height="40"
                        style="object-fit: cover"
                        alt="Recipe"
                      />
                      <strong>{{ data.title }}</strong>
                    </div>
                  </template>
                  <!-- BR (D.3): 個別カラム検索 / Individual Column Search -->
                  <template #filter="{ filterModel, filterCallback }">
                    <input
                      type="text"
                      v-model="filterModel.value"
                      @input="filterCallback()"
                      class="form-control form-control-sm"
                      placeholder="Search by name"
                    />
                  </template>
                </Column>

                <!-- Cuisine Column / 料理ジャンル列 -->
                <Column field="cuisine" header="Cuisine" :sortable="true" style="min-width: 150px">
                  <template #body="{ data }">
                    <span class="badge bg-primary">{{ data.cuisine }}</span>
                  </template>
                  <!-- BR (D.3): 個別カラム検索 / Individual Column Search -->
                  <template #filter="{ filterModel, filterCallback }">
                    <input
                      type="text"
                      v-model="filterModel.value"
                      @input="filterCallback()"
                      class="form-control form-control-sm"
                      placeholder="Search by cuisine"
                    />
                  </template>
                </Column>

                <!-- Difficulty Column / 難易度列 -->
                <Column
                  field="difficulty"
                  header="Difficulty"
                  :sortable="true"
                  style="min-width: 150px"
                >
                  <template #body="{ data }">
                    <span
                      :class="{
                        'badge bg-success': data.difficulty === 'Easy',
                        'badge bg-warning': data.difficulty === 'Medium',
                        'badge bg-danger': data.difficulty === 'Hard',
                      }"
                    >
                      {{ data.difficulty }}
                    </span>
                  </template>
                  <!-- BR (D.3): 個別カラム検索（ドロップダウン） / Individual Column Search (Dropdown) -->
                  <template #filter="{ filterModel, filterCallback }">
                    <select
                      v-model="filterModel.value"
                      @change="filterCallback()"
                      class="form-select form-select-sm"
                    >
                      <option value="">All</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </template>
                </Column>

                <!-- Author Column / 著者列 -->
                <Column
                  field="author.name"
                  header="Author"
                  :sortable="true"
                  style="min-width: 150px"
                >
                  <template #body="{ data }">
                    {{ data.author.name }}
                  </template>
                  <!-- BR (D.3): 個別カラム検索 / Individual Column Search -->
                  <template #filter="{ filterModel, filterCallback }">
                    <input
                      type="text"
                      v-model="filterModel.value"
                      @input="filterCallback()"
                      class="form-control form-control-sm"
                      placeholder="Search by author"
                    />
                  </template>
                </Column>

                <!-- Cooking Time Column / 調理時間列 -->
                <Column
                  field="cookingTime"
                  header="Cooking Time"
                  :sortable="true"
                  style="min-width: 150px"
                >
                  <template #body="{ data }">
                    <i class="fas fa-clock me-1"></i>
                    {{ data.cookingTime }}
                  </template>
                </Column>

                <!-- Actions Column / アクション列 -->
                <Column header="Actions" style="min-width: 100px">
                  <template #body="{ data }">
                    <button class="btn btn-sm btn-outline-primary" @click="viewRecipe(data)">
                      <i class="fas fa-eye"></i>
                    </button>
                  </template>
                </Column>

                <!-- Empty State / 空の状態 -->
                <template #empty>
                  <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No recipes found.</p>
                  </div>
                </template>

                <!-- Loading State / ローディング状態 -->
                <template #loading>
                  <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted mt-2">Loading recipes...</p>
                  </div>
                </template>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { useRouter } from 'vue-router'

// Setup内でrouterを取得
const router = useRouter()

// ============================================================================
// BR (D.3): PrimeVue DataTable用のFilterMatchMode定義
// FilterMatchMode definitions for PrimeVue DataTable
// ============================================================================
const FilterMatchMode = {
  CONTAINS: 'contains',
  EQUALS: 'equals',
}

// ============================================================================
// State - データとローディング状態の管理
// State - Managing data and loading status
// ============================================================================
const recipes = ref([])
const loading = ref(false)

// ============================================================================
// BR (D.3): DataTable用のフィルター設定
// Filter settings for DataTable
// グローバル検索と個別カラム検索をサポート
// Supports global search and individual column search
// ============================================================================
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'author.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
  cuisine: { value: null, matchMode: FilterMatchMode.EQUALS },
  difficulty: { value: null, matchMode: FilterMatchMode.EQUALS },
})

// ============================================================================
// Firestoreからレシピデータを取得
// Fetch recipe data from Firestore
// Week 8 Studio: Firestoreのパターンに基づく実装
// Implementation based on Week 8 Studio Firestore patterns
// ============================================================================
const loadRecipes = async () => {
  loading.value = true
  try {
    const recipesCollection = collection(db, 'recipes')
    const snapshot = await getDocs(recipesCollection)

    recipes.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log('Loaded recipes:', recipes.value.length)
  } catch (error) {
    console.error('Error fetching recipes:', error)
  } finally {
    loading.value = false
  }
}

// ============================================================================
// レシピ詳細を表示（将来の実装用プレースホルダー）
// View recipe details (placeholder for future implementation)
// ============================================================================
const viewRecipe = (recipe) => {
  console.log('Navigating to recipe:', recipe.id)
  // RecipeDetailページに遷移（idを使用）
  router.push(`/recipes/${recipe.id}`)
}

// ============================================================================
// BR (E.4): Export - CSVエクスポート機能
// BR (E.4): Export - CSV Export Feature
//
// テーブルに表示されているレシピデータをCSV形式でエクスポートする
// Exports recipe data displayed in the table to CSV format
//
// 実装の参考:
// - MDN Web Docs - Blob: https://developer.mozilla.org/en-US/docs/Web/API/Blob
// - MDN Web Docs - URL.createObjectURL: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
// - CSV RFC 4180: https://datatracker.ietf.org/doc/html/rfc4180
// ============================================================================
const exportToCSV = () => {
  try {
    // CSVヘッダー行を作成
    // Create CSV header row
    const headers = ['Recipe Name', 'Cuisine', 'Difficulty', 'Author', 'Cooking Time']

    // データ行を作成（各レシピを配列に変換）
    // Create data rows (convert each recipe to array)
    const rows = recipes.value.map((recipe) => [
      recipe.title,
      recipe.cuisine,
      recipe.difficulty,
      recipe.author.name,
      recipe.cookingTime,
    ])

    // CSVコンテンツを作成（RFC 4180に準拠）
    // Create CSV content (compliant with RFC 4180)
    let csvContent = headers.join(',') + '\n'

    rows.forEach((row) => {
      // カンマを含む可能性があるフィールドはダブルクォートで囲む
      // Wrap fields that may contain commas in double quotes
      const escapedRow = row.map((field) => {
        if (typeof field === 'string' && field.includes(',')) {
          return `"${field}"`
        }
        return field
      })
      csvContent += escapedRow.join(',') + '\n'
    })

    // BlobオブジェクトとしてCSVを作成
    // Create CSV as Blob object
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    // ダウンロード用のリンクを作成
    // Create download link
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    // ファイル名を設定（現在の日時を含む）
    // Set filename (including current date)
    const timestamp = new Date().toISOString().slice(0, 10)
    link.setAttribute('href', url)
    link.setAttribute('download', `recipes_${timestamp}.csv`)

    // ダウンロードを実行
    // Execute download
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('CSV export completed successfully')
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    alert('Failed to export CSV file. Please try again.')
  }
}

// ============================================================================
// コンポーネントマウント時にデータをロード
// Load data when component is mounted
// ============================================================================
onMounted(async () => {
  try {
    console.log('Loading recipes...')
    await loadRecipes()

    console.log('=== All done ===')
  } catch (error) {
    console.error('=== ERROR ===')
    console.error(error)
  }
})
</script>

<style scoped>
/* ============================================================================
   BR (A.2): Responsiveness - レスポンシブデザインのためのスタイル
   BR (A.2): Responsiveness - Styles for responsive design
   ============================================================================ */

.recipes-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* DataTableのスタイルカスタマイズ / DataTable style customization */
.modern-table {
  font-size: 0.95rem;
}

.modern-table :deep(.p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.modern-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: #f8f9fa;
}

.modern-table :deep(.p-paginator) {
  background-color: #fff;
  border-top: 1px solid #dee2e6;
}
</style>
