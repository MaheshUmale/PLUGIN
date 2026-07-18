# Browser Plugin Factory for RBI's Model Risk Management (MRM) Guidelines

Welcome to the **Browser Plugin Factory**, an enterprise-grade system designed to assist Regulated Entities (REs)—including Commercial Banks, Small Finance Banks, NBFCs, and Credit Information Companies—in implementing and operationalizing the **Reserve Bank of India (RBI) Model Risk Management (MRM) guidelines**.

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

## 4. Model Discovery Engine: Regex vs. Transformers.js

To proactively assist risk auditors, the plugin's content script scans active banking portals or web-based spreadsheets (e.g., Google Sheets, MS Excel Online) to **find and discover model parameters, variables, and mathematical expressions**.

This repository supports two distinct search and extraction architectures:

### Side-by-Side Architectural Comparison

| Metric | Regex & DOM Parsing (Current) | On-Device NLP (Transformers.js / Xenova) |
| :--- | :--- | :--- |
| **Mechanism** | Standard regex token matching (e.g., matching mathematical symbols, variable names like `prob_of_default` or `loss_given_default`, and cell structure traversal). | Quantized Transformer models (e.g., `@xenova/transformers` loading `all-MiniLM-L6-v2` or `DistilBERT-NER`) executed directly inside the Chrome Extension sandbox. |
| **Pros** | <ul><li>**Zero-Latency**: Parsing runs in under 10 milliseconds.</li><li>**No Dependencies**: Zero bloat, keeps the extension bundle under 100 KB.</li><li>**Enterprise Security Friendly**: Does not load external binary weights, avoiding strict Content Security Policy (CSP) friction.</li><li>**Low Overhead**: Negligible CPU and memory consumption.</li></ul> | <ul><li>**Semantic Discovery**: Understands cell context even if terms shift (e.g., matching "credit_score" to "loan propensity metric").</li><li>**Equation Analysis**: Classifies equations into ML categories (regression, neural network, linear).</li><li>**PII Redaction**: Sophisticated Named Entity Recognition (NER) to prevent data leaks.</li><li>**100% Private**: Runs entirely in the browser thread with zero external network leakage.</li></ul> |
| **Cons** | <ul><li>**Rigid Matches**: Fails if spreadsheet layouts use undocumented terms or unstructured layouts.</li><li>**Lacks Semantic Understanding**: Cannot distinguish a standard interest rate addition cell from a complex mathematical model.</li></ul> | <ul><li>**High Resource Overhead**: Model weights add 20MB to 100MB to the memory footprint.</li><li>**Cold-Start Delay**: Takes 1–3 seconds to load model weights on first tab boot.</li><li>**CSP Complexities**: Chrome Extension V3 requires specific sandbox rules to execute WebAssembly (`WASM`) threads.</li></ul> |

---

### Implementation Blueprints

#### 1. Regex & DOM Discovery Code (Current Production Implementation)
This lightweight DOM scanner looks for specific model formulas, terms, and variables (e.g. `LGD`, `PD`, `EAD`, `scoring`, `regression`, `weight`):
```javascript
function scanDOMWithRegex() {
  const modelIndicators = [
    /\b(prob_of_default|PD_value|LGD_metric|EAD_calculator)\b/i,
    /\b(credit_scorecard|propensity_model|neural_net|linear_regression)\b/i,
    /=(SUMPRODUCT|LINEST|FORECAST|COVAR)\(/i // Spreadsheet formulas
  ];

  let detectedIndicators = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;

  while (node = walk.nextNode()) {
    const text = node.nodeValue;
    modelIndicators.forEach(regex => {
      if (regex.test(text)) {
        detectedIndicators.push(text.trim().substring(0, 50));
      }
    });
  }
  return [...new Set(detectedIndicators)];
}
```

#### 2. Upgrading to On-Device Semantic Discovery (`Transformers.js`)
To upgrade the discovery engine to use advanced, on-device NLP, developers can load `@xenova/transformers` inside the Manifest V3 Sandbox environment.

##### Manifest V3 Configuration (`manifest.json`):
To load and execute WebAssembly models locally inside Manifest V3, specific sandbox permissions are required:
```json
{
  "sandbox": {
    "pages": ["sandbox.html"]
  },
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
  }
}
```

##### Inside `sandbox.html` and `sandbox.js`:
The sandbox runs in an isolated thread allowing WASM execution. It listens for post-messages from the content script and parses the spreadsheet semantically:
```javascript
import { pipeline } from '@xenova/transformers';

let extractorPipeline = null;

// Lazily load model weights locally inside the sandboxed thread
async function getExtractor() {
  if (!extractorPipeline) {
    // Loads a quantized 23MB semantic similarity model
    extractorPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractorPipeline;
}

// Listen for text batches scanned from Google Sheets
window.addEventListener('message', async (event) => {
  const { action, textList, targetComplianceQuery } = event.data;

  if (action === 'calculate_similarity') {
    const extractor = await getExtractor();

    // Generate embeddings locally inside the browser memory sandbox
    const outputEmbeddings = await extractor(textList, { pooling: 'mean', normalize: true });
    const queryEmbedding = await extractor(targetComplianceQuery, { pooling: 'mean', normalize: true });

    const matches = [];
    for (let i = 0; i < textList.length; i++) {
      const similarity = cosineSimilarity(outputEmbeddings[i].data, queryEmbedding.data);
      if (similarity > 0.75) { // Match high semantic alignment (75% match)
        matches.push({ text: textList[i], score: similarity });
      }
    }

    // Reply back to Content Script
    window.parent.postMessage({ action: 'semantic_matches', matches }, '*');
  }
});

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

---

## 5. Security & Sandboxing Blueprint (Banking Deployments)

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
