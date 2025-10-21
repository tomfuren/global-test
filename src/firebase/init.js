// =============================================================================
// Firebase Initialization Configuration
// Firebase初期化設定
//
// This file initializes Firebase services for the Global Plate application,
// including Authentication, Firestore, Storage, and Cloud Functions.
// このファイルは、Global PlateアプリケーションのFirebaseサービスを初期化し、
// 認証、Firestore、Storage、Cloud Functionsを含みます。
//
// Features / 機能:
// - Secure configuration using environment variables / 環境変数を使用した安全な設定
// - Firebase Authentication initialization / Firebase認証の初期化
// - Firestore database connection / Firestoreデータベース接続
// - Cloud Storage integration / Cloud Storage統合
// - Cloud Functions connectivity / Cloud Functions接続
// - Development environment logging / 開発環境ログ記録
//
// Security Best Practices / セキュリティベストプラクティス:
// - API keys and credentials stored in .env file / APIキーと認証情報を.envファイルに保存
// - No hardcoded sensitive information / 機密情報のハードコーディングなし
// - Environment-specific configuration / 環境固有の設定
//
// Environment Variables Required / 必要な環境変数:
// - VITE_FIREBASE_API_KEY: Firebase API key / Firebase APIキー
// - VITE_FIREBASE_AUTH_DOMAIN: Authentication domain / 認証ドメイン
// - VITE_FIREBASE_PROJECT_ID: Firebase project ID / FirebaseプロジェクトID
// - VITE_FIREBASE_STORAGE_BUCKET: Storage bucket name / Storageバケット名
// - VITE_FIREBASE_MESSAGING_SENDER_ID: Messaging sender ID / メッセージング送信者ID
// - VITE_FIREBASE_APP_ID: Firebase app ID / FirebaseアプリID
// - VITE_FIREBASE_MEASUREMENT_ID: Analytics measurement ID / Analytics測定ID
//
// BR References / BR参照:
// - BR (C.1): Firebase Authentication - User authentication system / ユーザー認証システム
// - BR (C.2): Firestore Database - Data storage and retrieval / データ保存と取得
// - BR (D.1): Cloud Storage - File upload and management / ファイルアップロードと管理
// - BR (D.2): Cloud Functions - Backend API services / バックエンドAPIサービス
// =============================================================================

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

// =============================================================================
// Firebase Configuration / Firebase設定
// =============================================================================

/**
 * Firebase project configuration object
 * Firebaseプロジェクト設定オブジェクト
 *
 * Loads all configuration values from environment variables for security
 * セキュリティのため、すべての設定値を環境変数から読み込み
 *
 * Security: Never commit .env files to version control
 * セキュリティ: .envファイルをバージョン管理にコミットしない
 *
 * Note: VITE_ prefix is required for Vite to expose env variables to client
 * 注: Viteがクライアントに環境変数を公開するにはVITE_プレフィックスが必要
 */
const firebaseConfig = {
  // Firebase API key for client authentication / クライアント認証用のFirebase APIキー
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // Authentication domain for OAuth redirects / OAuthリダイレクト用の認証ドメイン
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // Unique Firebase project identifier / 一意のFirebaseプロジェクト識別子
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // Cloud Storage bucket name / Cloud Storageバケット名
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // Firebase Cloud Messaging sender ID / Firebase Cloud Messaging送信者ID
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // Firebase application ID / FirebaseアプリケーションID
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Google Analytics measurement ID / Google Analytics測定ID
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// =============================================================================
// Firebase App Initialization / Firebaseアプリ初期化
// =============================================================================

/**
 * Initialize Firebase application with configuration
 * 設定を使用してFirebaseアプリケーションを初期化
 *
 * This is the root Firebase instance that all services connect to
 * これはすべてのサービスが接続するルートFirebaseインスタンスです
 */
const app = initializeApp(firebaseConfig)

// =============================================================================
// Firebase Services Export / Firebaseサービスのエクスポート
// =============================================================================

/**
 * BR (C.2): Firestore Database Instance
 * BR (C.2): Firestoreデータベースインスタンス
 *
 * NoSQL cloud database for storing and syncing data
 * データの保存と同期のためのNoSQLクラウドデータベース
 *
 * Used for / 使用目的:
 * - User profiles and settings / ユーザープロフィールと設定
 * - Recipes and recipe details / レシピとレシピ詳細
 * - Events and event registrations / イベントとイベント登録
 * - Groups and group memberships / グループとグループメンバーシップ
 * - Ratings and reviews / 評価とレビュー
 * - Real-time data synchronization / リアルタイムデータ同期
 */
export const db = getFirestore(app)

/**
 * BR (C.1): Firebase Authentication Instance
 * BR (C.1): Firebase認証インスタンス
 *
 * Authentication service for user sign-in and management
 * ユーザーサインインと管理のための認証サービス
 *
 * Supports / サポート:
 * - Email/password authentication / メール/パスワード認証
 * - Google OAuth integration / Google OAuth統合
 * - User session management / ユーザーセッション管理
 * - Password reset functionality / パスワードリセット機能
 * - User profile management / ユーザープロフィール管理
 */
export const auth = getAuth(app)

/**
 * BR (D.1): Cloud Storage Instance
 * BR (D.1): Cloud Storageインスタンス
 *
 * File storage service for user-generated content
 * ユーザー生成コンテンツのためのファイルストレージサービス
 *
 * Used for / 使用目的:
 * - Recipe images and photos / レシピ画像と写真
 * - User profile pictures / ユーザープロフィール写真
 * - Event banners and media / イベントバナーとメディア
 * - Document attachments / ドキュメント添付ファイル
 * - Secure file upload and retrieval / 安全なファイルアップロードと取得
 */
export const storage = getStorage(app)

/**
 * BR (D.2): Cloud Functions Instance
 * BR (D.2): Cloud Functionsインスタンス
 *
 * Serverless functions for backend logic and API endpoints
 * バックエンドロジックとAPIエンドポイント用のサーバーレス関数
 *
 * Used for / 使用目的:
 * - Email sending via SendGrid / SendGrid経由のメール送信
 * - Bulk email operations / 一括メール操作
 * - Data aggregation and statistics / データ集約と統計
 * - Collection counting (users, recipes, events, groups) / コレクションカウント
 * - Server-side validation / サーバー側検証
 * - Background tasks / バックグラウンドタスク
 */
export const functions = getFunctions(app)

// =============================================================================
// Default Export / デフォルトエクスポート
// =============================================================================

/**
 * Export Firebase app instance as default
 * Firebaseアプリインスタンスをデフォルトとしてエクスポート
 *
 * Allows importing the base app for advanced configurations
 * 高度な設定のためにベースアプリのインポートを許可
 */
export default app

// =============================================================================
// Development Environment Logging / 開発環境ログ記録
// =============================================================================

/**
 * Development environment diagnostics
 * 開発環境診断
 *
 * Logs Firebase initialization status in development mode only
 * 開発モードでのみFirebase初期化状態をログ記録
 *
 * Helps developers verify:
 * 開発者が検証するのに役立つ:
 * - Firebase is properly initialized / Firebaseが適切に初期化されている
 * - Correct project is connected / 正しいプロジェクトが接続されている
 * - Environment variables are loaded / 環境変数が読み込まれている
 *
 * Note: These logs are automatically stripped in production builds
 * 注: これらのログは本番ビルドで自動的に削除されます
 */
if (import.meta.env.DEV) {
  console.log('Firebase initialized successfully')
  console.log('Project ID:', firebaseConfig.projectId)
  console.log('Using environment variables:', !!import.meta.env.VITE_FIREBASE_API_KEY)
}
