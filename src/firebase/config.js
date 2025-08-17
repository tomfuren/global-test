import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Firebase設定 - 環境変数から読み込み（セキュリティ向上）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAAAnZw9FhMc4iVfGro1buLVCVvC8Cyd2Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "global-plate-dev.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "global-plate-dev",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "global-plate-dev.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1021496007378",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1021496007378:web:4770893cb90e9125952b0b"
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Firebase サービスのエクスポート
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// デフォルトエクスポート
export default app;

// 開発環境での確認
if (import.meta.env.DEV) {
  console.log('🔥 Firebase initialized successfully');
  console.log('📝 Project ID:', firebaseConfig.projectId);
  console.log('🔐 Using environment variables:', !!import.meta.env.VITE_FIREBASE_API_KEY);
}