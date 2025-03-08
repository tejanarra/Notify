import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [emailForPasswordReset, setEmailForPasswordReset] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/notes");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/notes");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    const authInstance = getAuth();
    try {
      await sendPasswordResetEmail(authInstance, emailForPasswordReset);
      setError("");
      alert("Password reset email sent! Please check your inbox.");
      setIsForgotPassword(false);
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <div className="h-full bg-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-30 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-fuchsia-600/10"></div>
      </div>
      
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8 max-h-[calc(100vh-8rem)] overflow-y-auto relative z-10 border border-pink-500/30">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600">
            Notify
          </h2>
          <h3 className="text-2xl font-semibold text-white mt-4">Welcome Back</h3>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-pink-500/20 text-pink-300 rounded-lg border border-pink-500/30">
            {error}
          </div>
        )}

        {!isForgotPassword ? (
          <>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40"
              >
                Sign In
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="px-4 text-gray-400 text-sm">
                Or continue with
              </span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 border border-gray-700 hover:border-pink-500/50 text-gray-300 py-3 px-4 rounded-lg font-medium transition-all hover:bg-gray-800/80"
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
              Sign in with Google
            </button>

            <p className="text-center mt-6 text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600 hover:text-pink-400 font-semibold"
              >
                Sign up
              </Link>
            </p>

            <p className="text-center mt-2 text-gray-400">
              <button
                onClick={() => setIsForgotPassword(true)}
                className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600 hover:text-pink-400 font-semibold"
              >
                Forgot password?
              </button>
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-white text-center mb-4">
              Reset Your Password
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter your email address to receive a password reset link
              </label>
              <input
                type="email"
                value={emailForPasswordReset}
                onChange={(e) => setEmailForPasswordReset(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all"
                placeholder="name@example.com"
              />
            </div>

            <button
              onClick={handleForgotPassword}
              className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 mt-4"
            >
              Send Password Reset Link
            </button>

            <p className="text-center mt-6 text-gray-400">
              Remember your password?{" "}
              <button
                onClick={() => setIsForgotPassword(false)}
                className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-600 hover:text-pink-400 font-semibold"
              >
                Back to login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}