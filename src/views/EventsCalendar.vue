<!--
  Events Calendar Page - Advanced calendar interface with FullCalendar integration
  イベントカレンダーページ - FullCalendar統合による高度なカレンダーインターフェース

  Features / 機能:
  - Interactive calendar with multiple view options (month, week, day, list) / 複数のビューオプション付きインタラクティブカレンダー
  - Event creation with date/time selection / 日付/時間選択付きイベント作成
  - Event booking system with capacity management / 収容人数管理付きイベント予約システム
  - Booking conflict detection / 予約競合検出
  - Real-time participant count updates / リアルタイム参加者数更新
  - Event details modal with full information / 完全な情報を含むイベント詳細モーダル
  - Upcoming events list view / 今後のイベントリストビュー
  - Responsive design for mobile and desktop / モバイルとデスクトップ対応のレスポンシブデザイン

  BR (F.1): Innovation - FullCalendar Integration
  BR (F.1): イノベーション - FullCalendar統合

  This component demonstrates advanced calendar features:
  このコンポーネントは高度なカレンダー機能を実証:
  - Multiple calendar views (dayGrid, timeGrid, list) / 複数のカレンダービュー
  - Interactive date selection for event creation / イベント作成用のインタラクティブな日付選択
  - Booking conflict management / 予約競合管理
  - Capacity tracking and status updates / 収容人数追跡とステータス更新
  - Time-based event filtering / 時間ベースのイベントフィルタリング

  Calendar Views / カレンダービュー:
  - Month View (dayGridMonth): Overview of all events / 全イベントの概要
  - Week View (timeGridWeek): Detailed weekly schedule / 詳細な週間スケジュール
  - Day View (timeGridDay): Single day detailed view / 単日詳細ビュー
  - List View (listWeek): Event list format / イベントリスト形式

  Data Source / データソース:
  - Firestore 'events' collection / Firestoreの'events'コレクション
  - Real-time updates on booking / 予約時のリアルタイム更新
-->

