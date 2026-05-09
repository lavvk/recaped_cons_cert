import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const Factory = await ethers.getContractFactory("RecapedEvents");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const chainId = Number((await ethers.provider.getNetwork()).chainId);

  console.log(`RecapedEvents deployed to: ${address}`);
  console.log(`Network: ${network.name} (chainId ${chainId})`);

  const outDir = path.join(__dirname, "..", "frontend", "lib");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "deployed-address.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({ address, chainId, network: network.name }, null, 2) + "\n"
  );
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
