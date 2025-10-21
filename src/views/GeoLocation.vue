<!--
  レストラン検索ページ - Mapbox統合による地図ベースのレストラン検索
  Restaurant Finder Page - Map-based restaurant search with Mapbox integration

  主要機能 / Key Features:
  - BR (E.2): 現在地取得 (Geolocation API) / Get current location (Geolocation API)
  - BR (E.2): レストラン検索 (Mapbox Geocoding API) / Restaurant search (Mapbox Geocoding API)
  - BR (E.2): ルート案内 (Mapbox Directions API) / Route navigation (Mapbox Directions API)
  - BR (E.3): アクセシビリティ対応 / Accessibility support
  - BR (E.4): データエクスポート機能 / Data export functionality

  技術スタック / Technology Stack:
  - Mapbox GL JS: 地図表示とインタラクション / Map display and interaction
  - Geolocation API: ユーザーの現在地取得 / Get user's current location
  - Haversine Formula: 2地点間の距離計算 / Calculate distance between two points
  - Firebase Firestore: レストランデータストレージ / Restaurant data storage
-->
<template>
  <div class="geolocation-page min-vh-100 py-5">
    <div class="container-fluid px-3 px-md-4">
      <!-- ヘッダーセクション / Header Section -->
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
        アラート表示エリア - 成功/エラーメッセージを表示
        Alert Display Area - Show success/error messages

        BR (E.3): アクセシビリティ - role="alert"で支援技術に通知
        BR (E.3): Accessibility - role="alert" notifies assistive technologies
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
        <!-- 左カラム: 検索フォームとレストランリスト / Left Column: Search form and restaurant list -->
        <div class="col-lg-5">
          <!--
            現在地取得カード - ブラウザのGeolocation APIを使用
            Current Location Card - Uses browser's Geolocation API

            機能 / Features:
            - navigator.geolocation.getCurrentPosition()でユーザーの現在地を取得
            - Get user's current location using navigator.geolocation.getCurrentPosition()
            - 座標を小数点第4位まで表示 (約11mの精度)
            - Display coordinates to 4 decimal places (approx. 11m accuracy)
          -->
          <div class="card shadow-sm mb-3">
            <div class="card-body">
              <h5 class="card-title mb-3">
                <i class="fas fa-location-arrow me-2"></i>Your Location
              </h5>
              <button
                @click="getCurrentLocation"
                class="btn btn-primary w-100"
                :disabled="isLoading"
              >
                <i class="fas fa-crosshairs me-2"></i>
                {{ isLoading ? 'Getting Location...' : 'Use Current Location' }}
              </button>
              <!-- 座標表示エリア - 現在地取得後に表示 / Coordinate display - shown after location acquired -->
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
            レストラン検索カード - 住所検索とフィルタリング
            Restaurant Search Card - Address search and filtering

            機能 / Features:
            - Mapbox Geocoding API: 住所を座標に変換 / Convert address to coordinates
            - Enterキー対応: @keyup.enterで検索実行 / Enter key support: execute search with @keyup.enter
            - カテゴリーフィルタ: レストラン種別で絞り込み / Category filter: filter by restaurant type
            - 検索半径: 1-100kmの範囲でスライダー調整 / Search radius: adjust with slider from 1-100km
          -->
          <div class="card shadow-sm mb-3">
            <div class="card-body">
              <h5 class="card-title mb-3"><i class="fas fa-search me-2"></i>Search Restaurants</h5>
              <!-- 住所検索入力フィールド / Address search input field -->
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
                カテゴリーフィルター - レストランタイプで絞り込み
                Category Filter - Filter by restaurant type
                TODO: Firestoreクエリと連動させる機能を追加
                TODO: Add functionality to sync with Firestore query
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
                検索半径スライダー - 距離範囲を動的に調整
                Search Radius Slider - Dynamically adjust distance range
                範囲: 1-100km / Range: 1-100km
                デフォルト: 5km / Default: 5km
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
            レストランリストカード - 検索結果を距離順で表示
            Restaurant List Card - Display search results sorted by distance

            表示状態 / Display States:
            1. ローディング中: スピナー表示 / Loading: Show spinner
            2. 結果0件: 空状態メッセージ / No results: Empty state message
            3. 結果あり: レストランリスト表示 / Results found: Show restaurant list

            各レストラン項目に表示される情報 / Information shown for each restaurant:
            - 名前 / Name
            - 住所 / Address
            - 距離 (km) - Haversine公式で計算 / Distance (km) - calculated using Haversine formula
            - 評価 (星) / Rating (stars)
            - ルート案内ボタン / Get Directions button
          -->
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-3">
                <i class="fas fa-utensils me-2"></i>
                Nearby Restaurants
                <!-- 結果件数バッジ / Result count badge -->
                <span v-if="restaurants.length > 0" class="badge bg-primary ms-2">
                  {{ restaurants.length }}
                </span>
              </h5>

              <!-- ローディング状態 - データ取得中 / Loading state - fetching data -->
              <div v-if="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- 空状態 - 検索結果なし / Empty state - no search results -->
              <div v-else-if="restaurants.length === 0" class="text-center py-4 text-muted">
                <i class="fas fa-info-circle fa-2x mb-2"></i>
                <p class="mb-0">No restaurants found. Try searching a location.</p>
              </div>

              <!-- レストラン一覧 - クリックで地図上の位置にフライ / Restaurant list - click to fly to location on map -->
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
                      <h6 class="mb-1">
                        <i class="fas fa-store me-1 text-primary"></i>
                        {{ restaurant.name }}
                      </h6>
                      <p class="small text-muted mb-1">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        {{ restaurant.address }}
                      </p>
                      <div class="d-flex align-items-center">
                        <!-- 距離バッジ / Distance badge -->
                        <span class="badge bg-light text-dark me-2">
                          <i class="fas fa-walking me-1"></i>
                          {{ restaurant.distance }} km
                        </span>
                        <!-- 評価バッジ (評価がある場合のみ表示) / Rating badge (only shown if rating exists) -->
                        <span v-if="restaurant.rating" class="badge bg-warning text-dark">
                          <i class="fas fa-star me-1"></i>
                          {{ restaurant.rating }}
                        </span>
                      </div>
                    </div>
                    <!--
                      ルート案内ボタン - Mapbox Directions APIを使用
                      Get Directions button - Uses Mapbox Directions API
                      @click.stopで親要素のクリックイベントを防止
                      @click.stop prevents parent element's click event
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

        <!--
          右カラム: Mapbox地図表示とルート情報
          Right Column: Mapbox map display and route information
        -->
        <div class="col-lg-7">
          <div class="card shadow-sm">
            <div class="card-body p-0">
              <!--
                Mapboxマップコンテナ
                Mapbox map container

                地図の初期化: onMounted()で実行 / Map initialization: executed in onMounted()
                中心座標: メルボルン (37.8136°S, 144.9631°E) / Center: Melbourne (37.8136°S, 144.9631°E)
                ズームレベル: 12 / Zoom level: 12
                スタイル: mapbox://styles/mapbox/streets-v11 (標準道路地図) / Style: streets-v11 (standard street map)
              -->
              <div id="map" class="map-container"></div>

              <!--
                ルート情報パネル - ルート検索後に表示
                Route Information Panel - Displayed after route search

                表示内容 / Display content:
                - 所要時間: Mapbox Directions APIから取得 / Duration: from Mapbox Directions API
                - 距離: Mapbox Directions APIから取得 / Distance: from Mapbox Directions API
                - クリアボタン: ルート表示を削除 / Clear button: remove route display
              -->
              <div v-if="routeInfo" class="p-3 border-top">
                <h6 class="mb-2">
                  <i class="fas fa-route me-2 text-primary"></i>
                  Route Information
                </h6>
                <div class="row g-2">
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-clock text-muted me-2"></i>
                      <div>
                        <small class="text-muted d-block">Duration</small>
                        <strong>{{ routeInfo.duration }}</strong>
                      </div>
                    </div>
                  </div>
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
/**
 * GeoLocation.vue - レストラン検索スクリプト
 * GeoLocation.vue - Restaurant Search Script
 *
 * このファイルは地図ベースのレストラン検索機能を提供します
 * This file provides map-based restaurant search functionality
 *
 * API使用 / API Usage:
 * - Geolocation API: ユーザーの現在地取得 / Get user's current location
 * - Mapbox Geocoding API: 住所→座標変換 / Address to coordinates conversion
 * - Mapbox Directions API: ルート検索 / Route search
 * - Firebase Firestore: レストランデータ管理 / Restaurant data management
 */

