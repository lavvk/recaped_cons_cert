export function shortAddress(addr?: string | null): string {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatDate(unixSec: number | bigint | undefined): string {
  if (unixSec === undefined) return "TBA";
  const n = typeof unixSec === "bigint" ? Number(unixSec) : unixSec;
  if (!n) return "TBA";
  const d = new Date(n * 1000);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTimeLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function dateToUnix(input: string): number {
  if (!input) return 0;
  const t = new Date(input).getTime();
  return Number.isFinite(t) ? Math.floor(t / 1000) : 0;
}
