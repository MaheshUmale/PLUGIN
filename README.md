# RBI Model Risk Management (MRM) Framework Support System

The Reserve Bank of India (RBI) mandates a Board-approved Model Risk Management Framework (MRMF) for financial institutions. It requires a "Three Lines of Defense" system—1st line (Developers), 2nd line (Independent Validation), and 3rd line (Internal Audit). Outsourcing to third-party or AI/ML vendors does not absolve a firm from independent validation. [1, 2, 3, 4]  
The RBI's Model Risk Management (MRM) guidelines define a "model" broadly—encompassing any system, including simple spreadsheet-based calculators, that takes inputs and produces outputs affecting material business decisions. [1, 3]  

### Key Pillars of the RBI's MRM Guidelines
* **Risk-Based Tiering**: Models must be classified by their complexity, regulatory impact, and materiality. High-risk models require explicit approval from the Risk Management Committee of the Board (RMCB).
* **Complete Inventory**: Firms must maintain an active, living model inventory, with retired or decommissioned models archived for a minimum of ten years.
* **Strict AI/ML Safeguards**: For "black-box" models or those with high explainability thresholds, institutions must employ compensating controls, continuous monitoring, and human-in-the-loop overrides.
* **Third-Party Accountability**: Regardless of any vendor certification, Regulated Entities (REs) are fully accountable for third-party or AI/ML models. This necessitates independent validation and audit access. [1, 4]

### Applicable Entities
The mandate extends across a broad range of institutions, including commercial banks, Small Finance Banks, Payments Banks, Regional Rural Banks (RRBs), co-operative banks, NBFCs across all layers, Asset Reconstruction Companies (ARCs), and Credit Information Companies (CICs). [4, 8]  

---

## The Solution: Browser Plugin Factory for RBI's MRM Guidelines

The **Browser Plugin Factory** is an enterprise-grade solution that allows Banks & NBFCs to generate customized, secure, and compliant Chrome/Firefox Extensions (Manifest V3). These extensions inject real-time compliance sidebars, calculators, and audit sheets directly into the browser to guide developers and validators as they edit Google Sheets, MS Excel Online, or internal dashboards.

---

### 📸 Factory Dashboard Interface

The visual Web GUI builder allows compliance officers to brand, preview, and compile custom extensions on-the-fly inside the browser:

![Browser Plugin Factory Dashboard](/docs/images/factory_dashboard.png)

---

### 🛡️ Actual Running Plugin Popup Screenshots

Below are actual screenshots of the compiled and running browser extension captured from the Chrome popup interface:

| 1. Living Model Inventory | 2. Risk-Based Tiering | 3. AI/ML Governance Audit |
| :---: | :---: | :---: |
| ![Model Inventory](/docs/images/plugin_inventory.png) | ![Risk-Based Tiering](/docs/images/plugin_tiering.png) | ![AI/ML Audit](/docs/images/plugin_ai_audit.png) |

---

### 📋 Key Use Cases & Scenarios Captured by the Plugin:

1. **Spreadsheet-Based Calculator Auditing**: Injects an active sidebar directly on web-based spreadsheets (e.g., Google Sheets or Excel Online) enabling users to register shadow model calculators into the central database with one click.
2. **RMCB Board-Level Approval Enforcement**: Automatically detects **Tier 1 (High Risk)** models based on financial materiality (>INR 10 Crores) and blocks deployment registry until explicit confirmation of Board (RMCB) approval is checked and logged.
3. **10-Year Archival Retention Lock**: Triggers high-priority regulatory warnings upon model decommissioning. Once retired, the model records are locked and stamped with an automated **10-year preservation requirement** to comply with RBI archival rules.
4. **AI/ML 7-Risk Dimension Oversight**: Enforces recording compensating controls targeting the **7 AI Risk Dimensions** (drift, hallucinations, bias, adversarial, explainability, privacy, concentration) and requires documenting **Human-In-The-Loop Override** credentials.
5. **Vendor Accountability Auditing**: Audits third-party models against transparency standards (disclosure, audit rights, annual validation logs), warning procurement teams of **"High Outsourcing Risk"** if logs are missing.
6. **Real-Time Breach Alert & Board Reporting**: Scans and flags models exceeding safety thresholds (e.g. `MDL-5040` with high drift). Triggers a critical red banner alert, forcing senior management to document retraining plans and file formal Board (RMCB) reports.
7. **Formula Diff & Spreadsheet Change Control**: Sidebar monitors active cell coordinates (e.g. `Cell H10`). If an unapproved formula modification is simulated, it suspends validation, displays a side-by-side green and red diff, and forces documenting an impact assessment.
8. **Scheduled Background Pipeline Polling**: Allows enabling continuous 24h scheduled validation checks to fetch latest performance metrics, validations, and drift indices directly from the central machine-learning pipeline.

