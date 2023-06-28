const fs = require("fs");
const path = require("path");

const FiatTokenProxy = artifacts.require("FiatTokenProxy");
const FiatTokenV2_1 = artifacts.require("FiatTokenV2_1");
const MasterMinter = artifacts.require("MasterMinter.sol");

let coldProxyAdminAddress = "";
let coldMasterMinterAddress = "";
let coldOwnerAddress = "";
let proxyContractAddress = "";
let masterMinterContractAddress = "";

// Read config file if it exists
if (fs.existsSync(path.join(__dirname, "..", "config.js"))) {
  ({
    COLD_PROXY_ADMIN_ADDRESS: coldProxyAdminAddress,
    COLD_MASTERMINTER_OWNER_ADDRESS: coldMasterMinterAddress,
    COLD_OWNER_ADDRESS: coldOwnerAddress,
    PROXY_CONTRACT_ADDRESS: proxyContractAddress,
    MASTER_MINTER_CONTRACT_ADDRESS: masterMinterContractAddress,
  } = require("../config.js"));
}

// reassign ownership/control of contract to cold storage keys
module.exports = async function (deployer, network, accounts) {
  if (!coldProxyAdminAddress || !coldMasterMinterAddress || !coldOwnerAddress) {
    throw new Error(
      "COLD_PROXY_ADMIN_ADDRESS, COLD_MASTERMINTER_ADDRESS, and COLD_OWNER_ADDRESS must be provided in config.js"
    );
  }

  console.log(`>>>>>>> Reassigning ownership to cold storage <<<<<<<`);

  masterMinterContractAddress =
    masterMinterContractAddress || (await MasterMinter.deployed()).address;
  proxyContractAddress =
    proxyContractAddress || (await FiatTokenProxy.deployed()).address;

  const ownerPrivateKey = accounts[3];

  // upgrade master minter on token to master minter contract address
  const proxyAsV2_1 = await FiatTokenV2_1.at(proxyContractAddress);
  await proxyAsV2_1.updateMasterMinter(masterMinterContractAddress, {
    from: ownerPrivateKey,
  });
  console.log(
    `Reassigned master minter on token to the master minter contract address`
  );

  await proxyAsV2_1.transferOwnership(coldOwnerAddress, {
    from: ownerPrivateKey,
  });
  console.log(`Reassigned token owner to cold storage`);

  // reassign proxy admin to cold storage
  const proxyContract = await FiatTokenProxy.at(proxyContractAddress);
  const proxyAdminPrivateKey = accounts[2];
  await proxyContract.changeAdmin(coldProxyAdminAddress, {
    from: proxyAdminPrivateKey,
  });

  console.log(`Reassigned proxy admin to cold storage`);

  // reassign master minter to cold storage
  const masterMinter = await MasterMinter.at(masterMinterContractAddress);
  const masterMinterOwnerPrivateKey = accounts[1];
  await masterMinter.transferOwnership(coldMasterMinterAddress, {
    from: masterMinterOwnerPrivateKey,
  });

  console.log(`Reassigned master minter to cold storage`);
};
