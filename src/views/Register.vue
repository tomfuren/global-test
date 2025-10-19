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

              <!--
                エラー・成功メッセージ
                Error/Success Message
                BR (E.3): Accessibility - aria-live="polite"でスクリーンリーダーに動的な変更を通知
                BR (E.3): Accessibility - Notify screen readers of dynamic changes with aria-live="polite"
              -->
              <div
                v-if="message"
                :class="messageClass"
                class="alert"
                role="alert"
                aria-live="polite"
              >
                <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                <!-- BR (E.3): Accessibility - Hide decorative icons from screen readers with aria-hidden="true" -->
                <i :class="messageIcon" class="me-2" aria-hidden="true"></i>
                {{ message }}
              </div>

              <form @submit.prevent="register">
                <div class="row">
                  <!--
                    BR (B.1): Validations - 名前の検証（最小2文字）
                    BR (B.1): Validations - Name validation (minimum 2 characters)
                  -->
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
                    />
                    <!--
                      BR (E.3): Accessibility - role="alert"でエラーメッセージをスクリーンリーダーに即座に通知
                      BR (E.3): Accessibility - Notify screen readers of error messages immediately with role="alert"
                    -->
                    <div v-if="errors.firstName" class="invalid-feedback" role="alert">
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
                      placeholder="Last Name"
                      autocomplete="family-name"
                      @blur="validateLastName(true)"
                      @input="validateLastName(false)"
                    />
                    <!-- BR (E.3): Accessibility - role="alert"でエラーメッセージを通知 -->
                    <div v-if="errors.lastName" class="invalid-feedback" role="alert">
                      {{ errors.lastName }}
                    </div>
                  </div>
                </div>

                <!--
                  BR (B.1): Validations - メールアドレス形式の検証
                  BR (B.1): Validations - Email address format validation
                -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    id="email"
                    v-model="formData.email"
                    placeholder="your@email.com"
                    autocomplete="email"
                    @blur="validateEmail(true)"
                    @input="validateEmail(false)"
                  />
                  <!-- BR (E.3): Accessibility - role="alert"でエラーメッセージを通知 -->
                  <div v-if="errors.email" class="invalid-feedback" role="alert">
                    {{ errors.email }}
                  </div>
                </div>

                <div class="mb-3">
                  <label for="country" class="form-label">Country</label>
                  <select
                    class="form-select"
                    :class="{ 'is-invalid': errors.country }"
                    id="country"
                    v-model="formData.country"
                    autocomplete="country"
                    @blur="validateCountry(true)"
                    @change="validateCountry(true)"
                  >
                    <option value="">Select your country</option>
                    <option value="japan">Japan</option>
                    <option value="china">China</option>
                    <option value="korea">South Korea</option>
                    <option value="india">India</option>
                    <option value="thailand">Thailand</option>
                    <option value="vietnam">Vietnam</option>
                    <option value="indonesia">Indonesia</option>
                    <option value="malaysia">Malaysia</option>
                    <option value="other">Other</option>
                  </select>
                  <!-- BR (E.3): Accessibility - role="alert"でエラーメッセージを通知 -->
                  <div v-if="errors.country" class="invalid-feedback" role="alert">
                    {{ errors.country }}
                  </div>
                </div>

                <!--
                  BR (C.2): Role-based authentication - 役割選択フィールド
                  ユーザー登録時に役割（user/admin）を選択可能にする

                  BR (C.2): Role-based authentication - Role selection field
                  Allow users to select their role (user/admin) during registration
                -->
                <div class="mb-3">
                  <label for="role" class="form-label">Account Type</label>
                  <select
                    class="form-select"
                    :class="{ 'is-invalid': errors.role }"
                    id="role"
                    v-model="formData.role"
                    @blur="validateRole(true)"
                    @change="validateRole(true)"
                  >
                    <option value="">Select account type</option>
                    <option value="user">Student Member</option>
                    <option value="admin">Community Administrator</option>
                  </select>
                  <!-- BR (E.3): Accessibility - role="alert"でエラーメッセージを通知 -->
                  <div v-if="errors.role" class="invalid-feedback" role="alert">
                    {{ errors.role }}
                  </div>
                  <div class="form-text">
                    <small>
                      <strong>Student Member:</strong> Access recipes, events, and groups<br />
                      <strong>Community Administrator:</strong> Manage content and users
                    </small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="university" class="form-label">University/School</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.university }"
                    id="university"
                    v-model="formData.university"
                    placeholder="e.g., Monash University"
                    autocomplete="organization"
                    @blur="validateUniversity(true)"
                    @input="validateUniversity(false)"
                  />
                  <!-- BR (E.3): Accessibility - role="alert"でエラーメッセージを通知 -->
                  <div v-if="errors.university" class="invalid-feedback" role="alert">
                    {{ errors.university }}
                  </div>
                </div>

                <!--
                  BR (B.1): Validations - パスワード強度の検証
                  最低8文字、大文字・小文字・数字を含む

                  BR (B.1): Validations - Password strength validation
                  Minimum 8 characters, including uppercase, lowercase, and numbers
                -->
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    id="password"
                    v-model="formData.password"
                    placeholder="At least 8 characters"
                    autocomplete="new-password"
                    @blur="validatePassword(true)"
                    @input="validatePassword(false)"
                  />
                  <!-- BR (E.3): Accessibility - role="alert"でエラーメッセージを通知 -->
                  <div v-if="errors.password" class="invalid-feedback" role="alert">
                    {{ errors.password }}
                  </div>
                </div>

                <!--
                  BR (B.1): Validations - パスワード確認の検証
                  BR (B.1): Validations - Password confirmation validation
                -->
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    placeholder="Re-enter your password"
                    autocomplete="new-password"
                    @blur="validateConfirmPassword(true)"
                    @input="validateConfirmPassword(false)"
                  />
                  <!-- BR (E.3): Accessibility - role="alert"でエラーメッセージを通知 -->
                  <div v-if="errors.confirmPassword" class="invalid-feedback" role="alert">
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :class="{ 'is-invalid': errors.agree }"
                    id="agree"
                    v-model="formData.agree"
                    @change="validateAgree(true)"
                  />
                  <label class="form-check-label" for="agree">
                    I agree to the
                    <router-link to="/terms" class="text-decoration-none"
                      >Terms of Service</router-link
                    >
                    and
                    <router-link to="/privacy" class="text-decoration-none"
                      >Privacy Policy</router-link
                    >
                  </label>
                  <!-- BR (E.3): Accessibility - role="alert"でエラーメッセージを通知 -->
                  <div v-if="errors.agree" class="invalid-feedback" role="alert">
                    {{ errors.agree }}
                  </div>
                </div>

                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
                    <span
                      v-if="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                    Create Account
                  </button>
                </div>
              </form>

              <hr class="my-4" />

              <!--
                BR (D.1): External Authentication - Google認証
                Googleアカウントでの新規登録機能

                BR (D.1): External Authentication - Google Authentication
                Sign up functionality using Google account
              -->
              <div class="d-grid mb-3">
                <button
                  @click="handleGoogleRegister"
                  class="btn btn-outline-danger btn-lg"
                  :disabled="isLoading"
                >
                  <!-- BR (E.3): Accessibility - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す -->
                  <i class="fab fa-google me-2" aria-hidden="true"></i>
                  Sign up with Google
                </button>
              </div>

              <div class="text-center">
                <p class="mb-0">
                  Already have an account?<br />
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
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
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
  role: '', // BR (C.2): Role-based authentication
  university: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

