# Browser Plugin Factory for RBI's Model Risk Management (MRM) Guidelines

Welcome to the **Browser Plugin Factory**, a enterprise-grade system designed to assist Regulated Entities (REs)—including Commercial Banks, Small Finance Banks, NBFCs, and Credit Information Companies—in implementing and operationalizing the **Reserve Bank of India (RBI) Model Risk Management (MRM) guidelines**.

This project provides a **Factory Builder** that generates customized, secure, and compliant browser extensions (Chrome/Firefox Manifest V3) tailored for individual financial institutions (e.g., configuring bank branding, API endpoints, custom risk-tiering rules, and approval workflows).

---

## 1. Executive Summary

Under the RBI’s mandate, financial institutions must maintain a **Board-approved Model Risk Management Framework (MRMF)** based on the "Three Lines of Defense" governance model. This applies to any quantitative method, system, or spreadsheet-based calculator that affects material business decisions.

A major operational bottleneck for Banks and NBFCs is that employees, model developers, and risk validators work across heterogeneous environments (such as web dashboards, cloud tools, SaaS model platforms, and web-based spreadsheets like Google Sheets or Microsoft Excel Online).

The **Browser Plugin Factory** solves this by generating custom browser extensions that **inject compliance guardrails directly into existing web workflows**. The generated plugin provides a unified sidebar and popup dashboard that helps personnel register models, calculate risk-based tiers, audit black-box AI/ML systems against the RBI’s 7 risk dimensions, and log independent validations—all on-the-fly, without leaving their current web tab.

---

## 2. RBI MRM Regulatory Compliance Matrix

The browser plugin directly implements and enforces the key pillars of the RBI's Model Risk Management guidelines:

| RBI MRM Pillar | Regulatory Requirement | Browser Plugin Implementation |
| :--- | :--- | :--- |
| **Pillar 1: Risk-Based Tiering** | Models must be classified by complexity, regulatory impact, and materiality. High-risk models require explicit approval from the Risk Management Committee of the Board (RMCB). | **Interactive Tiering Calculator**: A wizard that asks standardized questions on asset size, transaction value thresholds (e.g., INR 10 Crores limit), regulatory capital impact, and algorithmic complexity. Automatically computes Tier 1 (High Risk), Tier 2 (Medium Risk), or Tier 3 (Low Risk) and triggers a mandatory Board (RMCB) approval warning. |
| **Pillar 2: Complete Living Inventory** | REs must maintain a comprehensive, active model inventory. Retired/decommissioned models must be safely archived and retained for a minimum of ten (10) years. | **Living Inventory Manager**: A secure local/cloud database client embedded in the popup and sidebar. Users can search and filter the model registry, register new systems, and decommission existing ones. Decommissioning automatically flags a mandatory 10-year retention rule and generates an archiving certificate. |
| **Pillar 3: AI/ML Safeguards & Explainability** | Explicit controls for black-box AI models. Continuous monitoring, compensating controls, explainability analysis, and human-in-the-loop overrides are required. | **AI Governance Auditor**: An interactive checklist mapping directly to RBI's **7 AI Risk Dimensions**: 1. Hallucinations, 2. Bias/Discrimination, 3. Performance Drift, 4. Adversarial Attacks, 5. Explainability Gaps, 6. Data Privacy, and 7. Concentration Risk. Generates structured risk-mitigation logs and enforces verification of "Human-in-the-Loop Override" parameters. |
| **Pillar 4: Third-Party Accountability** | REs are fully accountable for third-party or AI/ML models. Vendor certifications do not absolve REs; independent validation and audit access are mandatory. | **Vendor Accountability Tracker**: Checklist tracking vendor transparency, available disclosures, independent validation logs, and audit access trails. Flags high-risk third-party vendor integrations that lack validation evidence. |

---

## 3. Browser Plugin Factory Architecture

The project is structured into two main layers:
1. **The Factory Dashboard (Web GUI & CLI Builder)**: An interactive web interface and a Node.js compiler (`build-plugin.js`) that allows a bank's IT security team to customize extension parameters (such as branding, allowed URLs, API endpoints, and validation rules) and export a deployment-ready Chrome Extension ZIP bundle.
2. **The Extension Template (Manifest V3)**: The underlying source files that are compiled with custom brand configurations.

### Directory Structure

```
browser-plugin-factory/
├── factory-app/                  # Web GUI for customizing & building plugins
│   ├── index.html                # Main factory interface
│   ├── style.css                 # Factory styling
│   └── factory.js                # Factory client-side compilation logic
├── template-extension/           # Base extension files (Manifest V3)
│   ├── manifest.json             # Manifest template
│   ├── popup.html                # Popup UI (Dashboard, Inventory, Calculators)
│   ├── popup.css                 # Enterprise financial styling
│   ├── popup.js                  # Popup interactive logic
│   ├── content.js                # Content script injecting compliance sidebar
│   ├── sidebar.html              # Sidebar overlay UI (inserted in spreadsheet pages)
│   ├── sidebar.css               # Sidebar styling
│   ├── sidebar.js                # Content script sidebar interactive logic
│   ├── background.js             # Background worker managing state & mock sync
│   ├── options.html              # Options/Settings panel
│   └── options.js                # Options controller
├── build-plugin.js               # CLI Builder script (Node.js)
├── test/                         # End-to-End & Unit Testing suite
│   ├── build.test.js             # Tests the extension builder and configuration compiler
│   ├── extension.test.js         # Tests the compliance calculators and storage logic
│   └── run-tests.js              # Test runner
└── PLUGIN.md                     # This blueprint file
```