<template>
  <div class="events-calendar-page">
    <div class="container-fluid px-4 py-4">
      <!-- ============================================================================
           Header Section / ヘッダーセクション

           BR (F.1): Innovation - FullCalendar Integration
           BR (F.1): イノベーション - FullCalendar統合

           Page title and create event button
           ページタイトルとイベント作成ボタン
           ============================================================================ -->
      <div class="row mb-4">
        <div class="col-md-8">
          <h2 class="mb-1">
            <i class="fas fa-calendar-alt me-2 text-primary" aria-hidden="true"></i>
            Events Calendar
          </h2>
          <p class="text-muted">Browse and book cooking workshops and food events</p>
        </div>
        <div class="col-md-4 text-end">
          <!-- Create event button (authenticated users only) / イベント作成ボタン（認証済みユーザーのみ） -->
          <button class="btn btn-primary" @click="openCreateEventModal" v-if="isAuthenticated">
            <i class="fas fa-plus me-2" aria-hidden="true"></i>
            Create Event
          </button>
        </div>
      </div>

      <!-- ============================================================================
           FullCalendar Component / FullCalendarコンポーネント

           BR (F.1): Innovation - Interactive Calendar View
           BR (F.1): イノベーション - インタラクティブカレンダービュー

           Features / 機能:
           - Multiple view types (month, week, day, list) / 複数のビュータイプ
           - Event click for details / 詳細表示用のイベントクリック
           - Date selection for event creation / イベント作成用の日付選択
           - Booking conflict management / 予約競合管理
           ============================================================================ -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <!-- BR (F.1): FullCalendar component with plugins / プラグイン付きFullCalendarコンポーネント -->
              <FullCalendar :options="calendarOptions" ref="fullCalendar" />
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================================
           Upcoming Events List Section / 今後のイベントリストセクション

           Card-based list of upcoming events synchronized with calendar
           カレンダーと同期された今後のイベントのカードベースリスト

           Shows next 6 upcoming events with:
           次の6つの今後のイベントを表示:
           - Date and time / 日付と時間
           - Location / 場所
           - Participant count / 参加者数
           - Status badge / ステータスバッジ
           ============================================================================ -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="fas fa-list me-2" aria-hidden="true"></i>
                Upcoming Events
              </h5>
            </div>
            <div class="card-body">
              <!-- Empty state / 空状態 -->
              <div v-if="upcomingEvents.length === 0" class="text-center py-4">
                <i class="fas fa-calendar-times fs-1 text-muted mb-3" aria-hidden="true"></i>
                <p class="text-muted">No upcoming events</p>
              </div>

              <!-- Event cards grid / イベントカードグリッド -->
              <div v-else class="row">
                <div v-for="event in upcomingEvents" :key="event.id" class="col-md-6 col-lg-4 mb-3">
                  <div class="card h-100 event-card" @click="handleEventClick({ event })">
                    <div class="card-body">
                      <!-- Event title / イベントタイトル -->
                      <h6 class="card-title">{{ event.title }}</h6>
                      <p class="card-text">
                        <!-- Date / 日付 -->
                        <small>
                          <i class="fas fa-calendar me-1" aria-hidden="true"></i>
                          {{ formatDate(event.start) }}
                        </small>
                        <br />
                        <!-- Time / 時間 -->
                        <small>
                          <i class="fas fa-clock me-1" aria-hidden="true"></i>
                          {{ formatTime(event.start) }}
                        </small>
                        <br />
                        <!-- Location / 場所 -->
                        <small>
                          <i class="fas fa-map-marker-alt me-1" aria-hidden="true"></i>
                          {{ event.extendedProps.location }}
                        </small>
                      </p>
                      <!-- Badges for participants and status / 参加者数とステータスのバッジ -->
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-primary">
                          {{ event.extendedProps.participants || 0 }}/{{
                            event.extendedProps.maxParticipants
                          }}
                        </span>
                        <span
                          class="badge"
                          :class="getStatusBadgeClass(event.extendedProps.status)"
                        >
                          {{ event.extendedProps.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================================
         Event Details Modal / イベント詳細モーダル

         BR (F.1): Innovation - Booking System with Conflict Management
         BR (F.1): イノベーション - 競合管理付き予約システム

         Features / 機能:
         - Full event information display / 完全なイベント情報表示
         - Booking conflict warnings / 予約競合警告
         - Capacity status checking / 収容人数ステータスチェック
         - Time conflict detection / 時間競合検出
         - One-click booking / ワンクリック予約
         ============================================================================ -->
    <div
      class="modal fade"
      id="eventDetailModal"
      tabindex="-1"
      aria-labelledby="eventDetailModalLabel"
      aria-hidden="true"
      ref="eventDetailModalRef"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="eventDetailModalLabel">
              {{ selectedEvent?.title }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="selectedEvent">
            <!-- Event Image / イベント画像 -->
            <img
              v-if="selectedEvent.extendedProps.imageUrl"
              :src="selectedEvent.extendedProps.imageUrl"
              class="img-fluid rounded mb-3"
              :alt="selectedEvent.title"
            />

            <!-- Event Description / イベント説明 -->
            <div class="mb-3">
              <h6><i class="fas fa-info-circle me-2" aria-hidden="true"></i>Description</h6>
              <p>{{ selectedEvent.extendedProps.description }}</p>
            </div>

            <!-- Event Details Grid / イベント詳細グリッド -->
            <div class="row mb-3">
              <!-- Left column: Date, Time, Location / 左列: 日付、時間、場所 -->
              <div class="col-md-6">
                <p>
                  <i class="fas fa-calendar me-2 text-primary" aria-hidden="true"></i>
                  <strong>Date:</strong> {{ formatDate(selectedEvent.start) }}
                </p>
                <p>
                  <i class="fas fa-clock me-2 text-primary" aria-hidden="true"></i>
                  <strong>Time:</strong>
                  {{ formatTime(selectedEvent.start) }} - {{ formatTime(selectedEvent.end) }}
                </p>
                <p>
                  <i class="fas fa-map-marker-alt me-2 text-primary" aria-hidden="true"></i>
                  <strong>Location:</strong> {{ selectedEvent.extendedProps.location }}
                </p>
              </div>
              <!-- Right column: Organizer, Cuisine, Participants / 右列: 主催者、料理、参加者 -->
              <div class="col-md-6">
                <p>
                  <i class="fas fa-user me-2 text-primary" aria-hidden="true"></i>
                  <strong>Organizer:</strong> {{ selectedEvent.extendedProps.organizer }}
                </p>
                <p>
                  <i class="fas fa-utensils me-2 text-primary" aria-hidden="true"></i>
                  <strong>Cuisine:</strong> {{ selectedEvent.extendedProps.cuisine }}
                </p>
                <p>
                  <i class="fas fa-users me-2 text-primary" aria-hidden="true"></i>
                  <strong>Participants:</strong>
                  {{ selectedEvent.extendedProps.participants }}/{{
                    selectedEvent.extendedProps.maxParticipants
                  }}
                </p>
              </div>
            </div>

            <!-- BR (F.1): Booking Conflict Warning / 予約競合警告 -->
            <!-- Displays warnings for capacity or time conflicts / 収容人数または時間競合の警告を表示 -->
            <div v-if="bookingConflict" class="alert alert-warning" role="alert">
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ bookingConflict }}
            </div>

            <!-- Booking Success Message / 予約成功メッセージ -->
            <div v-if="bookingSuccess" class="alert alert-success" role="alert">
              <i class="fas fa-check-circle me-2"></i>
              {{ bookingSuccess }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <!-- Book Now button / 今すぐ予約ボタン -->
            <button
              type="button"
              class="btn btn-primary"
              @click="bookEvent"
              :disabled="isBookingDisabled"
              v-if="isAuthenticated"
            >
              <i class="fas fa-check me-2" aria-hidden="true"></i>
              {{ isBookingDisabled ? 'Fully Booked' : 'Book Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================================
         Create Event Modal / イベント作成モーダル

         Form for creating new events with validation
         検証付きの新規イベント作成フォーム

         Required fields / 必須フィールド:
         - Title / タイトル
         - Description / 説明
         - Date / 日付
         - Start Time / 開始時間
         - End Time / 終了時間
         - Location / 場所
         - Max Participants / 最大参加者数
         ============================================================================ -->
    <div
      class="modal fade"
      id="createEventModal"
      tabindex="-1"
      aria-labelledby="createEventModalLabel"
      aria-hidden="true"
      ref="createEventModalRef"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createEventModalLabel">Create New Event</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createEvent">
              <!-- Event Title / イベントタイトル -->
              <div class="mb-3">
                <label for="eventTitle" class="form-label">Event Title *</label>
                <input
                  type="text"
                  class="form-control"
                  id="eventTitle"
                  v-model="newEvent.title"
                  required
                />
              </div>

              <!-- Description / 説明 -->
              <div class="mb-3">
                <label for="eventDescription" class="form-label">Description *</label>
                <textarea
                  class="form-control"
                  id="eventDescription"
                  v-model="newEvent.description"
                  rows="3"
                  required
                ></textarea>
              </div>

              <!-- Date and Time Fields / 日付と時間フィールド -->
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label for="eventDate" class="form-label">Date *</label>
                  <input
                    type="date"
                    class="form-control"
                    id="eventDate"
                    v-model="newEvent.date"
                    required
                  />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="eventStartTime" class="form-label">Start Time *</label>
                  <input
                    type="time"
                    class="form-control"
                    id="eventStartTime"
                    v-model="newEvent.startTime"
                    required
                  />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="eventEndTime" class="form-label">End Time *</label>
                  <input
                    type="time"
                    class="form-control"
                    id="eventEndTime"
                    v-model="newEvent.endTime"
                    required
                  />
                </div>
              </div>

              <!-- Location / 場所 -->
              <div class="mb-3">
                <label for="eventLocation" class="form-label">Location *</label>
                <input
                  type="text"
                  class="form-control"
                  id="eventLocation"
                  v-model="newEvent.location"
                  required
                />
              </div>

              <!-- Cuisine and Max Participants / 料理タイプと最大参加者数 -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="eventCuisine" class="form-label">Cuisine Type</label>
                  <input
                    type="text"
                    class="form-control"
                    id="eventCuisine"
                    v-model="newEvent.cuisine"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="eventMaxParticipants" class="form-label">Max Participants *</label>
                  <input
                    type="number"
                    class="form-control"
                    id="eventMaxParticipants"
                    v-model.number="newEvent.maxParticipants"
                    min="1"
                    required
                  />
                </div>
              </div>

              <!-- Organizer / 主催者 -->
              <div class="mb-3">
                <label for="eventOrganizer" class="form-label">Organizer</label>
                <input
                  type="text"
                  class="form-control"
                  id="eventOrganizer"
                  v-model="newEvent.organizer"
                />
              </div>

              <!-- Submit Button / 送信ボタン -->
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="isCreatingEvent">
                  <span v-if="isCreatingEvent">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Creating...
                  </span>
                  <span v-else>
                    <i class="fas fa-plus me-2"></i>
                    Create Event
                  </span>
                </button>
              </div>
            </form>
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
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, addDoc, doc, updateDoc, increment } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '@/firebase/init'
import { Modal } from 'bootstrap'

// BR (F.1): FullCalendar Component and Plugins
// BR (F.1): FullCalendarコンポーネントとプラグイン
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid' // Month view / 月ビュー
import timeGridPlugin from '@fullcalendar/timegrid' // Week/Day view / 週/日ビュー
import interactionPlugin from '@fullcalendar/interaction' // Date selection / 日付選択
import listPlugin from '@fullcalendar/list' // List view / リストビュー

// ============================================================================
// Component State / 状態管理
// ============================================================================

// Authentication state / 認証状態
const auth = getAuth()
const isAuthenticated = ref(false)
const currentUser = ref(null)

// Events data / イベントデータ
const events = ref([]) // All event data / 全イベントデータ
const selectedEvent = ref(null) // Currently selected event / 現在選択されているイベント

// Booking state / 予約状態
const bookingConflict = ref('') // Conflict warning message / 競合警告メッセージ
const bookingSuccess = ref('') // Success confirmation message / 成功確認メッセージ

// Modal references / モーダル参照
const eventDetailModalRef = ref(null)
const createEventModalRef = ref(null)
let eventDetailModal = null
let createEventModal = null

// New event form data / 新規イベントフォームデータ
const newEvent = ref({
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  cuisine: '',
  maxParticipants: 20,
  organizer: '',
})
const isCreatingEvent = ref(false)

// ============================================================================
// Event Handlers / イベントハンドラー
// ============================================================================

/**
 * BR (F.1): Event Click Handler
 * BR (F.1): イベントクリック処理
 *
 * Triggered when user clicks an event on calendar
 * カレンダー上のイベントをクリックしたときにトリガー
 *
 * Actions / アクション:
 * 1. Store selected event / 選択されたイベントを保存
 * 2. Clear previous messages / 前のメッセージをクリア
 * 3. Check booking conflicts / 予約競合をチェック
 * 4. Open detail modal / 詳細モーダルを開く
 *
 * @param {Object} clickInfo - FullCalendar click event info / クリックイベント情報
 */
const handleEventClick = (clickInfo) => {
  selectedEvent.value = clickInfo.event
  bookingConflict.value = ''
  bookingSuccess.value = ''

  // BR (F.1): Check for booking conflicts / 予約競合をチェック
  checkBookingConflicts(clickInfo.event)

  // Initialize and show modal / モーダルを初期化して表示
  if (!eventDetailModal) {
    eventDetailModal = new Modal(eventDetailModalRef.value)
  }
  eventDetailModal.show()
}

/**
 * BR (F.1): Date Selection Handler
 * BR (F.1): 日付選択処理
 *
 * Triggered when user selects date range on calendar
 * カレンダーで日付範囲を選択したときにトリガー
 *
 * Opens create event modal with pre-filled date
 * 事前入力された日付でイベント作成モーダルを開く
 *
 * @param {Object} selectInfo - FullCalendar select event info / 選択イベント情報
 */
const handleDateSelect = (selectInfo) => {
  // Check authentication / 認証をチェック
  if (!isAuthenticated.value) {
    alert('Please login to create events')
    return
  }

  // Pre-fill form with selected date / 選択された日付でフォームを事前入力
  newEvent.value.date = selectInfo.startStr.split('T')[0]
  openCreateEventModal()
}

/**
 * BR (F.1): Booking Conflict Detection
 * BR (F.1): 予約競合検出
 *
 * Checks for various booking conflicts:
 * 様々な予約競合をチェック:
 *
 * Conflict types / 競合タイプ:
 * 1. Capacity check - Event fully booked / 収容人数チェック - イベント満席
 * 2. Time check - Event already passed / 時間チェック - イベント終了済み
 * 3. Schedule conflict - Overlapping events / スケジュール競合 - 重複イベント
 *
 * @param {Object} event - Event to check / チェックするイベント
 */
const checkBookingConflicts = (event) => {
  const props = event.extendedProps

  // Check 1: Capacity / 収容人数チェック
  if (props.participants >= props.maxParticipants) {
    bookingConflict.value = 'This event is fully booked.'
    return
  }

  // Check 2: Past event / 過去のイベントチェック
  if (new Date(event.start) < new Date()) {
    bookingConflict.value = 'This event has already passed.'
    return
  }

  // Check 3: Time conflicts / 時間競合チェック
  // Find overlapping events / 重複するイベントを検索
  const conflictingEvents = events.value.filter((e) => {
    if (e.id === event.id) return false
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    const otherStart = new Date(e.start)
    const otherEnd = new Date(e.end)

    // Check for time overlap / 時間の重複をチェック
    return eventStart < otherEnd && eventEnd > otherStart
  })

  // Warn if conflicts exist / 競合が存在する場合は警告
  if (conflictingEvents.length > 0) {
    bookingConflict.value = `Warning: You have ${conflictingEvents.length} other event(s) at a similar time.`
  }
}

// ============================================================================
// BR (F.1): FullCalendar Configuration
// BR (F.1): FullCalendar設定
// ============================================================================

/**
 * FullCalendar options configuration
 * FullCalendarオプション設定
 *
 * Plugins / プラグイン:
 * - dayGridPlugin: Month view / 月ビュー
 * - timeGridPlugin: Week/Day view / 週/日ビュー
 * - interactionPlugin: User interaction (date select, drag) / ユーザーインタラクション
 * - listPlugin: List view / リストビュー
 *
 * Views / ビュー:
 * - dayGridMonth: Monthly calendar grid / 月間カレンダーグリッド
 * - timeGridWeek: Weekly time schedule / 週間タイムスケジュール
 * - timeGridDay: Daily time schedule / 日間タイムスケジュール
 * - listWeek: Weekly event list / 週間イベントリスト
 */
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: 'dayGridMonth', // Default view / デフォルトビュー

  // Header toolbar configuration / ヘッダーツールバー設定
  headerToolbar: {
    left: 'prev,next today', // Navigation buttons / ナビゲーションボタン
    center: 'title', // Calendar title / カレンダータイトル
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek', // View switcher / ビュー切替
  },

  events: [], // Event data array / イベントデータ配列
  editable: false, // Disable drag & drop / ドラッグ&ドロップを無効化
  selectable: true, // Enable date selection / 日付選択を有効化
  selectMirror: true, // Show selection preview / 選択プレビューを表示
  dayMaxEvents: true, // Show "+more" link when many events / 多数イベント時に"+more"リンクを表示
  weekends: true, // Show weekends / 週末を表示

  // BR (F.1): Event handlers / イベントハンドラー
  eventClick: handleEventClick, // When event is clicked / イベントクリック時
  select: handleDateSelect, // When date range is selected / 日付範囲選択時

  // Event styling / イベントスタイル
  eventColor: '#007bff', // Default event color / デフォルトイベント色

  // Time display format / 時間表示形式
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-hour format / 24時間形式
  },
})

