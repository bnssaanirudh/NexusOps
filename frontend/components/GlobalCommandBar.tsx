"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ShieldAlert, BrainCircuit, ActivitySquare, LayoutDashboard, FlaskConical, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Executive", href: "/executive", icon: ActivitySquare },
  { name: "Analytics", href: "/analytics", icon: Activity },
  { name: "Agents", href: "/agents", icon: BrainCircuit },
  { name: "Maintenance", href: "/maintenance", icon: ShieldAlert },
  { name: "Simulation", href: "/simulation", icon: FlaskConical },
];

export function GlobalCommandBar() {
  const pathname = usePathname();

  // Hide navbar on landing page — it has its own nav
  if (pathname === "/") return null;

  return (
    <header
      style={{
        backgroundColor: '#F2EEE8',
        borderBottom: '1px solid #DDD5C8',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Branding */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              background: '#1C1A18',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu style={{ width: '14px', height: '14px', color: '#F2EEE8' }} />
          </div>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '-0.02em',
              color: '#1C1A18',
            }}
          >
            Nexus<span style={{ color: '#C07C2A' }}>Ops</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#1C1A18' : '#6B6158',
                  backgroundColor: isActive ? '#DDD5C8' : 'transparent',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease, background 0.15s ease',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = '#1C1A18';
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#E8E2D9';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = '#6B6158';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon style={{ width: '13px', height: '13px' }} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              border: '1px solid rgba(58, 107, 74, 0.25)',
              backgroundColor: 'rgba(192, 217, 200, 0.4)',
              borderRadius: '100px',
              fontSize: '0.7rem',
              fontFamily: "'Space Mono', monospace",
              color: '#3A6B4A',
              letterSpacing: '0.05em',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#3A6B4A',
                animation: 'live-pulse 1.8s ease-in-out infinite',
              }}
            />
            LIVE
          </div>
        </div>
      </div>
    </header>
  );
}
