"use strict";

// Import NodeWalletConnect and WalletConnectQRCodeModal from the library =
const NodeWalletConnect = window.WalletConnect.default;
const WalletConnectQRCodeModal = window.WalletConnectQRCodeModal.default;

let walletConnector = null;
// Create connector
function init() {
  walletConnector = new NodeWalletConnect(
    {
      bridge: "https://bridge.walletconnect.org", // Required
    },
    {
      clientMeta: {
        description: "WalletConnect NodeJS Client",
        url: "https://nodejs.org/en/",
        icons: ["https://nodejs.org/static/images/logo.svg"],
        name: "WalletConnect",
      },
    }
  );
  console.log("Init walletConnect", walletConnector);
  check();
}

// Check if connected for proper UI handling (when user refresh the page)
function check() {
  if (walletConnector.connected) {
    document.querySelector("#connected").style.display = "block";
    document.querySelector("#prepare").style.display = "none";
  }
}

// Change button when use connected
async function changeButton() {
  document.querySelector("#connected").style.display = "block";
  document.querySelector("#prepare").style.display = "none";
}

// Check if connection is already established
async function showQRCode() {
  if (!walletConnector.connected) {
    // create new session
    walletConnector.createSession().then(() => {
      // get uri for QR Code modal
      const uri = walletConnector.uri;
      // display QR Code modal
      WalletConnectQRCodeModal.open(
        uri,
        () => {
          console.log("QR Code Modal closed");
        },
        true // isNode = true
      );
    });
  }
  // Subscribe to connection events
  walletConnector.on("connect", async (error, payload) => {
    if (error) {
      throw error;
    }

    // Close QR Code Modal
    WalletConnectQRCodeModal.close(
      true // isNode = true
    );

    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    await changeButton();
    console.log("Connected");
    console.log("Address:", accounts);
    console.log("ChainId", chainId);
  });

  walletConnector.on("session_update", (error, payload) => {
    if (error) {
      throw error;
    }

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    console.log(accounts, chainId);
  });
}

function disconnect() {
  walletConnector.on("disconnect", (error, payload) => {
    if (error) {
      throw error;
    }

    // Delete walletConnector
  });
  walletConnector.killSession().then(() => {
    console.log("Disconnect successfully");
  });
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}

// Catch event when init page and user click button
window.addEventListener("load", async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", showQRCode);
  document
    .querySelector("#btn-disconnect")
    .addEventListener("click", disconnect);
});
