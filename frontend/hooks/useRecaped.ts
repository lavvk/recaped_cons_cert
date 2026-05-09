"use client";

import { useMemo } from "react";
import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { RECAPED_ABI, type RecapedEventInfo, type RecapedAttendee } from "@/constants/abi";
import { CONTRACT_ADDRESS, IS_CONFIGURED } from "@/constants/contract";

const baseRead = {
  abi: RECAPED_ABI,
  address: CONTRACT_ADDRESS as `0x${string}`,
};

export function useNextEventId() {
  return useReadContract({
    ...baseRead,
    functionName: "nextEventId",
    query: { enabled: IS_CONFIGURED },
  });
}

export function useEvent(id?: bigint) {
  return useReadContract({
    ...baseRead,
    functionName: "getEvent",
    args: id !== undefined ? [id] : undefined,
    query: { enabled: IS_CONFIGURED && id !== undefined && id > 0n },
  }) as { data: RecapedEventInfo | undefined; isLoading: boolean; error: Error | null; refetch: () => void };
}

export function useAttendeeStatus(id?: bigint, user?: `0x${string}`) {
  return useReadContract({
    ...baseRead,
    functionName: "getAttendeeStatus",
    args: id !== undefined && user ? [id, user] : undefined,
    query: { enabled: IS_CONFIGURED && id !== undefined && !!user },
  }) as { data: RecapedAttendee | undefined; isLoading: boolean; error: Error | null; refetch: () => void };
}

export function useUserEventIds(user?: `0x${string}`) {
  return useReadContract({
    ...baseRead,
    functionName: "getUserEventIds",
    args: user ? [user] : undefined,
    query: { enabled: IS_CONFIGURED && !!user },
  }) as { data: bigint[] | undefined; isLoading: boolean; refetch: () => void };
}

export function useAllOnchainEvents() {
  const { data: nextId } = useNextEventId();
  const ids = useMemo(() => {
    if (!nextId) return [] as bigint[];
    const total = Number(nextId) - 1;
    return Array.from({ length: Math.max(0, total) }, (_, i) => BigInt(i + 1));
  }, [nextId]);

  const result = useReadContracts({
    contracts: ids.map((id) => ({
      ...baseRead,
      functionName: "getEvent" as const,
      args: [id] as const,
    })),
    query: { enabled: IS_CONFIGURED && ids.length > 0 },
  });

  const events = useMemo(() => {
    if (!result.data) return [];
    return result.data
      .map((r) => (r.status === "success" ? (r.result as RecapedEventInfo) : null))
      .filter(Boolean) as RecapedEventInfo[];
  }, [result.data]);

  return { events, isLoading: result.isLoading, refetch: result.refetch, ids };
}

export function useRecapedWrite() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  function call(functionName: string, args: readonly unknown[]) {
    if (!IS_CONFIGURED) {
      throw new Error("Contract address not configured");
    }
    writeContract({
      ...baseRead,
      functionName: functionName as any,
      args: args as any,
    });
  }

  const errorMessage = useMemo(() => {
    const e = error || receipt.error;
    if (!e) return null;
    const msg = (e as Error).message || String(e);
    // Try to extract revert reason from common viem patterns.
    const match =
      /reverted with the following reason:\s*([^\n]+)/i.exec(msg) ||
      /reason:\s*([^\n]+)/i.exec(msg) ||
      /reverted with reason string ['"]([^'"]+)['"]/i.exec(msg);
    return match ? match[1] : msg.split("\n")[0];
  }, [error, receipt.error]);

  return {
    call,
    hash,
    isPending: isPending || receipt.isLoading,
    isSuccess: receipt.isSuccess,
    error: errorMessage,
    reset,
  };
}
