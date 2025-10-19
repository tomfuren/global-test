<template>
  <div class="rating-section mt-4">
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0"><i class="fas fa-star me-2"></i>Ratings & Reviews</h5>
      </div>
      <div class="card-body">
        <!-- 評価統計 -->
        <div v-if="ratings.length > 0" class="mb-4">
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
          <p class="rating-text mb-0">
            Based on {{ ratings.length }} review{{ ratings.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <div v-else class="mb-4">
          <p class="text-muted">No ratings yet. Be the first to rate!</p>
        </div>

        <!-- 認証済みユーザーの評価フォーム -->
        <div v-if="isAuthenticated">
          <!-- 既存評価の表示 -->
          <div v-if="userRating && !showRatingForm" class="mb-3">
            <div class="alert alert-info">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <strong>Your Rating</strong>
                  <div class="stars mt-1">
                    <i
                      v-for="star in 5"
                      :key="star"
                      :class="star <= userRating.rating ? 'text-warning' : 'text-muted'"
                      class="fas fa-star"
                    ></i>
                  </div>
                  <p class="card-text mt-2" v-if="userRating.comment">{{ userRating.comment }}</p>
                  <small class="text-muted">{{ formatDate(userRating.createdAt) }}</small>
                </div>
                <button class="btn btn-outline-secondary btn-sm" @click="editRating">Edit</button>
              </div>
            </div>
          </div>

          <!-- 評価フォーム -->
          <div v-else class="mb-3">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">
                  {{ userRating ? 'Edit Your Rating' : 'Rate This Recipe' }}
                </h6>

                <!-- スターレーティング入力 -->
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

                <!-- コメント入力 -->
                <div class="mb-3">
                  <textarea
                    v-model="newComment"
                    class="form-control"
                    rows="3"
                    placeholder="Share your thoughts about this recipe (optional)"
                    maxlength="500"
                  ></textarea>
                  <small class="text-muted">{{ newComment.length }}/500 characters</small>
                  <div v-if="!isValidComment" class="text-danger small mt-1">
                    Please avoid using special characters or HTML tags
                  </div>
                </div>

                <!-- ボタン -->
                <div class="d-flex gap-2">
                  <button
                    class="btn btn-primary"
                    @click="submitRating"
                    :disabled="newRating === 0 || isSubmitting || !isValidComment"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ userRating ? 'Update' : 'Submit' }}
                  </button>
                  <button class="btn btn-secondary" @click="cancelRating" :disabled="isSubmitting">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 未認証ユーザー -->
        <div v-else class="mb-3">
          <p class="text-muted small">
            <router-link to="/login" class="text-decoration-none">Sign in</router-link>
            to rate this recipe
          </p>
        </div>

        <!-- レビュー一覧 -->
        <div v-if="reviews.length > 0" class="reviews-list">
          <h6 class="mb-3">Recent Reviews</h6>
          <div v-for="review in displayedReviews" :key="review.id" class="review-item mb-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-start">
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
                        <h6 class="mb-1">{{ review.user.name }}</h6>
                        <div class="stars mb-2">
                          <i
                            v-for="star in 5"
                            :key="star"
                            :class="star <= review.rating ? 'text-warning' : 'text-muted'"
                            class="fas fa-star"
                          ></i>
                        </div>
                        <p class="card-text" v-if="review.comment">{{ review.comment }}</p>
                        <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMoreReviews" class="text-center mt-3">
            <button class="btn btn-outline-primary" @click="loadMoreReviews">
              <i class="fas fa-chevron-down me-2"></i>
              Load More Reviews
            </button>
          </div>
        </div>

        <!-- ローディング表示 -->
        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- エラー表示 -->
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

const currentUser = ref(null)
const isAuthenticated = computed(() => !!currentUser.value)
const ratings = ref([])
const userRating = ref(null)
const showRatingForm = ref(false)
const newRating = ref(0)
const newComment = ref('')
const hoverRating = ref(0)
const isSubmitting = ref(false)
const loading = ref(true)
const error = ref(null)
const displayLimit = ref(5)

