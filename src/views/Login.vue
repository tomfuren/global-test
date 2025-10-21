<!--
  Login Page - User authentication interface with Firebase Authentication
  ログインページ - Firebase Authenticationを使用したユーザー認証インターフェース

  Features / 機能:
  - Email/Password authentication / メールアドレス・パスワード認証
  - Google OAuth authentication / Google OAuth認証
  - Real-time form validation / リアルタイムフォーム検証
  - Accessible form design with ARIA attributes / ARIA属性を使用したアクセシブルフォーム設計
  - Loading states and error handling / ローディング状態とエラーハンドリング

  BR (C.1): Authentication - Email/Password Login
  BR (C.1): 認証機能 - メールアドレス・パスワードログイン

  BR (D.1): External Authentication - Google OAuth Integration
  BR (D.1): 外部認証機能 - Google OAuth統合

  BR (B.1): Validations - Email and Password Format Validation
  BR (B.1): バリデーション機能 - メールアドレスとパスワード形式の検証

  BR (E.3): Accessibility - ARIA labels, roles, and keyboard navigation support
  BR (E.3): アクセシビリティ - ARIAラベル、ロール、キーボードナビゲーション対応
-->

<template>
  <div class="login-page bg-light min-vh-100 d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 col-sm-9">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <!-- Page Header / ページヘッダー -->
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary">Global Plate</h2>
                <p class="text-muted">Log in to your account</p>
              </div>

              <!--
                Message Display / メッセージ表示
                BR (E.3): Accessibility - aria-live="polite" notifies screen readers of dynamic changes
                BR (E.3): アクセシビリティ - aria-live="polite"でスクリーンリーダーに動的な変更を通知
              -->
              <div
                v-if="message"
                :class="messageClass"
                class="alert"
                role="alert"
                aria-live="polite"
              >
                <!--
                  BR (E.3): Accessibility - aria-hidden="true" hides decorative icons from screen readers
                  BR (E.3): アクセシビリティ - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す
                -->
                <i :class="messageIcon" class="me-2" aria-hidden="true"></i>
                {{ message }}
              </div>

              <!-- Login Form / ログインフォーム -->
              <form @submit.prevent="handleEmailLogin">
                <!--
                  Email Input Field / Email入力フィールド
                  BR (B.1): Validations - Email address format validation implementation
                  BR (B.1): バリデーション機能 - メールアドレス形式の検証を実装
                -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    id="email"
                    v-model="formData.email"
                    @blur="validateEmail(true)"
                    @input="validateEmail(false)"
                    placeholder="Enter your email"
                    autocomplete="email"
                    required
                  />
                  <!--
                    BR (E.3): Accessibility - role="alert" immediately notifies screen readers of error messages
                    BR (E.3): アクセシビリティ - role="alert"でエラーメッセージをスクリーンリーダーに即座に通知
                  -->
                  <div v-if="errors.email" class="invalid-feedback" role="alert">
                    {{ errors.email }}
                  </div>
                </div>

                <!--
                  Password Input Field / Password入力フィールド
                  BR (B.1): Validations - Password length validation implementation
                  BR (B.1): バリデーション機能 - パスワード長の検証を実装
                -->
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    id="password"
                    v-model="formData.password"
                    @blur="validatePassword(true)"
                    @input="validatePassword(false)"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                    required
                  />
                  <!--
                    BR (E.3): Accessibility - role="alert" immediately notifies screen readers of error messages
                    BR (E.3): アクセシビリティ - role="alert"でエラーメッセージをスクリーンリーダーに即座に通知
                  -->
                  <div v-if="errors.password" class="invalid-feedback" role="alert">
                    {{ errors.password }}
                  </div>
                </div>

                <!-- Login Button / ログインボタン -->
                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
                    <span
                      v-if="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                    Log in
                  </button>
                </div>

                <!-- Forgot Password Link / パスワード忘れリンク -->
                <div class="text-center">
                  <a href="#" class="text-decoration-none">Forgot your password?</a>
                </div>
              </form>

              <hr class="my-4" />

              <!--
                Google OAuth Login Button / Google OAuth ログインボタン
                BR (D.1): External Authentication - Google OAuth login implementation
                BR (D.1): 外部認証機能 - Google OAuth ログインを実装

                Implements external authentication using Google OAuth.
                Uses Firebase Authentication's signInWithPopup() to allow users to easily sign in with their Google account.

                Google OAuth を使用した外部認証機能を実装。
                Firebase Authentication の signInWithPopup() を使用して、ユーザーがGoogleアカウントで簡単にログインできるようにします。
              -->
              <div class="d-grid mb-3">
                <button
                  @click="handleGoogleLogin"
                  class="btn btn-outline-danger btn-lg"
                  :disabled="isLoading"
                >
                  <!--
                    BR (E.3): Accessibility - aria-hidden="true" hides decorative icons from screen readers
                    BR (E.3): アクセシビリティ - aria-hidden="true"で装飾的なアイコンをスクリーンリーダーから隠す
                  -->
                  <i class="fab fa-google me-2" aria-hidden="true"></i>
                  Continue with Google
                </button>
              </div>

              <!-- Sign Up Link / 新規登録リンク -->
              <div class="text-center">
                <p class="mb-0">
                  Don't have an account?<br />
                  <router-link to="/register" class="text-decoration-none fw-bold">
                    Create New Account
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
import { useRouter, useRoute } from 'vue-router'
// BR (D.1): Firebase Authentication imports / Firebase Authentication のインポート
// Import necessary functions for Email/Password and Google OAuth authentication
// Email/Password認証とGoogle OAuth認証のために必要な関数をインポート
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
// Import functions to retrieve and save user information from Firestore
// Firestoreからユーザー情報を取得・保存するための関数をインポート
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

