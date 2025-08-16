"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db, isFirebaseAvailable } from "./firebase"

interface UserData {
  uid: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signUp: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isFirebaseReady: boolean
  isOffline: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  const saveUserDataLocally = (data: UserData) => {
    try {
      localStorage.setItem("userData", JSON.stringify(data))
    } catch (error) {
      console.warn("Failed to save user data locally:", error)
    }
  }

  const loadUserDataLocally = (): UserData | null => {
    try {
      const stored = localStorage.getItem("userData")
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn("Failed to load user data locally:", error)
      return null
    }
  }

  const fetchUserData = async (user: User): Promise<UserData | null> => {
    if (!db) {
      console.warn("Firestore not available, using local data")
      return loadUserDataLocally()
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData
        saveUserDataLocally(data) // Save to localStorage as backup
        setIsOffline(false)
        return data
      }
    } catch (error: any) {
      console.warn("Firestore unavailable, using local data:", error.message)
      setIsOffline(true)

      const localData = loadUserDataLocally()
      if (localData && localData.uid === user.uid) {
        return localData
      }

      const fallbackData: UserData = {
        uid: user.uid,
        email: user.email || "",
        firstName: user.displayName?.split(" ")[0] || "User",
        lastName: user.displayName?.split(" ")[1] || "",
        createdAt: new Date(),
      }
      saveUserDataLocally(fallbackData)
      return fallbackData
    }

    return null
  }

  useEffect(() => {
    if (!isFirebaseAvailable() || !auth) {
      console.warn("Firebase not available, running in offline mode")
      setLoading(false)
      setIsFirebaseReady(false)
      setIsOffline(true)

      const localData = loadUserDataLocally()
      if (localData) {
        setUserData(localData)
      }
      return
    }

    setIsFirebaseReady(true)

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        try {
          const data = await fetchUserData(user)
          setUserData(data)
        } catch (error) {
          console.error("Error in auth state change:", error)
        }
      } else {
        setUser(null)
        setUserData(null)
        try {
          localStorage.removeItem("userData")
        } catch (error) {
          console.warn("Failed to clear local data:", error)
        }
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    if (!auth) throw new Error("Firebase not initialized")

    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    })

    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      firstName,
      lastName,
      phone,
      createdAt: new Date(),
    }

    saveUserDataLocally(userData)
    setUserData(userData)

    if (db) {
      try {
        await setDoc(doc(db, "users", user.uid), userData)
        setIsOffline(false)
      } catch (error) {
        console.warn("Failed to save to Firestore, data saved locally:", error)
        setIsOffline(true)
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not initialized")
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    if (!auth) throw new Error("Firebase not initialized")
    await signOut(auth)
  }

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    logout,
    isFirebaseReady,
    isOffline,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