// Vue Composition API
import { ref, computed, onMounted } from 'vue'
import axios from 'axios' // HTTP クライアント / HTTP client
import mapboxgl from 'mapbox-gl' // Mapbox地図ライブラリ / Mapbox map library
import 'mapbox-gl/dist/mapbox-gl.css'

// Firebase Firestore インポート / Firebase Firestore imports
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/init'

/**
 * BR (E.2): Mapbox APIキー
 * BR (E.2): Mapbox API Key
 *
 * 本番環境では環境変数に移行すること
 * Should be moved to environment variables in production
 */
const MAPBOX_TOKEN =
  'pk.eyJ1IjoidGltMDcxMXZyYyIsImEiOiJjbWd3eGp2b28wY29pMm5weGVpNncxM25zIn0.Xk0HpuaBU_k04XucsuSK7Q'
mapboxgl.accessToken = MAPBOX_TOKEN

/**
 * リアクティブステート / Reactive State
 */

// ユーザーの現在地 { latitude, longitude } / User's current location
const userLocation = ref(null)

// 検索クエリ (住所または地名) / Search query (address or place name)
const searchQuery = ref('')

// 選択されたレストランカテゴリ / Selected restaurant category
const selectedCategory = ref('restaurant')

// 検索半径 (km) - デフォルト5km / Search radius (km) - default 5km
const searchRadius = ref(5)

