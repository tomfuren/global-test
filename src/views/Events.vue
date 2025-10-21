<!--
  Events Page - Advanced event management interface with PrimeVue DataTable
  イベント一覧ページ - PrimeVue DataTableを使用した高度なイベント管理画面

  Features / 機能:
  - Advanced DataTable with sorting, filtering, and pagination / ソート、フィルタリング、ページネーション付き高度なDataTable
  - Global search across multiple fields / 複数フィールド横断のグローバル検索
  - Column-specific filtering / 列固有のフィルタリング
  - Multi-column sorting / マルチカラムソート
  - Event registration functionality / イベント参加機能
  - Real-time status updates / リアルタイムステータス更新
  - Responsive design with scrollable layout / スクロール可能なレイアウトのレスポンシブデザイン
  - Color-coded badges for types and statuses / タイプとステータスの色分けバッジ

  BR (D.3): Interactive Table Data - Table #2 (Event Management Table)
  BR (D.3): インタラクティブテーブルデータ - テーブル#2（イベント管理テーブル）

  This component demonstrates advanced table features with PrimeVue:
  このコンポーネントはPrimeVueの高度なテーブル機能を実証:
  - Multi-level filtering (global + column-specific) / 多段階フィルタリング（グローバル+列固有）
  - Pagination with customizable rows per page / カスタマイズ可能な1ページあたりの行数のページネーション
  - Sortable columns with removable sort / 削除可能なソート付きのソート可能列
  - Custom cell templates for rich content display / リッチコンテンツ表示用のカスタムセルテンプレート

  Data Source / データソース:
  - Firestore 'events' collection / Firestoreの'events'コレクション
  - Seed data utility for sample events / サンプルイベント用のシードデータユーティリティ
-->

