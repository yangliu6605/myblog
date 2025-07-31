import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(false);

    const login = (username, password) => {
        setIsLoggedIn(true);
        setUser({ username });
    }

    return (
        <AuthContext.Provider value={{ backendUrl,isLoggedIn, setIsLoggedIn, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