const reviews = computed(() => {
  return ratings.value.filter((r) => r.comment && r.comment.trim())
})

const displayedReviews = computed(() => {
  return reviews.value.slice(0, displayLimit.value)
})

const hasMoreReviews = computed(() => {
  return reviews.value.length > displayLimit.value
})

const loadMoreReviews = () => {
  displayLimit.value += 5
}

const averageRating = computed(() => {
  if (ratings.value.length === 0) return 0
  const sum = ratings.value.reduce((acc, rating) => acc + rating.rating, 0)
  return sum / ratings.value.length
})

const getStarClass = (star, rating) => {
  return star <= rating ? 'text-warning' : 'text-muted'
}

const getInputStarClass = (star) => {
  const rating = hoverRating.value || newRating.value
  return star <= rating ? 'text-warning' : 'text-muted'
}

const setRating = (star) => {
  newRating.value = star
}

const getUserAvatar = (user) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=32&background=007bff&color=ffffff`
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const isValidComment = computed(() => {
  const comment = newComment.value.trim()
  if (comment.length > 500) return false

  const dangerousPatterns = [/<script/i, /javascript:/i, /<iframe/i, /on\w+=/i]

  return !dangerousPatterns.some((pattern) => pattern.test(comment))
})

const submitRating = async () => {
  if (!currentUser.value || newRating.value === 0) return

  isSubmitting.value = true
  error.value = null

  try {
    const sanitizedComment = newComment.value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()

    const ratingData = {
      targetType: props.targetType,
      targetId: props.targetId,
      userId: currentUser.value.uid,
      user: {
        name: currentUser.value.displayName || currentUser.value.email,
        email: currentUser.value.email,
      },
      rating: Math.max(1, Math.min(5, parseInt(newRating.value))),
      comment: sanitizedComment,
      createdAt: serverTimestamp(),
    }

    if (userRating.value) {
      await updateDoc(doc(db, 'ratings', userRating.value.id), ratingData)
    } else {
      await addDoc(collection(db, 'ratings'), ratingData)
    }

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

const cancelRating = () => {
  showRatingForm.value = false
  newRating.value = userRating.value?.rating || 0
  newComment.value = userRating.value?.comment || ''
  hoverRating.value = 0
}

const editRating = () => {
  newRating.value = userRating.value.rating
  newComment.value = userRating.value.comment || ''
  showRatingForm.value = true
}

// Firestoreから評価を読み込む（orderByなしバージョン）
const loadRatings = async () => {
  loading.value = true
  error.value = null

  try {
    // まずorderByなしでクエリを試行
    const q = query(
      collection(db, 'ratings'),
      where('targetType', '==', props.targetType),
      where('targetId', '==', props.targetId),
    )

    // リアルタイムリスナーを設定
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ratingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // クライアント側でcreatedAtでソート
        ratings.value = ratingsData.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0)
          const bTime = b.createdAt?.toDate?.() || new Date(0)
          return bTime - aTime
        })

        // ユーザーの既存評価を検索
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

// 初期化処理
onMounted(() => {
  let ratingsUnsubscribe = null

  // 認証状態監視
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user

    // 既存のリスナーをクリーンアップ
    if (ratingsUnsubscribe) {
      ratingsUnsubscribe()
    }

    // 評価を読み込み
    ratingsUnsubscribe = await loadRatings()
  })

  // コンポーネントがアンマウントされるときにリスナーをクリーンアップ
  return () => {
    if (ratingsUnsubscribe) {
      ratingsUnsubscribe()
    }
  }
})
</script>

<style scoped>
.stars .fa-star {
  font-size: 1rem;
  margin-right: 0.1rem;
}

.star-clickable {
  cursor: pointer;
  font-size: 1.2rem;
  margin-right: 0.2rem;
  transition: all 0.2s ease;
}

.star-clickable:hover {
  transform: scale(1.1);
}

.star-input {
  margin: 0.5rem 0;
}

.review-item .stars .fa-star {
  font-size: 0.8rem;
}

.rating-text {
  font-size: 0.9rem;
  color: #6c757d;
}

.d-flex.gap-2 {
  gap: 0.5rem;
}
</style>
