import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Initialize Firebase only on client side
let firebaseInitialized = false
let initializationError: string | null = null

const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
]

let app: any = null
let clientAuth: any = null
let clientDb: any = null
let clientStorage: any = null

// Ensure Firebase is initialized on both server and client
if (!firebaseInitialized) {
  try {
    const hasValidConfig = Object.values(firebaseConfig).every((value) => value && value.length > 0)

    if (!hasValidConfig) {
      throw new Error("Invalid Firebase configuration values")
    }

    app = initializeApp(firebaseConfig)
    clientAuth = getAuth(app)
    clientDb = getFirestore(app)
    clientStorage = getStorage(app)
    firebaseInitialized = true
  } catch (error) {
    initializationError = `Firebase initialization failed: ${error}`
  }
}

export { app }

export const auth = firebaseInitialized ? clientAuth : null
export const db = firebaseInitialized ? clientDb : null
export const storage = firebaseInitialized ? clientStorage : null

// Export initialization status
export const isFirebaseAvailable = () => firebaseInitialized
export const getFirebaseError = () => initializationError

export const safeFirebaseOperation = async (operation: () => Promise<any>, fallback: any = null) => {
  if (!firebaseInitialized) {
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.error("Firebase operation failed:", error)
    return fallback
  }
}
