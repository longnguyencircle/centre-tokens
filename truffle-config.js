process.env.TS_NODE_FILES = "true";
require("ts-node/register/transpile-only");
// Fix Typescript callsite reporting
Object.defineProperty(Error, "prepareStackTrace", { writable: false });

const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const path = require("path");

// Read config file if it exists
let config = {
  BLACKLISTER_PRIVATE_KEY: "",
  DEPLOYER_PRIVATE_KEY: "",
  MASTERMINTER_OWNER_PRIVATE_KEY: "",
  OWNER_PRIVATE_KEY: "",
  PROXY_ADMIN_PRIVATE_KEY: "",
  USE_USDC_MIGRATIONS: "",
  TESTNET_RPC_URL: "",
  LOCAL_RPC_URL: "",
  MAINNET_RPC_URL: "",
  MAINNET_ID: "",
  TESTNET_ID: "",
  ETHERSCAN_API_KEY: "",
  ARBISCAN_API_KEY: "",
  OPTIMISTIC_ETHERSCAN_API_KEY: "",
};

if (fs.existsSync(path.join(__dirname, "config.js"))) {
  config = require("./config.js");
}

module.exports = {
  compilers: {
    solc: {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 10000000,
        },
      },
    },
  },
  networks: {
    development: {
      network_id: "*",
      provider: rpcProvider(config.LOCAL_RPC_URL),
    },
    mainnet: {
      provider: rpcProvider(config.MAINNET_RPC_URL),
      network_id: config.MAINNET_ID,
      skipDryRun: false,
      confirmations: 1,
      networkCheckTimeout: 100000,
      timeoutBlocks: 20,
    },
    testnet: {
      provider: rpcProvider(config.TESTNET_RPC_URL),
      network_id: config.TESTNET_ID,
      skipDryRun: true,
      confirmations: 1,
      networkCheckTimeout: 100000,
      timeoutBlocks: 20,
    },
  },
  mocha: {
    timeout: 60000, // prevents tests from failing when pc is under heavy load
    reporter: "Spec",
  },
  plugins: ["solidity-coverage", "truffle-plugin-verify"],
  // https://www.npmjs.com/package/truffle-plugin-verify
  api_keys: {
    etherscan: config.ETHERSCAN_API_KEY,
    arbiscan: config.ARBISCAN_API_KEY,
    optimistic_etherscan: config.OPTIMISTIC_ETHERSCAN_API_KEY,
  },
  // Use default directory if false
  migrations_directory: config.USE_USDC_MIGRATIONS
    ? "./migrations/usdc"
    : undefined,
};

function rpcProvider(network) {
  return () => {
    return new HDWalletProvider({
      privateKeys: [
        config.DEPLOYER_PRIVATE_KEY,
        config.MASTERMINTER_OWNER_PRIVATE_KEY,
        config.PROXY_ADMIN_PRIVATE_KEY,
        config.OWNER_PRIVATE_KEY,
        config.BLACKLISTER_PRIVATE_KEY,
      ],
      providerOrUrl: network,
    });
  };
}
