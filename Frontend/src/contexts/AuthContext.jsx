import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
      
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || '';
      });

    
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                
                if (storedUser && token) {
                    
                    // const response = await axios.get("http://localhost:4000/api/user/verify", {
                    //     withCredentials: true
                    // });

                    // if (response.data.success) {
                       
                    //     setUser(JSON.parse(storedUser));
                    // } else {
                        
                    //     localStorage.removeItem("user");
                    //     setUser(null);
                    // }
                    setUser(storedUser)
                }
            } catch (error) {
                console.error("Auth verification failed:", error);
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = async (userData) => {
        try {
            localStorage.setItem("user", JSON.stringify(userData.data));
            setUser(userData.data);
            setToken(userData.token);
            localStorage.setItem("token",userData.token);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setToken(null);
            localStorage.removeItem("token");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("user");
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                setUser,
                token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};