// Validation errors
const errors = ref({
  firstName: null,
  lastName: null,
  email: null,
  country: null,
  role: null, // BR (C.2): Role-based authentication
  university: null,
  password: null,
  confirmPassword: null,
  agree: null,
})

// UI state
const isLoading = ref(false)
const message = ref('')
const messageType = ref('')

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
// BR (B.1): Validations - 各フィールドのバリデーション関数
const validateFirstName = (blur) => {
  if (!formData.value.firstName.trim()) {
    if (blur) errors.value.firstName = 'First name is required'
  } else if (formData.value.firstName.trim().length < 2) {
    if (blur) errors.value.firstName = 'First name must be at least 2 characters'
  } else {
    errors.value.firstName = null
  }
}

const validateLastName = (blur) => {
  if (!formData.value.lastName.trim()) {
    if (blur) errors.value.lastName = 'Last name is required'
  } else if (formData.value.lastName.trim().length < 2) {
    if (blur) errors.value.lastName = 'Last name must be at least 2 characters'
  } else {
    errors.value.lastName = null
  }
}

const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!formData.value.email.trim()) {
    if (blur) errors.value.email = 'Email address is required'
  } else if (!emailPattern.test(formData.value.email.trim())) {
    if (blur) errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = null
  }
}

const validateCountry = (blur) => {
  if (!formData.value.country || formData.value.country === '') {
    if (blur) errors.value.country = 'Please select your country'
  } else {
    errors.value.country = null
  }
}

