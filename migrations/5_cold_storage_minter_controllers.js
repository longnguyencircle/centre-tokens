const fs = require("fs");
const path = require("path");
const MasterMinter = artifacts.require("MasterMinter.sol");

let masterMinterContractAddress = "";
let minterProd = "";
let minterStg = "";
let burnerProd = "";
let burnerStg = "";
let minterStgControllerIncrementer = "";
let minterStgControllerRemover = "";
let burnerStgController = "";
let minterProdControllerIncrementer = "";
let minterProdControllerRemover = "";
let burnerProdController = "";

// Read config file if it exists
if (fs.existsSync(path.join(__dirname, "..", "config.js"))) {
  ({
    MASTER_MINTER_CONTRACT_ADDRESS: masterMinterContractAddress,
    MINTER_PROD: minterProd,
    MINTER_STG: minterStg,
    BURNER_PROD: burnerProd,
    BURNER_STG: burnerStg,
    MINTER_STG_CONTROLLER_INCREMENTER: minterStgControllerIncrementer,
    MINTER_STG_CONTROLLER_REMOVER: minterStgControllerRemover,
    BURNER_STG_CONTROLLER: burnerStgController,
    MINTER_PROD_CONTROLLER_INCREMENTER: minterProdControllerIncrementer,
    MINTER_PROD_CONTROLLER_REMOVER: minterProdControllerRemover,
    BURNER_PROD_CONTROLLER: burnerProdController,
  } = require("../config.js"));
}

module.exports = async function (deployer, network, accounts) {
  console.log(
    `>>>>>>> Configuring Known Cold Storage Controllers of Minters And Burners <<<<<<<`
  );

  masterMinterContractAddress =
    masterMinterContractAddress || (await MasterMinter.deployed()).address;
  const masterMinter = await MasterMinter.at(masterMinterContractAddress);
  const masterMinterOwnerAddress = accounts[1];

  await masterMinter.configureController(
    minterProdControllerIncrementer,
    minterProd,
    {
      from: masterMinterOwnerAddress,
    }
  );

  await masterMinter.configureController(
    minterProdControllerRemover,
    minterProd,
    {
      from: masterMinterOwnerAddress,
    }
  );

  await masterMinter.configureController(burnerProdController, burnerProd, {
    from: masterMinterOwnerAddress,
  });

  await masterMinter.configureController(
    minterStgControllerIncrementer,
    minterStg,
    {
      from: masterMinterOwnerAddress,
    }
  );

  await masterMinter.configureController(
    minterStgControllerRemover,
    minterStg,
    {
      from: masterMinterOwnerAddress,
    }
  );

  await masterMinter.configureController(burnerStgController, burnerStg, {
    from: masterMinterOwnerAddress,
  });

  console.log(`>>>>>>> The following controllers are now configured: <<<<<<<`);
  console.log(
    `MINTER_PROD_CONTROLLER_INCREMENTER ${minterProdControllerIncrementer} controls ${await masterMinter.getWorker(
      minterProdControllerIncrementer
    )}`
  );
  console.log(
    `MINTER_PROD_CONTROLLER_REMOVER ${minterProdControllerRemover} controls ${await masterMinter.getWorker(
      minterProdControllerRemover
    )}`
  );
  console.log(
    `BURNER_PROD_CONTROLLER ${burnerProdController} controls ${await masterMinter.getWorker(
      burnerProdController
    )}`
  );
  console.log(
    `MINTER_STG_CONTROLLER_INCREMENTER ${minterStgControllerIncrementer} controls ${await masterMinter.getWorker(
      minterStgControllerIncrementer
    )}`
  );
  console.log(
    `MINTER_STG_CONTROLLER_REMOVER ${minterStgControllerRemover} controls ${await masterMinter.getWorker(
      minterStgControllerRemover
    )}`
  );
  console.log(
    `BURNER_STG_CONTROLLER ${burnerStgController} controls ${await masterMinter.getWorker(
      burnerStgController
    )}`
  );
};
