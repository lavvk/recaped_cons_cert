import deployed from "@/lib/deployed-address.json";

const envAddr = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "").trim();
const fileAddr = (deployed.address || "").trim();
const resolved = envAddr || fileAddr;

export const CONTRACT_ADDRESS = (resolved || "") as `0x${string}` | "";

const envChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
export const CONTRACT_CHAIN_ID =
  Number.isFinite(envChainId) && envChainId > 0
    ? envChainId
    : deployed.chainId || 31337;
export const IS_CONFIGURED =
  /^0x[0-9a-fA-F]{40}$/.test(resolved as string);
