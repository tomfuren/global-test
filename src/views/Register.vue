<template>
  <div class="register-page bg-light min-vh-100 d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 col-sm-9">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary">Global Plate</h2>
                <p class="text-muted">Create your account</p>
              </div>

              <!-- エラー・成功メッセージ -->
              <div v-if="message" :class="messageClass" class="alert" role="alert">
                <i :class="messageIcon" class="me-2"></i>
                {{ message }}
              </div>

              <!-- 登録フォーム -->
              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.firstName }"
                      id="firstName"
                      v-model="formData.firstName"
                      placeholder="First name"
                      autocomplete="given-name"
                      @blur="validateFirstName(true)"
                      @input="validateFirstName(false)"
                      required
                    />
                    <div v-if="errors.firstName" class="invalid-feedback">
                      {{ errors.firstName }}
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.lastName }"
                      id="lastName"
                      v-model="formData.lastName"
                      placeholder="Last name"
                      autocomplete="family-name"
                      @blur="validateLastName(true)"
                      @input="validateLastName(false)"
                      required
                    />
                    <div v-if="errors.lastName" class="invalid-feedback">
                      {{ errors.lastName }}
                    </div>
                  </div>
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    id="email"
                    v-model="formData.email"
                    placeholder="Enter your email"
                    autocomplete="email"
                    @blur="validateEmail(true)"
                    @input="validateEmail(false)"
                    required
                  />
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Country -->
                <div class="mb-3">
                  <label for="country" class="form-label">Country</label>
                  <select
                    class="form-select"
                    :class="{ 'is-invalid': errors.country }"
                    id="country"
                    v-model="formData.country"
                    @change="validateCountry(true)"
                    required
                  >
                    <option value="">Select your country</option>
                    <option value="Japan">Japan</option>
                    <option value="China">China</option>
                    <option value="South Korea">South Korea</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Other">Other</option>
                  </select>
                  <div v-if="errors.country" class="invalid-feedback">
                    {{ errors.country }}
                  </div>
                </div>

                <!-- University -->
                <div class="mb-3">
                  <label for="university" class="form-label">University</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.university }"
                    id="university"
                    v-model="formData.university"
                    placeholder="Enter your university name"
                    @blur="validateUniversity(true)"
                    @input="validateUniversity(false)"
                    required
                  />
                  <div v-if="errors.university" class="invalid-feedback">
                    {{ errors.university }}
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    id="password"
                    v-model="formData.password"
                    placeholder="Password (min. 6 characters)"
                    autocomplete="new-password"
                    @blur="validatePassword(true)"
                    @input="validatePassword(false)"
                    required
                  />
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    placeholder="Confirm your password"
                    autocomplete="new-password"
                    @blur="validateConfirmPassword(true)"
                    @input="validateConfirmPassword(false)"
                    required
                  />
                  <div v-if="errors.confirmPassword" class="invalid-feedback">
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <!-- Terms Agreement -->
                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :class="{ 'is-invalid': errors.agree }"
                    id="agree"
                    v-model="formData.agree"
                    @change="validateAgree(true)"
                    required
                  />
                  <label class="form-check-label" for="agree">
                    I agree to the 
                    <router-link to="/terms" class="text-decoration-none">Terms of Service</router-link> and
                    <router-link to="/privacy" class="text-decoration-none">Privacy Policy</router-link>
                  </label>
                  <div v-if="errors.agree" class="invalid-feedback">
                    {{ errors.agree }}
                  </div>
                </div>

                <!-- 登録ボタン -->
                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Create Account
                  </button>
                </div>
              </form>

              <hr class="my-4">

              <!-- ログインリンク -->
              <div class="text-center">
                <p class="mb-0">
                  Already have an account?<br>
                  <router-link to="/login" class="text-decoration-none fw-bold">
                    Sign In
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// BR (C.1) & BR (D.1): Firebase Authentication のインポート
// ユーザー登録とプロフィール更新のために必要な関数をインポート
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
// Firestoreにユーザー情報を保存するための関数をインポート
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

