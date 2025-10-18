<template>
  <div class="recipes-page">
    <div class="container-fluid px-4 py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <i class="fas fa-utensils text-success me-3 fs-4"></i>
              <h1 class="h3 mb-0">Recipe Collection</h1>
            </div>
            <!-- View Toggle Buttons -->
            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn"
                :class="viewMode === 'card' ? 'btn-primary' : 'btn-outline-primary'"
                @click="viewMode = 'card'"
                title="Card View"
              >
                <i class="fas fa-th-large"></i>
              </button>
              <button
                type="button"
                class="btn"
                :class="viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'"
                @click="viewMode = 'table'"
                title="Table View"
              >
                <i class="fas fa-table"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== CARD VIEW ===== -->
      <div v-show="viewMode === 'card'">
        <!-- Search and filter -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <input
                  type="search"
                  class="form-control"
                  placeholder="Search recipes..."
                  v-model="searchQuery"
                />
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

        <!-- Recipe Cards -->
        <div class="row g-4">
          <div v-for="recipe in filteredRecipes" :key="recipe.id" class="col-lg-4 col-md-6">
            <div class="card h-100 recipe-card">
              <img :src="recipe.image" :alt="recipe.title" class="card-img-top recipe-image" />

              <div class="card-body d-flex flex-column p-4">
                <h5 class="card-title mb-3">{{ recipe.title }}</h5>

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div class="author-info">
                    <div class="d-flex align-items-center">
                      <img
                        :src="getAuthorAvatar(recipe.author)"
                        class="rounded-circle me-2"
                        width="24"
                        height="24"
                      />
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

                <div class="recipe-meta mb-4">
                  <div class="d-flex justify-content-between text-muted small">
                    <span><i class="fas fa-clock me-1"></i>{{ recipe.cookingTime }}</span>
                    <span><i class="fas fa-signal me-1"></i>{{ recipe.difficulty }}</span>
                    <span><i class="fas fa-globe me-1"></i>{{ recipe.cuisine }}</span>
                  </div>
                </div>

                <div class="mt-auto">
                  <router-link :to="'/recipes/' + recipe.id" class="btn btn-primary w-100">
                    <i class="fas fa-eye me-2"></i>View Recipe
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No results for card view -->
        <div v-if="filteredRecipes.length === 0" class="text-center py-5">
          <i class="fas fa-search fs-1 text-muted mb-3"></i>
          <h4>No recipes found</h4>
          <p class="text-muted">Try adjusting your search criteria</p>
        </div>
      </div>

      <!-- ===== TABLE VIEW (BR D.3) ===== -->
      <div v-show="viewMode === 'table'">
        <div class="card shadow-sm">
          <div class="card-body">
            <!-- Global Search for Table -->
            <div class="mb-3">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search across all fields..."
                  v-model="tableFilters['global'].value"
                />
              </div>
            </div>

            <!-- PrimeVue DataTable - BR (D.3) -->
            <DataTable
              v-model:filters="tableFilters"
              :value="tableRecipes"
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
              <!-- Title Column -->
              <Column field="title" header="Recipe Name" :sortable="true" style="min-width: 250px">
                <template #body="{ data }">
                  <div class="d-flex align-items-center">
                    <img
                      :src="data.image"
                      class="rounded me-2"
                      width="40"
                      height="40"
                      style="object-fit: cover"
                    />
                    <strong>{{ data.title }}</strong>
                  </div>
                </template>
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

              <!-- Author Column -->
              <Column field="author.name" header="Author" :sortable="true" style="min-width: 150px">
                <template #body="{ data }">
                  <div class="d-flex align-items-center">
                    <img
                      :src="getAuthorAvatar(data.author)"
                      class="rounded-circle me-2"
                      width="24"
                      height="24"
                    />
                    <span>{{ data.author.name }}</span>
                  </div>
                </template>
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

              <!-- Cuisine Column -->
              <Column field="cuisine" header="Cuisine" :sortable="true" style="min-width: 130px">
                <template #body="{ data }">
                  <span class="badge bg-info">{{ data.cuisine }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                  <select
                    v-model="filterModel.value"
                    @change="filterCallback()"
                    class="form-select form-select-sm"
                  >
                    <option value="">All</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Korean">Korean</option>
                    <option value="Thai">Thai</option>
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </template>
              </Column>

              <!-- Difficulty Column -->
              <Column
                field="difficulty"
                header="Difficulty"
                :sortable="true"
                style="min-width: 120px"
              >
                <template #body="{ data }">
                  <span
                    class="badge"
                    :class="{
                      'bg-success': data.difficulty === 'Easy',
                      'bg-warning': data.difficulty === 'Medium',
                      'bg-danger': data.difficulty === 'Hard',
                    }"
                  >
                    {{ data.difficulty }}
                  </span>
                </template>
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

              <!-- Cooking Time Column -->
              <Column
                field="cookingTime"
                header="Cooking Time"
                :sortable="true"
                style="min-width: 120px"
              >
                <template #body="{ data }">
                  <i class="far fa-clock me-1"></i>
                  {{ data.cookingTime }}
                </template>
              </Column>

              <!-- Actions Column -->
              <Column header="Actions" style="min-width: 100px">
                <template #body="{ data }">
                  <router-link :to="'/recipes/' + data.id" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-eye"></i>
                  </router-link>
                </template>
              </Column>

              <!-- Empty State -->
              <template #empty>
                <div class="text-center py-5">
                  <i class="fas fa-search fa-3x text-muted mb-3"></i>
                  <p class="text-muted">No recipes found.</p>
                </div>
              </template>

              <!-- Loading State -->
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RatingComponent from '../components/RatingComponent.vue'

