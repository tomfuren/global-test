<!--
  Restaurant Finder Page - Map-based restaurant search with Mapbox integration
  レストラン検索ページ - Mapbox統合による地図ベースのレストラン検索

  Features / 機能:
  - Current location detection using Geolocation API / Geolocation APIによる現在地検出
  - Restaurant search with address input / 住所入力によるレストラン検索
  - Distance calculation using Haversine formula / Haversine公式を使用した距離計算
  - Interactive map with markers and popups / マーカーとポップアップ付きインタラクティブマップ
  - Route navigation with turn-by-turn directions / ターンバイターンナビゲーション付きルート案内
  - Search radius filtering (1-100km) / 検索半径フィルタリング（1-100km）
  - Restaurant category filtering / レストランカテゴリフィルタリング
  - Responsive design for mobile and desktop / モバイルとデスクトップ対応のレスポンシブデザイン

  BR References / BR参照:
  - BR (E.2): Geo Location - Core geolocation features / コア地理位置情報機能
    * Feature 1: Get current location (Geolocation API) / 現在地取得
    * Feature 2: Restaurant search (Mapbox Geocoding API) / レストラン検索
    * Feature 3: Route navigation (Mapbox Directions API) / ルート案内
  - BR (E.3): Accessibility - ARIA attributes and screen reader support / アクセシビリティ
  - BR (E.4): Data Export - Export restaurant data functionality / データエクスポート機能

  Technology Stack / 技術スタック:
  - Mapbox GL JS v2: Interactive map rendering / インタラクティブマップレンダリング
  - Geolocation API: Browser-based location services / ブラウザベースの位置情報サービス
  - Mapbox Geocoding API: Address to coordinates conversion / 住所から座標への変換
  - Mapbox Directions API: Route calculation and navigation / ルート計算とナビゲーション
  - Firebase Firestore: Restaurant data storage / レストランデータストレージ
  - Haversine Formula: Accurate distance calculation / 正確な距離計算

  Map Configuration / マップ設定:
  - Default Center: Melbourne, Australia (37.8136°S, 144.9631°E) / デフォルト中心: メルボルン
  - Default Zoom: 12 / デフォルトズーム: 12
  - Map Style: streets-v12 / マップスタイル: streets-v12
  - Controls: Navigation, Geolocate / コントロール: ナビゲーション、位置情報
-->

