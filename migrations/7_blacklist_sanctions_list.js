const fs = require("fs");
const path = require("path");

const FiatTokenV2_1 = artifacts.require("FiatTokenV2_1");

const configFile = "config.js";
const blacklistFile = "blacklist.txt";

let blacklisterAddress = "";
let proxyContractAddress = "";

// Attempt to fetch the values needed for blacklisting.
if (fs.existsSync(path.join(__dirname, "..", `${configFile}`))) {
  ({
    BLACKLISTER_ADDRESS: blacklisterAddress,
    PROXY_CONTRACT_ADDRESS: proxyContractAddress,
  } = require(`../${configFile}`));
}
if (!blacklisterAddress || !proxyContractAddress) {
  throw new Error(
    "BLACKLISTER_ADDRESS (with its private key) & PROXY_CONTRACT_ADDRESS must be provided in config.js for blacklisting!"
  );
}

// Proceed to blacklist if and only if the file exists.
if (!fs.existsSync(path.join(__dirname, "..", `${blacklistFile}`))) {
  throw new Error(
    `${blacklistFile} file does not exist with addresses! See ${blacklistFile}.example!`
  );
}

module.exports = async function (deployer, network, accounts) {
  const proxyAsV2_1 = await FiatTokenV2_1.at(proxyContractAddress);
  const blacklisterPrivateKey = accounts[4]; // truffle-config.js, HDWalletProvider

  console.log(
    "Blacklisting the following addresses using blacklister address",
    await proxyAsV2_1.blacklister()
  );

  const addressesToBlacklist = fs
    .readFileSync(path.join(__dirname, "..", `${blacklistFile}`), "utf-8")
    .split(/\r?\n/);
  for (const addr of addressesToBlacklist) {
    await proxyAsV2_1.blacklist(addr, {
      from: blacklisterPrivateKey,
    });
    console.log(addr, await proxyAsV2_1.isBlacklisted(addr));
  }
};
