// RBI MRM Browser Plugin Factory - Automated Test Runner
// Discover, execute, and report results from all testing files in the suite.

const extensionSuite = require("./extension.test");
const buildSuite = require("./build.test");

console.log("====================================================");
console.log("       RBI MRM PLUGIN FACTORY AUTOMATED TEST SUITE  ");
console.log("====================================================");

let totalPassed = 0;
let totalFailed = 0;
const report = [];

function runSuite(suite) {
  console.log(`\n📦 Running Suite: ${suite.name}`);
  console.log("----------------------------------------------------");

  try {
    suite.run();
    report.push({ suite: suite.name, status: "PASSED", error: null });
    totalPassed++;
  } catch (err) {
    console.error(`❌ Suite Failed with error:`, err.message);
    if (err.stack) {
      console.error(err.stack.split("\n").slice(0, 3).join("\n"));
    }
    report.push({ suite: suite.name, status: "FAILED", error: err.message });
    totalFailed++;
  }
}

// Execute suites
runSuite(extensionSuite);
runSuite(buildSuite);

console.log("\n====================================================");
console.log("               COMPLIANCE TEST REPORT SUMMARY       ");
console.log("====================================================");
report.forEach((item) => {
  const symbol = item.status === "PASSED" ? "🟢" : "🔴";
  console.log(`${symbol}  ${item.suite.padEnd(65)} [${item.status}]`);
  if (item.error) {
    console.log(`    Error Details: ${item.error}`);
  }
});
console.log("----------------------------------------------------");
console.log(`FINAL RESULT: ${totalPassed} Passed, ${totalFailed} Failed.`);
console.log("====================================================");

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log("🌟 ALL TESTS COMPLETED SUCCESSFULLY! COMPLIANCE VERIFIED.");
  process.exit(0);
}