<template>
  <div class="geolocation-page min-vh-100 py-5">
    <div class="container-fluid px-3 px-md-4">
      <!-- Header Section / ヘッダーセクション -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="display-5 fw-bold mb-2">
              <i class="fas fa-map-marked-alt me-2 text-primary"></i>
              Restaurant Finder
            </h1>
            <p class="text-muted">Find nearby restaurants and get directions</p>
          </div>
        </div>
      </div>

      <!--
        Alert Display Area / アラート表示エリア

        BR (E.3): Accessibility - role="alert" for assistive technologies
        BR (E.3): アクセシビリティ - 支援技術用のrole="alert"

        Displays success/error messages with icons
        アイコン付きの成功/エラーメッセージを表示

        Auto-dismisses after 5 seconds
        5秒後に自動的に消去
      -->
      <div v-if="message" class="row mb-4">
        <div class="col-12">
          <div :class="['alert', messageClass, 'd-flex', 'align-items-center']" role="alert">
            <i :class="[messageIcon, 'me-2']"></i>
            {{ message }}
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Column: Search Controls and Restaurant List / 左カラム: 検索コントロールとレストランリスト -->
        <div class="col-lg-5">
          <!--
            Current Location Card / 現在地取得カード

            BR (E.2) Feature 1: Geolocation API Integration
            BR (E.2) 機能1: Geolocation API統合

            Uses navigator.geolocation.getCurrentPosition() to get user's location
            navigator.geolocation.getCurrentPosition()を使用してユーザーの現在地を取得

            Features / 機能:
            - Request browser permission for location / 位置情報のブラウザ許可をリクエスト
            - Display coordinates with 4 decimal precision (~11m accuracy) / 小数点第4位まで座標を表示（約11mの精度）
            - Automatic marker placement on map / 地図上への自動マーカー配置
            - Trigger nearby restaurant search / 近隣レストラン検索をトリガー
          -->
          <div class="card shadow-sm mb-3">
            <div class="card-body">
              <h5 class="card-title mb-3">
                <i class="fas fa-location-arrow me-2"></i>Your Location
              </h5>
              <!-- Get location button / 位置情報取得ボタン -->
              <button
                @click="getCurrentLocation"
                class="btn btn-primary w-100"
                :disabled="isLoading"
              >
                <i class="fas fa-crosshairs me-2"></i>
                {{ isLoading ? 'Getting Location...' : 'Use Current Location' }}
              </button>

              <!-- Coordinate Display Area / 座標表示エリア -->
              <!-- Shows after location is successfully obtained / 位置情報の取得成功後に表示 -->
              <div v-if="userLocation" class="mt-3 p-3 bg-light rounded">
                <small class="text-muted d-block">
                  <i class="fas fa-map-pin me-1"></i>
                  Lat: {{ userLocation.latitude.toFixed(4) }}, Lng:
                  {{ userLocation.longitude.toFixed(4) }}
                </small>
              </div>
            </div>
          </div>

          <!--
            Restaurant Search Card / レストラン検索カード

            BR (E.2) Feature 2: Address Search with Mapbox Geocoding API
            BR (E.2) 機能2: Mapbox Geocoding APIによる住所検索

            Features / 機能:
            - Address to coordinates conversion / 住所から座標への変換
            - Enter key support for quick search / クイック検索用のEnterキーサポート
            - Category filtering (restaurant, cafe, fast_food, bar) / カテゴリフィルタリング
            - Dynamic search radius adjustment (1-100km) / 動的検索半径調整（1-100km）
          -->
          <div class="card shadow-sm mb-3">
            <div class="card-body">
              <h5 class="card-title mb-3"><i class="fas fa-search me-2"></i>Search Restaurants</h5>

              <!-- Address Search Input / 住所検索入力 -->
              <div class="input-group mb-3">
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Enter location or address"
                  @keyup.enter="searchRestaurants"
                />
                <button
                  @click="searchRestaurants"
                  class="btn btn-primary"
                  :disabled="isLoading || !searchQuery"
                >
                  <i class="fas fa-search"></i>
                </button>
              </div>

              <!--
                Category Filter / カテゴリーフィルター

                Filter restaurants by type
                タイプ別にレストランをフィルター

                Categories / カテゴリー:
                - All Restaurants / すべてのレストラン
                - Cafes / カフェ
                - Fast Food / ファストフード
                - Bars / バー

                TODO: Implement Firestore query integration
                TODO: Firestoreクエリとの統合を実装
              -->
              <div class="mb-3">
                <label class="form-label small text-muted">Restaurant Type:</label>
                <select v-model="selectedCategory" class="form-select form-select-sm">
                  <option value="restaurant">All Restaurants</option>
                  <option value="cafe">Cafes</option>
                  <option value="fast_food">Fast Food</option>
                  <option value="bar">Bars</option>
                </select>
              </div>

              <!--
                Search Radius Slider / 検索半径スライダー

                Dynamically adjust search distance
                検索距離を動的に調整

                Range: 1-100km / 範囲: 1-100km
                Default: 5km / デフォルト: 5km
                Step: 1km / ステップ: 1km
              -->
              <div>
                <label class="form-label small text-muted">
                  Search Radius: {{ searchRadius }}km
                </label>
                <input
                  v-model.number="searchRadius"
                  type="range"
                  class="form-range"
                  min="1"
                  max="100"
                  step="1"
                />
              </div>
            </div>
          </div>

          <!--
            Restaurant List Card / レストランリストカード

            Displays search results sorted by distance
            距離順にソートされた検索結果を表示

            Display States / 表示状態:
            1. Loading: Spinner animation / ローディング: スピナーアニメーション
            2. Empty: No results message / 空: 結果なしメッセージ
            3. Results: Restaurant cards with details / 結果: 詳細付きレストランカード

            Each Restaurant Item Shows / 各レストラン項目の表示内容:
            - Name and icon / 名前とアイコン
            - Full address / 完全な住所
            - Distance (calculated using Haversine formula) / 距離（Haversine公式で計算）
            - Rating (if available) / 評価（利用可能な場合）
            - Get Directions button / ルート案内ボタン
          -->
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-3">
                <i class="fas fa-utensils me-2"></i>
                Nearby Restaurants
                <!-- Result count badge / 結果数バッジ -->
                <span v-if="restaurants.length > 0" class="badge bg-primary ms-2">
                  {{ restaurants.length }}
                </span>
              </h5>

              <!-- Loading State / ローディング状態 -->
              <div v-if="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Empty State / 空状態 -->
              <div v-else-if="restaurants.length === 0" class="text-center py-4 text-muted">
                <i class="fas fa-info-circle fa-2x mb-2"></i>
                <p class="mb-0">No restaurants found. Try searching a location.</p>
              </div>

              <!-- Restaurant List / レストラン一覧 -->
              <!-- Click to select and fly to location on map / クリックして選択し、地図上の位置にフライ -->
              <div v-else class="restaurant-list">
                <div
                  v-for="(restaurant, index) in restaurants"
                  :key="index"
                  class="restaurant-item p-3 mb-2 rounded cursor-pointer"
                  :class="{ selected: selectedRestaurant === restaurant }"
                  @click="selectRestaurant(restaurant)"
                >
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                      <!-- Restaurant name / レストラン名 -->
                      <h6 class="mb-1">
                        <i class="fas fa-store me-1 text-primary"></i>
                        {{ restaurant.name }}
                      </h6>
                      <!-- Address / 住所 -->
                      <p class="small text-muted mb-1">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        {{ restaurant.address }}
                      </p>
                      <div class="d-flex align-items-center">
                        <!-- Distance badge / 距離バッジ -->
                        <span class="badge bg-light text-dark me-2">
                          <i class="fas fa-walking me-1"></i>
                          {{ restaurant.distance }} km
                        </span>
                        <!-- Rating badge (if available) / 評価バッジ（利用可能な場合） -->
                        <span v-if="restaurant.rating" class="badge bg-warning text-dark">
                          <i class="fas fa-star me-1"></i>
                          {{ restaurant.rating }}
                        </span>
                      </div>
                    </div>
                    <!--
                      Get Directions Button / ルート案内ボタン

                      BR (E.2) Feature 3: Route Navigation
                      BR (E.2) 機能3: ルート案内

                      Uses Mapbox Directions API to calculate route
                      Mapbox Directions APIを使用してルートを計算

                      @click.stop prevents parent click event
                      @click.stopは親要素のクリックイベントを防止
                    -->
                    <button
                      @click.stop="getDirections(restaurant)"
                      class="btn btn-sm btn-outline-primary"
                      title="Get Directions"
                    >
                      <i class="fas fa-directions"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Mapbox Map and Route Information / 右カラム: Mapbox地図とルート情報 -->
        <div class="col-lg-7">
          <div class="card shadow-sm">
            <div class="card-body p-0">
              <!--
                Mapbox Map Container / Mapboxマップコンテナ

                Initialization: Performed in onMounted() lifecycle hook
                初期化: onMounted()ライフサイクルフックで実行

                Default Configuration / デフォルト設定:
                - Center: Melbourne, Australia (144.9631°E, 37.8136°S) / 中心: メルボルン
                - Zoom Level: 12 / ズームレベル: 12
                - Style: mapbox://styles/mapbox/streets-v12 / スタイル: streets-v12

                Built-in Controls / 組み込みコントロール:
                - Navigation: Zoom in/out, rotate / ナビゲーション: ズームイン/アウト、回転
                - Geolocate: Quick access to current location / 位置情報: 現在地への素早いアクセス

                Interactions / インタラクション:
                - Click markers to show popups / マーカークリックでポップアップ表示
                - Drag to pan / ドラッグでパン
                - Scroll to zoom / スクロールでズーム
                - Pinch to zoom (mobile) / ピンチでズーム（モバイル）
              -->
              <div id="map" class="map-container"></div>

              <!--
                Route Information Panel / ルート情報パネル

                BR (E.2) Feature 3: Route Navigation Details
                BR (E.2) 機能3: ルート案内詳細

                Displayed after route calculation
                ルート計算後に表示

                Shows / 表示内容:
                - Duration: Formatted time (e.g., "15 min", "1h 20min") / 所要時間: フォーマット済み時間
                - Distance: In kilometers (e.g., "5.43 km") / 距離: キロメートル単位
                - Clear button: Remove route from map / クリアボタン: 地図からルートを削除

                Data Source: Mapbox Directions API response
                データソース: Mapbox Directions APIレスポンス
              -->
              <div v-if="routeInfo" class="p-3 border-top">
                <h6 class="mb-2">
                  <i class="fas fa-route me-2 text-primary"></i>
                  Route Information
                </h6>
                <div class="row g-2">
                  <!-- Duration display / 所要時間表示 -->
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-clock text-muted me-2"></i>
                      <div>
                        <small class="text-muted d-block">Duration</small>
                        <strong>{{ routeInfo.duration }}</strong>
                      </div>
                    </div>
                  </div>
                  <!-- Distance display / 距離表示 -->
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-road text-muted me-2"></i>
                      <div>
                        <small class="text-muted d-block">Distance</small>
                        <strong>{{ routeInfo.distance }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Clear route button / ルートクリアボタン -->
                <button @click="clearRoute" class="btn btn-sm btn-outline-secondary w-100 mt-3">
                  <i class="fas fa-times me-1"></i>Clear Route
                </button>
              </div>
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

// Vue Composition API
import { ref, computed, onMounted } from 'vue'

// HTTP client for API requests / APIリクエスト用HTTPクライアント
import axios from 'axios'

// Mapbox GL JS library and styles / Mapbox GLライブラリとスタイル
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Firebase Firestore for restaurant data / レストランデータ用Firebase Firestore
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'

// ============================================================================
// BR (E.2): Mapbox API Configuration
// BR (E.2): Mapbox API設定
// ============================================================================

/**
 * Mapbox Access Token
 * Mapboxアクセストークン
 *
 * Required for all Mapbox API services:
 * すべてのMapbox APIサービスに必要:
 * - Map rendering / マップレンダリング
 * - Geocoding (address to coordinates) / ジオコーディング（住所から座標）
 * - Directions (route calculation) / ルート案内（ルート計算）
 *
 * Security Note: Should be moved to environment variables in production
 * セキュリティ注意: 本番環境では環境変数に移行すべき
 *
 * Usage: import.meta.env.VITE_MAPBOX_TOKEN
 * 使用法: import.meta.env.VITE_MAPBOX_TOKEN
 */
const MAPBOX_TOKEN =
  'pk.eyJ1IjoidGltMDcxMXZyYyIsImEiOiJjbWd3eGp2b28wY29pMm5weGVpNncxM25zIn0.Xk0HpuaBU_k04XucsuSK7Q'
mapboxgl.accessToken = MAPBOX_TOKEN

// ============================================================================
// Component State / コンポーネント状態
// ============================================================================

/**
 * User Location State
 * ユーザー位置情報状態
 *
 * Stores user's current location from Geolocation API
 * Geolocation APIからのユーザーの現在地を保存
 *
 * Structure: { latitude: number, longitude: number }
 * 構造: { latitude: number, longitude: number }
 */
const userLocation = ref(null)

/**
 * Search Query State
 * 検索クエリ状態
 *
 * User input for address or place name search
 * 住所または場所名検索用のユーザー入力
 */
const searchQuery = ref('')

/**
 * Restaurant Category Filter
 * レストランカテゴリフィルター
 *
 * Filter restaurants by type
 * タイプ別にレストランをフィルター
 *
 * Options: 'restaurant', 'cafe', 'fast_food', 'bar'
 * オプション: 'restaurant', 'cafe', 'fast_food', 'bar'
 */
const selectedCategory = ref('restaurant')

/**
 * Search Radius State
 * 検索半径状態
 *
 * Distance range for restaurant search in kilometers
 * レストラン検索の距離範囲（キロメートル）
 *
 * Range: 1-100km / 範囲: 1-100km
 * Default: 5km / デフォルト: 5km
 */
const searchRadius = ref(5)

/**
 * Restaurants Array
 * レストラン配列
 *
 * Stores search results with calculated distances
 * 計算された距離を含む検索結果を保存
 *
 * Each restaurant object contains:
 * 各レストランオブジェクトには以下を含む:
 * - id, name, address, coordinates, distance, rating, etc.
 */
const restaurants = ref([])

/**
 * Selected Restaurant State
 * 選択されたレストラン状態
 *
 * Currently selected restaurant from the list
 * リストから現在選択されているレストラン
 */
const selectedRestaurant = ref(null)

/**
 * Route Information State
 * ルート情報状態
 *
 * Stores calculated route data from Mapbox Directions API
 * Mapbox Directions APIからの計算されたルートデータを保存
 *
 * Structure: { duration: string, distance: string }
 * 構造: { duration: string, distance: string }
 */
const routeInfo = ref(null)

/**
 * Loading State Flag
 * ローディング状態フラグ
 *
 * Indicates async operations in progress
 * 非同期操作の進行中を示す
 */
const isLoading = ref(false)

/**
 * Message Display State
 * メッセージ表示状態
 *
 * Stores user-facing success/error messages
 * ユーザー向けの成功/エラーメッセージを保存
 */
const message = ref('')

/**
 * Message Type State
 * メッセージタイプ状態
 *
 * Determines message styling ('success' | 'error')
 * メッセージスタイルを決定（'success' | 'error'）
 */
const messageType = ref('success')

// ============================================================================
// Map Instance and Markers / マップインスタンスとマーカー
// ============================================================================

/**
 * Mapbox Map Instance
 * Mapboxマップインスタンス
 *
 * Main map object (not reactive)
 * メインマップオブジェクト（リアクティブではない）
 *
 * Initialized in onMounted() lifecycle hook
 * onMounted()ライフサイクルフックで初期化
 */
let map = null

/**
 * User Location Marker
 * ユーザー位置マーカー
 *
 * Blue circle marker showing user's current position
 * ユーザーの現在位置を示す青い円マーカー
 */
let userMarker = null

/**
 * Restaurant Markers Array
 * レストランマーカー配列
 *
 * Collection of red utensil markers for restaurants
 * レストラン用の赤いフォーク&ナイフマーカーのコレクション
 */
const restaurantMarkers = ref([])

// ============================================================================
// Computed Properties / 算出プロパティ
// ============================================================================

/**
 * Message CSS Class
 * メッセージCSSクラス
 *
 * Returns Bootstrap alert class based on message type
 * メッセージタイプに基づいてBootstrapアラートクラスを返す
 *
 * @returns {string} 'alert-danger' or 'alert-success'
 */
const messageClass = computed(() => {
  return messageType.value === 'error' ? 'alert-danger' : 'alert-success'
})

/**
 * Message Icon Class
 * メッセージアイコンクラス
 *
 * Returns Font Awesome icon class based on message type
 * メッセージタイプに基づいてFont Awesomeアイコンクラスを返す
 *
 * @returns {string} Icon class name
 */
const messageIcon = computed(() => {
  return messageType.value === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'
})

// ============================================================================
// Helper Functions / ヘルパー関数
// ============================================================================

/**
 * Show Message Helper
 * メッセージ表示ヘルパー
 *
 * Displays message and auto-dismisses after 5 seconds
 * メッセージを表示し、5秒後に自動的に消去
 *
 * @param {string} msg - Message to display / 表示メッセージ
 * @param {string} type - Message type ('success' | 'error') / メッセージタイプ
 */
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// ============================================================================
// BR (E.2) Feature 1: Current Location Detection
// BR (E.2) 機能1: 現在地検出
// ============================================================================

/**
 * Get Current Location
 * 現在地を取得
 *
 * Uses browser's Geolocation API to get user's current position
 * ブラウザのGeolocation APIを使用してユーザーの現在位置を取得
 *
 * Process flow / 処理フロー:
 * 1. Check if Geolocation API is available / Geolocation APIが利用可能かチェック
 * 2. Request location permission / 位置情報許可をリクエスト
 * 3. Get coordinates (latitude, longitude) / 座標を取得（緯度、経度）
 * 4. Update map with user marker / ユーザーマーカーで地図を更新
 * 5. Fly to user's location / ユーザーの位置にフライ
 * 6. Trigger nearby restaurant search / 近隣レストラン検索をトリガー
 *
 * Error Handling / エラーハンドリング:
 * - Permission denied / 許可拒否
 * - Position unavailable / 位置情報利用不可
 * - Timeout / タイムアウト
 * - API not supported / API未サポート
 */
const getCurrentLocation = async () => {
  isLoading.value = true

  try {
    // Check if Geolocation API is available / Geolocation APIの利用可能性をチェック
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Extract coordinates / 座標を抽出
          const { latitude, longitude } = position.coords

          // Store user location / ユーザー位置を保存
          userLocation.value = {
            latitude,
            longitude,
          }

          // Update map display / 地図表示を更新
          if (map) {
            // Fly to current location / 現在地にフライ
            map.flyTo({
              center: [longitude, latitude],
              zoom: 14,
            })

            // Remove existing user marker / 既存のユーザーマーカーを削除
            if (userMarker) {
              userMarker.remove()
            }

            // Create custom marker element / カスタムマーカー要素を作成
            const el = document.createElement('div')
            el.className = 'user-location-marker'
            el.innerHTML = '<i class="fas fa-circle text-primary"></i>'

            // Add new user marker / 新しいユーザーマーカーを追加
            userMarker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map)
          }

          showMessage('Current location obtained successfully!', 'success')

          // Automatically search nearby restaurants / 自動的に近隣レストランを検索
          await searchNearbyRestaurants(latitude, longitude)
        },
        (error) => {
          // Handle geolocation errors / 位置情報エラーを処理
          console.error('Geolocation error:', error)
          showMessage('Unable to get location. Please check your browser settings.', 'error')
          isLoading.value = false
        },
      )
    } else {
      showMessage('This browser does not support geolocation.', 'error')
      isLoading.value = false
    }
  } catch (error) {
    console.error('Error getting current location:', error)
    showMessage('An error occurred while getting location.', 'error')
    isLoading.value = false
  }
}

