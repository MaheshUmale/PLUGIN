// Options Controller

document.addEventListener("DOMContentLoaded", () => {
  const btnSave = document.getElementById("btn-save-options");
  const optBankName = document.getElementById("opt-bank-name");
  const optSyncApi = document.getElementById("opt-sync-api");
  const optThreshold = document.getElementById("opt-materiality-threshold");
  const statusMessage = document.getElementById("status-message");

  // Load existing configuration on start
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["bank_name", "api_endpoint", "materiality_threshold"], (result) => {
      if (result.bank_name) optBankName.value = result.bank_name;
      if (result.api_endpoint) optSyncApi.value = result.api_endpoint;
      if (result.materiality_threshold) optThreshold.value = result.materiality_threshold;
    });
  }

  btnSave.addEventListener("click", () => {
    const config = {
      bank_name: optBankName.value,
      api_endpoint: optSyncApi.value,
      materiality_threshold: optThreshold.value,
      last_modified: new Date().toISOString()
    };

    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(config, () => {
        showStatus();
      });
    } else {
      localStorage.setItem("mrm_config_options", JSON.stringify(config));
      showStatus();
    }
  });

  function showStatus() {
    statusMessage.style.display = "block";
    setTimeout(() => {
      statusMessage.style.display = "none";
    }, 2000);
  }
});