// ============================================================================
// Computed Properties / 算出プロパティ
// ============================================================================

/**
 * Upcoming Events List
 * 今後のイベントリスト
 *
 * Filters and sorts events:
 * イベントをフィルタリングしてソート:
 * 1. Filter events after current date/time / 現在日時以降のイベントをフィルタ
 * 2. Sort by start date ascending / 開始日で昇順ソート
 * 3. Limit to first 6 events / 最初の6イベントに制限
 *
 * @returns {Array} Next 6 upcoming events / 次の6つの今後のイベント
 */
const upcomingEvents = computed(() => {
  const now = new Date()
  return events.value
    .filter((event) => new Date(event.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 6)
})

/**
 * BR (F.1): Booking Button Disabled State
 * BR (F.1): 予約ボタン無効化状態
 *
 * Determines if booking button should be disabled
 * 予約ボタンを無効化すべきかを判定
 *
 * Disabled when / 無効化条件:
 * - No event selected / イベントが選択されていない
 * - Event is fully booked / イベントが満席
 * - Event is in the past / イベントが過去
 *
 * @returns {boolean} True if booking should be disabled / 予約を無効化すべき場合true
 */
const isBookingDisabled = computed(() => {
  if (!selectedEvent.value) return true
  const isFull =
    selectedEvent.value.extendedProps.participants >=
    selectedEvent.value.extendedProps.maxParticipants
  const isPast = new Date(selectedEvent.value.start) < new Date()
  return isFull || isPast
})

// ============================================================================
// Data Methods / データメソッド
// ============================================================================

/**
 * Load events from Firestore
 * Firestoreからイベントを読み込み
 *
 * Process flow / 処理フロー:
 * 1. Query Firestore 'events' collection / Firestore 'events'コレクションをクエリ
 * 2. Transform data to FullCalendar format / データをFullCalendar形式に変換
 * 3. Update events array and calendar / イベント配列とカレンダーを更新
 *
 * Data transformation / データ変換:
 * - Combines date and time fields / 日付と時間フィールドを結合
 * - Creates FullCalendar event objects / FullCalendarイベントオブジェクトを作成
 * - Includes extended properties / 拡張プロパティを含める
 */
const loadEvents = async () => {
  try {
    const eventsCollection = collection(db, 'events')
    const snapshot = await getDocs(eventsCollection)

    // Transform Firestore documents to FullCalendar format
    // FirestoreドキュメントをFullCalendar形式に変換
    const loadedEvents = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        start: `${data.date}T${data.startTime}`, // Combine date and time / 日付と時間を結合
        end: `${data.date}T${data.endTime}`,
        extendedProps: {
          description: data.description,
          location: data.location,
          cuisine: data.cuisine,
          organizer: data.organizer,
          participants: data.participants || 0,
          maxParticipants: data.maxParticipants || 20,
          status: data.status || 'Open',
          imageUrl: data.imageUrl || null,
        },
      }
    })

    // Update state / 状態を更新
    events.value = loadedEvents
    calendarOptions.value.events = loadedEvents

    console.log('Loaded events:', loadedEvents.length)
  } catch (error) {
    console.error('Error loading events:', error)
  }
}