---

## 4. Security & Sandboxing Blueprint (Banking Deployments)

Financial institutions operate under strict security constraints. A browser plugin deployed to bank employees must prevent data exfiltration, maintain privacy, and avoid interference with sensitive bank operations. The generated plugin implements the following security safeguards:

1. **Strict Content Security Policy (CSP)**:
   The plugin prevents the injection of unsafe inline scripts (`'unsafe-eval'`) and restricts network connections solely to the bank's approved internal compliance API endpoints configured during factory generation.
2. **Local-First Zero-Knowledge Architecture**:
   All compliance calculators, risk evaluations, and checklists run strictly in-memory or save to local sandboxed storage (`chrome.storage.local`). Data is synchronized to the core compliance system only through authenticated HTTPS POST requests. No telemetry is shared with external servers.
3. **Domain-Specific Whitelisting**:
   The factory limits content script injection to specific domains (e.g., `*.bank-internal.com`, `docs.google.com`, `excel.officeapps.live.com`). The plugin will NOT read or inject on unapproved third-party or consumer web pages.
4. **Audit Logs**:
   Every action in the extension—such as calculating risk, adding a model, or downloading an audit report—generates a tamper-resistant local audit entry containing user ID, timestamp, target web URL, and action details.

---

## 5. Detailed Implementation Specifications

### Manifest V3 Configuration
The `manifest.json` uses declarative permissions to ensure minimal privilege:
```json
{
  "manifest_version": 3,
  "name": "{{BANK_NAME}} MRM Compliance Assistant",
  "version": "1.0.0",
  "description": "Assists {{BANK_NAME}} with RBI Model Risk Management Guidelines",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "{{ALLOWED_DOMAINS}}"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "options_page": "options.html",
  "content_scripts": [
    {
      "matches": ["{{ALLOWED_DOMAINS}}"],
      "js": ["content.js"],
      "css": ["sidebar.css"]
    }
  ]
}
```

### Risk-Based Tiering Logic
The risk engine uses a point-based classification based on the RBI draft instructions:
- **Materiality Score**: Influenced by transaction volume (INR > 10 Cr is High risk), business impact, and user base.
- **Regulatory Score**: Influenced by whether the model calculations directly feed into Basel regulatory capital, NPA provisioning, credit approvals, or customer pricing.
- **Complexity Score**: Encompasses statistical models, spreadsheet calculations, and deep-learning/black-box models.
- **Result Tier**:
  - **Tier 1 (High Risk)**: Materiality or Regulatory Score is High. Requires RMCB board-level approval logs.
  - **Tier 2 (Medium Risk)**: Moderate complexity and business impact. Requires Chief Risk Officer validation signoff.
  - **Tier 3 (Low Risk)**: Low complexity, local spreadsheet tools. Still requires registration and periodic self-assessment.

### Active living Inventory
The storage mechanism uses `chrome.storage.local` to maintain an active registry of models, supporting properties like:
- `id` (e.g., `MDL-2026-004`)
- `name` (e.g., `AI Credit Scoring Model`)
- `version` (e.g., `v2.4.0`)
- `owner` (e.g., `Retail Lending Division`)
- `riskTier` (Tier 1/2/3)
- `status` (Active / Retired)
- `decommissionedDate` (Archived with 10-year warning if retired)
- `validationDate` (Latest independent validation check date)

---

## 6. End-to-End & Unit Testing Strategy

To ensure reliability, the project includes automated E2E and Unit testing:

1. **Unit Testing (`test/extension.test.js`)**:
   - Validates the Risk-Based Tiering Engine: checks that high transaction values or regulatory capital models correctly flag as Tier 1 and prompt for RMCB approval.
   - Validates the Inventory Manager: checks that adding, searching, and retiring models behaves correctly, especially confirming that retired models get assigned a 10-year minimum archiving flag.
   - Validates the AI Risk assessment checklist: checks that missing explanations or human-in-the-loop approvals trigger high-risk compliance alerts.

2. **Integration & Builder Testing (`test/build.test.js`)**:
   - Validates that `build-plugin.js` reads user configurations (Bank Name, brand colors, Whitelisted URLs).
   - Validates that the builder compiles correct, error-free JavaScript and JSON templates, and creates a valid distribution ZIP.

3. **E2E Browser Interface Verification**:
   - Simulated JSDOM tests verify that Popup tabs transition correctly, event listeners trigger modal workflows, and the UI adapts dynamically to RMCB approval prompts.

---

## 7. How to Run & Build

### System Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Launching the Browser Plugin Factory Web GUI
1. Open `factory-app/index.html` in any web browser.
2. Customize the Bank Name (e.g., "State Bank of India"), Theme Primary Color, Allowed Domains, and API Connection details.
3. Click **Generate Extension** to configure and instantly package your Chrome extension.

### 2. Building via CLI (Command Line)
To compile a customized plugin from the command line, run:
```bash
node build-plugin.js --bank "HDFC Bank" --color "#1e3a8a" --domains "*://*.hdfcbank.com/*" --api "https://api.hdfcbank.com/mrm-sync"
```
The script will output a completed Chrome Extension folder and a zip bundle named `dist/hdfc-bank-mrm-assistant.zip`.

### 3. Running Automated Tests
Run the following command to execute all unit and integration tests:
```bash
npm test
```

This ensures full compliance and structural correctness of the generated extensions before deployment to banking environments.