// 検索結果のレストラン配列 / Array of search result restaurants
const restaurants = ref([])

// 現在選択されているレストラン / Currently selected restaurant
const selectedRestaurant = ref(null)

// ルート情報 { duration, distance } / Route information
const routeInfo = ref(null)

// ローディング状態フラグ / Loading state flag
const isLoading = ref(false)

// 表示メッセージ / Display message
const message = ref('')

// メッセージタイプ ('success' | 'error') / Message type
const messageType = ref('success')

/**
 * Mapインスタンスとマーカー / Map instance and markers
 */

// Mapboxマップインスタンス (リアクティブにする必要なし) / Mapbox map instance (no need to be reactive)
let map = null

// ユーザー位置マーカー / User location marker
let userMarker = null

// レストランマーカー配列 / Restaurant markers array
const restaurantMarkers = ref([])

/**
 * 算出プロパティ / Computed Properties
 */

// メッセージのBootstrapクラスを返す / Return Bootstrap class for message
const messageClass = computed(() => {
  return messageType.value === 'error' ? 'alert-danger' : 'alert-success'
})

// メッセージアイコンのクラスを返す / Return icon class for message
const messageIcon = computed(() => {
  return messageType.value === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'
})

/**
 * ヘルパー関数: メッセージを表示 (5秒後に自動消去)
 * Helper function: Show message (auto-clear after 5 seconds)
 *
 * @param {string} msg - 表示メッセージ / Message to display
 * @param {string} type - メッセージタイプ ('success' | 'error') / Message type
 */
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

/**
 * BR (E.2) Feature 1: 現在地取得と地図表示
 * Get Current Location and Display on Map
 *
 * navigator.geolocation APIを使用してユーザーの現在地を取得
 * Uses the navigator.geolocation API to get the user's current location
 */
