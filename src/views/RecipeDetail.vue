<template>
  <div class="recipe-detail">
    <div class="container-fluid px-4 py-4">
      <!-- Back button -->
      <div class="mb-3">
        <router-link to="/recipes" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i>Back to Recipes
        </router-link>
      </div>

      <!-- If you can't find a recipe -->
      <div v-if="!recipe" class="text-center py-5">
        <h3>Recipe not found</h3>
        <p class="text-muted">The recipe you're looking for doesn't exist.</p>
      </div>

      <!-- Recipe details -->
      <div v-else>
        <!-- Header information -->
        <div class="row mb-4">
          <div class="col-lg-6">
            <img 
              :src="recipe.image" 
              :alt="recipe.title"
              class="img-fluid rounded"
            >
          </div>
          <div class="col-lg-6">
            <h1 class="h2 mb-3">{{ recipe.title }}</h1>
            <p class="text-muted mb-3">{{ recipe.description }}</p>
            
            <!-- Author information -->
            <div class="card mb-3">
              <div class="card-body">
                <h6 class="card-title">Recipe by</h6>
                <div class="d-flex align-items-center">
                  <img 
                    :src="getAuthorAvatar(recipe.author)" 
                    class="rounded-circle me-3" 
                    width="40" 
                    height="40"
                  >
                  <div>
                    <div class="fw-bold">{{ recipe.author.name }}</div>
                    <small class="text-muted">{{ recipe.author.country }} • {{ recipe.author.university }}</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- basic information -->
            <div class="row g-3">
              <div class="col-6">
                <div class="text-center p-3 bg-light rounded">
                  <i class="fas fa-clock text-primary mb-2"></i>
                  <div class="small text-muted">Cooking Time</div>
                  <div class="fw-bold">{{ recipe.cookingTime }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="text-center p-3 bg-light rounded">
                  <i class="fas fa-users text-success mb-2"></i>
                  <div class="small text-muted">Servings</div>
                  <div class="fw-bold">{{ recipe.servings }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="text-center p-3 bg-light rounded">
                  <i class="fas fa-chart-bar text-warning mb-2"></i>
                  <div class="small text-muted">Difficulty</div>
                  <div class="fw-bold">{{ recipe.difficulty }}</div>
                </div>
              </div>
              <div class="col-6">
                <div class="text-center p-3 bg-light rounded">
                  <i class="fas fa-globe text-info mb-2"></i>
                  <div class="small text-muted">Cuisine</div>
                  <div class="fw-bold">{{ recipe.cuisine }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- tags -->
        <div class="mb-4">
          <span 
            v-for="tag in recipe.tags" 
            :key="tag"
            class="badge bg-secondary me-2 mb-2"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Materials and Procedure -->
        <div class="row">
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-list-ul me-2"></i>Ingredients
                </h5>
              </div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li 
                    v-for="(ingredient, index) in recipe.ingredients" 
                    :key="index"
                    class="mb-2"
                  >
                    <i class="fas fa-check text-success me-2"></i>
                    {{ ingredient }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Nutritional Information -->
            <div class="card mt-3" v-if="recipe.nutritionInfo">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="fas fa-heartbeat me-2"></i>Nutrition (per serving)
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

          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="fas fa-utensils me-2"></i>Instructions
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

        <!-- Evaluation section -->
        <RatingComponent 
            target-type="recipe" 
            :target-id="recipe.id" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import RatingComponent from '../components/RatingComponent.vue'

const route = useRoute()
const recipe = ref(null)

// レシピデータを取得
// Get recipe data
const getRecipeById = async (id) => {
  try {
    // JSONファイルからレシピデータを読み込み
    // Read recipe data from a JSON file
    const response = await fetch('/src/assets/JSON/recipes.json')
    const recipes = await response.json()
    return recipes.find(recipe => recipe.id === id)
  } catch (error) {
    console.error('Error loading recipe:', error)
    return null
  }
}

// Author avatar generation
const getAuthorAvatar = (author) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=40&background=007bff&color=ffffff`
}

onMounted(async () => {
  const recipeId = route.params.id
  if (recipeId) {
    recipe.value = await getRecipeById(recipeId)
  }
})
</script>

<style scoped>
.recipe-detail {
  padding-top: 3.5em;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Adjustments for desktop with sidebar */
@media (min-width: 992px) {
  .recipe-detail {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

/* Mobile Compatible */
@media (max-width: 768px) {
  .recipe-detail {
    padding-bottom: 4em;
  }
}

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

.instructions-list {
  padding-left: 2rem;
  line-height: 1.6;
}

.instruction-item {
  margin-bottom: 1rem;
  padding-left: 0.5rem;
}
</style>