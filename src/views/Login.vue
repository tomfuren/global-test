<template>
  <div class="login-page bg-light min-vh-100 d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 col-sm-9">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary">Global Plate</h2>
                <p class="text-muted">Log in to your account</p>
              </div>

              <!-- メッセージ表示 / Message Display -->
              <div v-if="message" :class="messageClass" class="alert" role="alert">
                <i :class="messageIcon" class="me-2"></i>
                {{ message }}
              </div>

              <!-- ログインフォーム / Login Form -->
              <form @submit.prevent="handleEmailLogin">
                <!-- Email -->
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
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
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
                    @blur="validatePassword(true)"
                    @input="validatePassword(false)"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                    required
                  />
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                </div>

                <!-- ログインボタン / Login Button -->
                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Log in
                  </button>
                </div>

                <div class="text-center">
                  <a href="#" class="text-decoration-none">Forgot your password?</a>
                </div>
              </form>

              <hr class="my-4">

              <!-- 
                BR (D.1): External Authentication - Google OAuth ログインボタン
                Google OAuth を使用した外部認証機能を実装
                Firebase Authentication の signInWithPopup() を使用して、
                ユーザーがGoogleアカウントで簡単にログインできるようにする
                
                BR (D.1): External Authentication - Google OAuth Login Button
                Implements external authentication using Google OAuth
                Uses Firebase Authentication's signInWithPopup() to allow
                users to easily sign in with their Google account
              -->
              <div class="d-grid mb-3">
                <button @click="handleGoogleLogin" class="btn btn-outline-danger btn-lg" :disabled="isLoading">
                  <i class="fab fa-google me-2"></i>
                  Continue with Google
                </button>
              </div>

              <!-- 新規登録リンク / Sign Up Link -->
              <div class="text-center">
                <p class="mb-0">
                  Don't have an account?<br>
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
// BR (D.1): Firebase Authentication のインポート
// Email/Password認証とGoogle OAuth認証のために必要な関数をインポート
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
// Firestoreからユーザー情報を取得・保存するための関数をインポート
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

const router = useRouter()
const route = useRoute()
// BR (D.1): Firebase Authenticationインスタンスを取得
// このauthオブジェクトを使って認証操作を実行する
const auth = getAuth()

// Form data - ユーザーが入力するメールアドレスとパスワードを保持
const formData = ref({
  email: '',
  password: ''
})

// State - エラーメッセージ、通知メッセージ、ローディング状態を管理
const errors = ref({
  email: null,
  password: null
})
const message = ref('') // 成功/エラーメッセージ
const messageType = ref('success') // メッセージタイプ ('success' or 'error')
const isLoading = ref(false) // ボタンのローディング状態

// Computed - メッセージ表示用のBootstrapクラスとアイコンを動的に決定
const messageClass = computed(() => {
  return messageType.value === 'error' ? 'alert-danger' : 'alert-success'
})

const messageIcon = computed(() => {
  return messageType.value === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'
})

// Helper functions

/**
 * メッセージを表示する関数
 * @param {string} msg - 表示するメッセージ
 * @param {string} type - メッセージタイプ ('success' or 'error')
 */
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  // 5秒後に自動的にメッセージを消す
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// Validation functions

/**
 * メールアドレスのバリデーション
 * BR (B.1): Validations - メールアドレス形式の検証
 * @param {boolean} blur - blurイベント時はエラーを表示、inputイベント時は表示しない
 */
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

/**
 * パスワードのバリデーション
 * BR (B.1): Validations - パスワード長の検証
 * @param {boolean} blur - blurイベント時はエラーを表示、inputイベント時は表示しない
 */
const validatePassword = (blur) => {
  if (!formData.value.password) {
    if (blur) errors.value.password = "Password is required"
  } else if (formData.value.password.length < 6) {
    if (blur) errors.value.password = "Password must be at least 6 characters"
  } else {
    errors.value.password = null
  }
}

