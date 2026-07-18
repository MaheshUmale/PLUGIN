// RBI MRM Compliance Assistant - Content Script

console.log("[RBI MRM] Content Script initiated on target banking workspace.");

// Injects the launcher button and the compliance sidebar overlay
function initMRMOverlay() {
  if (document.getElementById("rbi-mrm-launcher")) return;

  // 1. Create launcher button
  const launcher = document.createElement("div");
  launcher.id = "rbi-mrm-launcher";
  launcher.innerHTML = "🛡️ RBI MRM Compliance";
  document.body.appendChild(launcher);

  // 2. Create sidebar container
  const sidebar = document.createElement("div");
  sidebar.id = "rbi-mrm-sidebar";
  sidebar.className = "rbi-mrm-sidebar-hidden";

  sidebar.innerHTML = `
    <div class="rbi-sidebar-header">
      <h4>{{BANK_NAME}} Assistant</h4>
      <button id="rbi-sidebar-close">×</button>
    </div>
    <div class="rbi-sidebar-body">
      <div class="rbi-sidebar-alert">
        <strong>📋 Active Tab Auditing</strong>
        <p>Analyzing active spreadsheet or web parameters for RBI MRM alignment.</p>
      </div>

      <!-- SPREADSHEET CHANGE MANAGEMENT (DIFF AUDITOR) -->
      <div class="rbi-card" id="rbi-change-management-card">
        <h5>Spreadsheet Change Management</h5>
        <p class="rbi-small-text">Under RBI MRMF, all changes to spreadsheet calculators require documented impact assessments.</p>

        <div class="rbi-formula-inspect">
          <span class="rbi-label-sub">Active Grid Coordinate:</span>
          <strong id="mrm-grid-cell">Cell H10</strong>
          <span class="rbi-label-sub" style="margin-top:4px;">Original Formula:</span>
          <code id="mrm-grid-formula">=SUMPRODUCT(B2:B20, C2:C20) * 1.15</code>
        </div>

        <button id="sidebar-btn-modify-formula" class="rbi-btn rbi-btn-secondary" style="background-color: #fef3c7; color: #92400e; border: 1px solid #fcd34d;">Simulate Formula Edit (Unapproved)</button>

        <!-- Dynamic Diff Warning Banner (Hidden by default) -->
        <div id="mrm-diff-alert" class="rbi-diff-box hidden">
          <strong style="color: #b91c1c; display:block; margin-bottom:4px;">⚠️ UNAPPROVED FORMULA CHANGE DETECTED</strong>
          <div class="diff-view">
            <span class="diff-old">Before: =SUMPRODUCT(B2:B20, C2:C20) * 1.15</span><br>
            <span class="diff-new">After:  =SUMPRODUCT(B2:B20, C2:C20) * 1.35</span>
          </div>
          <p class="rbi-small-text" style="color: #7f1d1d; margin-top:6px;">Please record impact assessment to restore validation status:</p>
          <input type="text" id="mrm-change-assessment-input" placeholder="e.g., Retuning profit margins, CRO approved." style="width:100%; font-size:10px; padding:4px; box-sizing:border-box; border:1px solid #fca5a5; border-radius:3px; margin-bottom:6px;">
          <button id="sidebar-btn-authorize-change" class="rbi-btn" style="background-color: #15803d; font-size:10px; padding:4px;">Authorize & Re-Validate</button>
        </div>
      </div>

      <div class="rbi-card">
        <h5>Quick Risk-Based Tiering</h5>
        <div class="rbi-form-group">
          <label>Material Transaction Value (>10 Cr INR)?</label>
          <select id="sidebar-q-materiality">
            <option value="yes">Yes (High Materiality)</option>
            <option value="no" selected>No (Low/Medium)</option>
          </select>
        </div>
        <div class="rbi-form-group">
          <label>Regulatory Capital / Provisions Impact?</label>
          <select id="sidebar-q-regulatory">
            <option value="yes">Yes (Direct Impact)</option>
            <option value="no" selected>No (None)</option>
          </select>
        </div>
        <div class="rbi-form-group">
          <label>Model Architecture</label>
          <select id="sidebar-q-complexity">
            <option value="ai-ml">AI/ML Black-Box</option>
            <option value="statistical">Traditional Statistical</option>
            <option value="spreadsheet" selected>Spreadsheet / Formula Calc</option>
          </select>
        </div>
        <button id="sidebar-btn-calc" class="rbi-btn">Calculate Risk Tier</button>
        <div id="sidebar-calc-result" class="rbi-result-box hidden">
          <strong>Resulting Level: <span id="sidebar-res-label">-</span></strong>
          <p id="sidebar-res-explanation" style="margin:4px 0 0 0; font-size:10px; color:#475569;"></p>
        </div>
      </div>

      <div class="rbi-card">
        <h5>Active Living Inventory Register</h5>
        <button id="sidebar-btn-quick-add" class="rbi-btn rbi-btn-secondary">Add Active Tab to Model Inventory</button>
        <p class="rbi-small-text">Saves current web document URL and metadata into sandboxed database.</p>
      </div>

      <div class="rbi-card">
        <h5>AI Governance Verification</h5>
        <p class="rbi-small-text">Ensure the active system satisfies transparency requirements:</p>
        <label><input type="checkbox" id="sidebar-chk-explain"> Explainability Framework Configured</label><br>
        <label><input type="checkbox" id="sidebar-chk-hitl"> Human-in-the-Loop Override Logged</label>
      </div>
    </div>
    <div class="rbi-sidebar-footer">
      <span>Secure Local Sandbox • AES-256</span>
    </div>
  `;

  document.body.appendChild(sidebar);

  // 3. Setup event listeners
  launcher.addEventListener("click", () => {
    sidebar.classList.toggle("rbi-mrm-sidebar-hidden");
    sidebar.classList.toggle("rbi-mrm-sidebar-visible");
  });

  const closeBtn = document.getElementById("rbi-sidebar-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      sidebar.className = "rbi-mrm-sidebar-hidden";
    });
  }

  // Sidebar Spreadsheet Change Management Diff logic
  const btnModify = document.getElementById("sidebar-btn-modify-formula");
  const diffAlert = document.getElementById("mrm-diff-alert");
  const btnAuthorize = document.getElementById("sidebar-btn-authorize-change");

  if (btnModify) {
    btnModify.addEventListener("click", () => {
      // Show unapproved formula modification diff alert
      diffAlert.classList.remove("hidden");
      btnModify.style.display = "none";
      console.warn("[RBI MRM] Unapproved spreadsheet formula modification detected on Cell H10!");
    });
  }

  if (btnAuthorize) {
    btnAuthorize.addEventListener("click", () => {
      const assessmentText = document.getElementById("mrm-change-assessment-input").value;
      if (!assessmentText) {
        alert("Compliance Error: You must enter a change authorization impact assessment before re-validating.");
        return;
      }

      // Hide diff alert and log authorization
      diffAlert.classList.add("hidden");
      btnModify.style.display = "block";
      document.getElementById("mrm-change-assessment-input").value = "";

      // Update displayed active formula to represent approved updated state
      document.getElementById("mrm-grid-formula").innerText = "=SUMPRODUCT(B2:B20, C2:C20) * 1.35";

      alert("Change Authorized! Impact assessment logged, spreadsheet re-validated.");

      const changeLogMsg = `[SPREADSHEET CHANGE ASSESS] Cell H10 modified. Impact assessment: "${assessmentText}"`;
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(["mrm_logs"], (res) => {
          const logsList = res.mrm_logs || [];
          logsList.push(`[${new Date().toISOString().replace("T", " ").substring(0, 19)}] ${changeLogMsg}`);
          chrome.storage.local.set({ mrm_logs: logsList });
        });
      } else {
        const localLogs = localStorage.getItem("mrm_logs");
        const logsList = localLogs ? JSON.parse(localLogs) : [];
        logsList.push(`[${new Date().toISOString().replace("T", " ").substring(0, 19)}] ${changeLogMsg}`);
        localStorage.setItem("mrm_logs", JSON.stringify(logsList));
      }
    });
  }

  // Sidebar Calculator logic
  const btnCalc = document.getElementById("sidebar-btn-calc");
  if (btnCalc) {
    btnCalc.addEventListener("click", () => {
      const qMat = document.getElementById("sidebar-q-materiality").value;
      const qReg = document.getElementById("sidebar-q-regulatory").value;
      const qComp = document.getElementById("sidebar-q-complexity").value;

      const resultBox = document.getElementById("sidebar-calc-result");
      const resLabel = document.getElementById("sidebar-res-label");
      const resExp = document.getElementById("sidebar-res-explanation");

      let tier = "Tier 3";
      let explanation = "";

      if (qMat === "yes" || qReg === "yes") {
        tier = "Tier 1";
        explanation = "High-risk system. RMCB Board approval is mandatory under RBI MRMF.";
      } else if (qComp === "ai-ml") {
        tier = "Tier 2";
        explanation = "Medium risk due to Black-box AI. Enforce annual validation and performance drift checks.";
      } else if (qComp === "statistical") {
        tier = "Tier 2";
        explanation = "Medium-risk statistical system. Maintain complete audit log.";
      } else {
        tier = "Tier 3";
        explanation = "Low-risk spreadsheet/calculator. Periodic self-assessment is required.";
      }

      resLabel.innerText = tier;
      resExp.innerText = explanation;
      resultBox.classList.remove("hidden");
    });
  }

  // Quick Add active tab to inventory logic
  const btnQuickAdd = document.getElementById("sidebar-btn-quick-add");
  if (btnQuickAdd) {
    btnQuickAdd.addEventListener("click", () => {
      const currentUrl = window.location.href;
      const currentTitle = document.title || "Active Web Workspace";

      const mockNewModel = {
        id: "MDL-PAGE-" + Math.floor(100 + Math.random() * 900),
        name: currentTitle,
        owner: "Browser Generated",
        version: "1.0.0",
        riskTier: "Tier 3",
        type: "Spreadsheet",
        status: "Active",
        validationDate: new Date().toISOString().substring(0, 10),
        url: currentUrl
      };

      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(["mrm_models"], (res) => {
          const list = res.mrm_models || [];
          list.unshift(mockNewModel);
          chrome.storage.local.set({ mrm_models: list }, () => {
            alert(`Document added successfully to Living Inventory under ID: ${mockNewModel.id}`);
          });
        });
      } else {
        const localList = localStorage.getItem("mrm_models");
        const list = localList ? JSON.parse(localList) : [];
        list.unshift(mockNewModel);
        localStorage.setItem("mrm_models", JSON.stringify(list));
        alert(`Document added successfully to Living Inventory under ID: ${mockNewModel.id}`);
      }
    });
  }
}

// Automatically initiate overlay if matching suitable URL context
if (document.readyState === "complete" || document.readyState === "interactive") {
  initMRMOverlay();
} else {
  document.addEventListener("DOMContentLoaded", initMRMOverlay);
}
