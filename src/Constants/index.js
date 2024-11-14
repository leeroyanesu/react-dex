import {STACKS_TESTNET,STACKS_MAINNET} from "@stacks/network";

export const appName = "PNUT-DEX";
export const appIcon = window.location.origin+"/favicon/web-app-manifest-192x192.png";
export const networkString = "mainnet";
export const testnet = STACKS_MAINNET;
export const mainnet = STACKS_TESTNET;
export const network = mainnet;
export const isTestnet = network === testnet;
export const isMainnet = network === mainnet;

