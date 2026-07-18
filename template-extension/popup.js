// RBI MRM Assistant - Popup Controller

// Fallback Mock Storage for browser preview or testing
let mockStorage = {
  models: [
    {
      id: "MDL-2204",
      name: "Retail Credit Scoring Model",
      owner: "Retail Risk Division",
      version: "2.1.0",
      riskTier: "Tier 1",
      type: "AI-ML",
      status: "Active",
      validationDate: "2026-02-15",
      rmcbApproved: true,
      aiAudit: {
        dimensions: [2, 3, 5],
        controls: {
          bias: "Scrubbed demographic parameters. Verified disparate impact ratio is 0.98.",
          drift: "Continuous monitoring using PSI dashboard with alert at >0.15.",
          explainability: "Using SHAP local explanations integrated into loan decision system."
        },
        hitlOverride: true,
        hitlRole: "Head of Credit Approvals"
      }
    },
    {
      id: "MDL-1089",
      name: "Collections Propensity Scorecard",
      owner: "Collections Team",
      version: "1.0.4",
      riskTier: "Tier 2",
      type: "Statistical",
      status: "Active",
      validationDate: "2025-11-10",
      rmcbApproved: false
    },
    {
      id: "MDL-5040",
      name: "Lending Fraud Classifier",
      owner: "Fraud Analytics Division",
      version: "1.1.2",
      riskTier: "Tier 1",
      type: "AI-ML",
      status: "Breach",
      validationDate: "2026-04-10",
      rmcbApproved: true,
      psiValue: 0.28, // Triggers Breach! (Threshold: 0.25)
      remediated: false
    },
    {
      id: "MDL-0912",
      name: "Home Loan Interest Spreadsheet Calc",
      owner: "Mortgage Operations",
      version: "1.0.0",
      riskTier: "Tier 3",
      type: "Spreadsheet",
      status: "Active",
      validationDate: "2025-06-01",
      rmcbApproved: false
    }
  ],
  logs: [
    "[SYSTEM INFO] Secure Sandbox active database initiated.",
    "[COMPLIANCE] Verified 10-year retention rule implementation.",
    "[READY] Monitoring active spreadsheet tabs."
  ]
};

