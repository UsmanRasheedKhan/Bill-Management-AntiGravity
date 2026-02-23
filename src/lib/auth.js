// src/lib/auth.js
// Dummy Auth wrapper — swap the mock user for Firebase Google Auth later.
// To upgrade: import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
// and replace the hook body with real Firebase auth logic.

"use client";
import { createContext, useContext, useState } from "react";

const MOCK_USER = {
    uid: "demo-user-001",
    displayName: "Site Manager",
    email: "manager@construction.local",
    photoURL: null,
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Replace useState with real Firebase onAuthStateChanged subscription later
    const [user] = useState(MOCK_USER);

    return (
        <AuthContext.Provider value={{ user, loading: false }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