// ============================================================================
// BR (E.2) Feature 2: Restaurant Search
// BR (E.2) 機能2: レストラン検索
// ============================================================================

/**
 * Search Restaurants by Address
 * 住所でレストランを検索
 *
 * Uses Mapbox Geocoding API to convert address to coordinates
 * Mapbox Geocoding APIを使用して住所を座標に変換
 *
 * Process flow / 処理フロー:
 * 1. Validate search query / 検索クエリを検証
 * 2. Call Mapbox Geocoding API / Mapbox Geocoding APIを呼び出し
 * 3. Extract coordinates from response / レスポンスから座標を抽出
 * 4. Update map center / 地図の中心を更新
 * 5. Search nearby restaurants / 近隣レストランを検索
 *
 * API Endpoint: https://api.mapbox.com/geocoding/v5/mapbox.places/
 * APIエンドポイント: https://api.mapbox.com/geocoding/v5/mapbox.places/
 */
const searchRestaurants = async () => {
  // Validate input / 入力を検証
  if (!searchQuery.value.trim()) {
    showMessage('Please enter a location to search.', 'error')
    return
  }

  isLoading.value = true

  try {
    // BR (E.2): Mapbox Geocoding API call / Mapbox Geocoding API呼び出し
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?access_token=${MAPBOX_TOKEN}`
    const geocodeResponse = await axios.get(geocodeUrl)

    // Check if location found / 場所が見つかったかチェック
    if (geocodeResponse.data.features.length === 0) {
      showMessage('Location not found. Please try another search term.', 'error')
      isLoading.value = false
      return
    }

    // Extract coordinates (longitude, latitude) / 座標を抽出（経度、緯度）
    const [longitude, latitude] = geocodeResponse.data.features[0].center

    // Update map view / 地図ビューを更新
    if (map) {
      map.flyTo({
        center: [longitude, latitude],
        zoom: 14,
      })
    }

    // Search restaurants near this location / この場所の近くのレストランを検索
    await searchNearbyRestaurants(latitude, longitude)

    showMessage('Search completed!', 'success')
  } catch (error) {
    console.error('Search error:', error)
    showMessage('An error occurred during search.', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * Search Nearby Restaurants from Firestore
 * Firestoreから近隣レストランを検索
 *
 * Retrieves all restaurants from Firestore and filters by distance
 * Firestoreからすべてのレストランを取得し、距離でフィルター
 *
 * Process flow / 処理フロー:
 * 1. Query Firestore 'restaurants' collection / Firestore 'restaurants'コレクションをクエリ
 * 2. Calculate distance for each restaurant / 各レストランの距離を計算
 * 3. Filter by search radius / 検索半径でフィルター
 * 4. Sort by distance (ascending) / 距離でソート（昇順）
 * 5. Display markers on map / 地図上にマーカーを表示
 *
 * @param {number} latitude - Search center latitude / 検索中心緯度
 * @param {number} longitude - Search center longitude / 検索中心経度
 */
const searchNearbyRestaurants = async (latitude, longitude) => {
  try {
    console.log('Searching restaurants from Firestore...')

    // Query Firestore for all restaurants / すべてのレストランをFirestoreでクエリ
    const restaurantsCollection = collection(db, 'restaurants')
    const snapshot = await getDocs(restaurantsCollection)

    if (snapshot.empty) {
      console.log('No restaurants found in Firestore')
      restaurants.value = []
      return
    }

    // Process restaurant data and calculate distances / レストランデータを処理し距離を計算
    const allRestaurants = snapshot.docs.map((doc) => {
      const data = doc.data()

      // Calculate distance using Haversine formula / Haversine公式を使用して距離を計算
      const distance = calculateDistance(
        latitude,
        longitude,
        data.location.latitude,
        data.location.longitude,
      )

      return {
        id: doc.id,
        name: data.name,
        type: data.type,
        cuisine: data.cuisine,
        address: data.address,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        distance: distance.toFixed(2), // Round to 2 decimal places / 小数点第2位まで四捨五入
        rating: data.averageRating || 'N/A',
        priceRange: data.priceRange || '$$',
        phone: data.phone,
        website: data.website,
        imageUrl: data.imageUrl,
        features: data.features || [],
        openingHours: data.openingHours || {},
      }
    })

    // Filter by search radius and sort by distance / 検索半径でフィルターし距離でソート
    restaurants.value = allRestaurants
      .filter((restaurant) => parseFloat(restaurant.distance) <= searchRadius.value)
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

    console.log(`Found ${restaurants.value.length} restaurants within ${searchRadius.value}km`)

    // Display restaurant markers on map / 地図上にレストランマーカーを表示
    displayRestaurantMarkers()

    isLoading.value = false
  } catch (error) {
    console.error('Error searching nearby restaurants from Firestore:', error)
    restaurants.value = []
    isLoading.value = false
  }
}

/**
 * Calculate Distance Between Two Points (Haversine Formula)
 * 2地点間の距離を計算（Haversine公式）
 *
 * The Haversine formula calculates great-circle distance between two points on a sphere
 * Haversine公式は球面上の2点間の大円距離を計算する
 *
 * Formula Explanation / 公式の説明:
 * The formula accounts for Earth's curvature to provide accurate distances
 * この公式は地球の曲率を考慮して正確な距離を提供
 *
 * Steps / 手順:
 * 1. Convert latitude/longitude differences to radians / 緯度/経度の差をラジアンに変換
 * 2. Apply Haversine function: hav(θ) = sin²(θ/2) / Haversine関数を適用
 * 3. Calculate central angle using arctan / arctanを使用して中心角を計算
 * 4. Multiply by Earth's radius to get distance / 地球の半径を掛けて距離を取得
 *
 * Accuracy / 精度:
 * - Assumes Earth is a perfect sphere (actual ellipsoid) / 地球を完全な球体と仮定（実際は楕円体）
 * - High accuracy for short distances (< 1000km) / 短距離では高精度（< 1000km）
 * - Margin of error: ~0.5% / 誤差範囲: 約0.5%
 *
 * @param {number} lat1 - Latitude of point 1 (degrees) / 地点1の緯度（度）
 * @param {number} lon1 - Longitude of point 1 (degrees) / 地点1の経度（度）
 * @param {number} lat2 - Latitude of point 2 (degrees) / 地点2の緯度（度）
 * @param {number} lon2 - Longitude of point 2 (degrees) / 地点2の経度（度）
 * @returns {number} Distance in kilometers / 距離（キロメートル）
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in kilometers / 地球の半径（キロメートル）

  // Convert degree differences to radians / 度の差をラジアンに変換
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  // Haversine formula main calculation / Haversine公式のメイン計算
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  // Calculate central angle / 中心角を計算
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  // Distance = radius × central angle / 距離 = 半径 × 中心角
  return R * c
}

/**
 * Display Restaurant Markers on Map
 * 地図上にレストランマーカーを表示
 *
 * Creates custom markers for each restaurant with popups
 * 各レストランのポップアップ付きカスタムマーカーを作成
 *
 * Marker Features / マーカー機能:
 * - Custom red utensil icon / カスタム赤フォーク&ナイフアイコン
 * - Clickable popup with details / 詳細付きクリック可能ポップアップ
 * - Hover scale animation / ホバースケールアニメーション
 */
const displayRestaurantMarkers = () => {
  // Remove existing markers / 既存のマーカーを削除
  restaurantMarkers.value.forEach((marker) => marker.remove())
  restaurantMarkers.value = []

  if (!map) return

  // Add new markers for each restaurant / 各レストランの新しいマーカーを追加
  restaurants.value.forEach((restaurant) => {
    // Create custom marker element / カスタムマーカー要素を作成
    const el = document.createElement('div')
    el.className = 'restaurant-marker'
    el.innerHTML = '<i class="fas fa-utensils text-danger"></i>'

    // Create marker with popup / ポップアップ付きマーカーを作成
    const marker = new mapboxgl.Marker(el)
      .setLngLat([restaurant.longitude, restaurant.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h6 class="mb-1">${restaurant.name}</h6>
              <p class="small mb-1">${restaurant.address}</p>
              <span class="badge bg-primary">${restaurant.distance} km</span>
            </div>
          `),
      )
      .addTo(map)

    restaurantMarkers.value.push(marker)
  })
}

