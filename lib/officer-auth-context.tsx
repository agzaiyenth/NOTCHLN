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
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore"
import { auth, db, isFirebaseAvailable } from "./firebase"

interface OfficerData {
  uid: string
  email: string
  firstName: string
  lastName: string
  department: string
  position: string
  employeeId: string
  phone?: string
  isApproved: boolean
  createdAt: Date
  role: "officer"
}

interface OfficerAuthContextType {
  officer: User | null
  officerData: OfficerData | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    department: string,
    position: string,
    employeeId: string,
    phone?: string,
  ) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isFirebaseReady: boolean
  isOffline: boolean
}

const OfficerAuthContext = createContext<OfficerAuthContextType | undefined>(undefined)

export function useOfficerAuth() {
  const context = useContext(OfficerAuthContext)
  if (context === undefined) {
    throw new Error("useOfficerAuth must be used within an OfficerAuthProvider")
  }
  return context
}

export function OfficerAuthProvider({ children }: { children: React.ReactNode }) {
  const [officer, setOfficer] = useState<User | null>(null)
  const [officerData, setOfficerData] = useState<OfficerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  const saveOfficerDataLocally = (data: OfficerData) => {
    try {
      localStorage.setItem("officerData", JSON.stringify(data))
    } catch (error) {
      console.warn("Failed to save officer data locally:", error)
    }
  }

  const loadOfficerDataLocally = (): OfficerData | null => {
    try {
      const stored = localStorage.getItem("officerData")
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn("Failed to load officer data locally:", error)
      return null
    }
  }

  const fetchOfficerData = async (user: User): Promise<OfficerData | null> => {
    if (!db) {
      console.warn("Firestore not available, using local data")
      return loadOfficerDataLocally()
    }

    try {
      const officerDoc = await getDoc(doc(db, "officers", user.uid))
      if (officerDoc.exists()) {
        const data = officerDoc.data() as OfficerData
        saveOfficerDataLocally(data)
        setIsOffline(false)
        return data
      }
    } catch (error: any) {
      console.warn("Firestore unavailable, using local data:", error.message)
      setIsOffline(true)
      return loadOfficerDataLocally()
    }

    return null
  }

  useEffect(() => {
    if (!isFirebaseAvailable() || !auth) {
      console.warn("Firebase not available, running in offline mode")
      setLoading(false)
      setIsFirebaseReady(false)
      setIsOffline(true)

      const localData = loadOfficerDataLocally()
      if (localData) {
        setOfficerData(localData)
      }
      return
    }

    setIsFirebaseReady(true)

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setOfficer(user)
        try {
          const data = await fetchOfficerData(user)
          setOfficerData(data)
        } catch (error) {
          console.error("Error in officer auth state change:", error)
        }
      } else {
        setOfficer(null)
        setOfficerData(null)
        try {
          localStorage.removeItem("officerData")
        } catch (error) {
          console.warn("Failed to clear local officer data:", error)
        }
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    department: string,
    position: string,
    employeeId: string,
    phone?: string,
  ) => {
    if (!auth) throw new Error("Firebase not initialized")

    // Check if employee ID already exists
    if (db) {
      try {
        const q = query(collection(db, "officers"), where("employeeId", "==", employeeId))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          throw new Error("Employee ID already exists")
        }
      } catch (error: any) {
        if (error.message !== "Employee ID already exists") {
          console.warn("Could not verify employee ID uniqueness:", error)
        } else {
          throw error
        }
      }
    }

    const { user } = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    })

    const officerData: OfficerData = {
      uid: user.uid,
      email: user.email!,
      firstName,
      lastName,
      department,
      position,
      employeeId,
      phone,
      isApproved: false, // Requires admin approval
      createdAt: new Date(),
      role: "officer",
    }

    saveOfficerDataLocally(officerData)
    setOfficerData(officerData)

    if (db) {
      try {
        await setDoc(doc(db, "officers", user.uid), officerData)
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
    officer,
    officerData,
    loading,
    signUp,
    signIn,
    logout,
    isFirebaseReady,
    isOffline,
  }

  return <OfficerAuthContext.Provider value={value}>{children}</OfficerAuthContext.Provider>
}
