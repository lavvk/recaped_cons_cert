import {
  FileText,
  Github,
  BookOpen,
  Video,
  Code2,
  ListChecks,
  Lock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

const ICONS: Record<string, React.ComponentType<any>> = {
  Slides: FileText,
  "GitHub Repo": Github,
  Docs: BookOpen,
  Recording: Video,
  "Starter Code": Code2,
  "Key Takeaways": ListChecks,
  Template: FileText,
  Reading: BookOpen,
  "Rules & Judging": ListChecks,
};

const TINTS: Record<string, string> = {
  Slides: "from-accent/20 to-accent-warm/10 text-accent",
  "GitHub Repo": "from-[#B07CFF]/25 to-accent/10 text-[#D4B0FF]",
  Docs: "from-[#6BD0FF]/20 to-accent/10 text-[#9EE0FF]",
  Recording: "from-accent-deep/25 to-accent/10 text-[#FFB0C2]",
  "Starter Code": "from-[#FFD86B]/20 to-accent/10 text-[#FFE08A]",
};

export function MaterialCard({
  kind,
  description,
  href,
  locked,
}: {
  kind: string;
  description: string;
  href?: string;
  locked?: boolean;
}) {
  const Icon = ICONS[kind] ?? Sparkles;
  const tint = TINTS[kind] ?? "from-accent/20 to-accent-warm/10 text-accent";

  const inner = (
    <div
      className={clsx(
        "card group relative flex items-center gap-3.5 p-4 transition-all",
        !locked && href && "hover:border-accent/40 hover:-translate-y-0.5",
        locked && "opacity-60"
      )}
    >
      <div
        className={clsx(
          "grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br border border-white/5",
          locked ? "from-bg-elev to-bg-elev text-ink-mute" : tint
        )}
      >
        {locked ? <Lock size={18} /> : <Icon size={18} strokeWidth={2.2} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold tracking-tight leading-tight">{kind}</div>
        <div className="text-xs text-ink-mute line-clamp-1 mt-0.5">
          {description}
        </div>
      </div>
      {!locked && href && (
        <ArrowUpRight
          size={16}
          className="text-ink-dim group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0"
        />
      )}
    </div>
  );

  if (locked || !href) return inner;
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="block">
      {inner}
    </a>
  );
}
