<!--
  Profile Page - User profile management interface
  プロフィールページ - ユーザープロフィール管理インターフェース

  Features / 機能:
  - View and edit personal information / 個人情報の閲覧と編集
  - Real-time profile data loading from Firestore / Firestoreからのリアルタイムプロフィールデータ読み込み
  - Form validation before submission / 送信前のフォームバリデーション
  - Account information display / アカウント情報の表示
  - Password change and account deletion options / パスワード変更とアカウント削除オプション

  BR (C.1): Authentication - User authentication verification via Firebase
  BR (C.1): 認証機能 - Firebase経由でユーザー認証を検証

  BR (C.2): Role-based Authentication - Display user role (Administrator/Student Member)
  BR (C.2): ロールベース認証 - ユーザーロール（管理者/学生メンバー）を表示

  BR (B.1): Validations - Form field validation (name length validation)
  BR (B.1): バリデーション機能 - フォームフィールドの検証（名前の長さの検証）

  BR (E.3): Accessibility - ARIA labels and semantic HTML structure
  BR (E.3): アクセシビリティ - ARIAラベルとセマンティックHTML構造
-->

<template>
  <div class="profile-page">
    <div class="container-fluid px-4 py-4">
      <!-- ============================================================================
           Header Section / ヘッダーセクション
           Profile editing page title
           プロフィール編集ページのタイトル
           ============================================================================ -->
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-1">
            <i class="fas fa-user-circle me-2 text-primary" aria-hidden="true"></i>
            My Profile
          </h2>
          <p class="text-muted">Manage your account settings and preferences</p>
        </div>
      </div>

      <!-- ============================================================================
           Loading State / ローディング状態
           Display loading spinner while fetching user data from Firestore
           Firestoreからユーザーデータを取得中にローディングスピナーを表示
           ============================================================================ -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading profile...</p>
      </div>

      <!-- ============================================================================
           Profile Edit Form / プロフィール編集フォーム
           Main content area for profile management
           プロフィール管理のメインコンテンツエリア
           ============================================================================ -->
      <div v-else class="row">
        <div class="col-lg-8 mx-auto">
          <!--
            Success Message / 成功メッセージ
            Displayed when profile is successfully updated
            プロフィールが正常に更新されたときに表示
          -->
          <div
            v-if="successMessage"
            class="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            <i class="fas fa-check-circle me-2" aria-hidden="true"></i>
            {{ successMessage }}
            <button
              type="button"
              class="btn-close"
              @click="successMessage = ''"
              aria-label="Close"
            ></button>
          </div>

          <!--
            Error Message / エラーメッセージ
            Displayed when profile update fails or validation errors occur
            プロフィール更新失敗時またはバリデーションエラー発生時に表示
          -->
          <div
            v-if="errorMessage"
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
            {{ errorMessage }}
            <button
              type="button"
              class="btn-close"
              @click="errorMessage = ''"
              aria-label="Close"
            ></button>
          </div>

          <!--
            Profile Information Card / プロフィール情報カード
            Form for editing personal information
            個人情報編集用のフォーム
          -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="fas fa-id-card me-2" aria-hidden="true"></i>
                Personal Information
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateProfile">
                <!--
                  Name Fields / 名前フィールド
                  BR (B.1): Validations - Name length validation (minimum 2 characters)
                  BR (B.1): バリデーション機能 - 名前の長さの検証（最小2文字）
                -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="firstName" class="form-label"> First Name * </label>
                    <input
                      type="text"
                      class="form-control"
                      id="firstName"
                      v-model="profileData.firstName"
                      required
                      :class="{ 'is-invalid': validationErrors.firstName }"
                    />
                    <div v-if="validationErrors.firstName" class="invalid-feedback">
                      {{ validationErrors.firstName }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="lastName" class="form-label"> Last Name * </label>
                    <input
                      type="text"
                      class="form-control"
                      id="lastName"
                      v-model="profileData.lastName"
                      required
                      :class="{ 'is-invalid': validationErrors.lastName }"
                    />
                    <div v-if="validationErrors.lastName" class="invalid-feedback">
                      {{ validationErrors.lastName }}
                    </div>
                  </div>
                </div>

                <!--
                  Email Address (Read-only) / メールアドレス（読み取り専用）
                  Email cannot be changed as it's the authentication identifier
                  メールアドレスは認証識別子のため変更不可
                -->
                <div class="mb-3">
                  <label for="email" class="form-label"> Email Address </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="profileData.email"
                    readonly
                    disabled
                  />
                  <small class="text-muted">Email cannot be changed</small>
                </div>

                <!--
                  Country and University / 国と大学
                  Optional fields for user demographics
                  ユーザーの人口統計情報のオプションフィールド
                -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="country" class="form-label"> Country </label>
                    <select class="form-select" id="country" v-model="profileData.country">
                      <option value="">Select a country</option>
                      <option value="Japan">Japan</option>
                      <option value="China">China</option>
                      <option value="Korea">Korea</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="India">India</option>
                      <option value="Australia">Australia</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="university" class="form-label"> University </label>
                    <input
                      type="text"
                      class="form-control"
                      id="university"
                      v-model="profileData.university"
                      placeholder="e.g., Monash University"
                    />
                  </div>
                </div>

                <!--
                  Bio / 自己紹介
                  Textarea for user's self-introduction with character limit
                  文字数制限付きユーザー自己紹介用のテキストエリア
                -->
                <div class="mb-3">
                  <label for="bio" class="form-label"> About Me </label>
                  <textarea
                    class="form-control"
                    id="bio"
                    v-model="profileData.bio"
                    rows="4"
                    placeholder="Tell us about yourself..."
                    maxlength="500"
                  ></textarea>
                  <small class="text-muted">
                    {{ profileData.bio?.length || 0 }}/500 characters
                  </small>
                </div>

                <!--
                  Submit Button / 送信ボタン
                  Saves profile changes to Firestore
                  プロフィール変更をFirestoreに保存
                -->
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <router-link to="/dashboard" class="btn btn-outline-secondary">
                    <i class="fas fa-times me-2" aria-hidden="true"></i>
                    Cancel
                  </router-link>
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    <span v-if="isSaving">
                      <span
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </span>
                    <span v-else>
                      <i class="fas fa-save me-2" aria-hidden="true"></i>
                      Save Changes
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!--
            Account Information Card / アカウント情報カード
            BR (C.2): Role-based Authentication - Displays user role
            BR (C.2): ロールベース認証 - ユーザーロールを表示

            Shows read-only account details including user ID, role, and timestamps
            ユーザーID、ロール、タイムスタンプを含む読み取り専用のアカウント詳細を表示
          -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-secondary text-white">
              <h5 class="mb-0">
                <i class="fas fa-info-circle me-2" aria-hidden="true"></i>
                Account Information
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <!-- User ID / ユーザーID -->
                <div class="col-md-6 mb-3">
                  <p>
                    <strong>User ID:</strong><br />
                    <code>{{ currentUser?.uid }}</code>
                  </p>
                </div>

                <!--
                  Role Display / ロール表示
                  BR (C.2): Shows user's role with color-coded badge
                  BR (C.2): 色分けされたバッジでユーザーのロールを表示
                -->
                <div class="col-md-6 mb-3">
                  <p>
                    <strong>Role:</strong><br />
                    <span class="badge" :class="getRoleBadgeClass(profileData.role)">
                      {{ getRoleDisplay(profileData.role) }}
                    </span>
                  </p>
                </div>

                <!-- Account Creation Date / アカウント作成日 -->
                <div class="col-md-6 mb-3">
                  <p>
                    <strong>Member Since:</strong><br />
                    {{ formatDate(profileData.createdAt) }}
                  </p>
                </div>

                <!-- Last Update Date / 最終更新日 -->
                <div class="col-md-6 mb-3">
                  <p>
                    <strong>Last Updated:</strong><br />
                    {{ formatDate(profileData.updatedAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!--
            Account Settings Card (Danger Zone) / アカウント設定カード（危険ゾーン）
            Contains sensitive account operations like password change and account deletion
            パスワード変更やアカウント削除などの機密性の高いアカウント操作を含む
          -->
          <div class="card shadow-sm">
            <div class="card-header bg-warning text-dark">
              <h5 class="mb-0">
                <i class="fas fa-exclamation-triangle me-2" aria-hidden="true"></i>
                Danger Zone
              </h5>
            </div>
            <div class="card-body">
              <!--
                Password Change Option / パスワード変更オプション
                Provides instructions for changing password via password reset flow
                パスワードリセットフローを介したパスワード変更の手順を提供
              -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 class="mb-1">Change Password</h6>
                  <p class="text-muted mb-0 small">
                    Update your password to keep your account secure
                  </p>
                </div>
                <button class="btn btn-outline-warning" @click="showPasswordChangeInfo">
                  <i class="fas fa-key me-2" aria-hidden="true"></i>
                  Change
                </button>
              </div>
              <hr />

              <!--
                Account Deletion Option / アカウント削除オプション
                Warns users about permanent data deletion
                永久的なデータ削除についてユーザーに警告
              -->
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-1 text-danger">Delete Account</h6>
                  <p class="text-muted mb-0 small">Permanently delete your account and all data</p>
                </div>
                <button class="btn btn-outline-danger" @click="showDeleteAccountWarning">
                  <i class="fas fa-trash me-2" aria-hidden="true"></i>
                  Delete
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/init'

// ============================================================================
// State Management / 状態管理
// ============================================================================
const router = useRouter()
const auth = getAuth()

const loading = ref(true) // Loading state / ローディング状態
const isSaving = ref(false) // Saving state / 保存中状態
const successMessage = ref('') // Success message / 成功メッセージ
const errorMessage = ref('') // Error message / エラーメッセージ
const currentUser = ref(null) // Current authenticated user / 現在の認証ユーザー

// Profile Data / プロフィールデータ
// Reactive object containing all user profile information
// すべてのユーザープロフィール情報を含むリアクティブオブジェクト
const profileData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  country: '',
  university: '',
  bio: '',
  role: 'user',
  createdAt: null,
  updatedAt: null,
})

// BR (B.1): Validation Errors / バリデーションエラー
// Stores validation error messages for form fields
// フォームフィールドのバリデーションエラーメッセージを保存
const validationErrors = reactive({
  firstName: '',
  lastName: '',
})

// ============================================================================
// Methods / メソッド
// ============================================================================

/**
 * Load user profile from Firestore / Firestoreからユーザープロフィールを読み込む
 *
 * Fetches user document from Firestore and populates profileData
 * Firestoreからユーザードキュメントを取得し、profileDataに入力する
 *
 * @param {string} uid - User ID / ユーザーID
 */
const loadUserProfile = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const data = userDoc.data()

      // Set profile data / プロフィールデータを設定
      profileData.firstName = data.firstName || ''
      profileData.lastName = data.lastName || ''
      profileData.email = data.email || ''
      profileData.country = data.country || ''
      profileData.university = data.university || ''
      profileData.bio = data.bio || ''
      profileData.role = data.role || 'user'
      profileData.createdAt = data.createdAt
      profileData.updatedAt = data.updatedAt

      console.log('Profile loaded successfully')
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    errorMessage.value = 'Failed to load profile data'
  } finally {
    loading.value = false
  }
}

