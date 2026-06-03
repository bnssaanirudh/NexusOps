"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ShieldAlert, BrainCircuit, ActivitySquare, LayoutDashboard, Settings, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Executive View", href: "/executive", icon: ActivitySquare },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "Agent Center", href: "/agents", icon: BrainCircuit },
  { name: "Maintenance Hub", href: "/maintenance", icon: ShieldAlert },
  { name: "Simulation Lab", href: "/simulation", icon: FlaskConical },
];

export function GlobalCommandBar() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-[#0F4C81] text-white shadow-md z-50">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-6 h-6 text-blue-300" />
          <Link href="/" className="font-bold text-lg tracking-wide flex items-center gap-1 hover:text-blue-200 transition-colors">
            Sentinel<span className="text-blue-300 font-medium">AI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[#1F6FEB] text-white shadow-sm" 
                    : "text-blue-100 hover:bg-blue-800/50 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <Link href="/demo" className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse-subtle"></span>
            Demo Mode
          </Link>
          <button className="text-blue-100 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
