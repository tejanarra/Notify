import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}