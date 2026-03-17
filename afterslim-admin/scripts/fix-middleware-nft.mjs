// Workaround: Turbopack in Next.js 16 outputs middleware differently
// This script ensures both middleware.js and middleware.js.nft.json exist
import { existsSync, writeFileSync, readdirSync, copyFileSync } from "fs";
import { join } from "path";

const serverDir = join(process.cwd(), ".next/server");
const middlewareJs = join(serverDir, "middleware.js");
const middlewareNft = join(serverDir, "middleware.js.nft.json");

// List all files in server dir to find where Turbopack put the middleware
const files = readdirSync(serverDir).filter(f => f.includes("middleware"));
console.log("Middleware files found:", files);

if (!existsSync(middlewareJs)) {
  // Check if Turbopack put it elsewhere
  const altNames = ["middleware.js.body", "middleware.mjs"];
  let found = false;
  for (const alt of altNames) {
    const altPath = join(serverDir, alt);
    if (existsSync(altPath)) {
      copyFileSync(altPath, middlewareJs);
      console.log(`Copied ${alt} -> middleware.js`);
      found = true;
      break;
    }
  }
  if (!found) {
    // Create a minimal re-export wrapper
    writeFileSync(middlewareJs, `module.exports = require("../middleware");`);
    console.log("Created stub middleware.js");
  }
}

if (!existsSync(middlewareNft)) {
  writeFileSync(middlewareNft, JSON.stringify({ version: 1, files: [] }));
  console.log("Created missing middleware.js.nft.json");
}