/**
 * Select Restaurant
 * レストランを選択
 *
 * Updates selected restaurant and flies map to its location
 * 選択されたレストランを更新し、その場所に地図をフライ
 *
 * @param {Object} restaurant - Restaurant object / レストランオブジェクト
 */
const selectRestaurant = (restaurant) => {
  selectedRestaurant.value = restaurant

  if (map) {
    // Fly to selected restaurant / 選択されたレストランにフライ
    map.flyTo({
      center: [restaurant.longitude, restaurant.latitude],
      zoom: 15,
    })
  }
}

// ============================================================================
// BR (E.2) Feature 3: Route Navigation
// BR (E.2) 機能3: ルート案内
// ============================================================================

/**
 * Get Directions to Restaurant
 * レストランへのルート案内を取得
 *
 * Uses Mapbox Directions API to calculate optimal route
 * Mapbox Directions APIを使用して最適ルートを計算
 *
 * Process flow / 処理フロー:
 * 1. Verify user location is available / ユーザー位置が利用可能か確認
 * 2. Call Mapbox Directions API / Mapbox Directions APIを呼び出し
 * 3. Extract route geometry and metadata / ルートジオメトリとメタデータを抽出
 * 4. Display route on map / 地図上にルートを表示
 * 5. Show duration and distance / 所要時間と距離を表示
 *
 * API Endpoint: https://api.mapbox.com/directions/v5/mapbox/driving/
 * APIエンドポイント: https://api.mapbox.com/directions/v5/mapbox/driving/
 *
 * @param {Object} restaurant - Destination restaurant / 目的地レストラン
 */
