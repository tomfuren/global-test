<!--
  イベント一覧ページ - PrimeVue DataTableを使用したイベント管理画面
  Events Page - Event management interface using PrimeVue DataTable

  機能 / Features:
  - イベントの検索、ソート、フィルタリング / Event search, sort, and filtering
  - ページネーション対応 / Pagination support
  - イベントへの参加機能 / Event registration functionality
  - リアルタイムステータス更新 / Real-time status updates

  BR (D.3): Interactive Table Data - Table #2 (イベント管理テーブル / Event Management Table)
-->
<template>
  <div class="events-page">
    <div class="container-fluid py-4">
      <!-- ヘッダーセクション / Header Section -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-1">
            <i class="fas fa-calendar-alt me-2 text-primary"></i>
            Events
          </h2>
          <p class="text-muted">Discover and join cooking workshops and food events</p>
        </div>
      </div>

      <!-- BR (D.3): Interactive Table Data - Table #2 -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <!-- グローバル検索バー - 全フィールドを横断検索 / Global Search Bar - Search across all fields -->
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

              <!--
                PrimeVue DataTable - 高度な機能を持つイベント一覧テーブル
                PrimeVue DataTable - Advanced event listing table with rich features

                主要機能 / Key Features:
                - ページネーション: 10/20/50件表示切替 / Pagination: 10/20/50 items per page
                - マルチカラムソート: 複数列で同時ソート可能 / Multi-column sort: Sort by multiple columns
                - 行単位フィルタ: 各列で個別フィルタリング / Row-level filters: Individual filtering per column
                - グローバル検索: title, location, type, organizerを横断検索 / Global search across title, location, type, organizer
                - レスポンシブ対応: スクロール可能なレイアウト / Responsive: Scrollable layout
              -->
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
                <!--
                  イベントタイトル列 - タイトルと説明を表示
                  Event Title Column - Display title and description
                  カスタムボディ: タイトル（太字）+ 説明（小文字、グレー）
                  Custom body: Title (bold) + Description (small, muted)
                -->
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

                <!--
                  日付列 - フォーマットされた日付を表示
                  Date Column - Display formatted date
                  formatDate関数でオーストラリア形式にフォーマット (例: 25 Oct 2025)
                  Formatted to Australian format using formatDate function (e.g., 25 Oct 2025)
                -->
                <Column field="date" header="Date" :sortable="true" style="min-width: 150px">
                  <template #body="{ data }">
                    <i class="far fa-calendar me-1"></i>
                    {{ formatDate(data.date) }}
                  </template>
                </Column>

                <!--
                  場所列 - イベント開催地でフィルタリング可能
                  Location Column - Filterable by event venue
                -->
                <Column
                  field="location"
                  header="Location"
                  :sortable="true"
                  style="min-width: 150px"
                >
                  <template #body="{ data }">
                    <i class="fas fa-map-marker-alt me-1"></i>
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

                <!--
                  イベントタイプ列 - 色分けされたバッジで視覚的に表示
                  Event Type Column - Visually displayed with color-coded badges

                  タイプと色のマッピング / Type to color mapping:
                  - Workshop (ワークショップ) → Primary Blue (青)
                  - Cooking Class (料理教室) → Success Green (緑)
                  - Food Festival (フードフェス) → Info Light Blue (水色)
                  - Meetup (交流会) → Warning Yellow (黄)

                  ドロップダウンフィルタで選択可能 / Selectable via dropdown filter
                -->
                <Column field="type" header="Type" :sortable="true" style="min-width: 150px">
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

                <!--
                  参加者数列 - 現在の参加者数 / 最大参加者数を表示
                  Participants Column - Display current/max participants count
                  形式: 12/20 (12人参加中、最大20人 / 12 joined, max 20)
                -->
                <Column
                  field="participants"
                  header="Participants"
                  :sortable="true"
                  style="min-width: 120px"
                >
                  <template #body="{ data }">
                    <div class="text-center">
                      <i class="fas fa-users me-1"></i>
                      {{ data.participants }}/{{ data.maxParticipants }}
                    </div>
                  </template>
                </Column>

                <!--
                  ステータス列 - イベントの状態を色分けバッジで表示
                  Status Column - Display event status with color-coded badges

                  ステータスと色のマッピング / Status to color mapping:
                  - Open (募集中) → Success Green (緑) - 参加可能
                  - Almost Full (残りわずか) → Warning Yellow (黄) - 80%以上埋まっている
                  - Full (満員) → Danger Red (赤) - 参加不可
                  - Cancelled (中止) → Secondary Gray (灰) - イベント中止
                -->
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

                <!--
                  アクション列 - イベントの閲覧と参加ボタン
                  Actions Column - View and join event buttons

                  機能 / Features:
                  - 閲覧ボタン (Eye icon): イベント詳細を表示 / View event details
                  - 参加ボタン (Plus icon): イベントに参加 / Join event
                    - 満員 (Full) または中止 (Cancelled) の場合は無効化 / Disabled when Full or Cancelled
                -->
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
                      <i class="fas fa-plus"></i> Join
                    </button>
                  </template>
                </Column>

                <!-- Empty State -->
                <template #empty>
                  <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
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
// Vue & Firebase インポート / Vue & Firebase imports
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { seedEvents } from '@/utils/seedEvents'

