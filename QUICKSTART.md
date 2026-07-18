# Quickstart & Verification Guide: RBI MRM Browser Plugin Factory

This guide walk you step-by-step through generating, building, loading, and auditing customized Chrome Extensions using the **Browser Plugin Factory for RBI's Model Risk Management (MRM) Guidelines**.

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

## Step 1: Visual Customization & Compilation via Web GUI

To launch and visually customize your bank's extension, follow these steps:

1. Locate and open `factory-app/index.html` in your web browser (Chrome/Firefox/Safari).
2. Look at the **1. Customization Settings** panel:
   * **Regulated Entity Name**: Input your bank or NBFC name (e.g., `HDFC Bank Ltd`).
   * **Primary Brand Theme Color**: Click the color picker or input a hex code (e.g., `#1e3a8a` for classic dark blue).
   * **Permitted Host Domains**: Input a comma-separated list of domains where the extension should inject (e.g., `*://*.hdfc.com/*, *://docs.google.com/*`). This ensures the content script restricts injection solely to authorized banking networks and spreadsheets.
   * **Compliance Core API Endpoint**: Input your core MRM compliance synchronization URL.
3. Observe the **2. Live Extension Popup Preview** panel. As you change values on the left, the replica browser address bar, the extension badge background, and the popup content will update instantly in real-time!
4. Click the **"Compile Extension Source"** button. The file list and editor in **3. Compiled Chrome Extension Source Explorer** will compile the live configuration.
5. Click on `popup.js` or `manifest.json` in the file list to verify that the template placeholders (like `{{BANK_NAME}}`) have been compiled correctly with your customized input (e.g., `"HDFC Bank Ltd"`).
6. Click **"Download File"** to download individual compiled files directly to your machine.

---

## Step 2: CLI Compiler & ZIP Packaging Automation

If you prefer to automate compiling and packaging your browser extensions using a command-line interface, run the Node.js compiler:

### 1. Execute CLI Command
Open your terminal at the root of the repository and execute:
```bash
node build-plugin.js --bank "State Bank of India" --color "#0f1e36" --domains "*://*.sbi.co.in/*" --api "https://api.sbi.co.in/mrm-sync" --out "dist/sbi-mrm-assistant.zip"
```

### 2. Verify Output
The CLI builder reads the template source code under `template-extension/`, replaces the placeholders with your parameters, outputs the unpacked files in `dist/unpacked/`, and packages the bundle into a standard ZIP archive:
```bash
# Verify zipped package creation
ls -la dist/sbi-mrm-assistant.zip
```

---

## Step 3: Loading the Sideloaded Extension in Google Chrome

To sideload and test your generated extension:

1. Extract the generated ZIP bundle (`dist/sbi-mrm-assistant.zip`) or locate the unpacked folder under `dist/unpacked/`.
2. Open Google Chrome and type `chrome://extensions` in the URL bar.
3. Toggle the **"Developer mode"** switch on the top right-hand corner of the page.
4. Click on the **"Load unpacked"** button in the top left corner.
5. Select the `unpacked/` folder (or your extracted directory) containing your compiled `manifest.json`.
6. You will see the **"{{BANK_NAME}} RBI MRM Compliance Assistant"** card loaded on your screen.
7. Click the Extension Puzzle icon 🧩 in your browser toolbar and pin the Shield icon 🛡️ to your browser bar.

---

## Step 4: Testing Key RBI MRM Compliance Workflows

Click on the pinned shield icon 🛡️ in your browser toolbar to launch the interactive compliance interface. Test the following four compliance pillars:

### Workflow A: Risk-Based Tiering Assessment
1. Click on the **Risk Tiering** tab.
2. Answer the assessment questionnaire:
   * Select **"Yes"** for Materiality: This triggers if model operations exceed **INR 10 Crores** in annual value, or influence core balance sheet results.
   * Select **"Yes"** for Regulatory & Capital Impact: Indicates if the model directly affects Basel capital adequacy, provisions, or customer interest pricing.
   * Select **"Black-box AI/ML Model"** for Complexity.
3. Click **"Calculate Model Risk Tier"**.
4. The calculator computes **Tier 1 (High Risk)** and reveals a critical warning:
   > ⚠️ RMCB BOARD APPROVAL MANDATORY
   > Under RBI MRM rules, Tier 1 models require explicit Board-level Risk Management Committee (RMCB) approval before production deployment.
5. Try clicking "Save Assessment" without checking the approval box. The plugin enforces a compliance error blocking registration!
6. Check **"Log that Board (RMCB) approval has been secured"** and click **"Save Assessment to Model Registry"**. Enter a name for the model (e.g., `AI Retail Loan Scoring`) and click OK. The model is added to your living active inventory.

### Workflow B: Managing Active Living Inventory & 10-Year Archiving
1. Click on the **Model Inventory** tab.
2. Look at the data table. You will see your newly registered model listed as **Active** along with pre-loaded mock models.
3. Try typing a query in the search bar. The table filters records instantly by ID, owner division, or model name.
4. Find an active model in the list and click **"Decommission"**.
5. The extension triggers a compliance popup warning:
   > 🚨 WARNING: Under RBI MRMF guidelines, retiring this model will trigger a MANDATORY ten (10) year retention archival rule. You will not be able to purge this record.
6. Click OK. The model's status changes to **Retired** and locks the action button. An automated archival retention tag is attached, preserving evidence for standard regulatory audits.

### Workflow C: Performing AI/ML Governance & 7-Risk Audits
1. Click on the **AI/ML Audit** tab.
2. Select your registered model from the dropdown.
3. Look at the expandable accordion covering the **RBI's 7 AI Risk Dimensions**:
   * *1. Hallucination Risk*
   * *2. Bias & Discrimination*
   * *3. Model Drift*
   * *4. Adversarial Attack Safeguards*
   * *5. Explainability Gaps (Black-Box)*
   * *6. Data Privacy & Leakage*
   * *7. Supply Chain Concentration Risk*
4. Toggle any check box. The sidebar expands to reveal a designated input area where developers must record **compensating controls** (e.g., entering "SHAP local explanations" or "Monthly PSI monitoring thresholds").
5. Enforce safety check: Under RBI rules, customer-facing AI systems must have override permissions. Enforce this by checking **"Human-in-the-Loop Override Configured"** and enter the role of the overriding authority (e.g., `Chief Risk Officer`).
6. Click **"Save AI Governance Audit Logs"**. The controls are permanently recorded into the model's storage logs.

### Workflow D: Syncing Central Logs & Downloading Audit Packs
1. Click on the **Data Sync** tab.
2. The endpoint field displays your whitelisted central compliance core URL.
3. Click **"Sync with Core Systems"**. The engine synchronizes your local sandboxed model registry, RMCB board logs, and AI audits directly to your bank's central repository.
4. Click **"Download RBI Audit Pack (JSON)"**. The plugin instantly packages your entire active living inventory, audit assessments, and validation dates into an offline, portable, encrypted JSON pack ready for submission to RBI supervisory examiners!
