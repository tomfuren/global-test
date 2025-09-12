<template>
  <div class="rating-component">
    <!-- Rating display only mode -->
    <div v-if="displayOnly" class="rating-display-only">
      <div class="d-flex align-items-center">
        <div class="stars me-2">
          <i 
            v-for="star in 5" 
            :key="star"
            :class="getStarClass(star)"
            class="fas fa-star"
          ></i>
        </div>
        <span class="rating-text">
          {{ averageRating.toFixed(1) }} ({{ totalRatings }})
        </span>
      </div>
    </div>

    <!-- Fully functional mode -->
    <div v-else>
      <!-- Rating display -->
      <div class="rating-display mb-3">
        <div class="d-flex align-items-center">
          <div class="stars me-2">
            <i 
              v-for="star in 5" 
              :key="star"
              :class="getStarClass(star)"
              class="fas fa-star"
            ></i>
          </div>
          <span class="rating-text">
            {{ averageRating.toFixed(1) }} ({{ totalRatings }} reviews)
          </span>
        </div>
      </div>

      <!-- Only authenticated users can rate -->
      <div v-if="isAuthenticated">
        <!-- If the user has not yet rated -->
        <div v-if="!userRating && !showRatingForm" class="mb-3">
          <button class="btn btn-outline-primary btn-sm" @click="showRatingForm = true">
            <i class="fas fa-star me-1"></i>Rate this recipe
          </button>
        </div>

        <!-- Evaluation Form -->
        <div v-if="showRatingForm" class="rating-form mb-3">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title">Rate this recipe</h6>
              
              <!-- Enter star rating -->
              <div class="star-input mb-3">
                <i 
                  v-for="star in 5" 
                  :key="star"
                  :class="getInputStarClass(star)"
                  class="fas fa-star star-clickable"
                  @click="setRating(star)"
                  @mouseover="hoverRating = star"
                  @mouseleave="hoverRating = 0"
                ></i>
              </div>

              <!-- Comment input -->
              <div class="mb-3">
                <textarea 
                  v-model="newComment"
                  class="form-control" 
                  rows="3" 
                  maxlength="500"
                  placeholder="Share your thoughts about this recipe..."
                ></textarea>
              </div>

              <!-- Submit button -->
              <div class="d-flex gap-2">
                <button 
                  class="btn btn-primary btn-sm" 
                  @click="submitRating"
                  :disabled="newRating === 0 || isSubmitting || !isValidComment"
                >
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                  Submit Review
                </button>
                <button 
                  class="btn btn-outline-secondary btn-sm" 
                  @click="cancelRating"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Existing user ratings -->
        <div v-if="userRating" class="user-rating mb-3">
          <div class="card bg-light">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="card-title">Your review</h6>
                  <div class="stars mb-2">
                    <i 
                      v-for="star in 5" 
                      :key="star"
                      :class="star <= userRating.rating ? 'text-warning' : 'text-muted'"
                      class="fas fa-star"
                    ></i>
                  </div>
                  <p class="card-text" v-if="userRating.comment">{{ userRating.comment }}</p>
                  <small class="text-muted">{{ formatDate(userRating.createdAt) }}</small>
                </div>
                <button 
                  class="btn btn-outline-secondary btn-sm" 
                  @click="editRating"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unauthenticated Users -->
      <div v-else class="mb-3">
        <p class="text-muted small">
          <router-link to="/login" class="text-decoration-none">Sign in</router-link> 
          to rate this recipe
        </p>
      </div>

      <!-- Review List -->
      <div v-if="reviews.length > 0" class="reviews-list">
        <h6 class="mb-3">Recent Reviews</h6>
        <div 
          v-for="review in reviews" 
          :key="review.id"
          class="review-item mb-3"
        >
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-start">
                <img 
                  :src="getUserAvatar(review.user)" 
                  class="rounded-circle me-3" 
                  width="32" 
                  height="32"
                >
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="mb-1">{{ review.user.name }}</h6>
                      <div class="stars mb-2">
                        <i 
                          v-for="star in 5" 
                          :key="star"
                          :class="star <= review.rating ? 'text-warning' : 'text-muted'"
                          class="fas fa-star small"
                        ></i>
                      </div>
                    </div>
                    <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
                  </div>
                  <p class="mb-0" v-if="review.comment">{{ review.comment }}</p>
                </div>
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
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/init'

// Props
const props = defineProps({
  targetType: {
    type: String,
    required: true,
    default: 'recipe'
  },
  targetId: {
    type: String,
    required: true
  },
  displayOnly: {
    type: Boolean,
    default: false
  }
})

// Auth
const auth = getAuth()
const currentUser = ref(null)
const isAuthenticated = computed(() => !!currentUser.value)

// Rating state
const ratings = ref([])
const userRating = ref(null)
const showRatingForm = ref(false)
const newRating = ref(0)
const newComment = ref('')
const hoverRating = ref(0)
const isSubmitting = ref(false)

// Computed
const averageRating = computed(() => {
  if (ratings.value.length === 0) return 0
  const sum = ratings.value.reduce((acc, rating) => acc + rating.rating, 0)
  return sum / ratings.value.length
})

const totalRatings = computed(() => ratings.value.length)

const reviews = computed(() => {
  return ratings.value
    .filter(rating => rating.comment && rating.comment.trim() !== '')
    .slice(0, 5) // Display only the latest 5 items
})

// Methods
const getStarClass = (star) => {
  return star <= averageRating.value ? 'text-warning' : 'text-muted'
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
    year: 'numeric'
  })
}

// BR (C.4): Security
const isValidComment = computed(() => {
  const comment = newComment.value.trim()
  
  // Check comment length
  if (comment.length > 500) return false
  
  // content check
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /<iframe/i,
    /on\w+=/i
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(comment))
})

// Firestore operations
const submitRating = async () => {
  if (!currentUser.value || newRating.value === 0) return
  
  isSubmitting.value = true
  
  try {
    // BR (C.4): Security
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
        email: currentUser.value.email
      },
      rating: Math.max(1, Math.min(5, parseInt(newRating.value))), // Numeric range restrictions also added
      comment: sanitizedComment, // Save sanitized comments
      createdAt: serverTimestamp()
    }

    if (userRating.value) {
      // 既存評価を更新
      // Update an existing rating
      await updateDoc(doc(db, 'ratings', userRating.value.id), ratingData)
    } else {
      // 新規評価を追加
      // Add a new rating
      await addDoc(collection(db, 'ratings'), ratingData)
    }

    // フォームをリセット
    // Reset Form
    showRatingForm.value = false
    newRating.value = 0
    newComment.value = ''
    
  } catch (error) {
    console.error('Error submitting rating:', error)
    alert('Failed to submit rating. Please try again.')
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

// Load ratings from Firestore
const loadRatings = () => {
  const q = query(
    collection(db, 'ratings'),
    where('targetType', '==', props.targetType),
    where('targetId', '==', props.targetId),
    orderBy('createdAt', 'desc')
  )

  onSnapshot(q, (snapshot) => {
    ratings.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // ユーザーの既存評価を検索
    // Search existing user ratings
    if (currentUser.value) {
      userRating.value = ratings.value.find(
        rating => rating.userId === currentUser.value.uid
      ) || null
    }
  })
}

onMounted(() => {
  // 認証状態監視
  // Authentication Status Monitoring
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    if (user) {
      loadRatings()
    }
  })

  // 未認証でも評価一覧は表示
  // The evaluation list is displayed even if you are not authenticated.
  loadRatings()
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
  transition: color 0.2s ease;
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
</style>