// PrimeVue FilterMatchMode
const FilterMatchMode = {
  CONTAINS: 'contains',
  EQUALS: 'equals',
}

// State
const recipes = ref([])
const loading = ref(false)
const viewMode = ref('card') // 'card' or 'table'

// Card View Filters
const searchQuery = ref('')
const cuisineFilter = ref('')
const difficultyFilter = ref('')

// Table View Filters
const tableFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'author.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
  cuisine: { value: null, matchMode: FilterMatchMode.EQUALS },
  difficulty: { value: null, matchMode: FilterMatchMode.EQUALS },
})

/**
 * Load recipes from JSON file
 */
const loadRecipes = async () => {
  loading.value = true
  try {
    const response = await fetch('/src/assets/JSON/recipes.json')
    const recipesData = await response.json()

    recipes.value = recipesData.map((recipe) => ({
      ...recipe,
    }))
  } catch (error) {
    console.error('Error loading recipes:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Filtered recipes for card view
 */
const filteredRecipes = computed(() => {
  return recipes.value.filter((recipe) => {
    const matchesSearch =
      !searchQuery.value ||
      recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      recipe.author.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCuisine = !cuisineFilter.value || recipe.cuisine === cuisineFilter.value
    const matchesDifficulty =
      !difficultyFilter.value || recipe.difficulty === difficultyFilter.value

    return matchesSearch && matchesCuisine && matchesDifficulty
  })
})

/**
 * Recipes for table view (same data, different presentation)
 */
const tableRecipes = computed(() => recipes.value)

/**
 * Get author avatar
 */
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

@media (min-width: 992px) {
  .recipes-page {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

@media (max-width: 768px) {
  .recipes-page {
    padding-bottom: 4em;
  }
}

/* Card View Styles */
.recipe-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.recipe-image {
  height: 200px;
  object-fit: cover;
}

.recipe-meta {
  border-bottom: 1px solid #f1f3f4;
  padding-bottom: 0.5rem;
}

.author-info {
  font-size: 0.8rem;
  flex-shrink: 0;
}

/* Table View Styles */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-datatable-thead > tr > th) {
  background-color: #28a745;
  color: white;
  font-weight: 600;
  padding: 1rem;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f0fff0;
}

:deep(.p-paginator) {
  padding: 1rem;
  background-color: #f8f9fa;
}

:deep(.p-datatable .p-filter-column input),
:deep(.p-datatable .p-filter-column select) {
  width: 100%;
}
</style>
