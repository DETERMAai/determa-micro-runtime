import { execSync } from "child_process";

try {

  console.log("Runtime gate initialized");

  execSync("npm run verify:receipts", {
    stdio: "inherit"
  });

  console.log("Validation boundary active");
  console.log("Fail-closed execution enabled");

} catch (err) {

  console.error("RUNTIME_GATE_DENIED");
  process.exit(1);

}
