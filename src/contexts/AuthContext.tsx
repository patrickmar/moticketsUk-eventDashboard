// contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  email: string;
  fullname: string;
  accountName: string;
  accountNo: string;
  bank: string;
  hostid: string;
  // Add other fields from your API response
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (userId) {
        const userData = localStorage.getItem("userData");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("userId");
      localStorage.removeItem("userData");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch(
        "https://moloyal.com/test/mosave/script/api/eventhost/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login response:", data);

      if (data.id && data.email) {
        const userData: User = {
          id: data.id,
          email: data.email,
          fullname: data.fullname,
          accountName: data.accountName,
          accountNo: data.accountNo,
          bank: data.bank,
          hostid: data.hostid,
        };

        localStorage.setItem("userId", data.id);
        localStorage.setItem("userData", JSON.stringify(userData));

        setUser(userData);
        toast.success(data.message || "Login successful!");
        return true;
      } else {
        toast.error(data.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your connection and try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
