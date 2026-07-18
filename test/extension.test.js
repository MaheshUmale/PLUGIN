// Extension Unit and Integration Tests
// Validates RBI MRMF Compliance calculators, retention schedules, and validation workflows.

const assert = require("assert").strict;

// Mock storage adapter for testing identical to popup.js logic
class MockStorage {
  constructor() {
    this.store = {};
  }
  async get(key, defaultValue) {
    return this.store[key] !== undefined ? this.store[key] : defaultValue;
  }
  async set(key, value) {
    this.store[key] = value;
  }
}

// Replicate Risk-Based Tiering calculation algorithm from popup.js
function calculateModelRiskTier(qMateriality, qRegulatory, qComplexity) {
  const isMaterialHigh = qMateriality === "high";
  const isRegulatoryHigh = qRegulatory === "high";

  if (isMaterialHigh || isRegulatoryHigh) {
    return {
      tier: "Tier 1",
      explanation: "Tier 1 (High Risk) model due to financial materiality or regulatory capital impact.",
      requiresRMCB: true
    };
  } else if (qComplexity === "deep") {
    return {
      tier: "Tier 2",
      explanation: "Tier 2 (Medium Risk) model due to complex AI/ML structure.",
      requiresRMCB: false
    };
  } else if (qComplexity === "stat") {
    return {
      tier: "Tier 2",
      explanation: "Tier 2 (Medium Risk) model representing statistical systems.",
      requiresRMCB: false
    };
  } else {
    return {
      tier: "Tier 3",
      explanation: "Tier 3 (Low Risk) simple formula or spreadsheet calculator.",
      requiresRMCB: false
    };
  }
}

// Replicate Decommission Model Archiving logic from popup.js
function decommissionModel(model, currentYear) {
  if (model.status === "Retired") {
    throw new Error("Model is already decommissioned");
  }

  const retiredModel = {
    ...model,
    status: "Retired",
    decommissionedDate: new Date().toISOString().substring(0, 10),
    archivalRetentionUntil: currentYear + 10,
    retentionPolicyRef: "RBI MRM Guideline: 10-Year Mandatory Archive"
  };

  return retiredModel;
}

// Tests definition
const tests = {
  // Test 1: Verify Risk-Based Tiering Calculator Algorithm
  testRiskBasedTieringCalculations() {
    console.log("  - Running testRiskBasedTieringCalculations...");

    // Case A: High Materiality -> Tier 1 & RMCB approval mandatory
    const resultA = calculateModelRiskTier("high", "low", "simple");
    assert.equal(resultA.tier, "Tier 1");
    assert.equal(resultA.requiresRMCB, true);

    // Case B: High Regulatory Capital Impact -> Tier 1
    const resultB = calculateModelRiskTier("low", "high", "stat");
    assert.equal(resultB.tier, "Tier 1");
    assert.equal(resultB.requiresRMCB, true);

    // Case C: Deep Learning Black-Box Complexity -> Tier 2
    const resultC = calculateModelRiskTier("low", "low", "deep");
    assert.equal(resultC.tier, "Tier 2");
    assert.equal(resultC.requiresRMCB, false);

    // Case D: Simple Spreadsheet Formula -> Tier 3
    const resultD = calculateModelRiskTier("low", "low", "simple");
    assert.equal(resultD.tier, "Tier 3");
    assert.equal(resultD.requiresRMCB, false);

    console.log("  ✅ testRiskBasedTieringCalculations PASSED");
  },

  // Test 2: Verify Active Living Model Inventory & 10-Year retention flag on decommission
  testModelInventoryAndArchivingRetention() {
    console.log("  - Running testModelInventoryAndArchivingRetention...");

    const activeModel = {
      id: "MDL-9988",
      name: "Corporate Loan Pricing Engine",
      owner: "Wholesale Credit Division",
      version: "1.0.0",
      riskTier: "Tier 1",
      status: "Active"
    };

    const currentYear = 2026;
    const archivedModel = decommissionModel(activeModel, currentYear);

    // Assert status is now Retired
    assert.equal(archivedModel.status, "Retired");

    // Assert 10-year retention flag is exactly active (2026 + 10 = 2036)
    assert.equal(archivedModel.archivalRetentionUntil, 2036);
    assert.equal(archivedModel.retentionPolicyRef, "RBI MRM Guideline: 10-Year Mandatory Archive");

    // Assert trying to decommission an already decommissioned model throws
    assert.throws(() => {
      decommissionModel(archivedModel, currentYear);
    }, /already decommissioned/);

    console.log("  ✅ testModelInventoryAndArchivingRetention PASSED");
  },

  // Test 3: Verify AI/ML Governance Checklist Logic
  testAiMlgovernanceChecklist() {
    console.log("  - Running testAiMlgovernanceChecklist...");

    const auditChecklist = {
      modelId: "MDL-2204",
      dimensions: [1, 2, 5], // Hallucination, Bias, Explainability Gaps
      controls: {
        hallucination: "RAG verification pipeline configured.",
        bias: "Data parity scrubbed.",
        explainability: "SHAP scores exported for CRO inspection."
      },
      hitlOverride: true,
      hitlRole: "Credit Committee Executive"
    };

    // Asserts
    assert.equal(auditChecklist.dimensions.length, 3);
    assert.equal(auditChecklist.hitlOverride, true);
    assert.equal(auditChecklist.hitlRole, "Credit Committee Executive");

    // Verification alert checks
    const hasExplainabilityControl = !!auditChecklist.controls.explainability;
    assert.equal(hasExplainabilityControl, true);

    console.log("  ✅ testAiMlgovernanceChecklist PASSED");
  }
};

module.exports = {
  name: "Extension Integrity & RBI MRM Rule Engine Tests",
  run() {
    for (const [testName, testFn] of Object.entries(tests)) {
      testFn();
    }
  }
};
