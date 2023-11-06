export interface Transaction {
  from: string;
  to: string;
  data?: string;
  value?: string;
}

export enum TransactionType {
  Transaction = "Transaction",
  Signature = "Signature",
}

export enum ResponseType {
  Success = "success",
  Revert = "revert",
  Error = "error",
}

export enum TokenType {
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
  ERC20 = "ERC20",
}

export enum SimulationMethodType {
  EthSignTypedDataV3 = "eth_signTypedData_v3",
  EthSignTypedDataV4 = "eth_signTypedData_v4",
  EthSendTransaction = "eth_sendTransaction",
  EthSign = "eth_sign",
  PersonalSign = "personal_sign",
}

interface RequestArgs {
  // UUID for this request.
  id: string;
  // Chain ID for this request in hex.
  chainId: string;
  // Signer for this request.
  signer: string;
  // Domain Origin
  origin: string;
  // Method type
  method: SimulationMethodType | string;
  // Whether this request is a bypassed request.
  bypassed?: boolean;
}

export interface SimulateRequestArgs extends RequestArgs {
  transaction: Transaction;
}

export interface SignatureRequestArgs extends RequestArgs {
  // Domain for this signature request.
  domain: any; // TODO: add types here?
  // Message to be signed for this signature request.
  message: any;
  // Primary type for this message.
  primaryType: string;
}

export interface SignatureHashSignArgs extends RequestArgs {
  hash: string;
}

export interface PersonalSignArgs extends RequestArgs {
  signMessage: string;
}

export type TransactionArgs =
  | SimulateRequestArgs
  | SignatureRequestArgs
  | SignatureHashSignArgs
  | PersonalSignArgs;
