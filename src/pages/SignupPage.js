import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../firebase";
import { ref, set } from "firebase/database";
import { database, auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle signup with email/password
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Sign up the user using email/password
      await signUp(email, password);
      const user = auth.currentUser;

      // Store the user's email and other details in Firebase Realtime Database
      if (user) {
        await set(ref(database, `users/${user.uid}`), {
          email: user.email,
          username: user.email.split("@")[0], // Use email prefix as username
          onlineStatus: true,
          notes: {},
          collaborating: {},
        });
      }

      navigate("/notes");
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle signup with Google OAuth
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store the user's data (email, username, profile picture) in Firebase Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        username: user.displayName || user.email.split("@")[0], // Use display name or email prefix as username
        profilePic: user.photoURL, // Use profile picture URL from Google
        onlineStatus: true,
        notes: {},
        collaborating: {},
      });

      navigate("/notes");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full mt-5 flex items-center justify-center p-4">
      {" "}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 ">
        {" "}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create New Account
          </h2>
        </div>
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-sm"
          >
            Create Account
          </button>
        </form>
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-gray-500 text-sm">Or continue with</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Sign up with Google
        </button>
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