// BR (C.2): Role-based authentication validation
const validateRole = (blur) => {
  if (!formData.value.role || formData.value.role === '') {
    if (blur) errors.value.role = 'Please select account type'
  } else {
    errors.value.role = null
  }
}

const validateUniversity = (blur) => {
  if (!formData.value.university.trim()) {
    if (blur) errors.value.university = 'University/School is required'
  } else if (formData.value.university.trim().length < 3) {
    if (blur) errors.value.university = 'University name must be at least 3 characters'
  } else {
    errors.value.university = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password

  if (!password) {
    if (blur) errors.value.password = 'Password is required'
  } else if (password.length < 8) {
    if (blur) errors.value.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[a-z])/.test(password)) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter'
  } else if (!/(?=.*[A-Z])/.test(password)) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter'
  } else if (!/(?=.*\d)/.test(password)) {
    if (blur) errors.value.password = 'Password must contain at least one number'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (!formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Please confirm your password'
  } else if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateAgree = (blur) => {
  if (!formData.value.agree) {
    if (blur) errors.value.agree = 'You must agree to the Terms of Service and Privacy Policy'
  } else {
    errors.value.agree = null
  }
}

// Form validation
const isFormValid = computed(() => {
  return (
    Object.values(errors.value).every((error) => error === null) &&
    formData.value.firstName &&
    formData.value.lastName &&
    formData.value.email &&
    formData.value.country &&
    formData.value.role && // BR (C.2): Role-based authentication
    formData.value.university &&
    formData.value.password &&
    formData.value.confirmPassword &&
    formData.value.agree
  )
})

// Firebase error handling
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists'
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password'
    case 'auth/invalid-email':
      return 'Please enter a valid email address'
    case 'auth/operation-not-allowed':
      return 'Account creation is currently disabled. Please enable Google sign-in in Firebase Console.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection'
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for OAuth operations. Please add it to Firebase Console.'
    default:
      return `Registration failed: ${errorCode || 'Unknown error'}`
  }
}

/**
 * BR (C.1): Authentication - Email/Password Registration
 * BR (C.2): Role-based authentication - ユーザー登録時に役割を設定
 *
 * Email/Passwordでの新規ユーザー登録処理
 * Firestoreにユーザープロフィール情報（役割を含む）を保存
 */
