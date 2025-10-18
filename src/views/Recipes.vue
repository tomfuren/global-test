<template>
  <div class="recipes-page">
    <div class="container-fluid py-4">
      <!-- ヘッダー -->
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
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <!-- グローバル検索 -->
              <div class="mb-3">
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

              <!-- PrimeVue DataTable -->
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
                <!-- Title Column -->
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
                <Column
                  field="author.name"
                  header="Author"
                  :sortable="true"
                  style="min-width: 150px"
                >
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
                <Column field="cuisine" header="Cuisine" :sortable="true" style="min-width: 150px">
                  <template #body="{ data }">
                    <span class="badge bg-info">{{ data.cuisine }}</span>
                  </template>
                  <template #filter="{ filterModel, filterCallback }">
                    <select
                      v-model="filterModel.value"
                      @change="filterCallback()"
                      class="form-select form-select-sm"
                    >
                      <option value="">All Cuisines</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Italian">Italian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Mexican">Mexican</option>
                      <option value="Indian">Indian</option>
                      <option value="Thai">Thai</option>
                      <option value="American">American</option>
                      <option value="French">French</option>
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
                      <option value="">All Levels</option>
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
                    <button class="btn btn-sm btn-outline-primary" @click="viewRecipe(data)">
                      <i class="fas fa-eye"></i>
                    </button>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'

// PrimeVue FilterMatchMode
const FilterMatchMode = {
  CONTAINS: 'contains',
  EQUALS: 'equals',
}

// State
const recipes = ref([])
const loading = ref(false)

// Filters for DataTable
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'author.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
  cuisine: { value: null, matchMode: FilterMatchMode.EQUALS },
  difficulty: { value: null, matchMode: FilterMatchMode.EQUALS },
})

/**
 * Firestoreからレシピデータを取得
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

    // Firestoreにデータがない場合、サンプルデータを表示
    if (recipes.value.length === 0) {
      loadSampleData()
    }
  } finally {
    loading.value = false
  }
}

/**
 * サンプルデータを読み込み
 */
const loadSampleData = () => {
  recipes.value = [
    {
      id: '1',
      title: 'Classic Sushi Rolls',
      cuisine: 'Japanese',
      difficulty: 'Medium',
      cookingTime: '45 mins',
      author: { name: 'Chef Tanaka' },
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    },
    {
      id: '2',
      title: 'Carbonara Pasta',
      cuisine: 'Italian',
      difficulty: 'Easy',
      cookingTime: '30 mins',
      author: { name: 'Chef Giovanni' },
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    },
    {
      id: '3',
      title: 'Kung Pao Chicken',
      cuisine: 'Chinese',
      difficulty: 'Medium',
      cookingTime: '35 mins',
      author: { name: 'Chef Wang' },
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
    },
    {
      id: '4',
      title: 'Chicken Tacos',
      cuisine: 'Mexican',
      difficulty: 'Easy',
      cookingTime: '25 mins',
      author: { name: 'Chef Maria' },
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    },
    {
      id: '5',
      title: 'Butter Chicken',
      cuisine: 'Indian',
      difficulty: 'Medium',
      cookingTime: '50 mins',
      author: { name: 'Chef Singh' },
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    },
    {
      id: '6',
      title: 'Pad Thai',
      cuisine: 'Thai',
      difficulty: 'Medium',
      cookingTime: '30 mins',
      author: { name: 'Chef Somchai' },
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
    },
    {
      id: '7',
      title: 'Beef Burger',
      cuisine: 'American',
      difficulty: 'Easy',
      cookingTime: '20 mins',
      author: { name: 'Chef Mike' },
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    },
    {
      id: '8',
      title: 'Ramen Bowl',
      cuisine: 'Japanese',
      difficulty: 'Hard',
      cookingTime: '60 mins',
      author: { name: 'Chef Yamamoto' },
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    },
    {
      id: '9',
      title: 'Margherita Pizza',
      cuisine: 'Italian',
      difficulty: 'Medium',
      cookingTime: '40 mins',
      author: { name: 'Chef Antonio' },
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    },
    {
      id: '10',
      title: 'Spring Rolls',
      cuisine: 'Chinese',
      difficulty: 'Easy',
      cookingTime: '30 mins',
      author: { name: 'Chef Li' },
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    },
    {
      id: '11',
      title: 'Croissant',
      cuisine: 'French',
      difficulty: 'Hard',
      cookingTime: '120 mins',
      author: { name: 'Chef Pierre' },
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    },
    {
      id: '12',
      title: 'Guacamole',
      cuisine: 'Mexican',
      difficulty: 'Easy',
      cookingTime: '10 mins',
      author: { name: 'Chef Carlos' },
      image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400',
    },
  ]
}

/**
 * Author avatar generation
 */
const getAuthorAvatar = (author) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=40&background=007bff&color=ffffff`
}

/**
 * レシピを表示
 */
const viewRecipe = (recipe) => {
  console.log('View recipe:', recipe)
  alert(`Viewing recipe: ${recipe.title}`)
}

// コンポーネントマウント時にデータ取得
onMounted(() => {
  loadRecipes()
})
</script>

<style scoped>
.recipes-page {
  min-height: calc(100vh - 56px);
  background-color: #f8f9fa;
}

.card {
  border: none;
  border-radius: 8px;
}

/* PrimeVue DataTableのカスタムスタイル */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-datatable-thead > tr > th) {
  background-color: #007bff;
  color: white;
  font-weight: 600;
  padding: 1rem;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f0f8ff;
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
