<template>
  <div class="events-page">
    <div class="container-fluid py-4">
      <!-- ヘッダー -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">
                <i class="fas fa-calendar-alt me-2 text-primary"></i>
                Events
              </h2>
              <p class="text-muted">Discover and join cooking workshops and food events</p>
            </div>
            <button class="btn btn-primary" @click="showAddEventModal = true">
              <i class="fas fa-plus me-2"></i>
              Create Event
            </button>
          </div>
        </div>
      </div>

      <!-- BR (D.3): Interactive Table Data - Table #2 -->
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
                    placeholder="Search events..."
                    v-model="filters['global'].value"
                  />
                </div>
              </div>

              <!-- PrimeVue DataTable -->
              <DataTable
                v-model:filters="filters"
                :value="events"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50]"
                filterDisplay="row"
                :globalFilterFields="['title', 'location', 'type', 'organizer']"
                sortMode="multiple"
                removableSort
                :loading="loading"
                responsiveLayout="scroll"
                class="modern-table"
              >
                <!-- Event Title Column -->
                <Column
                  field="title"
                  header="Event Title"
                  :sortable="true"
                  style="min-width: 250px"
                >
                  <template #body="{ data }">
                    <div>
                      <strong>{{ data.title }}</strong>
                      <br />
                      <small class="text-muted">{{ data.description }}</small>
                    </div>
                  </template>
                  <template #filter="{ filterModel, filterCallback }">
                    <input
                      type="text"
                      v-model="filterModel.value"
                      @input="filterCallback()"
                      class="form-control form-control-sm"
                      placeholder="Search by title"
                    />
                  </template>
                </Column>

                <!-- Date Column -->
                <Column field="date" header="Date" :sortable="true" style="min-width: 150px">
                  <template #body="{ data }">
                    <i class="far fa-calendar me-1"></i>
                    {{ formatDate(data.date) }}
                  </template>
                </Column>

                <!-- Location Column -->
                <Column
                  field="location"
                  header="Location"
                  :sortable="true"
                  style="min-width: 180px"
                >
                  <template #body="{ data }">
                    <i class="fas fa-map-marker-alt me-1 text-danger"></i>
                    {{ data.location }}
                  </template>
                  <template #filter="{ filterModel, filterCallback }">
                    <input
                      type="text"
                      v-model="filterModel.value"
                      @input="filterCallback()"
                      class="form-control form-control-sm"
                      placeholder="Search by location"
                    />
                  </template>
                </Column>

                <!-- Type Column -->
                <Column field="type" header="Event Type" :sortable="true" style="min-width: 150px">
                  <template #body="{ data }">
                    <span
                      class="badge"
                      :class="{
                        'bg-primary': data.type === 'Workshop',
                        'bg-success': data.type === 'Cooking Class',
                        'bg-info': data.type === 'Food Festival',
                        'bg-warning': data.type === 'Meetup',
                      }"
                    >
                      {{ data.type }}
                    </span>
                  </template>
                  <template #filter="{ filterModel, filterCallback }">
                    <select
                      v-model="filterModel.value"
                      @change="filterCallback()"
                      class="form-select form-select-sm"
                    >
                      <option value="">All Types</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Cooking Class">Cooking Class</option>
                      <option value="Food Festival">Food Festival</option>
                      <option value="Meetup">Meetup</option>
                    </select>
                  </template>
                </Column>

                <!-- Organizer Column -->
                <Column
                  field="organizer"
                  header="Organizer"
                  :sortable="true"
                  style="min-width: 150px"
                >
                  <template #body="{ data }">
                    <i class="fas fa-user me-1"></i>
                    {{ data.organizer }}
                  </template>
                  <template #filter="{ filterModel, filterCallback }">
                    <input
                      type="text"
                      v-model="filterModel.value"
                      @input="filterCallback()"
                      class="form-control form-control-sm"
                      placeholder="Search by organizer"
                    />
                  </template>
                </Column>

                <!-- Participants Column -->
                <Column
                  field="participants"
                  header="Participants"
                  :sortable="true"
                  style="min-width: 120px"
                >
                  <template #body="{ data }">
                    <div class="text-center">
                      <i class="fas fa-users me-1"></i>
                      {{ data.participants }} / {{ data.maxParticipants }}
                    </div>
                  </template>
                </Column>

                <!-- Status Column -->
                <Column field="status" header="Status" :sortable="true" style="min-width: 120px">
                  <template #body="{ data }">
                    <span
                      class="badge"
                      :class="{
                        'bg-success': data.status === 'Open',
                        'bg-warning': data.status === 'Almost Full',
                        'bg-danger': data.status === 'Full',
                        'bg-secondary': data.status === 'Cancelled',
                      }"
                    >
                      {{ data.status }}
                    </span>
                  </template>
                </Column>

                <!-- Actions Column -->
                <Column header="Actions" style="min-width: 150px">
                  <template #body="{ data }">
                    <button class="btn btn-sm btn-outline-primary me-1" @click="viewEvent(data)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-success"
                      @click="joinEvent(data)"
                      :disabled="data.status === 'Full' || data.status === 'Cancelled'"
                    >
                      <i class="fas fa-user-plus"></i>
                    </button>
                  </template>
                </Column>

                <!-- Empty State -->
                <template #empty>
                  <div class="text-center py-5">
                    <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No events found.</p>
                  </div>
                </template>

                <!-- Loading State -->
                <template #loading>
                  <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted mt-2">Loading events...</p>
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
const events = ref([])
const loading = ref(false)
const showAddEventModal = ref(false)

