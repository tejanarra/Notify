import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import HomePage from "./pages/HomePage";
import NotePage from "./pages/NotePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const location = useLocation();

  // Check if the current route is '/notes/:noteId'
  const isNotePage = location.pathname.startsWith("/notes/");

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Conditionally render the Navbar */}
        {!isNotePage && <Navbar />}
        
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes/:noteId"
              element={
                <ProtectedRoute>
                  <NotePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
