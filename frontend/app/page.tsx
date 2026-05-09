"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Calendar, Plus, ShieldCheck, BookOpen, Award } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { NetworkGate } from "@/components/NetworkGate";
import { SAMPLE_EVENTS } from "@/constants/sampleData";
import { useAllOnchainEvents } from "@/hooks/useRecaped";

export default function HomePage() {
  const { isConnected } = useAccount();
  const { events: onchain } = useAllOnchainEvents();
  const featured = onchain[0] ?? SAMPLE_EVENTS[0];

  return (
    <div className="space-y-7 pb-6">
      <section className="pt-8 space-y-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent px-3 py-1 text-[10px] font-bold tracking-[0.14em]">
          <ShieldCheck size={11} strokeWidth={2.5} /> RECAPED
        </div>
        <h1 className="font-display text-[44px] font-medium tracking-[-0.015em] leading-[1.02]">
          Show up.
          <br />
          <span className="italic bg-gradient-to-r from-accent via-accent-warm to-accent-soft bg-clip-text text-transparent">
            Keep the receipts.
          </span>
        </h1>
        <p className="text-[15px] text-ink/70 leading-relaxed max-w-[34ch]">
          A softer take on event RSVPs. Verify attendance with your wallet,
          unlock the slides, and pocket a skill badge.
        </p>
        {!isConnected && (
          <div className="pt-1">
            <ConnectButton showBalance={false} />
          </div>
        )}
      </section>

      <NetworkGate />

      <section className="grid grid-cols-2 gap-3">
        <Link href="/events" className="btn-secondary">
          <Calendar size={16} /> Browse
        </Link>
        <Link href="/create" className="btn-primary">
          <Plus size={16} strokeWidth={2.5} /> Host
        </Link>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="h2">Happening soon</h2>
          <Link href="/events" className="text-xs text-accent font-semibold tracking-tight">
            See all →
          </Link>
        </div>
        <EventCard
          id={featured.id}
          title={featured.title}
          category={featured.category}
          organizer={featured.organizer}
          description={featured.description}
          startTime={featured.startTime}
          attendeeCount={featured.attendeeCount}
          capacity={featured.capacity}
          hasMaterials={!!featured.materialsURI}
        />
      </section>

      <section className="space-y-3 pt-2">
        <h2 className="h2">How it works</h2>
        <div className="grid grid-cols-1 gap-3">
          <Step
            n={1}
            icon={<ShieldCheck size={18} strokeWidth={2.5} />}
            title="Verify attendance"
            body="Enter the event code or proof. The contract records your verification."
          />
          <Step
            n={2}
            icon={<BookOpen size={18} strokeWidth={2.5} />}
            title="Unlock materials"
            body="After the organizer approves, the event materials open up."
          />
          <Step
            n={3}
            icon={<Award size={18} strokeWidth={2.5} />}
            title="Claim a skill badge"
            body="Mint a wallet-bound badge that lives in your profile."
          />
        </div>
      </section>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-4 flex items-start gap-3.5">
      <div className="relative shrink-0">
        <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-accent/25 to-accent-warm/15 text-accent border border-white/5">
          {icon}
        </div>
        <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-bg-card border border-line text-[10px] font-display font-semibold text-ink">
          {n}
        </span>
      </div>
      <div className="min-w-0">
        <div className="font-semibold tracking-tight">{title}</div>
        <div className="muted mt-0.5">{body}</div>
      </div>
    </div>
  );
}
