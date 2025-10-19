<template>
  <div class="geolocation-page min-vh-100 py-5">
    <div class="container-fluid px-3 px-md-4">
      <!-- ヘッダー / Header -->
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

      <!-- アラート表示 / Alert Messages -->
      <div v-if="message" class="row mb-4">
        <div class="col-12">
          <div :class="['alert', messageClass, 'd-flex', 'align-items-center']" role="alert">
            <i :class="[messageIcon, 'me-2']"></i>
            {{ message }}
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- 左側: 検索とリスト / Left: Search and List -->
        <div class="col-lg-5">
          <!-- 現在地取得 / Get Current Location -->
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
              <div v-if="userLocation" class="mt-3 p-3 bg-light rounded">
                <small class="text-muted d-block">
                  <i class="fas fa-map-pin me-1"></i>
                  Lat: {{ userLocation.latitude.toFixed(4) }}, Lng:
                  {{ userLocation.longitude.toFixed(4) }}
                </small>
              </div>
            </div>
          </div>

          <!-- レストラン検索 / Restaurant Search -->
          <div class="card shadow-sm mb-3">
            <div class="card-body">
              <h5 class="card-title mb-3"><i class="fas fa-search me-2"></i>Search Restaurants</h5>
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

              <!-- カテゴリーフィルター / Category Filter -->
              <div class="mb-3">
                <label class="form-label small text-muted">Restaurant Type:</label>
                <select v-model="selectedCategory" class="form-select form-select-sm">
                  <option value="restaurant">All Restaurants</option>
                  <option value="cafe">Cafes</option>
                  <option value="fast_food">Fast Food</option>
                  <option value="bar">Bars</option>
                </select>
              </div>

              <!-- 距離範囲 / Distance Range -->
              <div>
                <label class="form-label small text-muted">
                  Search Radius: {{ searchRadius }}km
                </label>
                <input
                  v-model.number="searchRadius"
                  type="range"
                  class="form-range"
                  min="1"
                  max="10"
                  step="1"
                />
              </div>
            </div>
          </div>

          <!-- レストランリスト / Restaurant List -->
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-3">
                <i class="fas fa-utensils me-2"></i>
                Nearby Restaurants
                <span v-if="restaurants.length > 0" class="badge bg-primary ms-2">
                  {{ restaurants.length }}
                </span>
              </h5>

              <div v-if="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div v-else-if="restaurants.length === 0" class="text-center py-4 text-muted">
                <i class="fas fa-info-circle fa-2x mb-2"></i>
                <p class="mb-0">No restaurants found. Try searching a location.</p>
              </div>

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
                        <span class="badge bg-light text-dark me-2">
                          <i class="fas fa-walking me-1"></i>
                          {{ restaurant.distance }} km
                        </span>
                        <span v-if="restaurant.rating" class="badge bg-warning text-dark">
                          <i class="fas fa-star me-1"></i>
                          {{ restaurant.rating }}
                        </span>
                      </div>
                    </div>
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

        <!-- 右側: マップ表示 / Right: Map Display -->
        <div class="col-lg-7">
          <div class="card shadow-sm">
            <div class="card-body p-0">
              <!-- マップコンテナ / Map Container -->
              <div id="map" class="map-container"></div>

              <!-- ルート情報 / Route Information -->
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// BR (E.2): MapBox API キー
// MapBox API Key - Replace with your actual API key
const MAPBOX_TOKEN =
  'pk.eyJ1IjoidGltMDcxMXZyYyIsImEiOiJjbWd3eGp2b28wY29pMm5weGVpNncxM25zIn0.Xk0HpuaBU_k04XucsuSK7Q'
mapboxgl.accessToken = MAPBOX_TOKEN

// State
const userLocation = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('restaurant')
const searchRadius = ref(5)
const restaurants = ref([])
const selectedRestaurant = ref(null)
const routeInfo = ref(null)
const isLoading = ref(false)
const message = ref('')
const messageType = ref('success')

// Map instance
let map = null
let userMarker = null
const restaurantMarkers = ref([])

// Computed
const messageClass = computed(() => {
  return messageType.value === 'error' ? 'alert-danger' : 'alert-success'
})

const messageIcon = computed(() => {
  return messageType.value === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'
})

// Helper functions
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
    // MapBox Places API でレストランを検索
    // Search for restaurants using MapBox Places API
    const placesUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedCategory.value}.json?proximity=${longitude},${latitude}&limit=10&access_token=${MAPBOX_TOKEN}`
    const placesResponse = await axios.get(placesUrl)

    // レストランデータを処理 / Process restaurant data
    restaurants.value = placesResponse.data.features
      .map((feature) => {
        const [lng, lat] = feature.center
        const distance = calculateDistance(latitude, longitude, lat, lng)

        return {
          name: feature.text,
          address: feature.place_name,
          latitude: lat,
          longitude: lng,
          distance: distance.toFixed(2),
          rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating for demo
        }
      })
      .filter((restaurant) => restaurant.distance <= searchRadius.value)
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

    // マップにレストランマーカーを表示 / Display restaurant markers on map
    displayRestaurantMarkers()
  } catch (error) {
    console.error('Error searching nearby restaurants:', error)
    restaurants.value = []
  }
}

/**
 * 2地点間の距離を計算（Haversine formula）
 * Calculate distance between two points using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // 地球の半径 (km) / Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
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
