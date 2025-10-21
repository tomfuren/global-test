<!--
  Recipes Page - Recipe management interface using PrimeVue DataTable
  レシピページ - PrimeVue DataTableを使用したレシピ管理インターフェース

  Features / 機能:
  - Recipe search, sort, and filtering / レシピの検索、ソート、フィルタリング
  - Pagination support / ページネーション対応
  - Global and individual column search / グローバル検索と個別カラム検索
  - CSV export functionality / CSVエクスポート機能
  - Real-time data loading from Firestore / Firestoreからのリアルタイムデータ読み込み
  - Responsive table layout / レスポンシブテーブルレイアウト

  BR (A.1): CRUD Operations - Read recipe data from Firestore
  BR (A.1): CRUD操作 - Firestoreからレシピデータを読み込み

  BR (A.2): Responsiveness - Responsive design with mobile support
  BR (A.2): レスポンシブ対応 - モバイル対応のレスポンシブデザイン

  BR (D.3): Interactive Table Data - Table #1 (Recipe Management Table)
  BR (D.3): インタラクティブなテーブルデータ - テーブル#1（レシピ管理テーブル）
  Advanced table with sorting, filtering, and pagination using PrimeVue DataTable
  PrimeVue DataTableを使用したソート、フィルタリング、ページネーション機能付きの高度なテーブル

  BR (E.4): Export - CSV Export Feature
  BR (E.4): エクスポート機能 - CSVエクスポート機能
  Allows exporting recipe data to CSV format
  レシピデータをCSV形式でエクスポート可能

  BR (E.3): Accessibility - Semantic HTML structure and ARIA attributes
  BR (E.3): アクセシビリティ - セマンティックHTML構造とARIA属性
-->

