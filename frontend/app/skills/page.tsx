"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BadgeCard } from "@/components/BadgeCard";
import { useHistorySnapshot } from "@/lib/history";

const TEMPLATE_BADGES = [
  { title: "Smart Contract Starter", category: "Web3" },
  { title: "Wallet Connect Beginner", category: "Web3" },
  { title: "AI Workshop Attendee", category: "AI" },
  { title: "React Builder", category: "Frontend" },
  { title: "Data Viz Explorer", category: "Data" },
  { title: "Workshop Finisher", category: "General" },
];

export default function SkillsPage() {
  const { isConnected } = useAccount();
  const history = useHistorySnapshot();
  const claimedFromHistory = history.filter((h) => h.claimed);
  const claimedCount = claimedFromHistory.length;

  if (!isConnected) {
    return (
      <div className="space-y-4 pt-4 pb-6">
        <h1 className="h1">Skills</h1>
        <div className="card p-6 space-y-3 text-center">
          <p className="muted">Connect your wallet to see your badges.</p>
          <div className="flex justify-center pt-1">
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-4 pb-8">
      <header>
        <h1 className="h1">Skills</h1>
        <p className="muted mt-1">
          Badges unlock as you complete events.{" "}
          <span className="text-accent font-semibold">
            {claimedCount} earned
          </span>
          .
        </p>
      </header>

      {claimedFromHistory.length > 0 && (
        <section className="space-y-3">
          <h2 className="h2">Your earned badges</h2>
          <div className="space-y-3">
            {claimedFromHistory.map((h) => (
              <BadgeCard
                key={h.eventId}
                title={h.title || `Event #${h.eventId}`}
                category={h.category || "Skill"}
                claimed
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="h2">Badge collection</h2>
        <div className="space-y-3">
          {TEMPLATE_BADGES.map((b, i) => (
            <BadgeCard
              key={b.title}
              title={b.title}
              category={b.category}
              claimed={i < claimedCount}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
