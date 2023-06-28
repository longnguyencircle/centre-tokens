module.exports = {
  // ***** CONFIGURATION *********

  // these API keys are used to verify contracts
  // see truffle-config.js for more context
  ETHERSCAN_API_KEY: "",
  ARBISCAN_API_KEY: "",
  OPTIMISTIC_ETHERSCAN_API_KEY: "",

  LOCAL_RPC_URL: "http://localhost:8545",
  TESTNET_RPC_URL: "",
  MAINNET_RPC_URL: "",

  MAINNET_ID: "",
  TESTNET_ID: "",

  TOKEN_NAME: "USD Coin",
  // TokenSymbol - Symbol of the token e.g. "USDC"
  TOKEN_SYMBOL: "USDC",
  // TokenCurrency - Currency of the token e.g. "USD"
  TOKEN_CURRENCY: "USD",
  // TokenDecimals - Number of decimals for the token e.g. 6
  TOKEN_DECIMALS: 6,
  // USE_USDC_MIGRATIONS - whether or not to use legacy migrations in migrations/usdc directory.
  // These migrations deploy each version of FiatToken separately.
  USE_USDC_MIGRATIONS: false,

  // FiatTokenImplementationAddress - (optional) if given for non-usdc migrations we don't deploy FiatToken, just the proxy
  // FIAT_TOKEN_IMPLEMENTATION_ADDRESS: "",
  // FiatTokenProxy contract - override the contract address used in migrations
  // PROXY_CONTRACT_ADDRESS: "",

  // ***** DEPLOYER HOT KEYS *********

  DEPLOYER_ADDRESS: "0xb22a72fb541088f2f21fc3f99f75639915f6062b",
  DEPLOYER_PRIVATE_KEY:
    "0x8c11473720b0e4cdb613a96eb198309a92a5b9df84cfdc481fd254c224651f76",

  MASTERMINTER_OWNER_ADDRESS: "0xb12fc9fbd0e8f3176b918f2f4d701138af4dcb28",
  MASTERMINTER_OWNER_PRIVATE_KEY:
    "0xad4596a39857056430ad1d43ab192bc3060b92fc84d233779d4c260144d23eea",

  PROXY_ADMIN_ADDRESS: "0xa0fd1902eb9abdebc82038b302bc3cb26934e4c3",
  PROXY_ADMIN_PRIVATE_KEY:
    "0x90bfcb25ef1989a3b60d4fd9234d70ff625e94a6b880af0ce05a42e7d3c3f851",

  OWNER_ADDRESS: "0x8a087d71d97b18ed8b46bdb3e8f38dbcb3ec9b53",
  OWNER_PRIVATE_KEY:
    "0x456cc28685727d949e29e0c2f48e622f7fd31879de70465cdff4d9809bc0b60d",

  // ***** MINTER SETUP *********

  MINTER_PROD: "",
  MINTER_STG: "",
  BURNER_PROD: "",
  BURNER_STG: "",

  // 115792089237316195423570985008687907853269984665640564039457584007 for testnet minter
  MINT_ALLOWANCE_UNITS_PROD: 115792089237316200000000000000000000000000000000000000000000000000000000,
  MINT_ALLOWANCE_UNITS_STG: 115792089237316200000000000000000000000000000000000000000000000000000000,

  // ***** COLD STORAGE *********

  MINTER_STG_CONTROLLER_INCREMENTER: "",
  MINTER_STG_CONTROLLER_REMOVER: "",
  BURNER_STG_CONTROLLER: "",

  MINTER_PROD_CONTROLLER_INCREMENTER:
    "0xb43d68b23e76c49f00d2d033900ca39d7f735a58",
  MINTER_PROD_CONTROLLER_REMOVER: "0x54b8bfb7a4c770966daea4b2481c4f08a859cee0",
  BURNER_PROD_CONTROLLER: "0x4b9ad65392bb382a1db142bb8978587daaddeafc",

  // Pauser - can pause the contract
  COLD_PAUSER_ADDRESS: "",
  // Blacklister - can blacklist addresses
  COLD_BLACKLISTER_ADDRESS: "",
  // LostAndFound - tokens that were locked in the contract are sent to this
  COLD_LOST_AND_FOUND_ADDRESS: "",
  COLD_MASTERMINTER_OWNER_ADDRESS: "",
  COLD_PROXY_ADMIN_ADDRESS: "",
  // Owner - can configure master minter, pauser, and blacklister
  COLD_OWNER_ADDRESS: "",
};