/**
 * PrimeVue フィルタマッチモード定義
 * PrimeVue Filter Match Mode definitions
 *
 * CONTAINS: 部分一致検索 (テキストフィールド用) / Partial match search (for text fields)
 * EQUALS: 完全一致検索 (ドロップダウン用) / Exact match search (for dropdowns)
 */
const FilterMatchMode = {
  CONTAINS: 'contains',
  EQUALS: 'equals',
}

/**
 * リアクティブステート / Reactive State
 */
// イベント一覧データ / Events list data
const events = ref([])

// ローディング状態 / Loading state
const loading = ref(false)

/**
 * DataTableフィルタ設定
 * DataTable filter configuration
 *
 * 各フィールドのフィルタルールを定義 / Define filter rules for each field:
 * - global: 全フィールド横断検索 / Cross-field search
 * - title: イベント名で検索 / Search by event name
 * - location: 開催地で検索 / Search by location
 * - type: イベントタイプで完全一致検索 / Exact match by event type
 * - organizer: 主催者名で検索 / Search by organizer name
 */
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  location: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
  organizer: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

/**
 * Firestoreからイベントデータを取得
 * Fetch event data from Firestore
 *
 * 処理フロー / Process flow:
 * 1. ローディング状態を開始 / Start loading state
 * 2. Firestore 'events' コレクションからデータ取得 / Fetch data from 'events' collection
 * 3. ドキュメントIDとデータをマージしてevents配列に格納 / Merge document ID with data and store in events array
 * 4. エラー時はサンプルデータにフォールバック / Fallback to sample data on error
 * 5. 最後にローディング状態を終了 / End loading state finally
 */
const fetchEvents = async () => {
  loading.value = true
  try {
    const eventsCollection = collection(db, 'events')
    const snapshot = await getDocs(eventsCollection)

    // FirestoreドキュメントをVueリアクティブ配列に変換 / Convert Firestore documents to Vue reactive array
    events.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log('Loaded events:', events.value.length)
  } catch (error) {
    console.error('Error fetching events:', error)

    // Firestoreにデータがない場合、サンプルデータを表示
    // Display sample data if Firestore has no data
    if (events.value.length === 0) {
      loadSampleData()
    }
  } finally {
    loading.value = false
  }
}

/**
 * サンプルデータを読み込み
 * Load sample data
 *
 * Firestoreが利用できない場合やデータが空の場合のフォールバックデータ
 * Fallback data when Firestore is unavailable or empty
 * 12種類の多国籍料理イベント (日本、イタリア、アジア、ビーガン、フランス、タイ、メキシコ、インド、韓国、コーヒー、中国、スペイン)
 * 12 types of multicultural cooking events (Japanese, Italian, Asian, Vegan, French, Thai, Mexican, Indian, Korean, Coffee, Chinese, Spanish)
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
 * Format date string
 *
 * @param {string} dateString - ISO形式の日付文字列 (例: '2025-10-25') / ISO format date string (e.g., '2025-10-25')
 * @returns {string} オーストラリア形式の日付 (例: '25 Oct 2025') / Australian format date (e.g., '25 Oct 2025')
 *
 * toLocaleDateString('en-AU')を使用してオーストラリアの日付形式に変換
 * Convert to Australian date format using toLocaleDateString('en-AU')
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
 * View event details
 *
 * @param {Object} event - イベントオブジェクト / Event object
 *
 * TODO: 将来的にはモーダルやルーティングでイベント詳細ページに遷移
 * TODO: In the future, navigate to event detail page via modal or routing
 */