<template>
  <div class="recipes-page">
    <div class="container-fluid py-4">
      <!-- ============================================================================
           Header Section / ヘッダーセクション
           Page title and description
           ページタイトルと説明
           ============================================================================ -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-1">
            <i class="fas fa-utensils me-2 text-primary" aria-hidden="true"></i>
            Recipes
          </h2>
          <p class="text-muted">Browse and discover delicious recipes from around the world</p>
        </div>
      </div>

      <!-- ============================================================================
           BR (D.3): Interactive Table Data - Table #1 (Recipe Management Table)
           BR (D.3): インタラクティブなテーブルデータ - テーブル#1（レシピ管理テーブル）

           PrimeVue DataTable with advanced features:
           - Multi-column sorting / 複数カラムソート
           - Global and column-specific filtering / グローバル検索と列固有のフィルタリング
           - Pagination with customizable rows per page / カスタマイズ可能な1ページあたりの行数でのページネーション
           - Responsive layout / レスポンシブレイアウト
           ============================================================================ -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <!-- Global Search and Export Button / グローバル検索とエクスポートボタン -->
              <div class="row mb-3">
                <!--
                  Global Search Bar / グローバル検索バー
                  Searches across multiple fields: title, cuisine, difficulty, author
                  複数のフィールド（タイトル、料理ジャンル、難易度、著者）を横断検索
                -->
                <div class="col-md-8">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-search" aria-hidden="true"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search recipes..."
                      v-model="filters['global'].value"
                      aria-label="Search recipes"
                    />
                  </div>
                </div>

                <!--
                  BR (E.4): Export - CSV Export Button
                  BR (E.4): エクスポート機能 - CSVエクスポートボタン

                  Exports all recipe data to CSV format
                  すべてのレシピデータをCSV形式でエクスポート
                -->
                <div class="col-md-4 text-end">
                  <button class="btn btn-success" @click="exportToCSV">
                    <i class="fas fa-file-csv me-2" aria-hidden="true"></i>
                    Export to CSV
                  </button>
                </div>
              </div>

              <!--
                PrimeVue DataTable Component / PrimeVue DataTableコンポーネント
                BR (D.3): Interactive table with sort, search, and pagination features
                BR (D.3): ソート、検索、ページネーション機能付きのインタラクティブテーブル
              -->
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
                <!--
                  Title Column / タイトル列
                  Displays recipe image and name with sorting and filtering
                  レシピ画像と名前を表示し、ソートとフィルタリングを提供
                -->
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
                        :alt="`${data.title} thumbnail`"
                      />
                      <strong>{{ data.title }}</strong>
                    </div>
                  </template>
                  <!-- BR (D.3): Individual Column Search / 個別カラム検索 -->
                  <template #filter="{ filterModel, filterCallback }">
                    <input
                      type="text"
                      v-model="filterModel.value"
                      @input="filterCallback()"
                      class="form-control form-control-sm"
                      placeholder="Search by name"
                      aria-label="Filter by recipe name"
                    />
                  </template>
                </Column>

                <!--
                  Cuisine Column / 料理ジャンル列
                  Displays cuisine type with badge styling
                  料理タイプをバッジスタイルで表示
                -->
                <Column field="cuisine" header="Cuisine" :sortable="true" style="min-width: 150px">
                  <template #body="{ data }">
                    <span class="badge bg-primary">{{ data.cuisine }}</span>
                  </template>
                  <!-- BR (D.3): Individual Column Search / 個別カラム検索 -->
                  <template #filter="{ filterModel, filterCallback }">
                    <input
                      type="text"
                      v-model="filterModel.value"
                      @input="filterCallback()"
                      class="form-control form-control-sm"
                      placeholder="Search by cuisine"
                      aria-label="Filter by cuisine type"
                    />
                  </template>
                </Column>

                <!--
                  Difficulty Column / 難易度列
                  Color-coded badges based on difficulty level
                  難易度レベルに基づいた色分けバッジ
                -->
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
                  <!--
                    BR (D.3): Individual Column Search with Dropdown / ドロップダウン付き個別カラム検索
                    Predefined options for easier filtering
                    より簡単なフィルタリングのための事前定義オプション
                  -->
                  <template #filter="{ filterModel, filterCallback }">
                    <select
                      v-model="filterModel.value"
                      @change="filterCallback()"
                      class="form-select form-select-sm"
                      aria-label="Filter by difficulty level"
                    >
                      <option value="">All</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </template>
                </Column>

                <!--
                  Author Column / 著者列
                  Displays recipe author name
                  レシピ著者名を表示
                -->
                <Column
                  field="author.name"
                  header="Author"
                  :sortable="true"
                  style="min-width: 150px"
                >
                  <template #body="{ data }">
                    {{ data.author.name }}
                  </template>
                  <!-- BR (D.3): Individual Column Search / 個別カラム検索 -->
                  <template #filter="{ filterModel, filterCallback }">
                    <input
                      type="text"
                      v-model="filterModel.value"
                      @input="filterCallback()"
                      class="form-control form-control-sm"
                      placeholder="Search by author"
                      aria-label="Filter by author name"
                    />
                  </template>
                </Column>

                <!--
                  Cooking Time Column / 調理時間列
                  Displays estimated cooking time
                  推定調理時間を表示
                -->
                <Column
                  field="cookingTime"
                  header="Cooking Time"
                  :sortable="true"
                  style="min-width: 150px"
                >
                  <template #body="{ data }">
                    <i class="fas fa-clock me-1" aria-hidden="true"></i>
                    {{ data.cookingTime }}
                  </template>
                </Column>

                <!--
                  Actions Column / アクション列
                  View button to navigate to recipe detail page
                  レシピ詳細ページへ遷移する表示ボタン
                -->
                <Column header="Actions" style="min-width: 100px">
                  <template #body="{ data }">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="viewRecipe(data)"
                      :aria-label="`View ${data.title} details`"
                    >
                      <i class="fas fa-eye" aria-hidden="true"></i>
                    </button>
                  </template>
                </Column>

                <!--
                  Empty State / 空の状態
                  Displayed when no recipes match the filter criteria
                  フィルター条件に一致するレシピがない場合に表示
                -->
                <template #empty>
                  <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3" aria-hidden="true"></i>
                    <p class="text-muted">No recipes found.</p>
                  </div>
                </template>

                <!--
                  Loading State / ローディング状態
                  Displayed while fetching data from Firestore
                  Firestoreからデータを取得中に表示
                -->
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
// ============================================================================
// Imports / インポート
// ============================================================================
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { useRouter } from 'vue-router'

const router = useRouter()

// ============================================================================
// BR (D.3): PrimeVue DataTable FilterMatchMode definitions
// BR (D.3): PrimeVue DataTable用のFilterMatchMode定義
//
// Filter match modes for DataTable column filtering
// DataTableカラムフィルタリング用のフィルターマッチモード
// ============================================================================
const FilterMatchMode = {
  CONTAINS: 'contains',
  EQUALS: 'equals',
}

// ============================================================================
// State Management / 状態管理
// Managing data and loading status
// データとローディング状態の管理
// ============================================================================
const recipes = ref([]) // Recipe data array / レシピデータ配列
const loading = ref(false) // Loading state / ローディング状態

// ============================================================================
// BR (D.3): DataTable Filter Settings / DataTable用のフィルター設定
//
// Filter configuration for DataTable
// Supports global search and individual column search
//
// DataTableのフィルター設定
// グローバル検索と個別カラム検索をサポート
// ============================================================================
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'author.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
  cuisine: { value: null, matchMode: FilterMatchMode.EQUALS },
  difficulty: { value: null, matchMode: FilterMatchMode.EQUALS },
})

