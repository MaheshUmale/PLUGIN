// RBI MRM Browser Plugin Factory - CLI Builder
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Helper to parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    bank: "Federal Bank of India",
    color: "#0b3c5d",
    domains: "<all_urls>",
    api: "https://api.compliance-core.internal/mrm-sync",
    out: "dist/rbi-mrm-extension.zip"
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--bank" && args[i + 1]) params.bank = args[i + 1];
    if (args[i] === "--color" && args[i + 1]) params.color = args[i + 1];
    if (args[i] === "--domains" && args[i + 1]) params.domains = args[i + 1];
    if (args[i] === "--api" && args[i + 1]) params.api = args[i + 1];
    if (args[i] === "--out" && args[i + 1]) params.out = args[i + 1];
  }
  return params;
}

// Tiny valid 16x16 PNG image in base64 to avoid extension load warning
const TINY_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAADVJREFUOE9jGBlQwf+gMGrAqAGjBowaMGqAZBv+/v37n1SMCmD68vXrf3IwqoHpy9ev/8nBqAGDAgDpu8axgY3S+gAAAABJRU5ErkJggg==";

function main() {
  const params = parseArgs();
  console.log("====================================================");
  console.log("       RBI MRM BROWSER PLUGIN FACTORY BUILDER       ");
  console.log("====================================================");
  console.log(`- RE Name:      ${params.bank}`);
  console.log(`- Theme Color:  ${params.color}`);
  console.log(`- Domains:      ${params.domains}`);
  console.log(`- Sync Node:    ${params.api}`);
  console.log(`- Output ZIP:   ${params.out}`);
  console.log("----------------------------------------------------");

  const templateDir = path.join(__dirname, "template-extension");
  const distDir = path.join(__dirname, "dist");
  const unpackedDir = path.join(distDir, "unpacked");

  // Create clean folders
  if (fs.existsSync(unpackedDir)) {
    fs.rmSync(unpackedDir, { recursive: true, force: true });
  }
  fs.mkdirSync(unpackedDir, { recursive: true });

  // Read all files from template-extension
  if (!fs.existsSync(templateDir)) {
    console.error(`Error: Template directory '${templateDir}' not found!`);
    process.exit(1);
  }

  const files = fs.readdirSync(templateDir);
  files.forEach(file => {
    const srcPath = path.join(templateDir, file);
    if (fs.lstatSync(srcPath).isDirectory()) return; // skip subdirs

    let content = fs.readFileSync(srcPath, "utf8");

    // Perform compilation replacements
    content = content.replace(/\{\{BANK_NAME\}\}/g, params.bank);
    content = content.replace(/\{\{THEME_COLOR\}\}/g, params.color);
    content = content.replace(/\{\{ALLOWED_DOMAINS\}\}/g, params.domains);
    content = content.replace(/\{\{API_ENDPOINT\}\}/g, params.api);

    // Dynamic brand colors injection for CSS
    if (file === "popup.css" || file === "sidebar.css") {
      content = content.replace(/--primary-color:\s*#[a-fA-F0-9]{3,6}/, `--primary-color: ${params.color}`);
    }

    const destPath = path.join(unpackedDir, file);
    fs.writeFileSync(destPath, content, "utf8");
    console.log(`Compiled: ${file}`);
  });

  // Write base64 mock icon
  const iconPath = path.join(unpackedDir, "icon.png");
  fs.writeFileSync(iconPath, Buffer.from(TINY_PNG_BASE64, "base64"));
  console.log("Generated: icon.png");

  // Generate ZIP bundle
  console.log("----------------------------------------------------");
  console.log("Creating enterprise distribution package...");

  const zipOutPath = path.resolve(__dirname, params.out);
  const zipOutDir = path.dirname(zipOutPath);
  if (!fs.existsSync(zipOutDir)) {
    fs.mkdirSync(zipOutDir, { recursive: true });
  }
  if (fs.existsSync(zipOutPath)) {
    fs.unlinkSync(zipOutPath);
  }

  try {
    // Navigate into unpacked and zip everything recursively
    execSync(`zip -r "${zipOutPath}" .`, { cwd: unpackedDir, stdio: "ignore" });
    console.log(`SUCCESS: Dynamic extension compiled successfully!`);
    console.log(`Distribution package saved to: ${params.out}`);
  } catch (error) {
    console.error("Warning: Failed to execute 'zip' terminal process.", error.message);
    console.log("Compiled files are available unpacked in: dist/unpacked/");
  }
  console.log("====================================================");
}

if (require.main === module) {
  main();
}