/**
 * BR (B.1): Validations - Form validation before submission
 * BR (B.1): バリデーション機能 - 送信前のフォームバリデーション
 *
 * Validates form fields (name length) before allowing profile update
 * プロフィール更新を許可する前にフォームフィールド（名前の長さ）を検証
 *
 * @returns {boolean} True if form is valid / フォームが有効な場合はtrue
 */
const validateForm = () => {
  let isValid = true

  // Name validation / 名前のバリデーション
  validationErrors.firstName = ''
  validationErrors.lastName = ''

  if (!profileData.firstName || profileData.firstName.trim().length < 2) {
    validationErrors.firstName = 'First name must be at least 2 characters'
    isValid = false
  }

  if (!profileData.lastName || profileData.lastName.trim().length < 2) {
    validationErrors.lastName = 'Last name must be at least 2 characters'
    isValid = false
  }

  return isValid
}

/**
 * Update profile / プロフィールを更新
 *
 * Updates user document in Firestore with new profile data
 * 新しいプロフィールデータでFirestoreのユーザードキュメントを更新
 *
 * Process / 処理:
 * 1. Validate form fields / フォームフィールドを検証
 * 2. Update Firestore document / Firestoreドキュメントを更新
 * 3. Show success message / 成功メッセージを表示
 * 4. Redirect to dashboard / ダッシュボードにリダイレクト
 */