const getDirections = async (restaurant) => {
  // Verify user location / ユーザー位置を確認
  if (!userLocation.value) {
    showMessage('Please get your current location first.', 'error')
    return
  }

  isLoading.value = true
  selectedRestaurant.value = restaurant

  try {
    // BR (E.2): Mapbox Directions API call / Mapbox Directions API呼び出し
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.value.longitude},${userLocation.value.latitude};${restaurant.longitude},${restaurant.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    const directionsResponse = await axios.get(directionsUrl)

    // Check if route found / ルートが見つかったかチェック
    if (directionsResponse.data.routes.length === 0) {
      showMessage('Route not found.', 'error')
      isLoading.value = false
      return
    }

    // Extract route data / ルートデータを抽出
    const route = directionsResponse.data.routes[0]

    // Store route information / ルート情報を保存
    routeInfo.value = {
      duration: formatDuration(route.duration),
      distance: formatDistance(route.distance),
    }

    // Display route on map / 地図上にルートを表示
    displayRoute(route.geometry)

    showMessage('Route calculated successfully!', 'success')
  } catch (error) {
    console.error('Error getting directions:', error)
    showMessage('An error occurred while getting directions.', 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * Display Route on Map
 * 地図上にルートを表示
 *
 * Draws route line on map and fits bounds to show entire route
 * 地図上にルート線を描画し、ルート全体が見えるように境界を調整
 *
 * @param {Object} geometry - GeoJSON geometry object / GeoJSONジオメトリオブジェクト
 */
const displayRoute = (geometry) => {
  if (!map) return

  // Remove existing route layer / 既存のルートレイヤーを削除
  if (map.getLayer('route')) {
    map.removeLayer('route')
    map.removeSource('route')
  }

  // Add route source / ルートソースを追加
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: geometry,
    },
  })

  // Add route layer with styling / スタイル付きルートレイヤーを追加
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#007bff', // Blue route line / 青いルート線
      'line-width': 4,
      'line-opacity': 0.75,
    },
  })

  // Fit map to show entire route / ルート全体が見えるように地図を調整
  const coordinates = geometry.coordinates
  const bounds = coordinates.reduce(
    (bounds, coord) => {
      return bounds.extend(coord)
    },
    new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
  )

  map.fitBounds(bounds, {
    padding: 50,
  })
}