/**
 * BR (F.1): Book Event
 * BR (F.1): イベント予約
 *
 * Handles event booking process:
 * イベント予約処理を実行:
 *
 * Process flow / 処理フロー:
 * 1. Update participant count in Firestore / Firestoreの参加者数を更新
 * 2. Show success message / 成功メッセージを表示
 * 3. Reload events to reflect changes / 変更を反映するためイベントを再読み込み
 * 4. Auto-close modal after 2 seconds / 2秒後にモーダルを自動的に閉じる
 *
 * Uses Firestore increment() for atomic update
 * アトミックな更新のためFirestore increment()を使用
 */
const bookEvent = async () => {
  if (!selectedEvent.value) return

  try {
    const eventRef = doc(db, 'events', selectedEvent.value.id)

    // Atomic increment of participant count / 参加者数のアトミックな増分
    await updateDoc(eventRef, {
      participants: increment(1),
    })

    // Show success message / 成功メッセージを表示
    bookingSuccess.value = 'Successfully booked! You will receive a confirmation email.'

    // Reload events to update calendar / カレンダーを更新するためイベントを再読み込み
    await loadEvents()

    // Auto-close modal after 2 seconds / 2秒後にモーダルを自動的に閉じる
    setTimeout(() => {
      eventDetailModal.hide()
      bookingSuccess.value = ''
    }, 2000)
  } catch (error) {
    console.error('Error booking event:', error)
    bookingConflict.value = 'Failed to book event. Please try again.'
  }
}