const register = async () => {
  // Validate all fields
  validateFirstName(true)
  validateLastName(true)
  validateEmail(true)
  validateCountry(true)
  validateRole(true) // BR (C.2): Role-based authentication
  validateUniversity(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateAgree(true)

  if (!isFormValid.value) {
    return
  }

  isLoading.value = true

  try {
    // Firebase Authentication でユーザーを作成
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password,
    )
    const user = userCredential.user

    console.log('Firebase Register Successful!')
    console.log('New User:', user)

    // BR (C.2): Firestoreにユーザープロフィール情報を保存（役割を含む）
    // Save user profile information to Firestore (including role)
    const userProfile = {
      uid: user.uid,
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      displayName: `${formData.value.firstName} ${formData.value.lastName}`,
      email: formData.value.email,
      country: formData.value.country,
      role: formData.value.role, // BR (C.2): 役割を保存
      university: formData.value.university,
      provider: 'email', // 認証プロバイダー
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Firestoreにユーザードキュメントを作成
    await setDoc(doc(db, 'users', user.uid), userProfile)

    // Firebase Authのdisplay nameを更新
    await updateProfile(user, {
      displayName: userProfile.displayName,
    })

    console.log('User profile saved to Firestore:', userProfile)

    showMessage('Registration successful!', 'success')

    // ログインページにリダイレクト
    setTimeout(() => {
      router.push({
        path: '/login',
        query: { message: 'registration-success' },
      })
    }, 1500)
  } catch (error) {
    console.error('Registration error:', error)
    showMessage(getErrorMessage(error.code), 'error')
  } finally {
    isLoading.value = false
  }
}

/**
 * BR (D.1): External Authentication - Google Authentication Registration
 * Googleアカウントで新規登録
 *
 * 処理フロー:
 * 1. GoogleAuthProviderでポップアップを表示
 * 2. ユーザーがGoogleアカウントを選択
 * 3. Firestoreでユーザープロフィールの存在確認
 * 4. 初回の場合はFirestoreに保存、既存の場合はログインページへリダイレクト
 */
const handleGoogleRegister = async () => {
  isLoading.value = true

  try {
    // GoogleAuthProvider インスタンスを作成
    const provider = new GoogleAuthProvider()

    // アカウント選択画面を毎回表示
    provider.setCustomParameters({
      prompt: 'select_account',
    })

    // Googleログインポップアップを表示
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    console.log('Google registration successful:', user)
    console.log('User UID:', user.uid)
    console.log('User Email:', user.email)

    // BR (C.2): Firestoreにユーザープロフィールが存在するか確認
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    console.log('User document exists:', userDoc.exists())

    if (!userDoc.exists()) {
      // 初回登録の場合、Firestoreにユーザー情報を保存
      // デフォルトで 'user' 役割を設定
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous User',
        photoURL: user.photoURL || null,
        provider: 'google',
        role: 'user', // BR (C.2): デフォルトの役割
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log('Creating new user profile:', userData)

      await setDoc(userDocRef, userData)
      console.log('User profile saved to Firestore successfully')

      showMessage('Welcome! Account created with Google', 'success')

      // ダッシュボードにリダイレクト
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      // 既にアカウントが存在する場合
      console.log('User already exists, redirecting to login')
      showMessage('Account already exists. Redirecting to login...', 'error')

      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  } catch (error) {
    // 詳細なエラー情報をコンソールに出力
    console.error('Google registration error - Full error:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)

    // ユーザーがポップアップを閉じた場合
    if (error.code === 'auth/popup-closed-by-user') {
      showMessage('Sign-up cancelled', 'error')
      isLoading.value = false
      return
    }

    // ユーザーがキャンセルした場合
    if (error.code === 'auth/cancelled-popup-request') {
      showMessage('Sign-up cancelled', 'error')
      isLoading.value = false
      return
    }

    // その他のエラー
    const errorMessage = getErrorMessage(error.code) || error.message
    showMessage(`Error: ${errorMessage}`, 'error')
  } finally {
    isLoading.value = false
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

.btn-outline-danger {
  border-radius: 10px;
}

.invalid-feedback {
  display: block;
}

/*
  BR (E.3): Accessibility - フォーカス時の視覚的フィードバック強化
  キーボード操作時にフォーカスが明確に見えるようにアウトラインを追加

  BR (E.3): Accessibility - Enhanced visual feedback on focus
  Add outline to make focus clearly visible during keyboard navigation
*/
.form-control:focus,
.form-select:focus,
.btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style>
