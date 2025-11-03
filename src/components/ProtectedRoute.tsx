// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import LoginComponent from "@/app/(routes)/login/page";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        // Check if user has auth token in localStorage
        const token = localStorage.getItem("authToken");
        // You can add additional validation here (e.g., token expiry)
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginComponent />;
  }

  return <>{children}</>;
}