const router = useRouter()
const route = useRoute()
// BR (D.1): Get Firebase Authentication instance / Firebase Authenticationインスタンスを取得
// Use this auth object to execute authentication operations
// このauthオブジェクトを使って認証操作を実行する
const auth = getAuth()

// Form data - Stores user input email and password / ユーザーが入力するメールアドレスとパスワードを保持
const formData = ref({
  email: '',
  password: '',
})

// State - Manages error messages, notification messages, and loading states
// エラーメッセージ、通知メッセージ、ローディング状態を管理
const errors = ref({
  email: null,
  password: null,
})
const message = ref('') // Success/Error message / 成功/エラーメッセージ
const messageType = ref('success') // Message type ('success' or 'error') / メッセージタイプ ('success' or 'error')
const isLoading = ref(false) // Button loading state / ボタンのローディング状態

// Computed - Dynamically determines Bootstrap classes and icons for message display
// メッセージ表示用のBootstrapクラスとアイコンを動的に決定
const messageClass = computed(() => {
  return messageType.value === 'error' ? 'alert-danger' : 'alert-success'
})

const messageIcon = computed(() => {
  return messageType.value === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'
})

// Helper functions / ヘルパー関数

/**
 * Display message function / メッセージを表示する関数
 * @param {string} msg - Message to display / 表示するメッセージ
 * @param {string} type - Message type ('success' or 'error') / メッセージタイプ ('success' or 'error')
 */
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  // Automatically clear message after 5 seconds / 5秒後に自動的にメッセージを消す
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// Validation functions / バリデーション関数

/**
 * Email address validation / メールアドレスのバリデーション
 * BR (B.1): Validations - Email address format validation
 * BR (B.1): バリデーション機能 - メールアドレス形式の検証
 * @param {boolean} blur - Show error on blur event, hide on input event / blurイベント時はエラーを表示、inputイベント時は表示しない
 */
const validateEmail = (blur) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email) {
    if (blur) errors.value.email = 'Email is required'
  } else if (!emailRegex.test(formData.value.email)) {
    if (blur) errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = null
  }
}

/**
 * Password validation / パスワードのバリデーション
 * BR (B.1): Validations - Password length validation
 * BR (B.1): バリデーション機能 - パスワード長の検証
 * @param {boolean} blur - Show error on blur event, hide on input event / blurイベント時はエラーを表示、inputイベント時は表示しない
 */
const validatePassword = (blur) => {
  if (!formData.value.password) {
    if (blur) errors.value.password = 'Password is required'
  } else if (formData.value.password.length < 6) {
    if (blur) errors.value.password = 'Password must be at least 6 characters'
  } else {
    errors.value.password = null
  }
}

/**
 * Convert Firebase error codes to user-friendly error messages
 * Firebase エラーコードをユーザーフレンドリーなエラーメッセージに変換
 * @param {string} errorCode - Firebase Authentication error code / Firebase Authenticationのエラーコード
 * @returns {string} Error message to display to user / ユーザーに表示するエラーメッセージ
 */
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-email': 'Invalid email address format',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/popup-closed-by-user': 'Sign-in popup was closed',
    'auth/cancelled-popup-request': 'Sign-in was cancelled',
  }
  return errorMessages[errorCode] || 'Login failed. Please try again'
}

/**
 * BR (C.1): Authentication - Email/Password Login Processing
 * BR (C.1): 認証機能 - Email/Password ログイン処理
 *
 * Login using Firebase Authentication with email address and password
 * Firebase Authentication を使用してメールアドレスとパスワードでログイン
 *
 * Upon success, Firebase automatically manages user state and triggers onAuthStateChanged
 * 成功時は自動的にFirebaseがユーザー状態を管理し、onAuthStateChangedが発火する
 */
const handleEmailLogin = async () => {
  // Validate all form fields / フォームの全フィールドを検証
  validateEmail(true)
  validatePassword(true)

  // Execute login process only if there are no errors / エラーがない場合のみログイン処理を実行
  if (!errors.value.email && !errors.value.password) {
    isLoading.value = true

    try {
      // Login with Firebase Authentication / Firebase Authentication でログイン
      // signInWithEmailAndPassword returns a Promise and UserCredential on success
      // signInWithEmailAndPassword は Promise を返し、成功時に UserCredential を返す
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.value.email,
        formData.value.password,
      )

      const user = userCredential.user
      console.log('Login successful:', user)

      showMessage('Login successful!', 'success')

      // Determine redirect destination (to query redirect if exists, otherwise to dashboard)
      // リダイレクト先を決定（query に redirect がある場合はそこへ、なければダッシュボードへ）
      const redirectTo = route.query.redirect || '/dashboard'
      setTimeout(() => {
        router.push(redirectTo)
      }, 1000)
    } catch (error) {
      console.error('Login error:', error)
      showMessage(getErrorMessage(error.code), 'error')
    } finally {
      isLoading.value = false
    }
  }
}