const updateProfile = async () => {
  // Validation / バリデーション
  if (!validateForm()) {
    errorMessage.value = 'Please fix the errors before saving'
    return
  }

  isSaving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const userDocRef = doc(db, 'users', currentUser.value.uid)

    // Update Firestore / Firestoreを更新
    await updateDoc(userDocRef, {
      firstName: profileData.firstName.trim(),
      lastName: profileData.lastName.trim(),
      country: profileData.country,
      university: profileData.university.trim(),
      bio: profileData.bio.trim(),
      updatedAt: serverTimestamp(),
    })

    successMessage.value = 'Profile updated successfully!'

    // Redirect to dashboard after 3 seconds / 3秒後にダッシュボードにリダイレクト
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  } catch (error) {
    console.error('Error updating profile:', error)
    errorMessage.value = 'Failed to update profile. Please try again.'
  } finally {
    isSaving.value = false
  }
}

/**
 * Show password change information / パスワード変更の案内を表示
 *
 * Displays instructions for changing password via password reset flow
 * パスワードリセットフローを介したパスワード変更の手順を表示
 */
const showPasswordChangeInfo = () => {
  alert(
    'To change your password, please:\n\n1. Log out\n2. Click "Forgot Password" on the login page\n3. Follow the instructions sent to your email',
  )
}