<template>
  <div class="events-page">
    <div class="container-fluid py-4">
      <!-- Header Section / ヘッダーセクション -->
      <!-- Page title and description / ページタイトルと説明 -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-1">
            <i class="fas fa-calendar-alt me-2 text-primary"></i>
            Events
          </h2>
          <p class="text-muted">Discover and join cooking workshops and food events</p>
        </div>
      </div>

      <!-- BR (D.3): Interactive Table Data - Table #2 / インタラクティブテーブルデータ - テーブル#2 -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <!-- Global Search Bar / グローバル検索バー -->
              <!-- Searches across all filterable fields simultaneously / すべてのフィルタ可能フィールドを同時に検索 -->
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
                PrimeVue DataTable Component / PrimeVue DataTableコンポーネント

                Advanced features enabled / 有効化された高度な機能:
                - v-model:filters: Reactive filter binding / リアクティブフィルタバインディング
                - :value: Data source / データソース
                - :paginator: Enable pagination / ページネーションを有効化
                - :rows: Default rows per page (10) / デフォルトの1ページあたりの行数（10）
                - :rowsPerPageOptions: Pagination options [10, 20, 50] / ページネーションオプション
                - filterDisplay="row": Show filters in header row / ヘッダー行にフィルタを表示
                - :globalFilterFields: Fields included in global search / グローバル検索に含まれるフィールド
                - sortMode="multiple": Allow multi-column sorting / マルチカラムソートを許可
                - removableSort: Click to remove sort / クリックでソートを削除
                - :loading: Show loading spinner / ローディングスピナーを表示
                - responsiveLayout="scroll": Enable horizontal scroll on small screens / 小画面で横スクロールを有効化
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
                  Event Title Column / イベントタイトル列

                  Custom template to display title and description
                  タイトルと説明を表示するカスタムテンプレート

                  Body template: Shows bold title + muted description
                  ボディテンプレート: 太字のタイトル + グレーの説明を表示

                  Filter template: Text input for title search
                  フィルタテンプレート: タイトル検索用のテキスト入力
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
                  Date Column / 日付列

                  Displays formatted date in Australian format
                  オーストラリア形式でフォーマットされた日付を表示

                  Format: Day Month Year (e.g., 25 Oct 2025)
                  形式: 日 月 年（例: 25 Oct 2025）

                  Sortable by date value
                  日付値でソート可能
                -->
                <Column field="date" header="Date" :sortable="true" style="min-width: 150px">
                  <template #body="{ data }">
                    <i class="far fa-calendar me-1"></i>
                    {{ formatDate(data.date) }}
                  </template>
                </Column>

                <!--
                  Location Column / 場所列

                  Event venue with location icon
                  場所アイコン付きイベント会場

                  Filterable by location name
                  場所名でフィルタリング可能
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
                  Event Type Column / イベントタイプ列

                  Color-coded badges for visual distinction
                  視覚的区別のための色分けバッジ

                  Type to Badge Color Mapping / タイプからバッジ色へのマッピング:
                  - Workshop (ワークショップ) → Primary Blue (青) - Learning focused
                  - Cooking Class (料理教室) → Success Green (緑) - Hands-on cooking
                  - Food Festival (フードフェス) → Info Light Blue (水色) - Large scale event
                  - Meetup (交流会) → Warning Yellow (黄) - Networking event

                  Dropdown filter for exact match selection
                  完全一致選択用のドロップダウンフィルタ
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

                <!--
                  Organizer Column / 主催者列

                  Event organizer name with user icon
                  ユーザーアイコン付きイベント主催者名

                  Filterable by organizer name
                  主催者名でフィルタリング可能
                -->
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
                  Participants Column / 参加者数列

                  Shows current participants vs maximum capacity
                  現在の参加者数と最大収容人数を表示

                  Format: current/max (e.g., 12/20)
                  形式: 現在数/最大数（例: 12/20）

                  Sortable to find events with availability
                  空き状況を見つけるためにソート可能
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
                  Status Column / ステータス列

                  Event availability status with color-coded badges
                  色分けバッジ付きイベント空き状況ステータス

                  Status to Badge Color Mapping / ステータスからバッジ色へのマッピング:
                  - Open (募集中) → Success Green (緑) - Available for registration
                  - Almost Full (残りわずか) → Warning Yellow (黄) - 80%+ capacity reached
                  - Full (満員) → Danger Red (赤) - No more registrations
                  - Cancelled (中止) → Secondary Gray (灰) - Event cancelled

                  Automatically updated when participants join
                  参加者が参加すると自動的に更新される
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
                  Actions Column / アクション列

                  Action buttons for event interaction
                  イベントインタラクション用のアクションボタン

                  Buttons / ボタン:
                  1. View (Eye icon): Display event details / イベント詳細を表示
                  2. Join (Plus icon): Register for event / イベントに参加登録
                     - Disabled when status is 'Full' or 'Cancelled'
                     - ステータスが「満員」または「中止」の場合は無効化

                  Future enhancements / 将来の拡張:
                  - Modal dialog for event details / イベント詳細用のモーダルダイアログ
                  - Confirmation dialog before joining / 参加前の確認ダイアログ
                  - Save registration to Firestore / Firestoreへの参加登録保存
                -->
                <Column header="Actions" style="min-width: 150px">
                  <template #body="{ data }">
                    <!-- View button / 閲覧ボタン -->
                    <button class="btn btn-sm btn-outline-primary me-1" @click="viewEvent(data)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <!-- Join button / 参加ボタン -->
                    <button
                      class="btn btn-sm btn-outline-success"
                      @click="joinEvent(data)"
                      :disabled="data.status === 'Full' || data.status === 'Cancelled'"
                    >
                      <i class="fas fa-plus"></i> Join
                    </button>
                  </template>
                </Column>

                <!-- Empty State Template / 空状態テンプレート -->
                <!-- Shown when no events match the current filters / 現在のフィルタに一致するイベントがない場合に表示 -->
                <template #empty>
                  <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No events found.</p>
                  </div>
                </template>

                <!-- Loading State Template / ローディング状態テンプレート -->
                <!-- Shown while fetching data from Firestore / Firestoreからデータを取得中に表示 -->
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
// ============================================================================
// Imports / インポート
// ============================================================================
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { seedEvents } from '@/utils/seedEvents'

// ============================================================================
// PrimeVue Filter Configuration / PrimeVueフィルタ設定
// ============================================================================

/**
 * Filter Match Mode Constants
 * フィルタマッチモード定数
 *
 * Defines how filter values should match against data
 * フィルタ値がデータとどのように一致すべきかを定義
 *
 * CONTAINS: Partial match (case-insensitive substring search)
 * CONTAINS: 部分一致（大文字小文字を区別しない部分文字列検索）
 * Used for: Text fields like title, location, organizer
 * 使用対象: タイトル、場所、主催者などのテキストフィールド
 *
 * EQUALS: Exact match (case-sensitive complete match)
 * EQUALS: 完全一致（大文字小文字を区別する完全一致）
 * Used for: Dropdown selections like event type
 * 使用対象: イベントタイプなどのドロップダウン選択
 */
const FilterMatchMode = {
  CONTAINS: 'contains',
  EQUALS: 'equals',
}

// ============================================================================
// Component State / コンポーネント状態
// ============================================================================

/**
 * Events data array
 * イベントデータ配列
 *
 * Stores all events fetched from Firestore
 * Firestoreから取得したすべてのイベントを保存
 */
const events = ref([])

/**
 * Loading state flag
 * ローディング状態フラグ
 *
 * Controls loading spinner visibility in DataTable
 * DataTableのローディングスピナーの表示を制御
 */
const loading = ref(false)

