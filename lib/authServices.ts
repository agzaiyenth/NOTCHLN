import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      phone,
      email,
      createdAt: new Date().toISOString(),
    });

    console.log("User registered and data saved successfully.");

    // Generate and store authToken in localStorage
    const tokenExpiration = new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now
    const authToken = { token: user.uid, expiresAt: tokenExpiration };
    localStorage.setItem("authToken", JSON.stringify(authToken));

    console.log("Auth token generated and stored:", authToken);
  } catch (error) {
    const firebaseError = error as any; // Cast error to any to access its properties
    console.error("Error registering user:", firebaseError);
    if (firebaseError.code === "auth/email-already-in-use") {
      throw new Error("auth/email-already-in-use");
    }
    throw firebaseError;
  }
}