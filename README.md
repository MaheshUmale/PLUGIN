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

To operationalize and enforce compliance with these guidelines directly in web workflows (e.g., inside internal banking portals, cloud spreadsheets like Google Sheets, or third-party AI dashboards), this repository introduces the **Browser Plugin Factory**.

The **Browser Plugin Factory** is an enterprise solution that allows Banks & NBFCs to generate customized, secure, and compliant Chrome/Firefox Extensions (Manifest V3). These extensions inject real-time compliance sidebars, calculators, and audit sheets directly into the browser to guide developers and validators.

---

### 📸 Factory Dashboard Interface

![Browser Plugin Factory Dashboard](/docs/images/factory_dashboard.png)

---

### 🛡️ Actual Running Plugin Popup Screenshots

Below are screenshots of the **compiled and running browser extension** captured directly from the browser popup interface:

| 1. Active living Model Inventory | 2. Risk-Based Tiering | 3. AI/ML Governance Audit |
| :---: | :---: | :---: |
| ![Model Inventory](/docs/images/plugin_inventory.png) | ![Risk-Based Tiering](/docs/images/plugin_tiering.png) | ![AI/ML Audit](/docs/images/plugin_ai_audit.png) |

---

### 📋 Key Use Cases & Scenarios Captured by the Plugin:

1. **Spreadsheet-Based Calculator Auditing (Scenario 1)**: Injects an active sidebar directly on web-based spreadsheets (e.g., Google Sheets or Excel Online) enabling users to register shadow model calculators into the central database with one click.
2. **RMCB Board-Level Approval Enforcement (Scenario 2)**: Automatically detects **Tier 1 (High Risk)** models based on financial materiality (>INR 10 Crores) and blocks deployment registry until explicit confirmation of Board (RMCB) approval is checked and logged.
3. **10-Year Archival Retention Lock (Scenario 3)**: Triggers high-priority regulatory warnings upon model decommissioning. Once retired, the model records are locked and stamped with an automated **10-year preservation requirement** to comply with RBI archival rules.
4. **AI/ML 7-Risk Dimension Oversight (Scenario 4)**: Enforces recording compensating controls targeting the **7 AI Risk Dimensions** (drift, hallucinations, bias, adversarial, explainability, privacy, concentration) and requires documenting **Human-In-The-Loop Override** credentials.
5. **Vendor Accountability Auditing (Scenario 5)**: Audits third-party models against transparency standards (disclosure, audit rights, annual validation logs), warning procurement teams of **"High Outsourcing Risk"** if logs are missing.
6. **Real-Time Breach Alert & Board Reporting (Scenario 6)**: Scans and flags models exceeding safety thresholds (e.g. `MDL-5040` with high drift). Triggers a critical red banner alert, forcing senior management to document retraining plans and file formal Board (RMCB) reports.
7. **Formula Diff & Spreadsheet Change Control (Scenario 7)**: Sidebar monitors active cell coordinates (e.g. `Cell H10`). If an unapproved formula modification is simulated, it suspends validation, displays a side-by-side green and red diff, and forces documenting an impact assessment.
8. **Scheduled Background Pipeline Polling (Scenario 8)**: Allows enabling continuous 24h scheduled validation checks to fetch latest performance metrics, validations, and drift indices directly from the central machine-learning pipeline.

---

## Project Structure & Documentation

* **[`docs/INFOGRAPHICS.md`](/docs/INFOGRAPHICS.md)**: Simple, short, and high-impact marketing infographics explaining how the product aligns boardroom RBI guidelines with active code.
* **[`LINKEDIN_POST.md`](/LINKEDIN_POST.md)**: Highly engaging corporate marketing template for LinkedIn campaigns.
* **[`COMPLIANCE_EVALUATION.md`](/COMPLIANCE_EVALUATION.md)**: Gap Analysis and Evaluation Report of our Browser Plugin Factory against the RBI Draft guidelines (referencing AMLEGALS 2026 legal framework), analyzing completed features and future product roadmaps.
* **[`QUICKSTART.md`](/QUICKSTART.md)**: Step-by-Step Guide on running the Web GUI customization, compiling extensions with CLI builders, loading unpacked extension in Chrome, and testing compliance workflows with full screenshots and scenario descriptions.
* **[`PLUGIN.md`](/PLUGIN.md)**: Detailed Architecture Blueprint, Chrome Extension Manifest V3 Specifications, Security & Sandboxing Policies, **Regex vs. Transformers.js search discovery architecture**, and Testing Strategy.
* **[`factory-app/`](/factory-app/)**: Web GUI configuration page where you can brand, configure, and generate custom browser extensions for your bank.
* **[`template-extension/`](/template-extension/)**: Base template source code for the Chrome Extension.
* **[`build-plugin.js`](/build-plugin.js)**: CLI engine that configures, compiles, and packages custom bank plugins.
* **[`test/`](/test/)**: Extensive automated test suite validating calculations, retention flags, and compilation templates.

---

## 🏃 Quick Start Command (CLI Build)

Ensure you have Node.js installed. To compile a customized plugin from the command line, run:
```bash
node build-plugin.js --bank "Federal Bank of India" --color "#0b3c5d" --domains "*://*.federalbank.co.in/*" --api "https://api.federalbank.co.in/mrm-sync"
```
The script will output a completed Chrome Extension folder and a zip bundle named `dist/rbi-mrm-extension.zip`.

---

## 🧪 Testing and Verification

To execute all unit and integration tests, run:
```bash
npm test
```

This verifies calculations, active living inventories, and CLI compiler builders, ensuring full compliance before deployment.

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