/**
 * Firebase エラーコードを日本語のエラーメッセージに変換
 * @param {string} errorCode - Firebase Authenticationのエラーコード
 * @returns {string} ユーザーに表示するエラーメッセージ
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
    'auth/cancelled-popup-request': 'Sign-in was cancelled'
  }
  return errorMessages[errorCode] || 'Login failed. Please try again'
}

/**
 * BR (C.1): Authentication - Email/Password ログイン処理
 * Firebase Authentication を使用してメールアドレスとパスワードでログイン
 * 成功時は自動的にFirebaseがユーザー状態を管理し、onAuthStateChangedが発火する
 */
const handleEmailLogin = async () => {
  // フォームの全フィールドを検証
  validateEmail(true)
  validatePassword(true)
  
  // エラーがない場合のみログイン処理を実行
  if (!errors.value.email && !errors.value.password) {
    isLoading.value = true
    
    try {
      // Firebase Authentication でログイン
      // signInWithEmailAndPassword は Promise を返し、成功時に UserCredential を返す
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.value.email,
        formData.value.password
      )
      
      const user = userCredential.user
      console.log('Login successful:', user)
      
      showMessage('Login successful!', 'success')
      
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
 * BR (D.1): External Authentication - Google OAuth ログイン処理
 * 
 * この関数は外部認証サービス（Google）を使用したログイン機能を実装します
 * 
 * 処理フロー:
 * 1. GoogleAuthProvider を作成し、認証ポップアップを表示
 * 2. ユーザーがGoogleアカウントでログインを承認
 * 3. Firebase Authentication にユーザー情報が自動的に登録される
 * 4. Firestoreでユーザープロフィールの存在を確認
 * 5. 初回ログインの場合、Firestoreに追加のユーザー情報を保存
 * 6. 既存ユーザーの場合、最終ログイン時刻を更新
 * 
 * メリット:
 * - パスワード管理が不要（Googleが管理）
 * - 安全で信頼性の高い認証
 * - ユーザーにとって簡単で素早いログイン体験
 */
const handleGoogleLogin = async () => {
  isLoading.value = true
  
  try {
    // GoogleAuthProvider インスタンスを作成
    // これはGoogle OAuth 2.0認証を処理するためのプロバイダー
    const provider = new GoogleAuthProvider()
    
    // カスタムパラメータを設定
    // 'select_account' を指定することで、毎回アカウント選択画面を表示
    // これにより、複数のGoogleアカウントを持つユーザーが適切なアカウントを選択できる
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    
    // signInWithPopup で認証ポップアップを表示
    // ユーザーがGoogleアカウントを選択してログインを承認すると、
    // Firebase が自動的にユーザーをアプリケーションに認証する
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    
    console.log('Google login successful:', user)
    
    // BR (D.1): Firestoreにユーザープロフィールが存在するか確認
    // Googleログインは初回でもFirebase Authenticationに自動登録されるが、
    // 追加のプロフィール情報（役割、大学など）はFirestoreに別途保存する必要がある
    const userDocRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userDocRef)
    
    // 初回ログインの場合、Firestoreにユーザー情報を保存
    if (!userDoc.exists()) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous User',
        photoURL: user.photoURL || null, // GoogleアカウントのプロフィールURL
        provider: 'google', // 認証プロバイダーを記録
        role: 'user', // BR (C.2): デフォルトの役割を設定
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      
      await setDoc(userDocRef, userData)
      console.log('New user profile created in Firestore')
    } else {
      // 既存ユーザーの場合、最終ログイン時刻のみ更新
      // merge: true を指定することで、既存のデータを保持したまま特定フィールドのみ更新
      await setDoc(userDocRef, {
        lastLogin: new Date().toISOString()
      }, { merge: true })
    }
    
    showMessage('Welcome! Signed in with Google', 'success')
    
    // リダイレクト先を決定
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
</style>