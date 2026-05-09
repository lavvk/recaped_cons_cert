import Link from "next/link";
import { Users, ArrowUpRight, X } from "lucide-react";
import { shortAddress, formatDate } from "@/lib/format";
import { StatusChip, type StatusKind } from "./StatusChip";
import { hideEvent } from "@/lib/hidden";

export type EventCardProps = {
  id: bigint | number;
  title: string;
  category: string;
  organizer: string;
  description?: string;
  startTime: bigint | number;
  attendeeCount: bigint | number;
  capacity: bigint | number;
  hasMaterials: boolean;
  status?: StatusKind;
  href?: string;
  // Only the wallet that organized this event sees the delete affordance.
  canDelete?: boolean;
};

// Deterministic gradient per event id so each card has its own "cover".
const COVERS = [
  "linear-gradient(135deg, #FF8FA3 0%, #FFB37A 60%, #FFE0D6 100%)",
  "linear-gradient(135deg, #E5446D 0%, #FF8FA3 50%, #FFB37A 100%)",
  "linear-gradient(135deg, #B07CFF 0%, #FF8FA3 60%, #FFB37A 100%)",
  "linear-gradient(135deg, #FFB37A 0%, #FF8FA3 50%, #B07CFF 100%)",
  "linear-gradient(135deg, #FFD86B 0%, #FF8FA3 60%, #E5446D 100%)",
  "linear-gradient(135deg, #6BD0FF 0%, #B07CFF 50%, #FF8FA3 100%)",
];

function coverFor(id: bigint | number) {
  const n = typeof id === "bigint" ? Number(id % BigInt(COVERS.length)) : id % COVERS.length;
  return COVERS[Math.abs(n)];
}

function dateParts(t: bigint | number) {
  const d = new Date(Number(t) * 1000);
  return {
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate(),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

export function EventCard(props: EventCardProps) {
  const {
    id,
    title,
    category,
    organizer,
    description,
    startTime,
    attendeeCount,
    capacity,
    status,
    href,
    canDelete,
  } = props;

  const link = href ?? `/events/${id}`;
  const { month, day, time } = dateParts(startTime);

  return (
    <Link
      href={link}
      className="card card-hover group block overflow-hidden relative"
    >
      {canDelete && (
        <button
          type="button"
          aria-label="Delete event"
          title="Delete event"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            hideEvent(String(id));
          }}
          className="absolute right-2 top-2 z-10 grid size-7 place-items-center rounded-full bg-black/50 text-white hover:bg-red-500 transition opacity-90"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
      {/* Cover */}
      <div
        className="relative h-28 w-full"
        style={{ background: coverFor(id) }}
      >
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(80% 60% at 20% 20%, rgba(255,255,255,0.45), transparent 60%), radial-gradient(60% 60% at 80% 80%, rgba(0,0,0,0.3), transparent 60%)",
          }}
        />
        <div className="absolute left-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-bg-card/85 backdrop-blur-md border border-white/10 shadow-card">
          <div className="text-[9px] font-bold tracking-[0.16em] text-accent">
            {month}
          </div>
          <div className="font-display text-[22px] leading-none font-semibold text-ink">
            {day}
          </div>
        </div>
        <div className="absolute right-4 top-4 inline-flex items-center rounded-full bg-bg-card/85 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-ink">
          {category.toUpperCase()}
        </div>
        {status && (
          <div className="absolute bottom-3 left-4">
            <StatusChip kind={status} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[19px] font-medium leading-snug tracking-tight line-clamp-2 flex-1">
            {title}
          </h3>
          <ArrowUpRight
            size={18}
            className="text-ink-dim group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
          />
        </div>

        <div className="mt-1.5 text-[12px] text-ink-mute">
          {time} · by {shortAddress(organizer)}
        </div>

        {description && (
          <p className="mt-2.5 text-[13px] text-ink/70 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-3.5 flex items-center justify-between text-[11px] text-ink-mute">
          <span className="inline-flex items-center gap-1.5">
            <Users size={12} strokeWidth={2.5} />
            {Number(attendeeCount)} going · {Number(capacity)} max
          </span>
          <span className="text-ink-dim">{formatDate(startTime)}</span>
        </div>
      </div>
    </Link>
  );
}
