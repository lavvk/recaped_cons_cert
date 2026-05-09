"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, CalendarDays, Plus, Award, User } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/create", label: "Create", icon: Plus, primary: true },
  { href: "/skills", label: "Skills", icon: Award },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname() || "/";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]">
      <div className="container-app pb-3 pt-2">
        <ul className="grid grid-cols-5 rounded-full border border-line/60 bg-bg-card/80 backdrop-blur-xl shadow-card px-1.5 py-1.5">
          {items.map(({ href, label, icon: Icon, primary }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href} className="flex justify-center">
                <Link
                  href={href}
                  aria-label={label}
                  className={clsx(
                    "flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold transition-all",
                    primary
                      ? "bg-gradient-to-br from-accent via-accent-warm to-accent-soft text-[#1a0a10] shadow-[0_8px_24px_-8px_rgba(255,143,163,0.7)]"
                      : active
                        ? "bg-accent/15 text-accent"
                        : "text-ink-mute hover:text-ink"
                  )}
                >
                  <Icon size={primary ? 18 : 17} strokeWidth={primary ? 2.6 : 2.2} />
                  {(active || primary) && (
                    <span className={clsx(primary && "font-bold")}>
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
