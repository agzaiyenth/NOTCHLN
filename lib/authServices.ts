import { db, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Registers a new user using Firebase Authentication and saves user data in Firestore.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} phone - The user's phone number.
 * @returns {Promise<void>} - Resolves when the user is successfully registered and data is saved.
 */
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string
) {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set displayName in Firebase Auth
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Save user data in Firestore with role as 'user'
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      phone,
      email,
      role: "user", // Assign role as 'user'
      createdAt: new Date().toISOString(),
    });

    console.log("User registered and data saved successfully.");
  } catch (error) {
    const firebaseError = error as any; // Cast error to any to access its properties
    console.error("Error registering user:", firebaseError);
    if (firebaseError.code === "auth/email-already-in-use") {
      throw new Error("auth/email-already-in-use");
    }
    throw firebaseError;
  }
}

/**
 * Logs in a user using Firebase Authentication.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<void>} - Resolves when the user is successfully logged in.
 */
export async function loginUser(email: string, password: string): Promise<void> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check the role in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role !== "user") {
        throw new Error("This portal is only for users. Please try the officer portal.");
      }
    } else {
      throw new Error("User data not found in Firestore.");
    }

    console.log("User logged in successfully.");
  } catch (error) {
    const firebaseError = error as any; // Cast error to any to access its properties
    console.error("Error logging in user:", firebaseError);
    if (firebaseError.code === "auth/invalid-credential") {
      throw new Error("auth/invalid-credential");
    }
    throw firebaseError;
  }
}

/**
 * Signs up or logs in a user using Google Authentication and saves user data to Firestore.
 * @returns {Promise<void>} - Resolves when the user is successfully signed in and data is saved.
 */
export async function signUpWithGoogle(): Promise<void> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      const { displayName, email, phoneNumber } = user;
      const [firstName, lastName] = displayName ? displayName.split(" ") : ["", ""];

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        phone: phoneNumber || "",
      });

      console.log("User signed in with Google and data saved to Firestore successfully.");
    }
  } catch (error) {
    const firebaseError = error as any; // Cast error to any to access its properties
    console.error("Error signing in with Google:", firebaseError);
    throw firebaseError;
  }
}

export const monitorAuthState = (
  onUserLoggedIn: (user: any) => void,
  onUserLoggedOut: () => void
) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      onUserLoggedIn(user);
    } else {
      // User is signed out
      onUserLoggedOut();
    }
  });
};

export const getIdToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  throw new Error("No user is currently signed in.");
};

/**
 * Signs out the currently logged-in user.
 * @returns {Promise<void>} - Resolves when the user is successfully signed out.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out user:", error);
    throw error;
  }
}