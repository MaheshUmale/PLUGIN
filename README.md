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

### Key Capabilities of Generated Plugins:
1. **Interactive Risk-Based Tiering Calculator**: On-the-fly evaluation of model complexity, materiality (e.g., INR 10+ Crores impact), and regulatory capital involvement, with explicit RMCB Board approval workflows for Tier-1 systems.
2. **Active Living Inventory Interface**: Unified model registry client built into the popup and sidebar with an automated **10-Year retention flag** when a model is decommissioned.
3. **AI/ML Governance Auditor Checklist**: Real-time auditing for the **7 AI Risk Dimensions** (Drift, Hallucinations, Bias, Adversarial Attacks, Explainability Gaps, Data Privacy, Vendor Concentration) as mandated by the RBI's August 2025 FREE-AI Committee and June 2026 guidelines.
4. **Third-Party Accountability Tracker**: Evaluates vendor disclosures, independent validations, and logs to ensure the Regulated Entity is never exposed to "vendor blame" liability.

---

## Project Structure & Documentation

* **[`PLUGIN.md`](/PLUGIN.md)**: Detailed Architecture Blueprint, Chrome Extension Manifest V3 Specifications, Security & Sandboxing Policies, and Testing Strategy.
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
* NASSCOM Draft MRM Policy analysis: https://community.nasscom.in/communities/public-policy/analysis-rbis-draft-guidance-regulatory-principles-model-risk-management

---

*AI responses may include mistakes. Refer to official RBI circulars for formal auditing guidelines.*
