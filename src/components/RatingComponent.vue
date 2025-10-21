<!--
  Rating Component - Star rating and review system for recipes and events
  評価コンポーネント - レシピとイベント用のスター評価とレビューシステム

  Features / 機能:
  - 5-star rating system with visual feedback / 視覚的フィードバック付き5段階評価システム
  - User review submission with comments / コメント付きユーザーレビュー送信
  - Real-time rating updates via Firestore / Firestore経由のリアルタイム評価更新
  - Average rating calculation and display / 平均評価の計算と表示
  - Edit and update existing ratings / 既存評価の編集と更新
  - Review pagination (load more) / レビューのページネーション（もっと読み込む）
  - Input validation and sanitization / 入力検証とサニタイゼーション
  - Responsive design for mobile and desktop / モバイルとデスクトップ対応のレスポンシブデザイン

  Security Features / セキュリティ機能:
  - XSS prevention through comment sanitization / コメントサニタイゼーションによるXSS防止
  - Rating value validation (1-5 range) / 評価値の検証（1-5の範囲）
  - Character limit enforcement (500 chars) / 文字数制限の適用（500文字）
  - Dangerous pattern detection / 危険なパターンの検出

  Usage / 使用方法:
  <RatingComponent targetType="recipe" targetId="recipeId123" />
  <RatingComponent targetType="event" targetId="eventId456" />

  Props / プロパティ:
  - targetType: Type of content being rated (recipe/event) / 評価対象のコンテンツタイプ
  - targetId: Unique identifier of the target / 対象の一意識別子

  BR Reference / BR参照:
  - Part of user engagement and content quality features / ユーザーエンゲージメントとコンテンツ品質機能の一部
-->

