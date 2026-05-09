import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export function TxStatus({
  pending,
  success,
  error,
}: {
  pending?: boolean;
  success?: boolean;
  error?: string | null;
}) {
  if (!pending && !success && !error) return null;
  if (pending) {
    return (
      <div className="card flex items-center gap-2.5 p-3.5 text-sm border-accent/30 bg-accent/5">
        <Loader2 size={16} className="animate-spin text-accent shrink-0" />
        <span className="text-ink/85">Transaction pending — confirm in your wallet…</span>
      </div>
    );
  }
  if (success) {
    return (
      <div className="card flex items-center gap-2.5 p-3.5 text-sm text-emerald-300 border-emerald-400/30 bg-emerald-400/5">
        <CheckCircle2 size={16} className="shrink-0" /> Confirmed.
      </div>
    );
  }
  return (
    <div className="card flex items-start gap-2.5 p-3.5 text-sm text-red-300 border-red-400/30 bg-red-400/5">
      <XCircle size={16} className="mt-0.5 shrink-0" />
      <span className="break-words">{error}</span>
    </div>
  );
}