/**
 * BR (D.3): DataTable Filter Configuration
 * BR (D.3): DataTableフィルタ設定
 *
 * Defines filter rules for each searchable field
 * 各検索可能フィールドのフィルタルールを定義
 *
 * Filter Structure / フィルタ構造:
 * - global: Cross-field search (title, location, type, organizer)
 * - global: フィールド横断検索（タイトル、場所、タイプ、主催者）
 * - title: Event name search / イベント名検索
 * - location: Venue search / 会場検索
 * - type: Event type exact match / イベントタイプ完全一致
 * - organizer: Organizer name search / 主催者名検索
 *
 * Each filter has / 各フィルタには以下がある:
 * - value: Current filter value (null = no filter)
 * - value: 現在のフィルタ値（null = フィルタなし）
 * - matchMode: How to match (CONTAINS or EQUALS)
 * - matchMode: 一致方法（CONTAINSまたはEQUALS）
 */
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  location: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.EQUALS },
  organizer: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// ============================================================================
// Data Fetching Methods / データ取得メソッド
// ============================================================================

/**
 * Fetch events data from Firestore
 * Firestoreからイベントデータを取得
 *
 * Process flow / 処理フロー:
 * 1. Set loading state to true / ローディング状態をtrueに設定
 * 2. Query Firestore 'events' collection / Firestoreの'events'コレクションをクエリ
 * 3. Map documents to event objects with ID / ドキュメントをIDを含むイベントオブジェクトにマップ
 * 4. Update events reactive array / イベントのリアクティブ配列を更新
 * 5. Handle errors gracefully / エラーを適切に処理
 * 6. Clear loading state / ローディング状態をクリア
 *
 * Error handling / エラーハンドリング:
 * Logs errors to console but doesn't show user error message
 * エラーをコンソールに記録するが、ユーザーエラーメッセージは表示しない
 * DataTable will show "No events found" in empty state
 * DataTableは空状態で「イベントが見つかりません」を表示
 */
const fetchEvents = async () => {
  loading.value = true
  try {
    // Get Firestore collection reference / Firestoreコレクション参照を取得
    const eventsCollection = collection(db, 'events')
    const snapshot = await getDocs(eventsCollection)

    // Transform Firestore documents to Vue reactive array / FirestoreドキュメントをVueリアクティブ配列に変換
    events.value = snapshot.docs.map((doc) => ({
      id: doc.id, // Document ID / ドキュメントID
      ...doc.data(), // Document fields / ドキュメントフィールド
    }))

    console.log('Loaded events:', events.value.length)
  } catch (error) {
    console.error('Error fetching events:', error)
    // Events array remains empty, triggering empty state in DataTable
    // イベント配列は空のまま、DataTableで空状態をトリガー
  } finally {
    loading.value = false
  }
}

// ============================================================================
// Utility Functions / ユーティリティ関数
// ============================================================================

/**
 * Format date string to Australian format
 * 日付文字列をオーストラリア形式にフォーマット
 *
 * Converts ISO date string to readable format
 * ISO日付文字列を読みやすい形式に変換
 *
 * @param {string} dateString - ISO format date (e.g., '2025-10-25') / ISO形式の日付（例: '2025-10-25'）
 * @returns {string} Formatted date (e.g., '25 Oct 2025') / フォーマットされた日付（例: '25 Oct 2025'）
 *
 * Format options / フォーマットオプション:
 * - year: 'numeric' (2025)
 * - month: 'short' (Oct)
 * - day: 'numeric' (25)
 *
 * Locale: 'en-AU' (Australian English)
 * ロケール: 'en-AU'（オーストラリア英語）
 */
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ============================================================================
// Event Action Methods / イベントアクションメソッド
// ============================================================================

/**
 * View event details
 * イベント詳細を表示
 *
 * Currently shows alert dialog
 * 現在はアラートダイアログを表示
 *
 * @param {Object} event - Event object / イベントオブジェクト
 *
 * TODO: Future enhancements / 将来の拡張:
 * - Open modal dialog with full event details / 完全なイベント詳細のモーダルダイアログを開く
 * - Navigate to dedicated event detail page / 専用のイベント詳細ページに移動
 * - Show event images, location map, full description / イベント画像、場所マップ、完全な説明を表示
 */
const viewEvent = (event) => {
  console.log('View event:', event)
  alert(`Viewing event: ${event.title}`)
}

