import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Firebase設定 - 環境変数から読み込み（セキュリティ向上）
// Firebase settings - read from environment variables (improved security)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebaseアプリの初期化
// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Firebase サービスのエクスポート
// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// デフォルトエクスポート
// Default export
export default app;

// 開発環境での確認
// Check in development environment
if (import.meta.env.DEV) {
  console.log('Firebase initialized successfully');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Using environment variables:', !!import.meta.env.VITE_FIREBASE_API_KEY);
}