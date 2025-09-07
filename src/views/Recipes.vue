<template>
  <div class="recipes-page">
    <div class="container-fluid px-4 py-4">
      <!-- ヘッダー -->
      <div class="d-flex align-items-center mb-4">
        <i class="fas fa-utensils text-success me-3 fs-4"></i>
        <h1 class="h3 mb-0">Recipe Collection</h1>
      </div>

      <!-- 検索とフィルター -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <input 
                type="search" 
                class="form-control" 
                placeholder="Search recipes..."
                v-model="searchQuery"
              >
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="cuisineFilter">
                <option value="">All Cuisines</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Thai">Thai</option>
                <option value="Indian">Indian</option>
                <option value="Chinese">Chinese</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Indonesian">Indonesian</option>
                <option value="Malaysian">Malaysian</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="difficultyFilter">
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- レシピ一覧 -->
      <div class="row g-4">
        <div 
          v-for="recipe in filteredRecipes" 
          :key="recipe.id"
          class="col-lg-4 col-md-6"
        >
          <div class="card h-100 recipe-card">
            <!-- レシピ画像 -->
            <img 
              :src="recipe.image" 
              :alt="recipe.title"
              class="card-img-top recipe-image"
            >
            
            <div class="card-body d-flex flex-column p-4">
              <!-- 1. レシピタイトル -->
              <h5 class="card-title mb-3">{{ recipe.title }}</h5>
              
              <!-- 2. 評価と作者情報を横並び -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <!-- 作者情報（左） -->
                <div class="author-info">
                  <div class="d-flex align-items-center">
                    <img 
                      :src="getAuthorAvatar(recipe.author)" 
                      class="rounded-circle me-2" 
                      width="24" 
                      height="24"
                    >
                    <div>
                      <small class="fw-bold">{{ recipe.author.name }}</small>
                      <small class="text-muted d-block">{{ recipe.author.country }}</small>
                    </div>
                  </div>
                </div>

                <RatingComponent 
                    target-type="recipe" 
                    :target-id="recipe.id" 
                    :display-only="true"
                />
              </div>

              <!-- 3. 基本情報 -->
              <div class="recipe-meta mb-4">
                <div class="d-flex justify-content-between text-muted small">
                  <span><i class="fas fa-clock me-1"></i>{{ recipe.cookingTime }}</span>
                  <span><i class="fas fa-signal me-1"></i>{{ recipe.difficulty }}</span>
                  <span><i class="fas fa-globe me-1"></i>{{ recipe.cuisine }}</span>
                </div>
              </div>

              <!-- 4. アクションボタン -->
              <div class="mt-auto">
                <router-link 
                  :to="'/recipes/' + recipe.id" 
                  class="btn btn-primary w-100"
                >
                  <i class="fas fa-eye me-2"></i>View Recipe
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- レシピが見つからない場合 -->
      <div v-if="filteredRecipes.length === 0" class="text-center py-5">
        <i class="fas fa-search fs-1 text-muted mb-3"></i>
        <h4>No recipes found</h4>
        <p class="text-muted">Try adjusting your search criteria</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RatingComponent from '../components/RatingComponent.vue'

// レシピデータ
const recipes = ref([])
const searchQuery = ref('')
const cuisineFilter = ref('')
const difficultyFilter = ref('')

// JSONファイルからレシピを読み込み
const loadRecipes = async () => {
  try {
    const response = await fetch('/src/assets/JSON/recipes.json')
    const recipesData = await response.json()
    
    // 各レシピ
    recipes.value = recipesData.map(recipe => ({
      ...recipe,
    }))
  } catch (error) {
    console.error('Error loading recipes:', error)
  }
}

// フィルタリング
const filteredRecipes = computed(() => {
  return recipes.value.filter(recipe => {
    const matchesSearch = !searchQuery.value || 
      recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      recipe.author.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCuisine = !cuisineFilter.value || recipe.cuisine === cuisineFilter.value
    const matchesDifficulty = !difficultyFilter.value || recipe.difficulty === difficultyFilter.value
    
    return matchesSearch && matchesCuisine && matchesDifficulty
  })
})

// ユーティリティ関数
const getStarClass = (star, rating) => {
  return star <= rating ? 'text-warning' : 'text-muted'
}

const getAuthorAvatar = (author) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=24&background=007bff&color=ffffff`
}

onMounted(() => {
  loadRecipes()
})
</script>

<style scoped>
.recipes-page {
  padding-top: 3.5em;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* デスクトップでサイドバーがある場合の調整 */
@media (min-width: 992px) {
  .recipes-page {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

/* モバイル対応 */
@media (max-width: 768px) {
  .recipes-page {
    padding-bottom: 4em;
  }
}

.recipe-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.recipe-image {
  height: 200px;
  object-fit: cover;
}

.stars .fa-star {
  font-size: 0.9rem;
  margin-right: 0.1rem;
}

.rating-text {
  font-size: 0.85rem;
  color: #6c757d;
}

.recipe-meta {
  border-bottom: 1px solid #f1f3f4;
  padding-bottom: 0.5rem;
}

.author-info {
  font-size: 0.8rem;
  flex-shrink: 0;
}

.rating-display {
  flex-shrink: 0;
}

/* レスポンシブ調整 */
@media (max-width: 576px) {
  .rating-text {
    font-size: 0.75rem;
  }
  
  .author-info small {
    font-size: 0.7rem;
  }
}
</style>