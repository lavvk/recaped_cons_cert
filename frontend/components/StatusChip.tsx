import clsx from "clsx";

export type StatusKind =
  | "not-joined"
  | "joined"
  | "submitted"
  | "approved"
  | "claimed"
  | "sample";

const styles: Record<StatusKind, { label: string; cls: string }> = {
  "not-joined": {
    label: "Open",
    cls: "border-line text-ink-mute bg-bg-card/80 backdrop-blur-md",
  },
  joined: {
    label: "Going",
    cls: "border-accent/50 text-accent bg-accent/15 backdrop-blur-md",
  },
  submitted: {
    label: "Pending",
    cls: "border-[#9EE0FF]/40 text-[#9EE0FF] bg-[#6BD0FF]/10 backdrop-blur-md",
  },
  approved: {
    label: "Approved",
    cls: "border-emerald-300/40 text-emerald-200 bg-emerald-400/10 backdrop-blur-md",
  },
  claimed: {
    label: "Collected",
    cls: "border-[#D4B0FF]/40 text-[#D4B0FF] bg-[#B07CFF]/15 backdrop-blur-md",
  },
  sample: {
    label: "Demo",
    cls: "border-white/15 text-ink bg-bg-card/85 backdrop-blur-md",
  },
};

export function StatusChip({
  kind,
  label,
  className,
}: {
  kind: StatusKind;
  label?: string;
  className?: string;
}) {
  const s = styles[kind];
  return (
    <span className={clsx("chip", s.cls, className)}>
      <span className="size-1.5 rounded-full bg-current opacity-90" />
      {label ?? s.label}
    </span>
  );
}
