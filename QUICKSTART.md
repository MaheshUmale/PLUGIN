# Quickstart & Verification Guide: RBI MRM Browser Plugin Factory

This guide walks you step-by-step through generating, building, loading, and auditing customized Chrome Extensions using the **Browser Plugin Factory for RBI's Model Risk Management (MRM) Guidelines**.

---

## 🚀 Architectural Overview

The Browser Plugin Factory compiles customized compliance companion browser extensions (Manifest V3) designed to assist Regulated Entities (REs) like Banks and NBFCs. The workflow operates as follows:

```
[ Bank Compliance Officer / IT Team ]
       │
       ├──► Web GUI Factory (factory-app/index.html)  ──► On-the-fly In-Browser Compile & Download
       │
       └──► CLI Compiler Script (build-plugin.js)     ──► Terminal Automation & ZIP Packaging
                                                                     │
                                                                     ▼
                                                   [ Compiled Extension Bundle (dist/) ]
                                                                     │
                                                                     ▼
                                                   [ Sideloaded in Chrome (Developer Mode) ]
                                                                     │
                                                                     ▼
                                             [ Embedded Sidebar & Popup Compliance Guards ]
```

---

## 📸 Factory Dashboard Interface

Below is the interface of the **Web GUI Factory App** showing a customized compilation for **HDFC Bank Ltd** with an interactive visual browser mockup and source code explorer:

![Browser Plugin Factory Dashboard](/docs/images/factory_dashboard.png)

---

## 🛡️ Actual Running Plugin Popup Screenshots

Below are screenshots of the **compiled and running browser extension** captured directly from the browser popup interface:

### 1. Active living Model Inventory Tab
Used to search, browse, and register models. It highlights the owners, active risk tiers, and status. It contains the **Decommission** trigger to retire models under the 10-year archiving policy.

![Model Inventory Tab Screenshot](/docs/images/plugin_inventory.png)

### 2. Risk-Based Tiering Calculator Tab
Used to classify models based on Materiality (INR 10 Crores threshold), Regulatory Capital Relevance (Basel, NPA), and Complexity (statistical, deep learning, spreadsheet).

![Risk-Based Tiering Screenshot](/docs/images/plugin_tiering.png)

### 3. AI/ML Governance Auditor Tab
Enforces compliance checkpoints for **RBI's 7 AI Risk Dimensions** (Drift, Hallucinations, Bias, Adversarial, Explainability, Privacy, Concentration) and records **Human-In-The-Loop Override** settings.

![AI/ML Audit Screenshot](/docs/images/plugin_ai_audit.png)

---

## 📋 Comprehensive Compliance Use Cases & Scenarios Captured

The browser plugin handles several critical operational scenarios faced by bank risk managers and model developers:

### Scenario 1: Sideloaded Spreadsheet-Based Calculator Auditing
* **Use Case**: Many bank teams use simple MS Excel Online or Google Sheets spreadsheets to perform material business decision calculations (e.g. loan interest rates, deposit yields). RBI guidelines mandate that these spreadsheets qualify as "models" and must be governed.
* **Plugin Capture**: The extension injects a sliding **Compliance Sidebar** directly into Google Sheets and bank portals. With one click (**"Add Active Tab to Model Inventory"**), the validator registers the current sheet URL, name, and owner into the living inventory, instantly regularizing untracked shadow calculators.

### Scenario 2: Enforcing Board-Level (RMCB) Approvals for Tier-1 Models
* **Use Case**: Under RBI guidelines, high-risk models must be explicitly approved by the Risk Management Committee of the Board (RMCB).
* **Plugin Capture**: The plugin's Tiering Calculator evaluates answers to the financial and regulatory questionnaire. If financial impact exceeds **INR 10 Crores** or involves capital calculation, it calculates **Tier 1 (High Risk)** and flags a mandatory warning. The extension blocks saving the assessment until the developer checks the box confirming RMCB board approval has been formally secured and logged.

### Scenario 3: Enforcing the 10-Year Archiving Retention Policy on Decommissioning
* **Use Case**: When a model is retired, banks frequently lose its archival data. RBI rules mandate that decommissioned models must be safely archived and retained for a minimum of ten (10) years.
* **Plugin Capture**: When a user clicks **"Decommission"** in the Living Inventory tab, the plugin triggers a high-severity warning reminding them of the mandatory 10-year rule. Once confirmed, the model status shifts to "Retired", locks editing, and automatically stamps the exact compliance expiration year (Current Year + 10) to prevent early records purging.

### Scenario 4: Mitigating AI/ML "Black-Box" Drift & Explainability Gaps
* **Use Case**: Regulated Entities deploying complex neural networks or LLMs face risks of drift, hallucinations, and bias.
* **Plugin Capture**: The **AI/ML Auditor** checks the model against the 7 AI Risk Dimensions. It requires documenting specific compensating controls (such as SHAP/LIME explainability tools or continuous Population Stability Index monitoring) and logging a designated **Human-in-the-Loop Override** officer (e.g., Chief Risk Officer) as required by supervisory guidance.

### Scenario 5: Enforcing Third-Party Vendor Accountability & Audit Rights
* **Use Case**: Banks cannot transfer model risk responsibility to third-party providers. "Vendor blame" is not permitted.
* **Plugin Capture**: The **Vendor Tracker** forces teams to audit SaaS models against transparency metrics (disclosures, independent third-party validation, and source code audit access). If any check is missing, the plugin flags a high-severity **"High Outsourcing Risk"** warning, guiding procurement teams to halt deployment.

---

## Step 1: Visual Customization & Compilation via Web GUI

To launch and visually customize your bank's extension, follow these steps:

1. Locate and open `factory-app/index.html` in your web browser (Chrome/Firefox/Safari).
2. Look at the **1. Customization Settings** panel:
   * **Regulated Entity Name**: Input your bank or NBFC name (e.g., `Federal Bank of India`).
   * **Primary Brand Theme Color**: Click the color picker or input a hex code (e.g., `#0b3c5d`).
   * **Permitted Host Domains**: Input a comma-separated list of domains (e.g., `*://*.federalbank.co.in/*, *://docs.google.com/*`).
3. Click **"Compile Extension Source"**. The file explorer compiles the live configuration.
4. Click **"Download File"** to download individual compiled files directly to your machine.

---

## Step 2: CLI Compiler & ZIP Packaging Automation

To automate compiling and packaging your browser extensions using a command-line interface:

```bash
node build-plugin.js --bank "Federal Bank of India" --color "#0b3c5d" --domains "<all_urls>" --api "https://api.compliance-core.internal/mrm-sync" --out "dist/rbi-mrm-extension.zip"
```

---

## Step 3: Loading the Sideloaded Extension in Google Chrome

1. Extract the generated ZIP bundle or locate `dist/unpacked/`.
2. Open Google Chrome and type `chrome://extensions` in the URL bar.
3. Toggle the **"Developer mode"** switch on the top right-hand corner.
4. Click on the **"Load unpacked"** button in the top left corner.
5. Select the `unpacked/` folder (or extracted directory) containing your compiled `manifest.json`.
6. Pin the Shield icon 🛡️ to your browser bar.
