import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Added to prevent flicker

    // THE MORNING ROUTINE: Check for user on startup
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            // If we find them in the "drawer," put them back in the Brain
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => { // ⬅️ NEW: Accept the real token
        setUser(userData);
        // Save both to the "drawer"
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token); // ⬅️ NEW: Save the REAL token, not the fake one
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children} 
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);