/**
 * Open create event modal
 * イベント作成モーダルを開く
 *
 * Initializes modal if not already created
 * まだ作成されていない場合はモーダルを初期化
 */
const openCreateEventModal = () => {
  if (!createEventModal) {
    createEventModal = new Modal(createEventModalRef.value)
  }
  createEventModal.show()
}

/**
 * Create new event
 * 新規イベント作成
 *
 * Process flow / 処理フロー:
 * 1. Validate form data / フォームデータを検証
 * 2. Create event document in Firestore / Firestoreにイベントドキュメントを作成
 * 3. Reset form / フォームをリセット
 * 4. Reload calendar / カレンダーを再読み込み
 * 5. Close modal / モーダルを閉じる
 *
 * Default values / デフォルト値:
 * - Participants: 0 / 参加者: 0
 * - Status: 'Open' / ステータス: '募集中'
 * - Type: 'Workshop' / タイプ: 'ワークショップ'
 */
const createEvent = async () => {
  isCreatingEvent.value = true

  try {
    const eventsCollection = collection(db, 'events')

    // Prepare event data / イベントデータを準備
    const eventData = {
      title: newEvent.value.title,
      description: newEvent.value.description,
      date: newEvent.value.date,
      startTime: newEvent.value.startTime,
      endTime: newEvent.value.endTime,
      location: newEvent.value.location,
      cuisine: newEvent.value.cuisine || 'International',
      organizer: newEvent.value.organizer || currentUser.value?.displayName || 'Anonymous',
      maxParticipants: newEvent.value.maxParticipants,
      participants: 0, // Start with 0 participants / 参加者0で開始
      status: 'Open',
      type: 'Workshop',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Add to Firestore / Firestoreに追加
    await addDoc(eventsCollection, eventData)

    // Reset form / フォームをリセット
    newEvent.value = {
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      cuisine: '',
      maxParticipants: 20,
      organizer: '',
    }

    // Reload events and close modal / イベントを再読み込みしてモーダルを閉じる
    await loadEvents()
    createEventModal.hide()
    alert('Event created successfully!')
  } catch (error) {
    console.error('Error creating event:', error)
    alert('Failed to create event. Please try again.')
  } finally {
    isCreatingEvent.value = false
  }
}

// ============================================================================
// Utility Functions / ユーティリティ関数
// ============================================================================

/**
 * Format date to readable string
 * 日付を読みやすい文字列にフォーマット
 *
 * @param {string|Date} dateString - Date to format / フォーマットする日付
 * @returns {string} Formatted date (e.g., "October 25, 2025") / フォーマットされた日付
 */
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format time to readable string
 * 時間を読みやすい文字列にフォーマット
 *
 * @param {string|Date} dateString - Time to format / フォーマットする時間
 * @returns {string} Formatted time (e.g., "02:30 PM") / フォーマットされた時間
 */
const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get badge CSS class based on event status
 * イベントステータスに基づいてバッジCSSクラスを取得
 *
 * @param {string} status - Event status / イベントステータス
 * @returns {string} Bootstrap badge class / BootstrapバッジクラスStatus badge color mapping / ステータスバッジ色マッピング:
 * - Open → bg-success (green) / 募集中 → 緑
 * - Almost Full → bg-warning (yellow) / 残りわずか → 黄
 * - Full → bg-danger (red) / 満員 → 赤
 * - Other → bg-secondary (gray) / その他 → 灰
 */
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-success'
    case 'Almost Full':
      return 'bg-warning text-dark'
    case 'Full':
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * Component mounted lifecycle hook
 * コンポーネントマウント時のライフサイクルフック
 *
 * Initialization tasks / 初期化タスク:
 * 1. Monitor authentication state / 認証状態を監視
 * 2. Load events from Firestore / Firestoreからイベントを読み込み
 */
onMounted(() => {
  // Monitor Firebase authentication state / Firebase認証状態を監視
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user
    currentUser.value = user
  })

  // Load initial events data / 初期イベントデータを読み込み
  loadEvents()
})
</script>

