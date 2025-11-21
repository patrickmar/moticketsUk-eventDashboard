"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/api/authSlice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Replace useAuth → Redux
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 flex md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-gray-900 text-white">
            <Sidebar />
          </div>
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium dark:text-white">
                      {user?.firstname || "User"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-100 dark:bg-gray-950 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
