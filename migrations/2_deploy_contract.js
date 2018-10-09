const Splitter = artifacts.require('Splitter');

module.exports = (deployer, network, accounts) =>
  network === 'development' && deployer.deploy(Splitter, { from: accounts[0] });

