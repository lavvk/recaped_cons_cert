"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/40 bg-[#0E0B10]/70 backdrop-blur-xl">
      <div className="container-app flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid size-8 place-items-center rounded-2xl bg-gradient-to-br from-accent via-accent-warm to-accent-soft text-[#1a0a10] font-display font-bold text-lg shadow-[0_6px_18px_-6px_rgba(255,143,163,0.7)] group-hover:scale-105 transition-transform">
            r
          </span>
          <span className="font-display text-[18px] font-medium tracking-tight">recaped</span>
        </Link>
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus={{ smallScreen: "avatar", largeScreen: "address" }}
        />
      </div>
    </header>
  );
}