---

## 💻 Step-by-Step Local Setup & Quickstart Guide

Follow these steps to run, compile, test, and sideload the browser companion locally:

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your local machine.

### 2. Project Installation
Clone the repository and install dependencies in your terminal:
```bash
# Clone the repository
git clone https://github.com/your-org/rbi-mrm-browser-plugin-factory.git
cd rbi-mrm-browser-plugin-factory

# Install standard dependencies
npm install
```

### 3. Launching the Visual Customizer App (Web GUI)
The factory comes with an offline-ready single-page builder application. To open it:
* Double-click on `factory-app/index.html` or run:
  ```bash
  # Open in your default browser on macOS/Linux
  open factory-app/index.html
  ```
* Customize the Bank Name, Brand Color, Whitelisted URL domains, and Sync URL.
* Click **"Compile Extension Source"** to view fully compiled code inside the Source Explorer, and click **"Download File"** to save customized files locally.

### 4. Compiling via CLI Terminal (CLI Build)
To compile a branded extension folder and package it as a ZIP bundle, run the builder script:
```bash
node build-plugin.js --bank "Federal Bank of India" --color "#0b3c5d" --domains "*://*.federalbank.co.in/*" --api "https://api.federalbank.co.in/mrm-sync"
```
The compiler processes files from `template-extension/`, replaces configuration placeholders, outputs the unpacked files to `dist/unpacked/`, and packages the bundle to `dist/rbi-mrm-extension.zip`.

### 5. Running Automated Compliance Tests
The repository features an extensive, zero-dependency testing suite verifying all compliance engines (tiering calculators, 10-year retention dates, breach alerts, spreadsheet formula diffs). Run:
```bash
npm test
```

### 6. Loading and Testing in Google Chrome
To sideload the generated plugin on your employee browsers:
1. Extract your compiled ZIP archive or locate `dist/unpacked/`.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Toggle the **"Developer mode"** switch in the top right-hand corner.
4. Click on **"Load unpacked"** in the top left and select your unpacked folder containing `manifest.json`.
5. Pin the shield icon 🛡️ to your browser bar and start testing compliance workflows!

---

## Project Structure & Documentation

* **[`COMPLIANCE_EVALUATION.md`](/COMPLIANCE_EVALUATION.md)**: Gap Analysis and Evaluation Report of our Browser Plugin Factory against the RBI Draft guidelines (referencing AMLEGALS 2026 legal framework), analyzing completed features and future product roadmaps.
* **[`QUICKSTART.md`](/QUICKSTART.md)**: In-depth Step-by-Step Guide detailing how to use and test every single compliance scenario in the running popup and sidebar.
* **[`PLUGIN.md`](/PLUGIN.md)**: Detailed Architecture Blueprint, Chrome Extension Manifest V3 Specifications, Security & Sandboxing Policies, **Regex vs. Transformers.js search discovery architecture**, and Testing Strategy.
* **[`factory-app/`](/factory-app/)**: Web GUI configuration page where you can brand, configure, and generate custom browser extensions for your bank.
* **[`template-extension/`](/template-extension/)**: Base template source code for the Chrome Extension.
* **[`build-plugin.js`](/build-plugin.js)**: CLI engine that configures, compiles, and packages custom bank plugins.
* **[`test/`](/test/)**: Extensive automated test suite validating calculations, retention flags, and compilation templates.

---

## References & Regulatory Guidance
For comprehensive regulatory details and instructions on compliance submission, refer to the official:
* **RBI Draft Guidance on Regulatory Principles for Model Risk Management**
* **FIDC India Regulatory Document** [9]
* Vinod Kothari analysis on RBI Draft Model Risk Management Guidelines: https://vinodkothari.com/2026/06/rbi-draft-model-risk-management-guidelines-2026/
* KPMG analysis: https://assets.kpmg.com/content/dam/kpmgsites/in/pdf/2024/11/model-risk-management.pdf
* M2P Fintech blog on RBI Draft Guidelines: https://m2pfintech.com/blog/rbi-draft-guidelines-ai-model-risk-management/
* AMLEGALS Regulatory Principles on Model Risk Management: https://amlegals.com/rbis-draft-model-risk-management-framework-strengthening-ai-governance-in-banking-and-financial-services/
* NASSCOM Draft MRM Policy analysis: https://community.nasscom.in/communities/public-policy/analysis-rbis-draft-guidance-regulatory-principles-model-risk-management

---

*AI responses may include mistakes. Refer to official RBI circulars for formal auditing guidelines.*