/**
 * Clear Route from Map
 * 地図からルートをクリア
 *
 * Removes route layer and resets route information
 * ルートレイヤーを削除し、ルート情報をリセット
 */
const clearRoute = () => {
  routeInfo.value = null

  if (map && map.getLayer('route')) {
    map.removeLayer('route')
    map.removeSource('route')
  }
}

// ============================================================================
// Utility Functions / ユーティリティ関数
// ============================================================================

/**
 * Format Duration (seconds to human-readable)
 * 所要時間をフォーマット（秒から人間が読める形式へ）
 *
 * Converts seconds to minutes or hours
 * 秒を分または時間に変換
 *
 * Examples / 例:
 * - 300 seconds → "5 min"
 * - 3600 seconds → "1h 0min"
 * - 5400 seconds → "1h 30min"
 *
 * @param {number} seconds - Duration in seconds / 所要時間（秒）
 * @returns {string} Formatted duration / フォーマットされた所要時間
 */
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}min`
}

/**
 * Format Distance (meters to kilometers)
 * 距離をフォーマット（メートルからキロメートルへ）
 *
 * Converts meters to kilometers with 2 decimal places
 * メートルを小数点第2位までのキロメートルに変換
 *
 * Examples / 例:
 * - 1000 meters → "1.00 km"
 * - 5432 meters → "5.43 km"
 *
 * @param {number} meters - Distance in meters / 距離（メートル）
 * @returns {string} Formatted distance / フォーマットされた距離
 */
const formatDistance = (meters) => {
  const km = meters / 1000
  return `${km.toFixed(2)} km`
}

// ============================================================================
// Map Initialization / マップ初期化
// ============================================================================

/**
 * Initialize Mapbox Map
 * Mapboxマップを初期化
 *
 * Creates map instance with default settings and controls
 * デフォルト設定とコントロールでマップインスタンスを作成
 *
 * Configuration / 設定:
 * - Container: 'map' div element / コンテナ: 'map' div要素
 * - Style: streets-v12 / スタイル: streets-v12
 * - Center: Melbourne [144.9631, -37.8136] / 中心: メルボルン
 * - Zoom: 12 / ズーム: 12
 *
 * Controls Added / 追加されたコントロール:
 * - Navigation: Zoom in/out, rotate / ナビゲーション: ズームイン/アウト、回転
 * - Geolocate: Quick access to current location / 位置情報: 現在地への素早いアクセス
 */
const initializeMap = () => {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [144.9631, -37.8136], // Melbourne coordinates / メルボルンの座標
    zoom: 12,
  })

  // Add navigation control / ナビゲーションコントロールを追加
  map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  // Add geolocate control / 位置情報コントロールを追加
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true, // Use GPS if available / 利用可能な場合はGPSを使用
      },
      trackUserLocation: true, // Track user movement / ユーザーの移動を追跡
      showUserHeading: true, // Show direction user is facing / ユーザーの向いている方向を表示
    }),
    'top-right',
  )
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * Component mounted lifecycle hook
 * コンポーネントマウント時のライフサイクルフック
 *
 * Initializes Mapbox map when component mounts
 * コンポーネントマウント時にMapboxマップを初期化
 */
onMounted(() => {
  initializeMap()
})
</script>

<style scoped>
/* ============================================================================
   Page Layout Styles / ページレイアウトスタイル
   ============================================================================ */

/* Gradient background for page / ページのグラデーション背景 */
.geolocation-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* ============================================================================
   Map Container Styles / マップコンテナスタイル
   ============================================================================ */

/* Fixed height map container with rounded top corners / 固定高さのマップコンテナと丸い上角 */
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 10px 10px 0 0;
}

/* ============================================================================
   Restaurant List Styles / レストランリストスタイル
   ============================================================================ */

/* Individual restaurant item styling / 個別レストラン項目スタイル */
.restaurant-item {
  border: 1px solid #dee2e6;
  background: #fff;
  transition: all 0.3s ease;
}

/* Restaurant item hover effect / レストラン項目ホバーエフェクト */
.restaurant-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
  transform: translateX(5px); /* Slide right on hover / ホバー時に右にスライド */
}

/* Selected restaurant highlighting / 選択されたレストランのハイライト */
.restaurant-item.selected {
  border-color: #007bff;
  background: #e7f3ff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

/* Scrollable restaurant list / スクロール可能なレストランリスト */
.restaurant-list {
  max-height: 400px;
  overflow-y: auto;
}

/* Cursor pointer utility / カーソルポインターユーティリティ */
.cursor-pointer {
  cursor: pointer;
}

/* ============================================================================
   Custom Marker Styles / カスタムマーカースタイル
   ============================================================================ */

/* User location marker (blue circle) / ユーザー位置マーカー（青い円） */
:deep(.user-location-marker) {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:deep(.user-location-marker i) {
  font-size: 8px;
}

/* Restaurant marker (red utensil icon) / レストランマーカー（赤いフォーク&ナイフアイコン） */
:deep(.restaurant-marker) {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Restaurant marker hover effect / レストランマーカーホバーエフェクト */
:deep(.restaurant-marker:hover) {
  transform: scale(1.2); /* Scale up on hover / ホバー時に拡大 */
}

:deep(.restaurant-marker i) {
  font-size: 14px;
}

/* ============================================================================
   Mapbox Popup Styles / Mapboxポップアップスタイル
   ============================================================================ */

/* Custom popup styling / カスタムポップアップスタイル */
:deep(.mapboxgl-popup-content) {
  padding: 0;
  border-radius: 8px;
}

/* ============================================================================
   Responsive Adjustments / レスポンシブ調整
   ============================================================================ */

/* Tablet and below / タブレット以下 */
@media (max-width: 991.98px) {
  .map-container {
    height: 400px;
  }

  .restaurant-list {
    max-height: 300px;
  }
}

/* Mobile devices / モバイルデバイス */
@media (max-width: 575.98px) {
  .map-container {
    height: 300px;
  }
}
</style>
