<!--
  Recipe Detail Page - Detailed recipe information display interface
  レシピ詳細ページ - 詳細なレシピ情報表示インターフェース

  Features / 機能:
  - Display comprehensive recipe information / 包括的なレシピ情報を表示
  - Show recipe image, title, and description / レシピ画像、タイトル、説明を表示
  - Display author information with avatar / アバター付き著者情報を表示
  - Show cooking details (time, servings, difficulty, cuisine) / 調理詳細を表示（時間、人数、難易度、料理）
  - List ingredients and step-by-step instructions / 材料と手順を一覧表示
  - Display nutritional information / 栄養情報を表示
  - Integrated rating and review system / 統合された評価とレビューシステム
  - Fallback to JSON data if Firestore fails / Firestore失敗時のJSONデータへのフォールバック

  BR (A.1): CRUD Operations - Read recipe data from Firestore
  BR (A.1): CRUD操作 - Firestoreからレシピデータを読み込み

  BR (E.1): Rating/Review System - Integrated via RatingComponent
  BR (E.1): 評価・レビューシステム - RatingComponentを介して統合

  BR (E.3): Accessibility - Semantic HTML structure and icon labels
  BR (E.3): アクセシビリティ - セマンティックHTML構造とアイコンラベル
-->

<template>
  <div class="recipe-detail">
    <div class="container-fluid px-4 py-4">
      <!--
        Back Button / 戻るボタン
        Navigation back to recipes list page
        レシピ一覧ページへの戻りナビゲーション
      -->
      <div class="mb-3">
        <router-link to="/recipes" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2" aria-hidden="true"></i>Back to Recipes
        </router-link>
      </div>

      <!--
        Recipe Not Found Message / レシピが見つからないメッセージ
        Displayed when recipe ID doesn't exist in database
        レシピIDがデータベースに存在しない場合に表示
      -->
      <div v-if="!recipe" class="text-center py-5">
        <h3>Recipe not found</h3>
        <p class="text-muted">The recipe you're looking for doesn't exist.</p>
      </div>

      <!--
        Recipe Details Display / レシピ詳細表示
        Main content area showing all recipe information
        すべてのレシピ情報を表示するメインコンテンツエリア
      -->
      <div v-else>
        <!-- ============================================================================
             Header Information / ヘッダー情報
             Recipe image, title, description, and author information
             レシピ画像、タイトル、説明、著者情報
             ============================================================================ -->
        <div class="row mb-4">
          <!-- Recipe Image / レシピ画像 -->
          <div class="col-lg-6">
            <img :src="recipe.image" :alt="recipe.title" class="img-fluid rounded" />
          </div>

          <!-- Recipe Information / レシピ情報 -->
          <div class="col-lg-6">
            <h1 class="h2 mb-3">{{ recipe.title }}</h1>
            <p class="text-muted mb-3">{{ recipe.description }}</p>

            <!--
              Author Information Card / 著者情報カード
              Displays recipe author's name, country, and university
              レシピ著者の名前、国、大学を表示
            -->
            <div class="card mb-3">
              <div class="card-body">
                <h6 class="card-title">Recipe by</h6>
                <div class="d-flex align-items-center">
                  <img
                    :src="getAuthorAvatar(recipe.author)"
                    class="rounded-circle me-3"
                    width="40"
                    height="40"
                    :alt="`${recipe.author.name} avatar`"
                  />
                  <div>
                    <div class="fw-bold">{{ recipe.author.name }}</div>
                    <small class="text-muted"
                      >{{ recipe.author.country }} • {{ recipe.author.university }}</small
                    >
                  </div>
                </div>
              </div>
            </div>

            <!--
              Basic Information Grid / 基本情報グリッド
              Displays cooking time, servings, difficulty, and cuisine type
              調理時間、人数、難易度、料理タイプを表示
            -->
            <div class="row g-3">
              <!-- Cooking Time / 調理時間 -->
              <div class="col-6">
                <div class="text-center p-3 bg-light rounded">
                  <i class="fas fa-clock text-primary mb-2" aria-hidden="true"></i>
                  <div class="small text-muted">Cooking Time</div>
                  <div class="fw-bold">{{ recipe.cookingTime }}</div>
                </div>
              </div>

              <!-- Servings / 人数 -->
              <div class="col-6">
                <div class="text-center p-3 bg-light rounded">
                  <i class="fas fa-users text-success mb-2" aria-hidden="true"></i>
                  <div class="small text-muted">Servings</div>
                  <div class="fw-bold">{{ recipe.servings }}</div>
                </div>
              </div>

              <!-- Difficulty / 難易度 -->
              <div class="col-6">
                <div class="text-center p-3 bg-light rounded">
                  <i class="fas fa-chart-bar text-warning mb-2" aria-hidden="true"></i>
                  <div class="small text-muted">Difficulty</div>
                  <div class="fw-bold">{{ recipe.difficulty }}</div>
                </div>
              </div>

              <!-- Cuisine Type / 料理タイプ -->
              <div class="col-6">
                <div class="text-center p-3 bg-light rounded">
                  <i class="fas fa-globe text-info mb-2" aria-hidden="true"></i>
                  <div class="small text-muted">Cuisine</div>
                  <div class="fw-bold">{{ recipe.cuisine }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--
          Tags Display / タグ表示
          Shows recipe category tags
          レシピカテゴリタグを表示
        -->
        <div class="mb-4">
          <span v-for="tag in recipe.tags" :key="tag" class="badge bg-secondary me-2 mb-2">
            {{ tag }}
          </span>
        </div>

        <!-- ============================================================================
             Ingredients and Instructions / 材料と手順
             Two-column layout for ingredients list and cooking instructions
             材料リストと調理手順の2列レイアウト
             ============================================================================ -->
        <div class="row">
          <!-- Left Column: Ingredients and Nutrition / 左列: 材料と栄養情報 -->
          <div class="col-lg-4">
            <!--
              Ingredients Card / 材料カード
              List of all ingredients needed for the recipe
              レシピに必要なすべての材料のリスト
            -->
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-list-ul me-2" aria-hidden="true"></i>Ingredients
                </h5>
              </div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="mb-2">
                    <i class="fas fa-check text-success me-2" aria-hidden="true"></i>
                    {{ ingredient }}
                  </li>
                </ul>
              </div>
            </div>

            <!--
              Nutritional Information Card / 栄養情報カード
              Displays calories, protein, carbs, and fat per serving
              カロリー、タンパク質、炭水化物、脂質を1人分で表示
            -->
            <div class="card mt-3" v-if="recipe.nutritionInfo">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="fas fa-heartbeat me-2" aria-hidden="true"></i>Nutrition (per serving)
                </h6>
              </div>
              <div class="card-body">
                <div class="row text-center">
                  <div class="col-6 mb-2">
                    <div class="fw-bold">{{ recipe.nutritionInfo.calories }}</div>
                    <small class="text-muted">Calories</small>
                  </div>
                  <div class="col-6 mb-2">
                    <div class="fw-bold">{{ recipe.nutritionInfo.protein }}</div>
                    <small class="text-muted">Protein</small>
                  </div>
                  <div class="col-6">
                    <div class="fw-bold">{{ recipe.nutritionInfo.carbs }}</div>
                    <small class="text-muted">Carbs</small>
                  </div>
                  <div class="col-6">
                    <div class="fw-bold">{{ recipe.nutritionInfo.fat }}</div>
                    <small class="text-muted">Fat</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Cooking Instructions / 右列: 調理手順 -->
          <div class="col-lg-8">
            <!--
              Instructions Card / 手順カード
              Step-by-step cooking instructions in ordered list
              順序付きリストでの段階的な調理手順
            -->
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-utensils me-2" aria-hidden="true"></i>Instructions
                </h5>
              </div>
              <div class="card-body">
                <ol class="instructions-list">
                  <li
                    v-for="(instruction, index) in recipe.instructions"
                    :key="index"
                    class="instruction-item"
                  >
                    {{ instruction }}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <!--
          BR (E.1): Rating/Review System - Rating Component Integration
          BR (E.1): 評価・レビューシステム - 評価コンポーネント統合

          Allows users to rate and review the recipe
          ユーザーがレシピを評価・レビューできるようにする
        -->
        <RatingComponent target-type="recipe" :target-id="recipe.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
// ============================================================================
// Imports / インポート
// ============================================================================
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'
import RatingComponent from '../components/RatingComponent.vue'

// ============================================================================
// State Management / 状態管理
// ============================================================================
const route = useRoute()
const recipe = ref(null) // Recipe data / レシピデータ
const loading = ref(false) // Loading state / ローディング状態

// ============================================================================
// Methods / メソッド
// ============================================================================

/**
 * BR (A.1): CRUD Operations - Get recipe data from Firestore
 * BR (A.1): CRUD操作 - Firestoreからレシピデータを取得
 *
 * Fetches recipe document from Firestore by ID
 * Falls back to JSON file if Firestore fetch fails
 *
 * IDでFirestoreからレシピドキュメントを取得
 * Firestore取得が失敗した場合はJSONファイルにフォールバック
 *
 * @param {string} id - Recipe ID / レシピID
 * @returns {object|null} Recipe data or null if not found / レシピデータまたは見つからない場合はnull
 */
const getRecipeById = async (id) => {
  loading.value = true
  try {
    console.log('Fetching recipe with ID:', id)

    // Get document from Firestore / Firestoreからドキュメントを取得
    const docRef = doc(db, 'recipes', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log('Recipe found in Firestore:', docSnap.data())
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      console.log('No recipe found in Firestore with ID:', id)

      // Fallback: Load from JSON file / フォールバック: JSONファイルから読み込み
      const response = await fetch('/src/assets/JSON/recipes.json')
      const recipes = await response.json()
      return recipes.find((recipe) => recipe.id === id)
    }
  } catch (error) {
    console.error('Error loading recipe from Firestore:', error)

    // If error occurs, fallback to JSON file / エラーが発生した場合、JSONファイルからフォールバック
    try {
      const response = await fetch('/src/assets/JSON/recipes.json')
      const recipes = await response.json()
      return recipes.find((recipe) => recipe.id === id)
    } catch (jsonError) {
      console.error('Error loading recipe from JSON:', jsonError)
      return null
    }
  } finally {
    loading.value = false
  }
}

/**
 * Generate author avatar URL / 著者アバターURLを生成
 *
 * Creates avatar image from author name using UI Avatars API
 * UI Avatars APIを使用して著者名からアバター画像を作成
 *
 * @param {object} author - Author object with name property / 名前プロパティを持つ著者オブジェクト
 * @returns {string} Avatar image URL / アバター画像URL
 */
const getAuthorAvatar = (author) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=40&background=007bff&color=ffffff`
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * On Component Mount / コンポーネントマウント時
 *
 * Fetches recipe data when component is mounted
 * Gets recipe ID from route parameters and loads recipe details
 *
 * コンポーネントがマウントされたときにレシピデータを取得
 * ルートパラメータからレシピIDを取得し、レシピ詳細を読み込む
 */
onMounted(async () => {
  const recipeId = route.params.id
  if (recipeId) {
    recipe.value = await getRecipeById(recipeId)
  }
})
</script>

<style scoped>
/* Overall page layout / ページ全体のレイアウト */
.recipe-detail {
  padding-top: 3.5em;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Adjustments for desktop with sidebar / デスクトップでサイドバーがある場合の調整 */
@media (min-width: 992px) {
  .recipe-detail {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

/* Mobile Compatible / モバイル対応 */
@media (max-width: 768px) {
  .recipe-detail {
    padding-bottom: 4em;
  }
}

/* Numbered list styling / 番号付きリストのスタイリング */
.list-group-numbered {
  counter-reset: section;
}

.list-group-numbered > .list-group-item::before {
  counter-increment: section;
  content: counter(section);
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.list-group-numbered > .list-group-item {
  padding-left: 2.5em;
  position: relative;
}

/* Instructions list styling / 手順リストのスタイリング */
.instructions-list {
  padding-left: 2rem;
  line-height: 1.6;
}

.instruction-item {
  margin-bottom: 1rem;
  padding-left: 0.5rem;
}
</style>
