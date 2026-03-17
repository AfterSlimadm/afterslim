// Workaround: Turbopack in Next.js 16 doesn't generate middleware.js.nft.json
// This script creates it if missing after build
import { existsSync, writeFileSync } from "fs";
import { join } from "path";

const nftPath = join(process.cwd(), ".next/server/middleware.js.nft.json");

if (!existsSync(nftPath)) {
  writeFileSync(nftPath, JSON.stringify({ version: 1, files: [] }));
  console.log("Created missing middleware.js.nft.json");
} else {
  console.log("middleware.js.nft.json already exists");
}