const viewEvent = (event) => {
  console.log('View event:', event)
  alert(`Viewing event: ${event.title}`)
}

/**
 * イベントに参加
 * Join an event
 *
 * @param {Object} event - イベントオブジェクト / Event object
 *
 * 処理フロー / Process flow:
 * 1. 参加者数が上限未満かチェック / Check if participants < max
 * 2. 参加者数を1増やす / Increment participant count by 1
 * 3. ステータスを自動更新: / Auto-update status:
 *    - 100%埋まった → 'Full' (満員) / 100% filled → 'Full'
 *    - 80%以上埋まった → 'Almost Full' (残りわずか) / 80%+ filled → 'Almost Full'
 *
 * TODO: Firestoreに参加記録を保存する機能を実装
 * TODO: Implement saving participation record to Firestore
 */
const joinEvent = (event) => {
  if (event.participants < event.maxParticipants) {
    // 参加者数をインクリメント / Increment participants
    event.participants++

    // ステータス自動更新ロジック / Auto-update status logic
    if (event.participants >= event.maxParticipants) {
      event.status = 'Full'
    } else if (event.participants >= event.maxParticipants * 0.8) {
      event.status = 'Almost Full'
    }

    alert(`You have joined: ${event.title}`)
  }
}

/**
 * コンポーネントマウント時の初期化処理
 * Initialization on component mount
 *
 * 実行順序 / Execution order:
 * 1. seedEvents(): Firestoreにサンプルイベントデータを投入 (初回のみ) / Seed sample event data to Firestore (first time only)
 * 2. fetchEvents(): Firestoreからイベントデータを取得 / Fetch event data from Firestore
 */
onMounted(async () => {
  // データを追加したい時だけコメントを外す
  // Uncomment when you want to seed data
  await seedEvents()

  await fetchEvents()
})
</script>

<style scoped>
/**
 * イベントページ全体のスタイル
 * Overall event page styling
 */
.events-page {
  /* ナビバー(56px)を除いた最小高さ / Minimum height excluding navbar (56px) */
  min-height: calc(100vh - 56px);
  background-color: #f8f9fa; /* ライトグレー背景 / Light gray background */
}

/* カードコンポーネントのスタイル / Card component styling */
.card {
  border: none; /* デフォルトボーダーを削除 / Remove default border */
  border-radius: 8px; /* 角丸 / Rounded corners */
}

/**
 * PrimeVue DataTableのカスタムスタイル
 * PrimeVue DataTable custom styles
 *
 * :deep()を使用してShadow DOMの奥深くまでスタイルを適用
 * Use :deep() to apply styles deep into Shadow DOM
 */

/* テーブル全体のフォントサイズ / Overall table font size */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

/* テーブルヘッダーのスタイル / Table header styling */
:deep(.p-datatable-thead > tr > th) {
  background-color: #28a745; /* 成功グリーン (Bootstrapのsuccess) / Success green (Bootstrap success) */
  color: white; /* 白文字 / White text */
  font-weight: 600; /* セミボールド / Semi-bold */
  padding: 1rem;
}

/* テーブル行のホバーエフェクト / Table row hover effect */
:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f0fff0; /* 薄い緑色の背景 / Light green background */
}

/* ページネーションのスタイル / Pagination styling */
:deep(.p-paginator) {
  padding: 1rem;
  background-color: #f8f9fa; /* ページと同じ背景色 / Same background as page */
}

/* フィルタ列の入力フィールド幅を100%に / Set filter column input fields to 100% width */
:deep(.p-datatable .p-filter-column input),
:deep(.p-datatable .p-filter-column select) {
  width: 100%;
}
</style>
