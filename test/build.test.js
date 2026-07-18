// Build Integration & Compiler Tests
// Validates CLI builder replacements, asset packaging, and custom brand configurations.

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const distDir = path.join(__dirname, "..", "dist");
const unpackedDir = path.join(distDir, "unpacked");

const testParams = {
  bank: "Test NBFC Corp",
  color: "#ff0011",
  domains: "*://*.testnbfc.in/*",
  api: "https://api.testnbfc.in/mrm-sync",
  out: "dist/test-mrm-assistant.zip"
};

const tests = {
  // Test 1: Verify the CLI compiler successfully processes templates and writes unpacked files
  testCLIBuilderOutput() {
    console.log("  - Running testCLIBuilderOutput...");

    // Run build-plugin.js CLI with custom parameters
    const cmd = `node build-plugin.js --bank "${testParams.bank}" --color "${testParams.color}" --domains "${testParams.domains}" --api "${testParams.api}" --out "${testParams.out}"`;
    try {
      execSync(cmd, { cwd: path.join(__dirname, ".."), stdio: "pipe" });
    } catch (e) {
      console.error(e.stdout.toString());
      console.error(e.stderr.toString());
      throw new Error(`CLI build execution failed: ${e.message}`);
    }

    // Assert files are created
    assert.equal(fs.existsSync(unpackedDir), true);
    assert.equal(fs.existsSync(path.join(unpackedDir, "manifest.json")), true);
    assert.equal(fs.existsSync(path.join(unpackedDir, "popup.html")), true);
    assert.equal(fs.existsSync(path.join(unpackedDir, "popup.js")), true);
    assert.equal(fs.existsSync(path.join(unpackedDir, "popup.css")), true);
    assert.equal(fs.existsSync(path.join(unpackedDir, "icon.png")), true);

    // Read manifest.json and assert branding variables are correctly injected
    const manifestJson = JSON.parse(fs.readFileSync(path.join(unpackedDir, "manifest.json"), "utf8"));
    assert.equal(manifestJson.name, `${testParams.bank} RBI MRM Compliance Assistant`);

    // Read popup.html and assert bank title replacement is done
    const popupHtml = fs.readFileSync(path.join(unpackedDir, "popup.html"), "utf8");
    assert.equal(popupHtml.includes(testParams.bank), true);

    // Read popup.css and assert Brand theme color injection is correct
    const popupCss = fs.readFileSync(path.join(unpackedDir, "popup.css"), "utf8");
    assert.equal(popupCss.includes(testParams.color), true);

    console.log("  ✅ testCLIBuilderOutput PASSED");
  },

  // Test 2: Verify custom ZIP package creation
  testZipArchiveGeneration() {
    console.log("  - Running testZipArchiveGeneration...");

    const expectedZipPath = path.join(__dirname, "..", testParams.out);

    // Assert ZIP archive exists and has a size greater than 0
    assert.equal(fs.existsSync(expectedZipPath), true);
    const stats = fs.statSync(expectedZipPath);
    assert.ok(stats.size > 0, "Generated ZIP file is empty");

    // Clean up test generated file
    if (fs.existsSync(expectedZipPath)) {
      fs.unlinkSync(expectedZipPath);
    }

    console.log("  ✅ testZipArchiveGeneration PASSED");
  }
};

module.exports = {
  name: "Plugin Factory Build & CLI Compiler Integration Tests",
  run() {
    for (const [testName, testFn] of Object.entries(tests)) {
      testFn();
    }
  }
};
