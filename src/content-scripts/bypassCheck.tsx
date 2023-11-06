import Browser from "webextension-polyfill";
import {
  PersonalSignArgs,
  SignatureHashSignArgs,
  SignatureRequestArgs,
  SimulateRequestArgs,
  Transaction,
  TransactionArgs,
} from "../models/simulation/Transaction";
import { uuid4 } from "@sentry/utils";
import {
  PortMessage,
  PortIdentifiers,
} from "../lib/helpers/chrome/messageHandler";
import { convertObjectValuesToString } from "../injected/injectWalletGuard";

let metamaskChainId = 1;
const bypassed = true;

const sendMessageToPort = (
  stream: Browser.Runtime.Port,
  data: TransactionArgs
): void => {
  console.log("called sendMessageToPort");
  console.log(stream);
  console.log(data);
  const message: PortMessage = {
    data,
  };
  //   stream.postMessage(message);
  chrome.runtime.sendMessage({ message, type: "open-popup" });
};

// Bypass checks for MetaMask
window.addEventListener("message", (message) => {
  console.log("on message event from the bypassChecker");
  console.log(message);
  const { target } = message?.data ?? {};
  const { name, data } = message?.data?.data ?? {};
  const { href } = location;
  const chainId = metamaskChainId;

  if (name !== PortIdentifiers.METAMASK_PROVIDER || !data) return;
  console.log(target);

  if (target === PortIdentifiers.METAMASK_CONTENT_SCRIPT) {
    if (data.method === "eth_sendTransaction") {
      console.log("inside eth_sendtransaction");
      const transaction: Transaction = data.params[0];
      const request: SimulateRequestArgs = {
        id: uuid4(),
        chainId: String(chainId),
        signer: transaction.from,
        transaction,
        method: data.method,
        origin: href,
        bypassed,
      };

      // Forward received messages to background.js
      const contentScriptPort = Browser.runtime.connect({
        name: PortIdentifiers.WG_CONTENT_SCRIPT,
      });
      sendMessageToPort(contentScriptPort, request);
    } else if (
      data.method === "eth_signTypedData_v3" ||
      data.method === "eth_signTypedData_v4"
    ) {
      if (data.params.length < 2) {
        console.warn("Unexpected argument length.");
        return;
      }

      const params = JSON.parse(data.params[1]);
      let signer: string = params[0];

      if (!signer) {
        signer = data.params[0];
      }

      const domain = convertObjectValuesToString(params.domain);
      const message = convertObjectValuesToString(params.message);

      const request: SignatureRequestArgs = {
        id: uuid4(),
        chainId: String(chainId),
        signer,
        domain: domain,
        message: message,
        primaryType: params["primaryType"],
        method: data.method,
        origin: href,
        bypassed,
      };

      // Forward received messages to background.js
      const contentScriptPort = Browser.runtime.connect({
        name: PortIdentifiers.WG_CONTENT_SCRIPT,
      });
      sendMessageToPort(contentScriptPort, request);
    } else if (data.method === "personal_sign") {
      if (data.params.length < 2) {
        console.warn("Unexpected argument length.");
        return;
      }

      const signer: string = data.params[1];
      const signMessage: string = data.params[0];

      const request: PersonalSignArgs = {
        id: uuid4(),
        chainId: String(chainId),
        origin: href,
        bypassed,
        method: data.method,
        signer,
        signMessage,
      };

      // Forward received messages to background.js
      const contentScriptPort = Browser.runtime.connect({
        name: PortIdentifiers.WG_CONTENT_SCRIPT,
      });
      sendMessageToPort(contentScriptPort, request);
    } else if (data.method === "eth_sign") {
      if (data.params.length < 2) {
        console.warn("Unexpected argument length.");
        return;
      }

      const signer: string = data.params[0];
      const hash: string = data.params[1];

      const request: SignatureHashSignArgs = {
        id: uuid4(),
        chainId: String(chainId),
        origin: href,
        bypassed,
        method: data.method,
        signer,
        hash,
      };

      // Forward received messages to background.js
      const contentScriptPort = Browser.runtime.connect({
        name: PortIdentifiers.WG_CONTENT_SCRIPT,
      });
      sendMessageToPort(contentScriptPort, request);
    }
  }

  if (
    target === PortIdentifiers.METAMASK_INPAGE &&
    data?.method?.includes("chainChanged")
  ) {
    metamaskChainId = Number(data?.params?.chainId ?? metamaskChainId);
  }
});