/**
 * Show account deletion warning / アカウント削除の警告を表示
 *
 * Warns users about permanent data loss before account deletion
 * アカウント削除前に永久的なデータ損失についてユーザーに警告
 */
const showDeleteAccountWarning = () => {
  const confirmed = confirm(
    'WARNING: This action cannot be undone!\n\n' +
      'Deleting your account will permanently remove:\n' +
      '- Your profile information\n' +
      '- All your recipes\n' +
      '- Your event bookings\n' +
      '- Your group memberships\n\n' +
      'Are you sure you want to continue?',
  )

  if (confirmed) {
    alert(
      'Account deletion feature is not yet implemented.\nPlease contact support for assistance.',
    )
  }
}

// ============================================================================
// Utility Functions / ユーティリティ関数
// ============================================================================

/**
 * BR (C.2): Get role badge class / ロールバッジのクラスを取得
 *
 * Returns CSS class for role badge based on user role
 * ユーザーロールに基づいてロールバッジのCSSクラスを返す
 *
 * @param {string} role - User role / ユーザーロール
 * @returns {string} CSS class / CSSクラス
 */
const getRoleBadgeClass = (role) => {
  return role === 'admin' ? 'bg-warning text-dark' : 'bg-primary'
}

/**
 * BR (C.2): Get role display name / ロールの表示名を取得
 *
 * Converts role code to user-friendly display name
 * ロールコードをユーザーフレンドリーな表示名に変換
 *
 * @param {string} role - User role / ユーザーロール
 * @returns {string} Display name / 表示名
 */
const getRoleDisplay = (role) => {
  return role === 'admin' ? 'Administrator' : 'Student Member'
}

/**
 * Format date / 日付フォーマット
 *
 * Converts Firestore Timestamp to readable date string
 * Firestore Timestampを読みやすい日付文字列に変換
 *
 * @param {object} timestamp - Firestore Timestamp / Firestore Timestamp
 * @returns {string} Formatted date string / フォーマットされた日付文字列
 */
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    return 'Unknown'
  }
}

// ============================================================================
// Lifecycle Hooks / ライフサイクルフック
// ============================================================================

/**
 * On Component Mount / コンポーネントマウント時
 *
 * BR (C.1): Authentication - Monitors authentication state
 * BR (C.1): 認証機能 - 認証状態を監視
 *
 * Sets up authentication state listener and loads user profile
 * Redirects to login page if user is not authenticated
 *
 * 認証状態リスナーを設定し、ユーザープロフィールを読み込む
 * ユーザーが認証されていない場合、ログインページにリダイレクト
 */
onMounted(() => {
  // Monitor authentication state / 認証状態を監視
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser.value = user
      await loadUserProfile(user.uid)
    } else {
      // Redirect to login page if not authenticated
      // 未認証の場合はログインページへリダイレクト
      router.push('/login')
    }
  })
})
</script>

<style scoped>
/* Overall page layout / ページ全体のレイアウト */
.profile-page {
  padding-top: 3.5em;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Desktop support / デスクトップ対応 */
@media (min-width: 992px) {
  .profile-page {
    margin-left: 4.5em;
    transition: margin-left 0.2s ease;
  }
}

/* Mobile support / モバイル対応 */
@media (max-width: 768px) {
  .profile-page {
    padding-bottom: 4em;
  }
}

/* Card animation / カードのアニメーション */
.card {
  border: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Form control focus / フォームコントロールのフォーカス */
.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Checkbox style / チェックボックスのスタイル */
.form-check-input:checked {
  background-color: #007bff;
  border-color: #007bff;
}

/* Button hover effect / ボタンのホバー効果 */
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

/* Alert animation / アラートのアニメーション */
.alert {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