<template>
  <div class="rating-section mt-4">
    <div class="card">
      <!-- Card Header / カードヘッダー -->
      <div class="card-header">
        <h5 class="card-title mb-0"><i class="fas fa-star me-2"></i>Ratings & Reviews</h5>
      </div>

      <div class="card-body">
        <!-- Rating Statistics Section / 評価統計セクション -->
        <!-- Displays average rating and total number of reviews / 平均評価とレビュー総数を表示 -->
        <div v-if="ratings.length > 0" class="mb-4">
          <!-- Average rating display / 平均評価表示 -->
          <div class="d-flex align-items-center mb-2">
            <h3 class="mb-0 me-2">{{ averageRating.toFixed(1) }}</h3>
            <div class="stars">
              <i
                v-for="star in 5"
                :key="star"
                :class="getStarClass(star, averageRating)"
                class="fas fa-star"
              ></i>
            </div>
          </div>
          <!-- Review count / レビュー数 -->
          <p class="rating-text mb-0">
            Based on {{ ratings.length }} review{{ ratings.length !== 1 ? 's' : '' }}
          </p>
        </div>

        <!-- No ratings placeholder / 評価なしのプレースホルダー -->
        <div v-else class="mb-4">
          <p class="text-muted">No ratings yet. Be the first to rate!</p>
        </div>

        <!-- Authenticated User Rating Form Section / 認証済みユーザー評価フォームセクション -->
        <div v-if="isAuthenticated">
          <!-- Existing Rating Display / 既存評価の表示 -->
          <!-- Shows user's current rating if exists and form is not open / フォームが開いていない場合、ユーザーの現在の評価を表示 -->
          <div v-if="userRating && !showRatingForm" class="mb-3">
            <div class="alert alert-info">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <strong>Your Rating</strong>
                  <!-- User's star rating / ユーザーのスター評価 -->
                  <div class="stars mt-1">
                    <i
                      v-for="star in 5"
                      :key="star"
                      :class="star <= userRating.rating ? 'text-warning' : 'text-muted'"
                      class="fas fa-star"
                    ></i>
                  </div>
                  <!-- User's comment / ユーザーのコメント -->
                  <p class="card-text mt-2" v-if="userRating.comment">{{ userRating.comment }}</p>
                  <!-- Rating timestamp / 評価タイムスタンプ -->
                  <small class="text-muted">{{ formatDate(userRating.createdAt) }}</small>
                </div>
                <!-- Edit button / 編集ボタン -->
                <button class="btn btn-outline-secondary btn-sm" @click="editRating">Edit</button>
              </div>
            </div>
          </div>

          <!-- Rating Input Form / 評価入力フォーム -->
          <!-- Form for new ratings or editing existing ratings / 新規評価または既存評価の編集用フォーム -->
          <div v-else class="mb-3">
            <div class="card">
              <div class="card-body">
                <!-- Form title / フォームタイトル -->
                <h6 class="card-title">
                  {{ userRating ? 'Edit Your Rating' : 'Rate This Recipe' }}
                </h6>

                <!-- Star Rating Input with hover effect / ホバーエフェクト付きスター評価入力 -->
                <div class="star-input mb-3">
                  <i
                    v-for="star in 5"
                    :key="star"
                    :class="getInputStarClass(star)"
                    class="star-clickable fas fa-star"
                    @click="setRating(star)"
                    @mouseenter="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                  ></i>
                </div>

                <!-- Comment Input Field / コメント入力フィールド -->
                <div class="mb-3">
                  <textarea
                    v-model="newComment"
                    class="form-control"
                    rows="3"
                    placeholder="Share your thoughts about this recipe (optional)"
                    maxlength="500"
                  ></textarea>
                  <!-- Character counter / 文字カウンター -->
                  <small class="text-muted">{{ newComment.length }}/500 characters</small>
                  <!-- Validation error message / 検証エラーメッセージ -->
                  <div v-if="!isValidComment" class="text-danger small mt-1">
                    Please avoid using special characters or HTML tags
                  </div>
                </div>

                <!-- Form Action Buttons / フォームアクションボタン -->
                <div class="d-flex gap-2">
                  <!-- Submit button / 送信ボタン -->
                  <button
                    class="btn btn-primary"
                    @click="submitRating"
                    :disabled="newRating === 0 || isSubmitting || !isValidComment"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ userRating ? 'Update' : 'Submit' }}
                  </button>
                  <!-- Cancel button / キャンセルボタン -->
                  <button class="btn btn-secondary" @click="cancelRating" :disabled="isSubmitting">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Unauthenticated User Prompt / 未認証ユーザープロンプト -->
        <!-- Prompts users to sign in to rate / 評価するためにサインインを促す -->
        <div v-else class="mb-3">
          <p class="text-muted small">
            <router-link to="/login" class="text-decoration-none">Sign in</router-link>
            to rate this recipe
          </p>
        </div>

        <!-- Reviews List Section / レビュー一覧セクション -->
        <!-- Displays all user reviews with comments / コメント付きのすべてのユーザーレビューを表示 -->
        <div v-if="reviews.length > 0" class="reviews-list">
          <h6 class="mb-3">Recent Reviews</h6>

          <!-- Individual Review Items / 個別レビュー項目 -->
          <div v-for="review in displayedReviews" :key="review.id" class="review-item mb-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <!-- User avatar / ユーザーアバター -->
                  <img
                    :src="getUserAvatar(review.user)"
                    class="rounded-circle me-3"
                    width="32"
                    height="32"
                    alt="User avatar"
                  />
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <!-- Reviewer name / レビュアー名 -->
                        <h6 class="mb-1">{{ review.user.name }}</h6>
                        <!-- Review star rating / レビュースター評価 -->
                        <div class="stars mb-2">
                          <i
                            v-for="star in 5"
                            :key="star"
                            :class="star <= review.rating ? 'text-warning' : 'text-muted'"
                            class="fas fa-star"
                          ></i>
                        </div>
                        <!-- Review comment / レビューコメント -->
                        <p class="card-text" v-if="review.comment">{{ review.comment }}</p>
                        <!-- Review timestamp / レビュータイムスタンプ -->
                        <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More Reviews Button / レビューをもっと読み込むボタン -->
          <!-- Pagination control for loading additional reviews / 追加レビューを読み込むためのページネーション制御 -->
          <div v-if="hasMoreReviews" class="text-center mt-3">
            <button class="btn btn-outline-primary" @click="loadMoreReviews">
              <i class="fas fa-chevron-down me-2"></i>
              Load More Reviews
            </button>
          </div>
        </div>

        <!-- Loading Indicator / ローディングインジケーター -->
        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error Message Display / エラーメッセージ表示 -->
        <div v-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '@/firebase/init'

