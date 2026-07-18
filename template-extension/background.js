// RBI MRM Compliance Assistant - Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log("RBI MRM Compliance Assistant successfully installed.");

  // Set default configurations if none exist
  chrome.storage.local.get(["mrm_configured"], (res) => {
    if (!res.mrm_configured) {
      chrome.storage.local.set({
        mrm_configured: true,
        bank_name: "{{BANK_NAME}}",
        theme_color: "{{THEME_COLOR}}",
        allowed_domains: "{{ALLOWED_DOMAINS}}",
        api_endpoint: "{{API_ENDPOINT}}",
        installation_time: new Date().toISOString()
      });
      console.log("Default configurations set for {{BANK_NAME}}.");
    }
  });
});

// Listener for receiving messages from Content Scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request);

  if (request.action === "get_status") {
    sendResponse({ status: "active", version: "1.0.0", bank: "{{BANK_NAME}}" });
  } else if (request.action === "log_compliance_alert") {
    console.warn("COMPLIANCE ALERT LOGGED BY CONTENT SCRIPT:", request.details);
    sendResponse({ received: true });
  }
  return true;
});
