import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//  axios instance (exported)
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load and validate token
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwtDecode<{ exp: number }>(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (isTokenExpired) {
          logout();
        } else {
          axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        logout();
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/auth/login", { email, password });

      const { token, user: userData } = res.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
      setUser(userData);
      toast.success("Login successful");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await axiosInstance.post("/auth/signup", { name, email, password });
      toast.success("Registration successful. Please login.");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    delete axiosInstance.defaults.headers["Authorization"];
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
