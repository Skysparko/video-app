import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import api from "../config/axios.config";

interface AuthContextProps {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (tokenId: string) => Promise<void>; // Added Google login method
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default to false
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if a valid token exists in local storage and fetch user details
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally fetch user details if needed
      api
        .get("auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setUserEmail(response.data.email);
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }else{
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      setUserEmail(email);
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
    }
  };

  const googleLogin = async (tokenId: string) => {
    try {
      const response = await api.post("auth/google", { idToken: tokenId });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      setUserEmail(response.data.email); // Assuming the response contains email
    } catch (error) {
      console.error("Google login failed:", error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
