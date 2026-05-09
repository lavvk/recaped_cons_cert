import { ShieldCheck, BookOpen, Award, Layers } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-5 pt-4 pb-8">
      <header>
        <h1 className="h1">About Recaped</h1>
        <p className="muted mt-1">
          Workshops, talks, and trainings — verified, unlocked, collected.
        </p>
      </header>

      <section className="card p-5 space-y-3">
        <p className="text-[14px] text-ink/85 leading-relaxed">
          Recaped helps attendees keep what they learned at workshops and events
          instead of losing it in Discord, Slack, or random links. You verify
          attendance with your wallet, the organizer approves, and you walk away
          with the materials and an on-chain skill badge.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="h2">How it works</h2>
        <Row
          icon={<ShieldCheck size={18} strokeWidth={2.5} />}
          title="Verify"
          body="Enter the event code or proof. The contract records the verification."
        />
        <Row
          icon={<Layers size={18} strokeWidth={2.5} />}
          title="Approve"
          body="The organizer approves your attendance for your wallet address."
        />
        <Row
          icon={<BookOpen size={18} strokeWidth={2.5} />}
          title="Unlock"
          body="The materials link opens up — slides, repos, docs, whatever the organizer shared."
        />
        <Row
          icon={<Award size={18} strokeWidth={2.5} />}
          title="Claim"
          body="Mint a wallet-bound badge that lives in your profile."
        />
      </section>

      <section className="card p-5 space-y-2">
        <h2 className="h2 mb-1">On-chain vs off-chain</h2>
        <p className="text-[13px] text-ink/85 leading-relaxed">
          <span className="text-accent font-semibold">On-chain:</span> registration,
          verification, approval, badge claims.
        </p>
        <p className="text-[13px] text-ink/85 leading-relaxed">
          <span className="text-accent font-semibold">Off-chain:</span> the actual
          materials (one link the organizer provides). The contract just stores the
          URI.
        </p>
      </section>

      <section className="card p-5 space-y-2">
        <h2 className="h2 mb-1">Demo only</h2>
        <p className="muted">
          Runs against a local Hardhat chain or Sepolia. No real money. No
          mainnet.
        </p>
      </section>
    </div>
  );
}

function Row({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-semibold">{title}</div>
        <div className="muted mt-0.5">{body}</div>
      </div>
    </div>
  );
}
