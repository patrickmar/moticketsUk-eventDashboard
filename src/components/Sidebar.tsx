"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  BarChart,
  Settings,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/screen/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  { name: "Events", href: "/events", icon: <Calendar size={18} /> },
  { name: "Tickets", href: "/tickets", icon: <Ticket size={18} /> },
  { name: "Analytics", href: "/analytics", icon: <BarChart size={18} /> },
  { name: "Settings", href: "/settings", icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const [active, setActive] = useState("/");

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
      <div className="p-6 text-2xl font-bold tracking-tight">Motickets</div>
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setActive(item.href)}
            className={cn(
              "group flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors",
              active === item.href ? "bg-gray-800 text-white" : "text-gray-400"
            )}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 text-xs text-gray-600">© 2025 Motickets</div>
    </aside>
  );
}