// Storage utility to support Chrome Extension environment and regular browsers
const storage = {
  async get(key, defaultValue) {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] !== undefined ? result[key] : defaultValue);
        });
      });
    } else {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    }
  },
  async set(key, value) {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

// Console Log Logger
async function addLog(message) {
  const currentLogs = await storage.get("mrm_logs", mockStorage.logs);
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  const logEntry = `[${timestamp}] ${message}`;
  currentLogs.push(logEntry);
  await storage.set("mrm_logs", currentLogs);
  renderLogs();
}

function renderLogs() {
  const logConsole = document.getElementById("log-console-screen");
  if (!logConsole) return;
  storage.get("mrm_logs", mockStorage.logs).then((logs) => {
    logConsole.innerHTML = logs.map(l => escapeHTML(l)).join("<br>");
    logConsole.scrollTop = logConsole.scrollHeight;
  });
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// State variables
let activeAssessment = null;
let pollingIntervalId = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize default models if empty
  const existingModels = await storage.get("mrm_models", null);
  if (!existingModels) {
    await storage.set("mrm_models", mockStorage.models);
    await storage.set("mrm_logs", mockStorage.logs);
  }

  // Check for model drift breaches
  await checkDriftBreaches();

  // Bind navigation tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add("active");

      // Specific tab loads
      if (targetId === "tab-ai-audit") {
        populateModelDropdowns();
      }
    });
  });

  // Render on load
  renderInventory();
  renderLogs();

  // Inventory Search filter
  const searchInput = document.getElementById("inventory-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderInventory();
    });
  }

  // Register Model Modal controls
  const openRegisterBtn = document.getElementById("btn-open-register-modal");
  const closeRegisterBtn = document.getElementById("btn-close-register");
  const registerModal = document.getElementById("register-modal");
  const registerForm = document.getElementById("form-register-model");

  if (openRegisterBtn && registerModal) {
    openRegisterBtn.addEventListener("click", () => {
      registerModal.classList.remove("hidden");
    });
  }
  if (closeRegisterBtn && registerModal) {
    closeRegisterBtn.addEventListener("click", () => {
      registerModal.classList.add("hidden");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("reg-model-name").value;
      const owner = document.getElementById("reg-model-owner").value;
      const version = document.getElementById("reg-model-version").value;
      const riskTier = document.getElementById("reg-model-tier").value;
      const type = document.getElementById("reg-model-type").value;

      const newId = "MDL-" + Math.floor(1000 + Math.random() * 9000);
      const newModel = {
        id: newId,
        name,
        owner,
        version,
        riskTier,
        type,
        status: "Active",
        validationDate: new Date().toISOString().substring(0, 10),
        rmcbApproved: false
      };

      const modelsList = await storage.get("mrm_models", mockStorage.models);
      modelsList.unshift(newModel);
      await storage.set("mrm_models", modelsList);

      await addLog(`Registered model ${newId} (${name}) as Active - Tier: ${riskTier}`);

      // Close modal and reset
      registerModal.classList.add("hidden");
      registerForm.reset();
      renderInventory();
    });
  }

  // Risk-Based Tiering Calculator Core
  const btnCalculate = document.getElementById("btn-calculate-tier");
  if (btnCalculate) {
    btnCalculate.addEventListener("click", () => {
      const qMateriality = document.querySelector('input[name="q-materiality"]:checked');
      const qRegulatory = document.querySelector('input[name="q-regulatory"]:checked');
      const qComplexity = document.querySelector('input[name="q-complexity"]:checked');

      if (!qMateriality || !qRegulatory || !qComplexity) {
        alert("Please answer all three tiering questions to compute the model risk level.");
        return;
      }

      const isMaterialHigh = qMateriality.value === "high";
      const isRegulatoryHigh = qRegulatory.value === "high";
      const complexityVal = qComplexity.value;

      let tier = "Tier 3";
      let explanation = "";
      let requiresRMCB = false;

      // Tiering algorithm based on RBI draft rules
      if (isMaterialHigh || isRegulatoryHigh) {
        tier = "Tier 1";
        explanation = "This model is flagged as Tier 1 (High Risk) due to high materiality (exceeding INR 10 Crores threshold) and/or direct regulatory capital calculation impact. Explicit Board-level Risk Management Committee (RMCB) approval is mandatory.";
        requiresRMCB = true;
      } else if (complexityVal === "deep") {
        tier = "Tier 2";
        explanation = "This model is classified as Tier 2 (Medium Risk) due to high architectural complexity (Black-box AI/ML models). It requires stringent continuous drift monitoring and independent validation.";
      } else if (complexityVal === "stat" || isMaterialHigh === false) {
        tier = "Tier 2";
        explanation = "This model is classified as Tier 2 (Medium Risk) representing statistical modeling systems with moderate business exposure.";
      } else {
        tier = "Tier 3";
        explanation = "This model is classified as Tier 3 (Low Risk). It is a simple formula or spreadsheet calculator with limited material business impact.";
      }

      // Display results
      const resultCard = document.getElementById("tiering-result-card");
      const resultTierLabel = document.getElementById("result-tier-label");
      const resultExplanation = document.getElementById("result-explanation");
      const rmcbWarning = document.getElementById("rmcb-warning");

      if (resultCard && resultTierLabel && resultExplanation) {
        resultTierLabel.innerText = `${tier} (${tier === "Tier 1" ? "High Risk" : tier === "Tier 2" ? "Medium Risk" : "Low Risk"})`;
        resultExplanation.innerText = explanation;
        resultCard.classList.remove("hidden");

        if (requiresRMCB) {
          rmcbWarning.classList.remove("hidden");
          document.getElementById("chk-rmcb-approved").checked = false;
        } else {
          rmcbWarning.classList.add("hidden");
        }

        // Store intermediate active assessment
        activeAssessment = {
          tier,
          requiresRMCB,
          complexity: complexityVal
        };
      }
    });
  }

  // Save Tiering assessment to Registry
  const btnSaveTier = document.getElementById("btn-save-tier-to-inventory");
  if (btnSaveTier) {
    btnSaveTier.addEventListener("click", async () => {
      if (!activeAssessment) return;

      const isApproved = document.getElementById("chk-rmcb-approved") ? document.getElementById("chk-rmcb-approved").checked : false;

      if (activeAssessment.requiresRMCB && !isApproved) {
        alert("Compliance Error: Tier 1 high-risk models require confirmation of RMCB board approval before they can be deployed.");
        return;
      }

      // Prompt to create model with this tier
      const modelName = prompt("Enter a name for this model to register in the Living Inventory:", "Automated Calculator Model");
      if (!modelName) return;

      const newId = "MDL-" + Math.floor(1000 + Math.random() * 9000);
      const newModel = {
        id: newId,
        name: modelName,
        owner: "Compliance Generated",
        version: "1.0.0",
        riskTier: activeAssessment.tier,
        type: activeAssessment.complexity === "deep" ? "AI-ML" : activeAssessment.complexity === "stat" ? "Statistical" : "Spreadsheet",
        status: "Active",
        validationDate: new Date().toISOString().substring(0, 10),
        rmcbApproved: isApproved
      };

      const modelsList = await storage.get("mrm_models", mockStorage.models);
      modelsList.unshift(newModel);
      await storage.set("mrm_models", modelsList);

      await addLog(`Registered calculated model ${newId} - Tier: ${activeAssessment.tier} (RMCB Approved: ${isApproved})`);
      alert(`Model successfully saved to Active Inventory under ID: ${newId}`);

      // Reset
      document.getElementById("tiering-result-card").classList.add("hidden");
      activeAssessment = null;
      renderInventory();
    });
  }

  // AI/ML Dimension Checklist - Show/Hide Textareas on Check
  const auditChecks = document.querySelectorAll(".audit-check");
  auditChecks.forEach(chk => {
    // Start with parent body hidden
    const body = chk.closest(".dimension-item").querySelector(".dimension-body");
    body.style.display = "none";

    chk.addEventListener("change", () => {
      body.style.display = chk.checked ? "block" : "none";
    });
  });

  // Save AI Audit Log
  const btnSaveAiAudit = document.getElementById("btn-save-ai-audit");
  if (btnSaveAiAudit) {
    btnSaveAiAudit.addEventListener("click", async () => {
      const selectedModelId = document.getElementById("ai-audit-model-select").value;
      if (!selectedModelId) {
        alert("Please select a model from the list to audit.");
        return;
      }

      const modelsList = await storage.get("mrm_models", mockStorage.models);
      const modelIndex = modelsList.findIndex(m => m.id === selectedModelId);
      if (modelIndex === -1) return;

      // Extract details
      const dimsChecked = [];
      const controls = {};

      auditChecks.forEach(chk => {
        if (chk.checked) {
          const dimNum = parseInt(chk.getAttribute("data-dim"));
          dimsChecked.push(dimNum);

          const dimItem = chk.closest(".dimension-item");
          const textarea = dimItem.querySelector("textarea");
          if (textarea) {
            const controlKey = textarea.id.replace("control-", "");
            controls[controlKey] = textarea.value;
          }
        }
      });

      const hitlApproved = document.getElementById("chk-hitl-override").checked;
      const hitlRole = document.getElementById("hitl-officer-role").value;

      if (!hitlApproved) {
        alert("Compliance Alert: AI/ML models must have human-in-the-loop overrides configured and checked.");
        return;
      }

      // Update model record
      modelsList[modelIndex].aiAudit = {
        dimensions: dimsChecked,
        controls,
        hitlOverride: hitlApproved,
        hitlRole: hitlRole || "Unspecified Role"
      };

      await storage.set("mrm_models", modelsList);
      await addLog(`Completed AI/ML audit for ${selectedModelId}. Logged ${dimsChecked.length} risk control vectors.`);
      alert(`AI/ML Compliance logs successfully attached to model: ${selectedModelId}`);

      // Clear inputs
      document.getElementById("chk-hitl-override").checked = false;
      document.getElementById("hitl-officer-role").value = "";
      auditChecks.forEach(chk => {
        chk.checked = false;
        chk.closest(".dimension-item").querySelector(".dimension-body").style.display = "none";
        const textarea = chk.closest(".dimension-item").querySelector("textarea");
        if (textarea) textarea.value = "";
      });
      document.getElementById("ai-audit-model-select").value = "";
    });
  }

  // Third-Party Vendor Accountability Checklist Listener
  const vendorChecks = [
    document.getElementById("chk-vendor-disclosure"),
    document.getElementById("chk-vendor-audit-access"),
    document.getElementById("chk-vendor-independent-val")
  ];

  vendorChecks.forEach(chk => {
    if (chk) {
      chk.addEventListener("change", evaluateVendorRisk);
    }
  });

  function evaluateVendorRisk() {
    const disclosure = document.getElementById("chk-vendor-disclosure").checked;
    const auditAccess = document.getElementById("chk-vendor-audit-access").checked;
    const independentVal = document.getElementById("chk-vendor-independent-val").checked;
    const riskBox = document.getElementById("vendor-risk-status");

    if (!riskBox) return;

    if (disclosure && auditAccess && independentVal) {
      riskBox.className = "vendor-status-box compliant";
      riskBox.innerHTML = `<strong>🟢 Compliant Vendor Alignment</strong><p>All crucial independent audits and vendor disclosures have been logged. Approved for procurement review.</p>`;
    } else {
      riskBox.className = "vendor-status-box";
      riskBox.innerHTML = `<strong>⚠️ High Outsourcing Risk Detected</strong><p>RBI guidelines state third-party models require independent validation. Missing transparency, audit rights, or independent annual checks poses high compliance risks.</p>`;
    }
  }

  // Save Vendor assessment
  const btnSaveVendor = document.getElementById("btn-save-vendor-audit");
  if (btnSaveVendor) {
    btnSaveVendor.addEventListener("click", async () => {
      const vendorName = document.getElementById("vendor-name-input").value;
      if (!vendorName) {
        alert("Please enter the vendor name.");
        return;
      }

      const disclosure = document.getElementById("chk-vendor-disclosure").checked;
      const auditAccess = document.getElementById("chk-vendor-audit-access").checked;
      const independentVal = document.getElementById("chk-vendor-independent-val").checked;

      const auditSummary = `Vendor: ${vendorName} [Disclosure: ${disclosure}, AuditAccess: ${auditAccess}, IndepValidation: ${independentVal}]`;
      await addLog(`Audited external vendor model. ${auditSummary}`);

      alert(`Vendor assessment for '${vendorName}' has been compiled and logged in sync registry.`);

      // Reset
      document.getElementById("vendor-name-input").value = "";
      vendorChecks.forEach(chk => { if (chk) chk.checked = false; });
      evaluateVendorRisk();
    });
  }

  // Breach Alerts Remediation Handlers
  const linkShowRemediation = document.getElementById("btn-show-remediation");
  const formRemediation = document.getElementById("remediation-form-container");
  const btnCancelRemediation = document.getElementById("btn-cancel-remediation");
  const btnSubmitRemediation = document.getElementById("btn-submit-remediation");

  if (linkShowRemediation) {
    linkShowRemediation.addEventListener("click", () => {
      formRemediation.classList.remove("hidden");
    });
  }

  if (btnCancelRemediation) {
    btnCancelRemediation.addEventListener("click", () => {
      formRemediation.classList.add("hidden");
    });
  }

  if (btnSubmitRemediation) {
    btnSubmitRemediation.addEventListener("click", async () => {
      const remediationText = document.getElementById("remediation-actions").value;
      const rmcbChecked = document.getElementById("chk-remediation-rmcb").checked;

      if (!remediationText) {
        alert("Please fill in the retraining and compensating controls plans.");
        return;
      }

      if (!rmcbChecked) {
        alert("Compliance Error: The remediation report must be formally routed and checked for Board (RMCB) reporting.");
        return;
      }

      // Resolve drift breach in MDL-5040
      const modelsList = await storage.get("mrm_models", mockStorage.models);
      const idx = modelsList.findIndex(m => m.id === "MDL-5040");
      if (idx !== -1) {
        modelsList[idx].status = "Active";
        modelsList[idx].remediated = true;
        modelsList[idx].remediationPlan = remediationText;
        await storage.set("mrm_models", modelsList);
      }

      await addLog(`[RMCB FORMAL REPORT] Resolved high drift breach for MDL-5040. Retraining controls filed: "${remediationText.substring(0, 40)}..."`);
      alert("Breach Remediation Submitted! Formal report logged in RMCB Board compliance repository.");

      // Hide remediation form and check drift again
      formRemediation.classList.add("hidden");
      document.getElementById("remediation-actions").value = "";
      document.getElementById("chk-remediation-rmcb").checked = false;
      await checkDriftBreaches();
      renderInventory();
    });
  }

  // Continuous Pipeline Sync Polling listener
  const chkContinuousSync = document.getElementById("chk-continuous-sync");
  if (chkContinuousSync) {
    chkContinuousSync.addEventListener("change", () => {
      if (chkContinuousSync.checked) {
        addLog("Continuous Scheduled Pipeline Sync activated (24h Polling active).");
        pollingIntervalId = setInterval(async () => {
          await addLog("[PIPELINE SYNC] Scheduled polling fetch executed...");
          await addLog("[PIPELINE SYNC] Pulled central ML Pipeline validation metrics. No new breaches detected.");
        }, 8000); // Fast mock polling interval of 8s for user visualization
      } else {
        if (pollingIntervalId) {
          clearInterval(pollingIntervalId);
          pollingIntervalId = null;
        }
        addLog("Continuous Scheduled Pipeline Sync deactivated.");
      }
    });
  }

  // Sync Operations
  const btnSync = document.getElementById("btn-sync-now");
  if (btnSync) {
    btnSync.addEventListener("click", async () => {
      const btnText = btnSync.innerText;
      btnSync.innerText = "Syncing...";
      btnSync.disabled = true;

      const modelsList = await storage.get("mrm_models", mockStorage.models);
      const mrmLogs = await storage.get("mrm_logs", mockStorage.logs);

      // Simulated network post with slight delay
      setTimeout(async () => {
        btnSync.innerText = btnText;
        btnSync.disabled = false;

        const syncIndicator = document.getElementById("sync-status-indicator");
        if (syncIndicator) {
          syncIndicator.innerHTML = `<div class="status-dot green"></div><span>Connected to Core Compliance Server. Sync successful.</span>`;
        }

        await addLog(`Synchronized ${modelsList.length} models and logs to core MRM repository.`);
        alert("Secure Data Sync Successful. Audit trails synchronized to Bank Compliance core database.");
      }, 1000);
    });
  }

  // Audit Pack JSON Exporter
  const btnDownloadAudit = document.getElementById("btn-download-audit");
  if (btnDownloadAudit) {
    btnDownloadAudit.addEventListener("click", async () => {
      const modelsList = await storage.get("mrm_models", mockStorage.models);
      const mrmLogs = await storage.get("mrm_logs", mockStorage.logs);

      const auditPack = {
        metadata: {
          generatedAt: new Date().toISOString(),
          bankName: document.getElementById("bank-name-display").innerText,
          regulatoryComplianceRef: "RBI MRM Draft Guidelines 2026",
          exporter: "Browser Plugin Factory Automated Pack"
        },
        inventory: modelsList,
        auditLogs: mrmLogs
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditPack, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `rbi_mrm_audit_pack_${new Date().toISOString().substring(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      await addLog("Downloaded localized RBI compliance Audit Pack (JSON).");
    });
  }
});

// Helper to scan for drift breaches
async function checkDriftBreaches() {
  const modelsList = await storage.get("mrm_models", mockStorage.models);
  const banner = document.getElementById("mrm-breach-alert-banner");
  if (!banner) return;

  // Find any active model with status === 'Breach' or psiValue > 0.25 that hasn't been remediated
  const breachModel = modelsList.find(m => m.psiValue > 0.25 && !m.remediated);

  if (breachModel) {
    document.getElementById("breach-model-id").innerText = breachModel.id;
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }
}

// Dynamic Dropdowns populator for AI/ML Audit Tab
async function populateModelDropdowns() {
  const dropdown = document.getElementById("ai-audit-model-select");
  if (!dropdown) return;

  const modelsList = await storage.get("mrm_models", mockStorage.models);
  dropdown.innerHTML = '<option value="">-- Choose Model --</option>';

  // filter for AI-ML or Statistical models
  const eligibleModels = modelsList.filter(m => m.type === "AI-ML" || m.type === "Statistical");
  eligibleModels.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.innerText = `${m.id} - ${m.name} (${m.type})`;
    dropdown.appendChild(opt);
  });
}

// Render living active inventory table
async function renderInventory() {
  const tbody = document.getElementById("inventory-tbody");
  if (!tbody) return;

  const searchQuery = document.getElementById("inventory-search") ? document.getElementById("inventory-search").value.toLowerCase() : "";
  const modelsList = await storage.get("mrm_models", mockStorage.models);

  tbody.innerHTML = "";

  const filteredModels = modelsList.filter(m => {
    return m.name.toLowerCase().includes(searchQuery) ||
           m.id.toLowerCase().includes(searchQuery) ||
           m.owner.toLowerCase().includes(searchQuery);
  });

  if (filteredModels.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b;">No models registered in the living inventory.</td></tr>`;
    return;
  }

  filteredModels.forEach(m => {
    const tr = document.createElement("tr");

    // Tier badge classes
    let tierClass = "tier-3";
    if (m.riskTier === "Tier 1") tierClass = "tier-1";
    if (m.riskTier === "Tier 2") tierClass = "tier-2";

    // Status classes
    let statusClass = "active";
    let statusText = m.status;
    if (m.status === "Retired") {
      statusClass = "retired";
    } else if (m.status === "Breach" && m.psiValue > 0.25 && !m.remediated) {
      statusClass = "breach";
      statusText = "Breach (Drift)";
    }

    // Actions cell
    let actionBtnHTML = "";
    if (m.status === "Active") {
      actionBtnHTML = `<button class="btn-secondary btn-decommission" data-id="${m.id}" style="font-size: 10px; padding: 2px 6px;">Decommission</button>`;
    } else if (m.status === "Breach" && m.psiValue > 0.25 && !m.remediated) {
      actionBtnHTML = `<button class="btn-primary btn-breach-remediate" style="font-size: 10px; padding: 2px 6px; background-color: var(--warning-color);">Remediate</button>`;
    } else {
      actionBtnHTML = `<span style="color: #64748b; font-size: 10px; font-style: italic;">Archived (10Yr Ret.)</span>`;
    }

    // RMCB label if approved
    const rmcbLabel = m.rmcbApproved ? `<div style="font-size: 9px; color: var(--success-color); font-weight: bold; margin-top: 2px;">✓ RMCB Approved</div>` : "";

    tr.innerHTML = `
      <td><strong>${escapeHTML(m.id)}</strong></td>
      <td>
        <span class="model-name-text">${escapeHTML(m.name)}</span>
        <span class="model-owner-text">${escapeHTML(m.owner)} • v${escapeHTML(m.version)} • ${escapeHTML(m.type)}</span>
        ${rmcbLabel}
      </td>
      <td><span class="tier-badge ${tierClass}">${escapeHTML(m.riskTier)}</span></td>
      <td><span class="status-badge ${statusClass}">${escapeHTML(statusText)}</span></td>
      <td>${actionBtnHTML}</td>
    `;

    tbody.appendChild(tr);
  });

  // Attach event listener for the inline remediate action
  const remediateBtns = tbody.querySelectorAll(".btn-breach-remediate");
  remediateBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("remediation-form-container").classList.remove("hidden");
    });
  });

  // Attach event listeners for decommission buttons
  const decommissionBtns = tbody.querySelectorAll(".btn-decommission");
  decommissionBtns.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const modelId = btn.getAttribute("data-id");

      const confirmed = confirm(`🚨 WARNING: Under RBI MRMF guidelines, retiring this model will trigger a MANDATORY ten (10) year retention archival rule. You will not be able to purge this record.

Are you sure you want to decommission model ${modelId}?`);

      if (confirmed) {
        const fullModelsList = await storage.get("mrm_models", mockStorage.models);
        const modelIndex = fullModelsList.findIndex(m => m.id === modelId);
        if (modelIndex !== -1) {
          fullModelsList[modelIndex].status = "Retired";
          fullModelsList[modelIndex].decommissionedDate = new Date().toISOString().substring(0, 10);
          await storage.set("mrm_models", fullModelsList);
          await addLog(`DECOMMISSION COMPLETED: ${modelId} moved to locked archive. 10-year retention rule active (Retain until ${parseInt(new Date().getFullYear()) + 10}).`);
          renderInventory();
        }
      }
    });
  });
}