// ============================================================================
// Component Props / コンポーネントプロパティ
// ============================================================================

/**
 * Props definition
 * プロパティ定義
 *
 * targetType: Type of content being rated (recipe/event)
 * targetType: 評価対象のコンテンツタイプ（レシピ/イベント）
 *
 * targetId: Unique identifier of the target content
 * targetId: 対象コンテンツの一意識別子
 */
const props = defineProps({
  targetType: {
    type: String,
    required: true,
  },
  targetId: {
    type: String,
    required: true,
  },
})

// ============================================================================
// Component State / コンポーネント状態
// ============================================================================

// Authentication state / 認証状態
const currentUser = ref(null)
const isAuthenticated = computed(() => !!currentUser.value)

// Ratings data / 評価データ
const ratings = ref([])
const userRating = ref(null)

// Form state / フォーム状態
const showRatingForm = ref(false)
const newRating = ref(0)
const newComment = ref('')
const hoverRating = ref(0)

// UI state / UI状態
const isSubmitting = ref(false)
const loading = ref(true)
const error = ref(null)
const displayLimit = ref(5)

// ============================================================================
// Computed Properties / 算出プロパティ
// ============================================================================

/**
 * Reviews with comments only
 * コメント付きレビューのみ
 *
 * Filters ratings to show only those with comments
 * コメントのある評価のみをフィルタリング
 */
const reviews = computed(() => {
  return ratings.value.filter((r) => r.comment && r.comment.trim())
})

/**
 * Displayed reviews with pagination
 * ページネーション付き表示レビュー
 *
 * Shows reviews up to the current display limit
 * 現在の表示制限までのレビューを表示
 */
const displayedReviews = computed(() => {
  return reviews.value.slice(0, displayLimit.value)
})

/**
 * Check if more reviews are available
 * さらにレビューがあるかチェック
 *
 * Determines if "Load More" button should be shown
 * 「もっと読み込む」ボタンを表示すべきか判断
 */
const hasMoreReviews = computed(() => {
  return reviews.value.length > displayLimit.value
})

/**
 * Load more reviews
 * さらにレビューを読み込む
 *
 * Increases the display limit by 5 reviews
 * 表示制限を5レビュー増やす
 */
const loadMoreReviews = () => {
  displayLimit.value += 5
}

/**
 * Calculate average rating
 * 平均評価を計算
 *
 * Returns the arithmetic mean of all ratings
 * すべての評価の算術平均を返す
 */
const averageRating = computed(() => {
  if (ratings.value.length === 0) return 0
  const sum = ratings.value.reduce((acc, rating) => acc + rating.rating, 0)
  return sum / ratings.value.length
})

/**
 * Comment validation
 * コメント検証
 *
 * Validates comment for length and dangerous patterns
 * コメントの長さと危険なパターンを検証
 *
 * Security: Prevents XSS attacks through input validation
 * セキュリティ: 入力検証によりXSS攻撃を防止
 */
const isValidComment = computed(() => {
  const comment = newComment.value.trim()
  if (comment.length > 500) return false

  // Dangerous pattern detection / 危険なパターンの検出
  const dangerousPatterns = [/<script/i, /javascript:/i, /<iframe/i, /on\w+=/i]

  return !dangerousPatterns.some((pattern) => pattern.test(comment))
})

// ============================================================================
// Helper Methods / ヘルパーメソッド
// ============================================================================

/**
 * Get star CSS class based on rating
 * 評価に基づいてスターCSSクラスを取得
 *
 * Returns appropriate class for filled or empty star
 * 塗りつぶされた星または空の星に適したクラスを返す
 *
 * @param {number} star - Star position (1-5) / スター位置（1-5）
 * @param {number} rating - Current rating value / 現在の評価値
 * @returns {string} CSS class name / CSSクラス名
 */
const getStarClass = (star, rating) => {
  return star <= rating ? 'text-warning' : 'text-muted'
}

