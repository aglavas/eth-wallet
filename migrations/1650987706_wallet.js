const Wallet = artifacts.require("Wallet");

module.exports = function(deployer, _network, accounts) {
  deployer.deploy(Wallet, accounts[0]);
};