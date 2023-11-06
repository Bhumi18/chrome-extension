import { TransactionArgs } from "../../../models/simulation/Transaction";

export type PortMessage = {
  data: TransactionArgs; // extend this type when if/when we add more use cases to postMessage
};

export const PortIdentifiers = {
  WG_CONTENT_SCRIPT: "wg-contentscript",
  METAMASK_INPAGE: "metamask-inpage",
  METAMASK_CONTENT_SCRIPT: "metamask-contentscript",
  METAMASK_PROVIDER: "metamask-provider",
};

export enum BrowserMessageType {
  ProceedAnyway = "proceedAnyway",
  RunSimulation = "runSimulation",
  ApprovedTxn = "approvedTxn",
  open = "open-popup",
}

interface BaseBrowserMessage {
  type: BrowserMessageType;
}
export interface ProceedAnywayMessageType extends BaseBrowserMessage {
  url: string;
  permanent: boolean;
}

export interface ApprovedTxnMessageType extends BaseBrowserMessage {
  data: TransactionArgs;
}

export interface RunSimulationMessageType extends BaseBrowserMessage {
  data: TransactionArgs;
}

export type BrowserMessage =
  | ProceedAnywayMessageType
  | ApprovedTxnMessageType
  | RunSimulationMessageType;
