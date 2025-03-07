"use client";

import React, { createContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if auth is disabled via environment variable
    const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

    if (isAuthDisabled) {
      // Provide a mock user when auth is disabled
      const mockUser = {
        uid: "test-user-id",
        email: "test@example.com",
        displayName: "Test User",
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null,
        phoneNumber: null,
        photoURL: null,
        providerId: "google.com",
        delete: async () => {},
        getIdToken: async () => "",
        getIdTokenResult: async () => ({
          token: "",
          signInProvider: null,
          expirationTime: "",
          issuedAtTime: "",
          authTime: "",
          claims: {},
        }),
        reload: async () => {},
        toJSON: () => ({}),
      } as unknown as User;

      setUser(mockUser);
      setLoading(false);
      return;
    }

    // Normal auth listener if auth is not disabled
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut: signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
