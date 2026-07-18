# RBI MRM Compliance Evaluation Report: Gap & Feature Analysis

This report evaluates our **Browser Plugin Factory** implementation against the Reserve Bank of India’s (RBI) Model Risk Management (MRM) Draft Framework, specifically incorporating legal perspectives and guidelines outlined in the **AMLEGALS 2026 Regulatory Analysis** (*"RBI’s Draft Model Risk Management Framework: Strengthening AI Governance in Banking and Financial Services"*).

---

## 1. Executive Summary

The AMLEGALS analysis highlights that the RBI's June 2026 guidelines serve as **"first principles"** guidance aiming to build a top-down culture of accountability (from the boardroom down to the code) rather than simply reacting to AI failures post-facto.

The **Browser Plugin Factory** addresses these requirements by injecting compliance workflows and guardrails directly into bankers' active workspaces (such as web spreadsheets and SaaS portals). This report analyzes which regulatory mandates are **fully completed** in our project delivery and identifies any **missing/future roadmap features** required as the RBI rules progress toward finalization.

---

## 2. Comprehensive Compliance Alignment Matrix

The table below maps the specific regulatory expectations outlined in the AMLEGALS review against the deliverables in our **Browser Plugin Factory**:

| RBI Draft MRM Regulatory Expectation (AMLEGALS) | System Delivery Status | Browser Plugin Factory Implementation Details |
| :--- | :---: | :--- |
| **Broad Definition of "Model"** (including simple spreadsheet calculators driving pricing or credit). | **🟢 Completed** | **Spreadsheet Sidebar Integration**: Content scripts inject a floating launcher directly into spreadsheets (Google Sheets, Excel Online), enabling users to add active shadow calculators to the Living Inventory with one click. |
| **Risk-Based Tiering** (materiality and complexity classification). | **🟢 Completed** | **Point-Based Tiering Calculator**: Dynamically evaluates Materiality (INR 10 Crores threshold), Regulatory Impact, and Complexity to calculate Tier 1, 2, or 3 risk. |
| **Boardroom Governance (RMCB Approval)** (Explicit Board Risk Committee sign-off for high-risk models). | **🟢 Completed** | **RMCB Hard Lock**: If calculated as Tier 1 (High Risk), the plugin enforces a mandatory warning block. The user cannot save the model to the inventory until they log explicit RMCB approval. |
| **Long-Term Model Traceability (10-Year Archive)** (Archiving decommissioned systems for 10 years). | **🟢 Completed** | **Archival Retention Stamp**: Decommissioning active models triggers a high-severity warning of the 10-year rule. The registry then locks the record as "Retired" and calculates the exact retention year. |
| **Specialized AI/ML Governance** (drift, bias, explainability, human oversight). | **🟢 Completed** | **AI/ML Governance Auditor**: Evaluates RBI's 7 AI Risk Dimensions and records compensating controls alongside mandatory **Human-In-The-Loop Override** credentials. |
| **Third-Party & Vendor Accountability** (REs remain fully responsible; vendor blame is restricted). | **🟢 Completed** | **Vendor Accountability Tracker**: Audits third-party SaaS models against disclosure and audit parameters, raising an immediate **"High Outsourcing Risk"** warning if validation is missing. |
| **Model Lifecycle Exception & Breach Reporting** (handling workflow exceptions and logging breaches). | **⚠️ Missing / Roadmap** | **Central Exception Logs**: The sync console logs audit actions locally, but a formal workflow to log regulatory compliance breaches and routing them to board dashboards is left to future API integration. |
| **Disciplined Change Management** (change log impact assessments). | **⚠️ Missing / Roadmap** | **Formula Diff Audit**: The sidebar allows saving current URL and metadata, but does not yet perform automatic code/formula line diff tracking when a spreadsheet undergoes modification. |

---

## 3. Deep-Dive: Completed Features

Our system successfully operationalizes the core "first principles" of the RBI MRM draft guidelines:

### 1. Unified Living Model Inventory (Broad Model capture)
* **Requirement**: Regulated Entities (REs) must maintain an active, living registry of all tools influencing business decisions—preventing teams from quietly running consequential tools under other names.
* **Our Solution**: The **Living Model Inventory** provides a centralized registry client embedded in both the popup and the sliding content sidebar. It lets validators register web-based spreadsheet tools, traditional statistical systems, and deep-learning models, instantly compiling their version, owner, and status records.

### 2. Guardrailed Risk-Based Tiering & Board Oversight
* **Requirement**: High-risk models require explicit oversight from the Risk Management Committee of the Board (RMCB). Materiality cannot be diluted by low technical complexity.
* **Our Solution**: The plugin's calculation engine prevents technical simplicity from diluting high materiality. Even if a model is technically simple (e.g., a spreadsheet), if transaction volumes exceed **INR 10 Crores**, it is classified as **Tier 1 (High Risk)**, immediately activating the RMCB Board approval warning block.

### 3. Decommissioning & Archival Retention Lock
* **Requirement**: Retired models must be kept in the repository for at least ten (10) years to ensure retroactive traceability.
* **Our Solution**: The decommissioning workflow blocks absolute record deletion. Instead, the registry marks retired models as "Retired (Locked)", disables modification, and stamps the exact compliance archiving limit (e.g., *Retain until 2036*).

### 4. Specialized AI Governance & Vendor Accountability
* **Requirement**: AI models must feature explainability, bias scrubbing, and human-in-the-loop overrides. REs are fully accountable for third-party vendor models.
* **Our Solution**:
  * The **AI Auditor Checklist** evaluates the **7 AI Risk Dimensions** (Drift, Hallucinations, Bias, Adversarial, Explainability, Privacy, and Concentration) and binds specific compensating control text logs to each model record.
  * Enforces the registration of a **Human-In-The-Loop Override** authority role.
  * The **Vendor Tracker** audits third-party vendor transparency and alerts risk teams of high outsourcing vulnerability.

---

## 4. Deep-Dive: Missing / Future Roadmap Features

Based on the legal and corporate governance criteria outlined in the AMLEGALS review, we have identified three operational areas that are currently missing and represent critical additions to our product roadmap:

### 1. Active Model Breach & Regulatory Alerting (Board Reporting)
* **The Gap**: The AMLEGALS analysis specifies that senior management and the RMCB must review "breach reports" for high-risk models (such as performance degradation or unauthorized parameter modifications).
* **Roadmap Addition**: Integrate a real-time breach alarm inside the popup/sidebar. If population stability drift metrics (PSI) exceed critical limits (e.g., PSI > 0.25), the extension background worker should trigger an automated "Compliance Breach Alert" pushing critical notifications directly to the RMCB dashboard.

### 2. Automated Spreadsheet Formula Change Diff-Tracking (Change Management)
* **The Gap**: RBI guidelines demand "disciplined change management with documented impact assessments" for spreadsheet models.
* **Roadmap Addition**: When the sliding content sidebar is active on an online spreadsheet (Google Sheets/Excel Online), it should save a hash of all active cell formulas. Upon sheet re-opening, the content script should execute a semantic comparison. If any cell formula has been modified, the sidebar should flag it as an **"Unapproved Model Change"**, forcing the developer to record an impact assessment before the sheet can re-validate.

### 3. Automated Model Performance Monitoring Sync (Continuous Validation)
* **The Gap**: Validation must happen before deployment and continuously during post-production.
* **Roadmap Addition**: Expand the central sync engine. Instead of manual data sync pushes, the background service worker should execute scheduled background fetch threads every 24 hours. This thread will pull the latest performance, drift, and validation metrics from the bank's central machine-learning pipeline, updating the inventory's validation statuses automatically.

---

## 5. Synthesis & Conclusion

Our **Browser Plugin Factory** represents an incredibly advanced, compliant, and highly secure "first-principles" companion tool. It successfully translates complex regulatory boardroom directives into concrete, interactive guardrails in developers' browsers.

By utilizing a local-first sandboxed architecture, it fully respects the strict security, privacy, and zero-data-leakage firewalls required by Indian Banks and NBFCs, while providing an accessible pathway to scale AI governance responsibly.