const getCurrentLocation = async () => {
  isLoading.value = true

  try {
    // BR (E.2): navigator.geolocation APIを使用した現在地取得
    // Use browser's geolocation API (same pattern as Week 10 Studio)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          userLocation.value = {
            latitude,
            longitude,
          }

          // マップに現在地を表示 / Display current location on map
          if (map) {
            // 現在地にマップを移動 / Move map to current location
            map.flyTo({
              center: [longitude, latitude],
              zoom: 14,
            })

            // 現在地マーカーを追加または更新 / Add or update user location marker
            if (userMarker) {
              userMarker.remove()
            }

            // Create custom marker element for user location
            const el = document.createElement('div')
            el.className = 'user-location-marker'
            el.innerHTML = '<i class="fas fa-circle text-primary"></i>'

            userMarker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map)
          }

          showMessage('Current location obtained successfully!', 'success')

          // 自動的に近くのレストランを検索 / Automatically search nearby restaurants
          await searchNearbyRestaurants(latitude, longitude)
        },
        (error) => {
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

/**
 * BR (E.2) Feature 2: レストラン検索機能
 * Restaurant Search Feature
 *
 * MapBox Geocoding APIを使用して住所から座標を取得し、
 * 周辺のレストランを検索
 */
const searchRestaurants = async () => {
  if (!searchQuery.value.trim()) {
    showMessage('Please enter a location to search.', 'error')
    return
  }

  isLoading.value = true

  try {
    // MapBox Geocoding API で住所を座標に変換
    // Convert address to coordinates using MapBox Geocoding API
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?access_token=${MAPBOX_TOKEN}`
    const geocodeResponse = await axios.get(geocodeUrl)

    if (geocodeResponse.data.features.length === 0) {
      showMessage('Location not found. Please try another search term.', 'error')
      isLoading.value = false
      return
    }

    const [longitude, latitude] = geocodeResponse.data.features[0].center

    // マップを検索した場所に移動 / Move map to searched location
    if (map) {
      map.flyTo({
        center: [longitude, latitude],
        zoom: 14,
      })
    }

    // 検索した場所の周辺レストランを検索 / Search restaurants near the location
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
 * 近くのレストランを検索する関数
 * Function to search for nearby restaurants
 *
 * MapBox Places APIを使用してレストランを検索
 * Uses MapBox Places API to search for restaurants
 */
const searchNearbyRestaurants = async (latitude, longitude) => {
  try {
    console.log('Searching restaurants from Firestore...')

    // Firestoreからすべてのレストラン/ストアを取得
    const restaurantsCollection = collection(db, 'restaurants')
    const snapshot = await getDocs(restaurantsCollection)

    if (snapshot.empty) {
      console.log('No restaurants found in Firestore')
      restaurants.value = []
      return
    }

    // レストランデータを処理し、距離を計算
    const allRestaurants = snapshot.docs.map((doc) => {
      const data = doc.data()
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
        distance: distance.toFixed(2),
        rating: data.averageRating || 'N/A',
        priceRange: data.priceRange || '$$',
        phone: data.phone,
        website: data.website,
        imageUrl: data.imageUrl,
        features: data.features || [],
        openingHours: data.openingHours || {},
      }
    })

    // 検索半径内のレストランのみフィルタリングし、距離でソート
    restaurants.value = allRestaurants
      .filter((restaurant) => parseFloat(restaurant.distance) <= searchRadius.value)
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

    console.log(`Found ${restaurants.value.length} restaurants within ${searchRadius.value}km`)

    // マップにレストランマーカーを表示
    displayRestaurantMarkers()

    isLoading.value = false
  } catch (error) {
    console.error('Error searching nearby restaurants from Firestore:', error)
    restaurants.value = []
    isLoading.value = false
  }
}

/**
 * 2地点間の距離を計算 - Haversine公式
 * Calculate distance between two points - Haversine formula
 *
 * @param {number} lat1 - 地点1の緯度 (度) / Latitude of point 1 (degrees)
 * @param {number} lon1 - 地点1の経度 (度) / Longitude of point 1 (degrees)
 * @param {number} lat2 - 地点2の緯度 (度) / Latitude of point 2 (degrees)
 * @param {number} lon2 - 地点2の経度 (度) / Longitude of point 2 (degrees)
 * @returns {number} 距離 (km) / Distance in kilometers
 *
 * Haversine公式の説明 / Haversine formula explanation:
 * 球面上の2点間の大円距離を計算する公式
 * Formula to calculate great-circle distance between two points on a sphere
 *
 * 計算手順 / Calculation steps:
 * 1. 緯度・経度の差をラジアンに変換 / Convert lat/lon differences to radians
 * 2. Haversine関数を適用 / Apply Haversine function
 * 3. 地球の半径を掛けて距離を算出 / Multiply by Earth's radius to get distance
 *
 * 精度 / Accuracy:
 * - 地球を完全な球体と仮定 (実際は楕円体) / Assumes Earth is a perfect sphere (actually an ellipsoid)
 * - 短距離 (< 1000km) では高精度 / High accuracy for short distances (< 1000km)
 * - 誤差: 約0.5% / Error: approximately 0.5%
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // 地球の半径 (km) / Earth's radius in km

  // 緯度・経度の差をラジアンに変換 / Convert lat/lon differences to radians
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  // Haversine公式のメイン計算 / Main Haversine formula calculation
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  // 中心角の計算 / Calculate central angle
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  // 距離 = 半径 × 中心角 / Distance = radius × central angle
  return R * c
}

/**
 * レストランマーカーをマップに表示
 * Display restaurant markers on the map
 */
const displayRestaurantMarkers = () => {
  // 既存のマーカーを削除 / Remove existing markers
  restaurantMarkers.value.forEach((marker) => marker.remove())
  restaurantMarkers.value = []

  if (!map) return

  // 新しいマーカーを追加 / Add new markers
  restaurants.value.forEach((restaurant) => {
    // index を削除
    const el = document.createElement('div')
    el.className = 'restaurant-marker'
    el.innerHTML = '<i class="fas fa-utensils text-danger"></i>'

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
 * レストランを選択
 * Select a restaurant
 */
const selectRestaurant = (restaurant) => {
  selectedRestaurant.value = restaurant

  if (map) {
    // 選択したレストランにマップを移動 / Move map to selected restaurant
    map.flyTo({
      center: [restaurant.longitude, restaurant.latitude],
      zoom: 15,
    })
  }
}

/**
 * BR (E.2) Feature 3: ルート検索とナビゲーション
 * Route Search and Navigation Feature
 *
 * MapBox Directions APIを使用してルートを取得し表示
 * Uses MapBox Directions API to get and display route
 */
const getDirections = async (restaurant) => {
  if (!userLocation.value) {
    showMessage('Please get your current location first.', 'error')
    return
  }

  isLoading.value = true
  selectedRestaurant.value = restaurant

  try {
    // MapBox Directions API でルートを取得
    // Get route using MapBox Directions API
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.value.longitude},${userLocation.value.latitude};${restaurant.longitude},${restaurant.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    const directionsResponse = await axios.get(directionsUrl)

    if (directionsResponse.data.routes.length === 0) {
      showMessage('Route not found.', 'error')
      isLoading.value = false
      return
    }

    const route = directionsResponse.data.routes[0]

    // ルート情報を保存 / Save route information
    routeInfo.value = {
      duration: formatDuration(route.duration),
      distance: formatDistance(route.distance),
    }

    // マップにルートを表示 / Display route on map
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
 * マップにルートを表示
 * Display route on the map
 */
const displayRoute = (geometry) => {
  if (!map) return

  // 既存のルートレイヤーを削除 / Remove existing route layer
  if (map.getLayer('route')) {
    map.removeLayer('route')
    map.removeSource('route')
  }

  // 新しいルートを追加 / Add new route
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: geometry,
    },
  })

  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#007bff',
      'line-width': 4,
      'line-opacity': 0.75,
    },
  })

  // ルート全体が見えるようにマップをフィット / Fit map to show entire route
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
 * ルートをクリア
 * Clear route
 */
const clearRoute = () => {
  routeInfo.value = null

  if (map && map.getLayer('route')) {
    map.removeLayer('route')
    map.removeSource('route')
  }
}

/**
 * 時間をフォーマット (秒 -> 分/時間)
 * Format duration (seconds to minutes/hours)
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
 * 距離をフォーマット (メートル -> km)
 * Format distance (meters to km)
 */
const formatDistance = (meters) => {
  const km = meters / 1000
  return `${km.toFixed(2)} km`
}

/**
 * マップを初期化
 * Initialize map
 */
const initializeMap = () => {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [144.9631, -37.8136],
    zoom: 12,
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    }),
    'top-right',
  )
}

// Lifecycle
onMounted(() => {
  initializeMap()
})
</script>

<style scoped>
.geolocation-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.map-container {
  width: 100%;
  height: 500px;
  border-radius: 10px 10px 0 0;
}

.restaurant-item {
  border: 1px solid #dee2e6;
  background: #fff;
  transition: all 0.3s ease;
}

.restaurant-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
  transform: translateX(5px);
}

.restaurant-item.selected {
  border-color: #007bff;
  background: #e7f3ff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.restaurant-list {
  max-height: 400px;
  overflow-y: auto;
}

.cursor-pointer {
  cursor: pointer;
}

/* Custom marker styles */
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

:deep(.restaurant-marker:hover) {
  transform: scale(1.2);
}

:deep(.restaurant-marker i) {
  font-size: 14px;
}

/* MapBox popup custom styles */
:deep(.mapboxgl-popup-content) {
  padding: 0;
  border-radius: 8px;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .map-container {
    height: 400px;
  }

  .restaurant-list {
    max-height: 300px;
  }
}

@media (max-width: 575.98px) {
  .map-container {
    height: 300px;
  }
}
</style>
