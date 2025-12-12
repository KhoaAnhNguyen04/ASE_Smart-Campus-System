import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra localStorage khi component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // userData phải chứa: { username, role, email, ... }
    const userInfo = {
      username: userData.username,
      role: userData.role || "student",
      email: userData.email,
      loginTime: new Date().toISOString(),
    };
    
    setUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
    
    // Lưu thông tin tương thích với code cũ
    localStorage.setItem("userName", userInfo.username);
    localStorage.setItem("userRole", userInfo.role);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
