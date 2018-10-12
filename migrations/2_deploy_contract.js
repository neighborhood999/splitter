const Splitter = artifacts.require('Splitter');

module.exports = (deployer, network, accounts) =>
  deployer.deploy(Splitter, { from: accounts[0] });