/**
 * BR (D.1): External Authentication - Google OAuth Login Processing
 * BR (D.1): 外部認証機能 - Google OAuth ログイン処理
 *
 * This function implements login functionality using external authentication service (Google)
 * この関数は外部認証サービス（Google）を使用したログイン機能を実装します
 *
 * Process Flow / 処理フロー:
 * 1. Create GoogleAuthProvider and display authentication popup
 *    GoogleAuthProvider を作成し、認証ポップアップを表示
 * 2. User approves login with Google account
 *    ユーザーがGoogleアカウントでログインを承認
 * 3. User information is automatically registered in Firebase Authentication
 *    Firebase Authentication にユーザー情報が自動的に登録される
 * 4. Check existence of user profile in Firestore
 *    Firestoreでユーザープロフィールの存在を確認
 * 5. For first-time login, save additional user information to Firestore
 *    初回ログインの場合、Firestoreに追加のユーザー情報を保存
 * 6. For existing users, update last login time
 *    既存ユーザーの場合、最終ログイン時刻を更新
 *
 * Benefits / メリット:
 * - No password management required (managed by Google)
 *   パスワード管理が不要（Googleが管理）
 * - Secure and reliable authentication
 *   安全で信頼性の高い認証
 * - Easy and quick login experience for users
 *   ユーザーにとって簡単で素早いログイン体験
 */
const handleGoogleLogin = async () => {
  isLoading.value = true

  try {
    // Create GoogleAuthProvider instance / GoogleAuthProvider インスタンスを作成
    // This is a provider for handling Google OAuth 2.0 authentication
    // これはGoogle OAuth 2.0認証を処理するためのプロバイダー
    const provider = new GoogleAuthProvider()

    // Set custom parameters / カスタムパラメータを設定
    // By specifying 'select_account', display account selection screen every time
    // 'select_account' を指定することで、毎回アカウント選択画面を表示
    // This allows users with multiple Google accounts to select the appropriate account
    // これにより、複数のGoogleアカウントを持つユーザーが適切なアカウントを選択できる
    provider.setCustomParameters({
      prompt: 'select_account',
    })

    // Display authentication popup with signInWithPopup / signInWithPopup で認証ポップアップを表示
    // When user selects Google account and approves login,
    // ユーザーがGoogleアカウントを選択してログインを承認すると、
    // Firebase automatically authenticates the user to the application
    // Firebase が自動的にユーザーをアプリケーションに認証する
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    console.log('Google login successful:', user)

    // BR (D.1): Check if user profile exists in Firestore / Firestoreにユーザープロフィールが存在するか確認
    // Google login automatically registers to Firebase Authentication even on first login,
    // Googleログインは初回でもFirebase Authenticationに自動登録されるが、
    // but additional profile information (role, university, etc.) needs to be saved separately in Firestore
    // 追加のプロフィール情報（役割、大学など）はFirestoreに別途保存する必要がある
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)

    // For first-time login, save user information to Firestore
    // 初回ログインの場合、Firestoreにユーザー情報を保存
    if (!userDoc.exists()) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous User',
        photoURL: user.photoURL || null, // Google account profile URL / GoogleアカウントのプロフィールURL
        provider: 'google', // Record authentication provider / 認証プロバイダーを記録
        role: 'user', // BR (C.2): Set default role / デフォルトの役割を設定
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      await setDoc(userDocRef, userData)
      console.log('New user profile created in Firestore')
    } else {
      // For existing users, only update last login time
      // 既存ユーザーの場合、最終ログイン時刻のみ更新
      // By specifying merge: true, update only specific fields while retaining existing data
      // merge: true を指定することで、既存のデータを保持したまま特定フィールドのみ更新
      await setDoc(
        userDocRef,
        {
          lastLogin: new Date().toISOString(),
        },
        { merge: true },
      )
    }

    showMessage('Welcome! Signed in with Google', 'success')

    // Determine redirect destination / リダイレクト先を決定
    const redirectTo = route.query.redirect || '/dashboard'
    setTimeout(() => {
      router.push(redirectTo)
    }, 1000)
  } catch (error) {
    console.error('Google login error:', error)
    showMessage(getErrorMessage(error.code), 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.invalid-feedback {
  display: block;
}

.login-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.card {
  border-radius: 15px;
}

.form-control:focus {
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

/*
  BR (E.3): Accessibility - Enhanced visual feedback on focus
  BR (E.3): アクセシビリティ - フォーカス時の視覚的フィードバック強化

  Add outline to make focus clearly visible during keyboard navigation
  キーボード操作時にフォーカスが明確に見えるようにアウトラインを追加
*/
.form-control:focus,
.btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style>
