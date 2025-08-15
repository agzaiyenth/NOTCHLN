import { db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const auth = getAuth();

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

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      phone,
      email,
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
    await signInWithEmailAndPassword(auth, email, password);
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