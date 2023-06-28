const fs = require("fs");
const path = require("path");
const BigNumber = require("bignumber.js");
const FiatTokenProxy = artifacts.require("FiatTokenProxy");
const FiatTokenV2_1 = artifacts.require("FiatTokenV2_1");

let proxyContractAddress = "";
let minterProd = "";
let minterStg = "";
let burnerProd = "";
let burnerStg = "";
let mintAllowanceUnitsProd = 0;
let mintAllowanceUnitsStg = 0;

// Read config file if it exists
if (fs.existsSync(path.join(__dirname, "..", "config.js"))) {
  ({
    PROXY_CONTRACT_ADDRESS: proxyContractAddress,
    MINTER_PROD: minterProd,
    MINTER_STG: minterStg,
    BURNER_PROD: burnerProd,
    BURNER_STG: burnerStg,
    MINT_ALLOWANCE_UNITS_PROD: mintAllowanceUnitsProd,
    MINT_ALLOWANCE_UNITS_STG: mintAllowanceUnitsStg,
  } = require("../config.js"));
}

// Configure some minters with hot keys before converting to cold storage
// to avoid needing a run to even get our products started.
module.exports = async function (deployer, network, accounts) {
  console.log(`>>>>>>> Configuring Known Minters and Burners <<<<<<<`);

  proxyContractAddress =
    proxyContractAddress || (await FiatTokenProxy.deployed()).address;

  const proxyAsV2_1 = await FiatTokenV2_1.at(proxyContractAddress);
  const masterMinterOwnerPrivateKey = accounts[1];

  const mintAllowanceStg = new BigNumber(mintAllowanceUnitsStg).shiftedBy(6);
  await proxyAsV2_1.configureMinter(minterStg, mintAllowanceStg, {
    from: masterMinterOwnerPrivateKey,
  });
  await proxyAsV2_1.configureMinter(burnerStg, 0, {
    from: masterMinterOwnerPrivateKey,
  });

  const mintAllowanceProd = new BigNumber(mintAllowanceUnitsProd).shiftedBy(6);
  await proxyAsV2_1.configureMinter(minterProd, mintAllowanceProd, {
    from: masterMinterOwnerPrivateKey,
  });
  await proxyAsV2_1.configureMinter(burnerProd, 0, {
    from: masterMinterOwnerPrivateKey,
  });
};
