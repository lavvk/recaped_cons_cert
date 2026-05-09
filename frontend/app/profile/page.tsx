"use client";

import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LogOut, ArrowRight, Award } from "lucide-react";
import { shortAddress } from "@/lib/format";
import { NetworkGate } from "@/components/NetworkGate";
import { BadgeCard } from "@/components/BadgeCard";
import { MaterialCard } from "@/components/MaterialCard";
import { SAMPLE_MATERIALS } from "@/constants/sampleData";
import { useHistorySnapshot } from "@/lib/history";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const history = useHistorySnapshot();

  const verified = history.filter((x) => x.verified || x.approved || x.claimed);
  const claimed = history.filter((x) => x.claimed);

  if (!isConnected) {
    return (
      <div className="space-y-4 pt-4 pb-6">
        <h1 className="h1">Profile</h1>
        <div className="card p-6 space-y-3 text-center">
          <p className="muted">Connect your wallet to view your profile.</p>
          <div className="flex justify-center pt-1">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-4 pb-8">
      <section className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.12em] text-ink-dim font-bold">
              Wallet
            </div>
            <div className="font-mono text-sm mt-1">{shortAddress(address)}</div>
          </div>
          <button
            type="button"
            className="btn-ghost text-xs px-2.5 py-1.5"
            onClick={() => disconnect()}
          >
            <LogOut size={14} /> Disconnect
          </button>
        </div>
      </section>

      <NetworkGate />

      <section className="grid grid-cols-3 gap-3">
        <Stat label="Joined" value={history.length} />
        <Stat label="Verified" value={verified.length} />
        <Stat label="Badges" value={claimed.length} />
      </section>

      <section className="space-y-3">
        <h2 className="h2">Attended events</h2>
        {history.length === 0 ? (
          <div className="card p-5 text-center space-y-3">
            <p className="muted">No events yet.</p>
            <Link href="/events" className="btn-primary inline-flex">
              Browse events <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <Link
                key={h.eventId}
                href={`/events/${h.eventId}`}
                className="card card-hover p-4 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-accent font-bold">
                    {h.category || "Event"}
                  </div>
                  <div className="font-semibold line-clamp-1 mt-0.5">
                    {h.title || `Event #${h.eventId}`}
                  </div>
                  <div className="text-xs text-ink-mute mt-0.5">
                    {h.claimed
                      ? "Badge Claimed"
                      : h.approved
                        ? "Approved"
                        : h.verified
                          ? "Verification submitted"
                          : "Joined"}
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-ink-mute self-center shrink-0"
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="h2">Unlocked materials</h2>
        {verified.length === 0 ? (
          <div className="muted">Verify attendance to unlock event materials.</div>
        ) : (
          <div className="space-y-4">
            {verified.map((h) => (
              <div key={h.eventId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.1em] text-ink-mute font-bold line-clamp-1">
                    {h.title}
                  </div>
                </div>
                <div className="space-y-2">
                  {SAMPLE_MATERIALS.map((m) => (
                    <MaterialCard
                      key={`${h.eventId}-${m.kind}`}
                      kind={m.kind}
                      description={m.description}
                      href={h.materialsURI || undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="h2">Skill badges</h2>
        {claimed.length === 0 ? (
          <div className="card p-5 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-bg-elev text-ink-mute shrink-0">
              <Award size={18} />
            </div>
            <div className="muted">No badges yet. Claim one after approval.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {claimed.map((h) => (
              <BadgeCard
                key={h.eventId}
                title={h.title || `Event #${h.eventId}`}
                category={h.category || "Skill"}
                claimed
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl font-bold text-accent">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.1em] text-ink-mute font-semibold mt-1">
        {label}
      </div>
    </div>
  );
}