// ============================================================================
// Methods / メソッド
// ============================================================================

/**
 * BR (A.1): CRUD Operations - Fetch recipe data from Firestore
 * BR (A.1): CRUD操作 - Firestoreからレシピデータを取得
 *
 * Implementation based on Week 8 Studio Firestore patterns
 * Week 8 Studioのパターンに基づく実装
 *
 * Fetches all recipe documents from Firestore and populates recipes array
 * Firestoreからすべてのレシピドキュメントを取得し、recipesレciピ配列に入力
 */
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

/**
 * Navigate to recipe detail page / レシピ詳細ページへ遷移
 *
 * Redirects to RecipeDetail page with recipe ID
 * レシピIDを使用してRecipeDetailページにリダイレクト
 *
 * @param {object} recipe - Recipe object / レシピオブジェクト
 */
const viewRecipe = (recipe) => {
  console.log('Navigating to recipe:', recipe.id)
  // Navigate to RecipeDetail page using ID / IDを使用してRecipeDetailページに遷移
  router.push(`/recipes/${recipe.id}`)
}

/**
 * BR (E.4): Export - CSV Export Feature
 * BR (E.4): エクスポート機能 - CSVエクスポート機能
 *
 * Exports recipe data displayed in the table to CSV format
 * テーブルに表示されているレシピデータをCSV形式でエクスポートする
 *
 * Process / 処理:
 * 1. Create CSV header row / CSVヘッダー行を作成
 * 2. Convert recipe objects to CSV rows / レシピオブジェクトをCSV行に変換
 * 3. Handle special characters (commas) / 特殊文字（カンマ）を処理
 * 4. Create Blob object with CSV content / CSVコンテンツでBlobオブジェクトを作成
 * 5. Generate download link / ダウンロードリンクを生成
 * 6. Trigger automatic download / 自動ダウンロードをトリガー
 *
 * Implementation References / 実装の参考:
 * - MDN Web Docs - Blob: https://developer.mozilla.org/en-US/docs/Web/API/Blob
 * - MDN Web Docs - URL.createObjectURL: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
 * - CSV RFC 4180: https://datatracker.ietf.org/doc/html/rfc4180
 */
const exportToCSV = () => {
  try {
    // Create CSV header row / CSVヘッダー行を作成
    const headers = ['Recipe Name', 'Cuisine', 'Difficulty', 'Author', 'Cooking Time']

    // Create data rows (convert each recipe to array) / データ行を作成（各レシピを配列に変換）
    const rows = recipes.value.map((recipe) => [
      recipe.title,
      recipe.cuisine,
      recipe.difficulty,
      recipe.author.name,
      recipe.cookingTime,
    ])

    // Create CSV content (compliant with RFC 4180) / CSVコンテンツを作成（RFC 4180に準拠）
    let csvContent = headers.join(',') + '\n'

    rows.forEach((row) => {
      // Wrap fields that may contain commas in double quotes
      // カンマを含む可能性があるフィールドはダブルクォートで囲む
      const escapedRow = row.map((field) => {
        if (typeof field === 'string' && field.includes(',')) {
          return `"${field}"`
        }
        return field
      })
      csvContent += escapedRow.join(',') + '\n'
    })

    // Create CSV as Blob object / BlobオブジェクトとしてCSVを作成
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    // Create download link / ダウンロード用のリンクを作成
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    // Set filename (including current date) / ファイル名を設定（現在の日時を含む）
    const timestamp = new Date().toISOString().slice(0, 10)
    link.setAttribute('href', url)
    link.setAttribute('download', `recipes_${timestamp}.csv`)

    // Execute download / ダウンロードを実行
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
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * On Component Mount / コンポーネントマウント時
 *
 * Load data when component is mounted
 * コンポーネントマウント時にデータをロード
 *
 * Fetches recipe data from Firestore on page load
 * ページ読み込み時にFirestoreからレシピデータを取得
 */
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
   Styles / スタイル
   BR (A.2): Responsiveness - Styles for responsive design
   BR (A.2): レスポンシブ対応 - レスポンシブデザインのためのスタイル
   ============================================================================ */

/* Overall page layout / ページ全体のレイアウト */
.recipes-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* DataTable style customization / DataTableのスタイルカスタマイズ */
.modern-table {
  font-size: 0.95rem;
}

/* Table header styling / テーブルヘッダーのスタイリング */
.modern-table :deep(.p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

/* Table row hover effect / テーブル行のホバー効果 */
.modern-table :deep(.p-datatable-tbody > tr:hover) {
  background-color: #f8f9fa;
}

/* Paginator styling / ページネーターのスタイリング */
.modern-table :deep(.p-paginator) {
  background-color: #fff;
  border-top: 1px solid #dee2e6;
}
</style>