<style scoped>
/* ============================================================================
   Events Calendar Page Layout / イベントカレンダーページレイアウト
   ============================================================================ */

.events-calendar-page {
  padding-top: 3.5em; /* Account for fixed navbar / 固定ナビゲーションバー用のスペース */
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Desktop layout adjustment / デスクトップレイアウト調整 */
@media (min-width: 992px) {
  .events-calendar-page {
    margin-left: 4.5em; /* Account for sidebar / サイドバー用のマージン */
    transition: margin-left 0.2s ease;
  }
}

/* Mobile layout adjustment / モバイルレイアウト調整 */
@media (max-width: 768px) {
  .events-calendar-page {
    padding-bottom: 4em; /* Account for bottom navigation / ボトムナビゲーション用のパディング */
  }
}

/* ============================================================================
   Event Card Styles / イベントカードスタイル
   ============================================================================ */

/* Event card hover effect / イベントカードホバーエフェクト */
.event-card {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.event-card:hover {
  transform: translateY(-5px); /* Lift card on hover / ホバー時にカードを持ち上げる */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ============================================================================
   FullCalendar Custom Styles / FullCalendarカスタムスタイル
   ============================================================================ */

/* Inherit font family / フォントファミリーを継承 */
:deep(.fc) {
  font-family: inherit;
}

/* Calendar button primary styling / カレンダーボタンプライマリスタイル */
:deep(.fc-button) {
  background-color: #007bff !important;
  border-color: #007bff !important;
}

/* Calendar button hover effect / カレンダーボタンホバーエフェクト */
:deep(.fc-button:hover) {
  background-color: #0056b3 !important;
  border-color: #0056b3 !important;
}

/* Event element cursor / イベント要素カーソル */
:deep(.fc-event) {
  cursor: pointer;
}

/* Event hover opacity / イベントホバー不透明度 */
:deep(.fc-event:hover) {
  opacity: 0.8;
}
</style>