/**
 * Join an event
 * イベントに参加
 *
 * Handles event registration with automatic status updates
 * 自動ステータス更新付きのイベント参加登録を処理
 *
 * @param {Object} event - Event object / イベントオブジェクト
 *
 * Process flow / 処理フロー:
 * 1. Check if event has available capacity / イベントに空き容量があるかチェック
 * 2. Increment participant count / 参加者数をインクリメント
 * 3. Auto-update status based on capacity / 容量に基づいてステータスを自動更新:
 *    - 100% full → 'Full' (満員)
 *    - 80%+ full → 'Almost Full' (残りわずか)
 * 4. Show confirmation alert / 確認アラートを表示
 *
 * Status Update Logic / ステータス更新ロジック:
 * - participants >= maxParticipants → 'Full'
 * - participants >= maxParticipants * 0.8 → 'Almost Full'
 * - Otherwise remains 'Open' / それ以外は「募集中」のまま
 *
 * TODO: Future enhancements / 将来の拡張:
 * - Save registration to Firestore 'eventRegistrations' collection
 * - Firestoreの'eventRegistrations'コレクションに参加登録を保存
 * - Check if user already registered / ユーザーが既に登録済みかチェック
 * - Send confirmation email / 確認メールを送信
 * - Add to user's calendar / ユーザーのカレンダーに追加
 */
const joinEvent = (event) => {
  if (event.participants < event.maxParticipants) {
    // Increment participant count / 参加者数をインクリメント
    event.participants++

    // Auto-update status based on capacity / 容量に基づいてステータスを自動更新
    if (event.participants >= event.maxParticipants) {
      event.status = 'Full'
    } else if (event.participants >= event.maxParticipants * 0.8) {
      event.status = 'Almost Full'
    }

    alert(`You have joined: ${event.title}`)
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * Component mounted lifecycle hook
 * コンポーネントマウント時のライフサイクルフック
 *
 * Initialization sequence / 初期化シーケンス:
 * 1. Seed sample data to Firestore (commented out by default)
 * 1. Firestoreにサンプルデータをシード（デフォルトでコメントアウト）
 * 2. Fetch events from Firestore
 * 2. Firestoreからイベントを取得
 *
 * Note on seeding / シードに関する注意:
 * - seedEvents() is called only when explicitly uncommented
 * - seedEvents()は明示的にコメント解除された場合のみ呼び出される
 * - Use for initial data population or testing
 * - 初期データ投入またはテストに使用
 * - Should not run in production environments
 * - 本番環境では実行しないでください
 */
onMounted(async () => {
  // Seed sample data (uncomment when needed) / サンプルデータをシード（必要な時にコメント解除）
  await seedEvents()

  // Fetch events from Firestore / Firestoreからイベントを取得
  await fetchEvents()
})
</script>

<style scoped>
/* ============================================================================
   Events Page Layout Styles / イベントページレイアウトスタイル
   ============================================================================ */

/**
 * Main page container
 * メインページコンテナ
 *
 * Minimum height excludes navbar (56px)
 * 最小高さはナビゲーションバーを除く（56px）
 *
 * Background color matches application theme
 * 背景色はアプリケーションテーマに一致
 */
.events-page {
  min-height: calc(100vh - 56px);
  background-color: #f8f9fa; /* Light gray / ライトグレー */
}

/* ============================================================================
   Card Component Styles / カードコンポーネントスタイル
   ============================================================================ */

/**
 * Card styling for DataTable container
 * DataTableコンテナのカードスタイル
 */
.card {
  border: none; /* Remove default border / デフォルトボーダーを削除 */
  border-radius: 8px; /* Rounded corners / 角丸 */
}

/* ============================================================================
   PrimeVue DataTable Custom Styles / PrimeVue DataTableカスタムスタイル
   ============================================================================ */

/**
 * :deep() selector usage
 * :deep()セレクタの使用
 *
 * Necessary to penetrate Shadow DOM and style PrimeVue components
 * Shadow DOMを貫通してPrimeVueコンポーネントをスタイリングするために必要
 */

/* Overall table font size / テーブル全体のフォントサイズ */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

/**
 * Table header styling
 * テーブルヘッダースタイル
 *
 * Green background matches success theme
 * 緑の背景は成功テーマに一致
 */
:deep(.p-datatable-thead > tr > th) {
  background-color: #28a745; /* Success green / 成功グリーン */
  color: white; /* White text / 白文字 */
  font-weight: 600; /* Semi-bold / セミボールド */
  padding: 1rem;
}

/**
 * Table row hover effect
 * テーブル行ホバーエフェクト
 *
 * Light green background on hover for better UX
 * より良いUXのためのホバー時の薄い緑色の背景
 */
:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f0fff0; /* Very light green / 非常に薄い緑 */
}

/**
 * Pagination styling
 * ページネーションスタイル
 *
 * Matches page background color for seamless integration
 * シームレスな統合のためにページ背景色に一致
 */
:deep(.p-paginator) {
  padding: 1rem;
  background-color: #f8f9fa;
}

/**
 * Filter input fields width
 * フィルタ入力フィールドの幅
 *
 * Ensures filter inputs fill column width
 * フィルタ入力が列幅いっぱいになることを保証
 */
:deep(.p-datatable .p-filter-column input),
:deep(.p-datatable .p-filter-column select) {
  width: 100%;
}
</style>