/**
 * Get star CSS class for input with hover effect
 * ホバーエフェクト付き入力用スターCSSクラスを取得
 *
 * Shows preview of rating on hover or displays selected rating
 * ホバー時に評価のプレビューを表示するか、選択された評価を表示
 *
 * @param {number} star - Star position (1-5) / スター位置（1-5）
 * @returns {string} CSS class name / CSSクラス名
 */
const getInputStarClass = (star) => {
  const rating = hoverRating.value || newRating.value
  return star <= rating ? 'text-warning' : 'text-muted'
}

/**
 * Set rating value
 * 評価値を設定
 *
 * Called when user clicks on a star
 * ユーザーが星をクリックしたときに呼び出される
 *
 * @param {number} star - Selected star rating (1-5) / 選択されたスター評価（1-5）
 */
const setRating = (star) => {
  newRating.value = star
}

/**
 * Generate user avatar URL
 * ユーザーアバターURLを生成
 *
 * Creates avatar image using UI Avatars service
 * UI Avatarsサービスを使用してアバター画像を作成
 *
 * @param {Object} user - User object with name / 名前を持つユーザーオブジェクト
 * @returns {string} Avatar image URL / アバター画像URL
 */
const getUserAvatar = (user) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=32&background=007bff&color=ffffff`
}

/**
 * Format timestamp to readable date
 * タイムスタンプを読みやすい日付にフォーマット
 *
 * Converts Firestore timestamp to localized date string
 * Firestoreタイムスタンプをローカライズされた日付文字列に変換
 *
 * @param {Object} timestamp - Firestore timestamp / Firestoreタイムスタンプ
 * @returns {string} Formatted date string / フォーマットされた日付文字列
 */
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ============================================================================
// Form Actions / フォームアクション
// ============================================================================

/**
 * Submit or update rating
 * 評価を送信または更新
 *
 * Handles both new rating submission and existing rating updates
 * 新規評価の送信と既存評価の更新の両方を処理
 *
 * Security features / セキュリティ機能:
 * - Comment sanitization to prevent XSS / XSS防止のためのコメントサニタイゼーション
 * - Rating value validation (1-5 range) / 評価値の検証（1-5の範囲）
 * - User authentication check / ユーザー認証チェック
 */
const submitRating = async () => {
  if (!currentUser.value || newRating.value === 0) return

  isSubmitting.value = true
  error.value = null

  try {
    // Sanitize comment to prevent XSS attacks
    // XSS攻撃を防ぐためにコメントをサニタイズ
    const sanitizedComment = newComment.value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()

    // Prepare rating data / 評価データを準備
    const ratingData = {
      targetType: props.targetType,
      targetId: props.targetId,
      userId: currentUser.value.uid,
      user: {
        name: currentUser.value.displayName || currentUser.value.email,
        email: currentUser.value.email,
      },
      // Validate and clamp rating value to 1-5 range
      // 評価値を検証し、1-5の範囲にクランプ
      rating: Math.max(1, Math.min(5, parseInt(newRating.value))),
      comment: sanitizedComment,
      createdAt: serverTimestamp(),
    }

    // Update existing rating or create new one
    // 既存評価を更新または新規作成
    if (userRating.value) {
      await updateDoc(doc(db, 'ratings', userRating.value.id), ratingData)
    } else {
      await addDoc(collection(db, 'ratings'), ratingData)
    }

    // Reset form state / フォーム状態をリセット
    showRatingForm.value = false
    newRating.value = 0
    newComment.value = ''
  } catch (err) {
    console.error('Error submitting rating:', err)
    error.value = 'Failed to submit rating. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Cancel rating form
 * 評価フォームをキャンセル
 *
 * Closes the form and restores original values
 * フォームを閉じて元の値を復元
 */
const cancelRating = () => {
  showRatingForm.value = false
  newRating.value = userRating.value?.rating || 0
  newComment.value = userRating.value?.comment || ''
  hoverRating.value = 0
}

/**
 * Edit existing rating
 * 既存評価を編集
 *
 * Opens the form with current rating values
 * 現在の評価値でフォームを開く
 */
const editRating = () => {
  newRating.value = userRating.value.rating
  newComment.value = userRating.value.comment || ''
  showRatingForm.value = true
}

// ============================================================================
// Data Loading / データ読み込み
// ============================================================================

/**
 * Load ratings from Firestore
 * Firestoreから評価を読み込む
 *
 * Sets up real-time listener for ratings updates
 * 評価更新のリアルタイムリスナーを設定
 *
 * Note: Uses client-side sorting instead of orderBy to avoid index requirement
 * 注: インデックス要件を回避するため、orderByの代わりにクライアント側ソートを使用
 *
 * @returns {Function} Unsubscribe function for cleanup / クリーンアップ用のサブスクライブ解除関数
 */
const loadRatings = async () => {
  loading.value = true
  error.value = null

  try {
    // Query without orderBy to avoid index requirement
    // インデックス要件を回避するためorderByなしでクエリ
    const q = query(
      collection(db, 'ratings'),
      where('targetType', '==', props.targetType),
      where('targetId', '==', props.targetId),
    )

    // Set up real-time listener / リアルタイムリスナーを設定
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Map documents to rating objects / ドキュメントを評価オブジェクトにマップ
        const ratingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Client-side sorting by createdAt / createdAtでクライアント側ソート
        ratings.value = ratingsData.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0)
          const bTime = b.createdAt?.toDate?.() || new Date(0)
          return bTime - aTime
        })

        // Find user's existing rating / ユーザーの既存評価を検索
        if (currentUser.value) {
          userRating.value =
            ratings.value.find((rating) => rating.userId === currentUser.value.uid) || null
        }

        loading.value = false
      },
      (err) => {
        console.error('Error loading ratings:', err)
        error.value = 'Failed to load ratings. Please refresh the page.'
        loading.value = false
      },
    )

    return unsubscribe
  } catch (err) {
    console.error('Error setting up ratings listener:', err)
    error.value = 'Failed to initialize ratings.'
    loading.value = false
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================
/**
 * Component mounted lifecycle hook
 * コンポーネントマウント時のライフサイクルフック
 *
 * Initializes authentication listener and loads ratings
 * 認証リスナーを初期化し、評価を読み込む
 */
onMounted(() => {
  let ratingsUnsubscribe = null

  // Monitor authentication state changes / 認証状態の変更を監視
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user

    // Clean up existing listener / 既存のリスナーをクリーンアップ
    if (ratingsUnsubscribe) {
      ratingsUnsubscribe()
    }

    // Load ratings data / 評価データを読み込み
    ratingsUnsubscribe = await loadRatings()
  })

  // Cleanup function for component unmount / コンポーネントアンマウント時のクリーンアップ関数
  return () => {
    if (ratingsUnsubscribe) {
      ratingsUnsubscribe()
    }
  }
})
</script>

<style scoped>
/* ============================================================================
   Star Rating Styles / スター評価スタイル
   ============================================================================
*/
/* Display stars in rating statistics / 評価統計の星表示 */
.stars .fa-star {
  font-size: 1rem;
  margin-right: 0.1rem;
}

/* Interactive star input styling / インタラクティブスター入力スタイル */
.star-clickable {
  cursor: pointer;
  font-size: 1.2rem;
  margin-right: 0.2rem;
  transition: all 0.2s ease;
}

/* Hover effect for star input / スター入力のホバーエフェクト */
.star-clickable:hover {
  transform: scale(1.1);
}

/* Star input container / スター入力コンテナ */
.star-input {
  margin: 0.5rem 0;
}

/* ============================================================================
   Review Item Styles / レビュー項目スタイル
   ============================================================================
*/
/* Smaller stars for individual reviews / 個別レビュー用の小さい星 */
.review-item .stars .fa-star {
  font-size: 0.8rem;
}

/* Rating text styling / 評価テキストスタイル */
.rating-text {
  font-size: 0.9rem;
  color: #6c757d;
}

/* ============================================================================
   Layout Utilities / レイアウトユーティリティ
   ============================================================================
*/
/* Gap utility for button groups / ボタングループ用のギャップユーティリティ */
.d-flex.gap-2 {
  gap: 0.5rem;
}
</style>
