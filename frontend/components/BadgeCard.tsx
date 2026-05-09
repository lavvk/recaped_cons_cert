import { Award, Sparkles } from "lucide-react";
import clsx from "clsx";

export function BadgeCard({
  title,
  category,
  claimed,
}: {
  title: string;
  category: string;
  claimed?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border p-4 transition",
        claimed
          ? "border-accent/40 bg-gradient-to-br from-accent/15 via-bg-card to-bg-card shadow-[0_8px_28px_-12px_rgba(255,176,32,0.4)]"
          : "border-line bg-bg-card opacity-65"
      )}
    >
      {claimed && (
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-accent">
          <Sparkles size={10} /> Earned
        </div>
      )}
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "grid size-12 place-items-center rounded-xl shrink-0",
            claimed
              ? "bg-gradient-to-br from-accent to-accent-warm text-black"
              : "bg-bg-elev text-ink-mute"
          )}
        >
          <Award size={22} strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.12em] text-ink-dim font-bold">
            {category}
          </div>
          <div className="font-semibold leading-tight line-clamp-1 mt-0.5">
            {title}
          </div>
          <div className="text-xs text-ink-mute mt-0.5">
            {claimed ? "Claimed" : "Locked"}
          </div>
        </div>
      </div>
    </div>
  );
}
