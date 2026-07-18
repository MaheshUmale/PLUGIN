// RBI MRM Browser Plugin Factory Compiler and Controller

// Hardcoded template strings of the extension files for browser compilation
const TEMPLATE_FILES = {
  "manifest.json": `{
  "manifest_version": 3,
  "name": "{{BANK_NAME}} RBI MRM Compliance Assistant",
  "version": "1.0.0",
  "description": "Enterprise Browser Companion for RBI's Model Risk Management Framework compliance.",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "options_page": "options.html",
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "{{ALLOWED_DOMAINS}}"
      ],
      "js": ["content.js"],
      "css": ["sidebar.css"]
    }
  ]
}`,

  "popup.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RBI MRM Assistant</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <header class="app-header">
    <div class="header-logo">
      <span class="bank-title" id="bank-name-display">{{BANK_NAME}}</span>
      <span class="compliance-badge">RBI MRM Compliance</span>
    </div>
    <div class="sandbox-indicator">Secure Sandbox</div>
  </header>

  <nav class="tab-navigation">
    <button class="tab-btn active" data-tab="tab-inventory">Model Inventory</button>
    <button class="tab-btn" data-tab="tab-tiering">Risk Tiering</button>
    <button class="tab-btn" data-tab="tab-ai-audit">AI/ML Audit</button>
    <button class="tab-btn" data-tab="tab-sync">Data Sync</button>
  </nav>

  <main class="tab-container">
    <section id="tab-inventory" class="tab-content active">
      <div class="section-header">
        <h3>Active living Model Inventory</h3>
        <p class="section-desc">Maintain a complete active inventory as mandated by RBI MRMF. Retired models require a mandatory 10-year archive.</p>
      </div>
      <!-- Rest of the inventory layout -->
    </section>
  </main>
</body>
</html>`,

  "popup.js": `// RBI MRM Assistant - Popup Controller
const storage = {
  async get(key, defaultValue) {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] !== undefined ? result[key] : defaultValue);
        });
      });
    }
    return defaultValue;
  }
};
console.log("Popup script loaded for {{BANK_NAME}}.");
`,

  "popup.css": `:root {
  --primary-color: {{THEME_COLOR}};
  --secondary-color: #328cc1;
  --accent-color: #d9b310;
  --bg-color: #f9fbfd;
  --text-color: #333333;
}
body {
  width: 440px;
  height: 560px;
  background-color: var(--bg-color);
  color: var(--text-color);
}`,

  "content.js": `// RBI MRM Compliance Assistant - Content Script injected on {{ALLOWED_DOMAINS}}
console.log("[RBI MRM] Content Script initiated on {{BANK_NAME}} workspace.");
`,

  "background.js": `// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("RBI MRM Compliance Assistant installed for {{BANK_NAME}}.");
});
`,

  "options.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Options</title>
</head>
<body>
  <h2>{{BANK_NAME}} Options</h2>
  <p>Synchronizing with: {{API_ENDPOINT}}</p>
</body>
</html>`
};

let compiledFiles = {};
let activeFile = "manifest.json";

document.addEventListener("DOMContentLoaded", () => {
  const inputBankName = document.getElementById("input-bank-name");
  const inputThemeColor = document.getElementById("input-theme-color");
  const inputThemeHex = document.getElementById("input-theme-hex");
  const inputDomains = document.getElementById("input-domains");
  const inputApiEndpoint = document.getElementById("input-api-endpoint");

  const prevBankName = document.getElementById("prev-bank-name");
  const prevEndpointText = document.getElementById("prev-endpoint-text");

  const btnCompile = document.getElementById("btn-compile-src");
  const compilationStatus = document.getElementById("compilation-status");
  const codeScreen = document.getElementById("code-screen");
  const activeFileTitle = document.getElementById("active-file-title");
  const btnDownloadFile = document.getElementById("btn-download-file");
  const fileListItems = document.querySelectorAll(".file-sidebar li");

  // Sync Color Picker with HEX input
  inputThemeColor.addEventListener("input", (e) => {
    const val = e.target.value;
    inputThemeHex.value = val;
    updatePreviewStyles(val);
  });

  inputThemeHex.addEventListener("input", (e) => {
    const val = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      inputThemeColor.value = val;
      updatePreviewStyles(val);
    }
  });

  function updatePreviewStyles(color) {
    document.documentElement.style.setProperty("--preview-primary", color);
  }

  // Real-time Text updates to preview
  inputBankName.addEventListener("input", (e) => {
    prevBankName.innerText = e.target.value || "Federal Bank";
  });

  inputApiEndpoint.addEventListener("input", (e) => {
    prevEndpointText.innerText = e.target.value || "https://api.mrm.internal";
  });

  // Mock Extension Tab switcher
  const prevTabs = document.querySelectorAll(".prev-tab-btn");
  prevTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      prevTabs.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".prev-tab-content").forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-prev-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });

  // On-the-fly In-Browser compilation
  function compileAll() {
    const bank = inputBankName.value;
    const color = inputThemeColor.value;
    const domains = inputDomains.value.split(",").map(d => d.trim()).join('",\\n        "');
    const api = inputApiEndpoint.value;

    compiledFiles = {};

    for (const [filename, template] of Object.entries(TEMPLATE_FILES)) {
      let compiled = template;
      compiled = compiled.replace(/\{\{BANK_NAME\}\}/g, bank);
      compiled = compiled.replace(/\{\{THEME_COLOR\}\}/g, color);
      compiled = compiled.replace(/\{\{ALLOWED_DOMAINS\}\}/g, domains);
      compiled = compiled.replace(/\{\{API_ENDPOINT\}\}/g, api);

      compiledFiles[filename] = compiled;
    }

    renderCodeViewer();

    compilationStatus.classList.remove("hidden");
    setTimeout(() => {
      compilationStatus.classList.add("hidden");
    }, 3000);
  }

  btnCompile.addEventListener("click", () => {
    compileAll();
  });

  // Explorer File Sidebar Click
  fileListItems.forEach(item => {
    item.addEventListener("click", () => {
      fileListItems.forEach(li => li.classList.remove("active"));
      item.classList.add("active");

      activeFile = item.getAttribute("data-file");
      activeFileTitle.innerText = activeFile;
      renderCodeViewer();
    });
  });

  function renderCodeViewer() {
    if (!compiledFiles[activeFile]) {
      // compile if not yet compiled
      compileAll();
    }
    codeScreen.textContent = compiledFiles[activeFile];
  }

  // Single File Browser-side downloader
  btnDownloadFile.addEventListener("click", () => {
    const codeContent = compiledFiles[activeFile] || "";
    const blob = new Blob([codeContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Initial Compile on page load
  compileAll();
  updatePreviewStyles(inputThemeColor.value);
});
