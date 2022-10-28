const fs = require("fs");
const path = require("path");

const FiatTokenV2_1 = artifacts.require("FiatTokenV2_1");
const FiatTokenProxy = artifacts.require("FiatTokenProxy");
const MasterMinter = artifacts.require("MasterMinter");

const THROWAWAY_ADDRESS = "0x0000000000000000000000000000000000000001";

let proxyAdminAddress = "";
let ownerAddress = "";
let pauserAddress = "";
let blacklisterAddress = "";
let lostAndFoundAddress = "";
let masterMinterOwnerAddress = "";
let fiatTokenImplementationAddress = "";
let tokenName = "";
let tokenSymbol = "";
let tokenCurrency = "";
let tokenDecimals = "";

// Read config file if it exists
if (fs.existsSync(path.join(__dirname, "..", "config.js"))) {
  ({
    PROXY_ADMIN_ADDRESS: proxyAdminAddress,
    OWNER_ADDRESS: ownerAddress,
    COLD_PAUSER_ADDRESS: pauserAddress,
    COLD_BLACKLISTER_ADDRESS: blacklisterAddress,
    COLD_LOST_AND_FOUND_ADDRESS: lostAndFoundAddress,
    MASTERMINTER_OWNER_ADDRESS: masterMinterOwnerAddress,
    FIAT_TOKEN_IMPLEMENTATION_ADDRESS: fiatTokenImplementationAddress,
    TOKEN_NAME: tokenName,
    TOKEN_SYMBOL: tokenSymbol,
    TOKEN_CURRENCY: tokenCurrency,
    TOKEN_DECIMALS: tokenDecimals,
  } = require("../config.js"));
}

/**
 * This file combines the work of USDC on ETH migrations 2 through 7. This was created with slight modifications from
 * 2_deploy_all.js from the tron branch of this repo. There's no point in deploying the older implementations for
 * FiatToken since we don't need them (we only want V2_1).
 *
 * The ordering of this is a little complex - we need the proxy's address in order to deploy
 * the master minter, but we can't initialize the proxy until we have the master minter deployed.
 */

module.exports = async (deployer, network) => {
  if (
      !proxyAdminAddress ||
      !ownerAddress ||
      !masterMinterOwnerAddress
  ) {
    throw new Error(
        "PROXY_ADMIN_ADDRESS, OWNER_ADDRESS, and MASTERMINTER_OWNER_ADDRESS must be provided in config.js"
    );
  }

  if (
      !pauserAddress ||
      !blacklisterAddress ||
      !lostAndFoundAddress
  ) {
    if (network === "mainnet") {
      throw new Error(
          "PAUSER_ADDRESS, BLACKLISTER_ADDRESS and LOST_AND_FOUND_ADDRESS must be provided in config.js"
      );
    } else {
      pauserAddress = proxyAdminAddress;
      blacklisterAddress = proxyAdminAddress;
      lostAndFoundAddress = proxyAdminAddress;
    }
  }

  console.log(`Proxy Admin:         ${proxyAdminAddress}`);
  console.log(`Owner:               ${ownerAddress}`);
  console.log(`Pauser:              ${pauserAddress}`);
  console.log(`Blacklister:         ${blacklisterAddress}`);
  console.log(`Lost and Found:      ${lostAndFoundAddress}`);
  console.log(`Master Minter Owner: ${masterMinterOwnerAddress}`);
  console.log(`FiatTokenV2_1ImplementationAddress: ${fiatTokenImplementationAddress}`);

  // If there is an existing USDC implementation contract,
  // we can simply point the newly deployed proxy contract to it.
  if (!fiatTokenImplementationAddress) {

    console.log("Deploying implementation contract...");
    await deployer.deploy(FiatTokenV2_1, { gas: 20000000 });
    const fiatTokenV2_1 = await FiatTokenV2_1.deployed();
    console.log("Deployed implementation contract at", FiatTokenV2_1.address);

    console.log("Initializing implementation contract with dummy values...");
    await fiatTokenV2_1.initialize(
      "",
      "",
      "",
      0,
      THROWAWAY_ADDRESS,
      THROWAWAY_ADDRESS,
      THROWAWAY_ADDRESS,
      THROWAWAY_ADDRESS
    );

    fiatTokenImplementationAddress = FiatTokenV2_1.address;
  }

  console.log("Deploying proxy contract...");
  await deployer.deploy(FiatTokenProxy, fiatTokenImplementationAddress);
  const fiatTokenProxy = await FiatTokenProxy.deployed();
  console.log("Deployed proxy contract at", FiatTokenProxy.address);

  // Now that the proxy contract has been deployed, we can deploy the master minter.
  console.log("Deploying master minter...");
  await deployer.deploy(MasterMinter, FiatTokenProxy.address);
  const masterMinter = await MasterMinter.deployed();
  console.log("Deployed master minter at", MasterMinter.address);

  // Change the master minter to be owned by the permanent owner
  console.log("Reassigning master minter owner...");
  await masterMinter.transferOwnership(masterMinterOwnerAddress);

  // Now that the master minter is set up, we can go back to setting up the proxy and
  // implementation contracts.

  console.log("Reassigning proxy contract admin...");
  // need to change admin first, or the call to initialize won't work
  // since admin can only call methods in the proxy, and not forwarded methods
  await fiatTokenProxy.changeAdmin(proxyAdminAddress);

  console.log("Initializing proxy contract...");

  // Do the initial (V1) initialization.
  // Note that this takes in the master minter contract's address as the master minter.
  const proxyAsV2_1 = await FiatTokenV2_1.at(FiatTokenProxy.address);
  await proxyAsV2_1.initialize(
    tokenName,
    tokenSymbol,
    tokenCurrency,
    tokenDecimals,
    masterMinterOwnerAddress,
    pauserAddress,
    blacklisterAddress,
    ownerAddress
  );

  // Do the V2 initialization
  console.log("Initializing V2...");
  await proxyAsV2_1.initializeV2(tokenName);

  // Do the V2_1 initialization
  console.log("Initializing V2.1...");
  await proxyAsV2_1.initializeV2_1(lostAndFoundAddress);

  console.log("Deployment step 2 finished");
};