const router = useRouter()
// BR (C.1): Firebase Authenticationインスタンスを取得
const auth = getAuth()

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  university: '',
  password: '',
  confirmPassword: '',
  agree: false
})

// State
const errors = ref({
  firstName: null,
  lastName: null,
  email: null,
  country: null,
  university: null,
  password: null,
  confirmPassword: null,
  agree: null
})
const message = ref('')
const messageType = ref('success')
const isLoading = ref(false)

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

// Validation functions
const validateFirstName = (blur) => {
  if (!formData.value.firstName.trim()) {
    if (blur) errors.value.firstName = "First name is required"
  } else if (formData.value.firstName.length < 2) {
    if (blur) errors.value.firstName = "First name must be at least 2 characters"
  } else {
    errors.value.firstName = null
  }
}

const validateLastName = (blur) => {
  if (!formData.value.lastName.trim()) {
    if (blur) errors.value.lastName = "Last name is required"
  } else if (formData.value.lastName.length < 2) {
    if (blur) errors.value.lastName = "Last name must be at least 2 characters"
  } else {
    errors.value.lastName = null
  }
}

const validateEmail = (blur) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email) {
    if (blur) errors.value.email = "Email is required"
  } else if (!emailRegex.test(formData.value.email)) {
    if (blur) errors.value.email = "Please enter a valid email address"
  } else {
    errors.value.email = null
  }
}

const validateCountry = (blur) => {
  if (!formData.value.country) {
    if (blur) errors.value.country = "Please select a country"
  } else {
    errors.value.country = null
  }
}

const validateUniversity = (blur) => {
  if (!formData.value.university.trim()) {
    if (blur) errors.value.university = "University name is required"
  } else if (formData.value.university.length < 3) {
    if (blur) errors.value.university = "University name must be at least 3 characters"
  } else {
    errors.value.university = null
  }
}

const validatePassword = (blur) => {
  if (!formData.value.password) {
    if (blur) errors.value.password = "Password is required"
  } else if (formData.value.password.length < 6) {
    if (blur) errors.value.password = "Password must be at least 6 characters"
  } else {
    errors.value.password = null
  }
  
  if (formData.value.confirmPassword) {
    validateConfirmPassword(blur)
  }
}

const validateConfirmPassword = (blur) => {
  if (!formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = "Please confirm your password"
  } else if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = "Passwords do not match"
  } else {
    errors.value.confirmPassword = null
  }
}

const validateAgree = (blur) => {
  if (!formData.value.agree) {
    if (blur) errors.value.agree = "You must agree to the terms"
  } else {
    errors.value.agree = null
  }
}

// Firebase エラーメッセージ
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled',
    'auth/weak-password': 'Password is too weak',
    'auth/network-request-failed': 'Network error. Please check your connection'
  }
  return errorMessages[errorCode] || 'Registration failed. Please try again'
}

// 登録処理
const handleRegister = async () => {
  validateFirstName(true)
  validateLastName(true)
  validateEmail(true)
  validateCountry(true)
  validateUniversity(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateAgree(true)
  
  const hasErrors = Object.values(errors.value).some(error => error !== null)
  
  if (!hasErrors) {
    isLoading.value = true
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.value.email,
        formData.value.password
      )
      
      const user = userCredential.user
      
      const displayName = `${formData.value.firstName} ${formData.value.lastName}`
      await updateProfile(user, {
        displayName: displayName
      })
      
      const userData = {
        uid: user.uid,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        displayName: displayName,
        email: user.email,
        country: formData.value.country,
        university: formData.value.university,
        photoURL: null,
        provider: 'email',
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      
      await setDoc(doc(db, 'users', user.uid), userData)
      
      console.log('Registration successful:', user)
      showMessage('Registration successful! Redirecting to login...', 'success')
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      
    } catch (error) {
      console.error('Registration error:', error)
      showMessage(getErrorMessage(error.code), 'error')
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<style scoped>
.register-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card {
  border-radius: 15px;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  border-radius: 10px;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
}

.invalid-feedback {
  display: block;
}
</style>