// Filters for DataTable
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  location: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
  organizer: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

/**
 * Firestoreからイベントデータを取得
 */
const fetchEvents = async () => {
  loading.value = true
  try {
    const eventsCollection = collection(db, 'events')
    const snapshot = await getDocs(eventsCollection)

    events.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log('Loaded events:', events.value.length)
  } catch (error) {
    console.error('Error fetching events:', error)

    // Firestoreにデータがない場合、サンプルデータを表示
    if (events.value.length === 0) {
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
  events.value = [
    {
      id: '1',
      title: 'Japanese Sushi Making Workshop',
      description: 'Learn to make authentic sushi rolls',
      date: '2025-10-25',
      location: 'Melbourne CBD',
      type: 'Workshop',
      organizer: 'Chef Tanaka',
      participants: 12,
      maxParticipants: 20,
      status: 'Open',
    },
    {
      id: '2',
      title: 'Italian Pasta Masterclass',
      description: 'Master the art of fresh pasta',
      date: '2025-10-28',
      location: 'Carlton',
      type: 'Cooking Class',
      organizer: 'Chef Giovanni',
      participants: 18,
      maxParticipants: 20,
      status: 'Almost Full',
    },
    {
      id: '3',
      title: 'Asian Street Food Festival',
      description: 'Taste authentic street food',
      date: '2025-11-05',
      location: 'Federation Square',
      type: 'Food Festival',
      organizer: 'Melbourne Food Council',
      participants: 150,
      maxParticipants: 500,
      status: 'Open',
    },
    {
      id: '4',
      title: 'Vegan Cooking Basics',
      description: 'Introduction to plant-based cooking',
      date: '2025-10-30',
      location: 'Fitzroy',
      type: 'Workshop',
      organizer: 'Green Kitchen',
      participants: 15,
      maxParticipants: 15,
      status: 'Full',
    },
    {
      id: '5',
      title: 'French Pastry Workshop',
      description: 'Create delicious pastries',
      date: '2025-11-02',
      location: 'South Yarra',
      type: 'Cooking Class',
      organizer: 'Chef Pierre',
      participants: 8,
      maxParticipants: 12,
      status: 'Open',
    },
    {
      id: '6',
      title: 'Thai Cuisine Meetup',
      description: 'Share Thai cooking experiences',
      date: '2025-11-10',
      location: 'Richmond',
      type: 'Meetup',
      organizer: 'Thai Food Lovers',
      participants: 25,
      maxParticipants: 30,
      status: 'Open',
    },
    {
      id: '7',
      title: 'Mexican Taco Night',
      description: 'Learn authentic taco recipes',
      date: '2025-11-08',
      location: 'Brunswick',
      type: 'Workshop',
      organizer: 'La Cocina',
      participants: 10,
      maxParticipants: 15,
      status: 'Open',
    },
    {
      id: '8',
      title: 'Indian Curry Masterclass',
      description: 'Master Indian spice blends',
      date: '2025-11-12',
      location: 'Dandenong',
      type: 'Cooking Class',
      organizer: 'Spice Kitchen',
      participants: 14,
      maxParticipants: 16,
      status: 'Almost Full',
    },
    {
      id: '9',
      title: 'Korean BBQ Experience',
      description: 'Traditional Korean BBQ techniques',
      date: '2025-11-15',
      location: 'Box Hill',
      type: 'Workshop',
      organizer: 'Seoul Kitchen',
      participants: 0,
      maxParticipants: 20,
      status: 'Cancelled',
    },
    {
      id: '10',
      title: 'Coffee & Dessert Pairing',
      description: 'Perfect coffee and dessert combinations',
      date: '2025-11-18',
      location: 'Docklands',
      type: 'Meetup',
      organizer: 'Coffee Lovers Club',
      participants: 22,
      maxParticipants: 25,
      status: 'Almost Full',
    },
    {
      id: '11',
      title: 'Chinese Dumpling Workshop',
      description: 'Learn to fold perfect dumplings',
      date: '2025-11-20',
      location: 'Glen Waverley',
      type: 'Workshop',
      organizer: 'Dumpling House',
      participants: 6,
      maxParticipants: 12,
      status: 'Open',
    },
    {
      id: '12',
      title: 'Spanish Tapas Night',
      description: 'Create authentic Spanish tapas',
      date: '2025-11-22',
      location: 'St Kilda',
      type: 'Cooking Class',
      organizer: 'Casa España',
      participants: 11,
      maxParticipants: 15,
      status: 'Open',
    },
  ]
}

/**
 * 日付をフォーマット
 */
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * イベントを表示
 */
const viewEvent = (event) => {
  console.log('View event:', event)
  alert(`Viewing event: ${event.title}`)
}

/**
 * イベントに参加
 */
const joinEvent = (event) => {
  if (event.participants < event.maxParticipants) {
    event.participants++

    if (event.participants >= event.maxParticipants) {
      event.status = 'Full'
    } else if (event.participants >= event.maxParticipants * 0.8) {
      event.status = 'Almost Full'
    }

    alert(`You have joined: ${event.title}`)
  }
}

// コンポーネントマウント時にデータ取得
onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.events-page {
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
