import fs from "fs";
import crypto from "crypto";

const receiptsDir = "./receipts";

const files = fs.readdirSync(receiptsDir)
  .filter(f => f.endsWith(".json"))
  .sort();

let previousHash = "GENESIS";

for (const file of files) {

  const receipt = JSON.parse(
    fs.readFileSync(`${receiptsDir}/${file}`)
  );

  const expectedHash = crypto
    .createHash("sha256")
    .update(JSON.stringify({
      timestamp: receipt.timestamp,
      status: receipt.status,
      previousHash: receipt.previousHash
    }))
    .digest("hex");

  if (receipt.previousHash !== previousHash) {
    console.error("CONTINUITY_BROKEN");
    process.exit(1);
  }

  if (receipt.hash !== expectedHash) {
    console.error("HASH_MISMATCH");
    process.exit(1);
  }

  previousHash = receipt.hash;
}

console.log("Receipt chain verified");
