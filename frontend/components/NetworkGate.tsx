"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { IS_CONFIGURED, CONTRACT_CHAIN_ID } from "@/constants/contract";
import { AlertTriangle } from "lucide-react";

export function NetworkGate() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!IS_CONFIGURED) {
    return (
      <div className="card flex items-start gap-2.5 border-amber-400/30 bg-amber-400/5 p-3.5 text-xs text-amber-200">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        <div>
          <div className="font-semibold">No contract deployed</div>
          <div className="opacity-90 mt-0.5">
            Run <code className="text-amber-300">npm run deploy:local</code> from the
            project root to enable on-chain actions.
          </div>
        </div>
      </div>
    );
  }

  if (isConnected && chainId !== CONTRACT_CHAIN_ID) {
    return (
      <div className="card flex items-start gap-2.5 border-amber-400/30 bg-amber-400/5 p-3.5 text-xs text-amber-200">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="font-semibold">Wrong network</div>
          <div className="opacity-90 mt-0.5">
            Switch your wallet to chain ID {CONTRACT_CHAIN_ID}.
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg bg-amber-300/20 px-2.5 py-1 font-semibold hover:bg-amber-300/30 transition disabled:opacity-50"
          disabled={isPending}
          onClick={() => switchChain({ chainId: CONTRACT_CHAIN_ID })}
        >
          Switch
        </button>
      </div>
    );
  }

  return null;
}
