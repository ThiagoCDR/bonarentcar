import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for logged in user on mount
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const loggedUser = await authService.login(email, password);
        setUser(loggedUser);
        return loggedUser;
    };

    const register = async (name, email, password) => {
        const newUser = await authService.register(name, email, password);
        setUser(newUser);
        return newUser;
    };

    const loginWithGoogle = async (token) => {
        const loggedUser = await authService.googleLogin(token);
        setUser(loggedUser);
        return loggedUser;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
