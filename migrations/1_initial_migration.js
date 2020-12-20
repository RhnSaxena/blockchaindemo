const Migrations = artifacts.require("SponsorAdvertising");

module.exports = function (deployer) {
  deployer.deploy(Migrations, "Maggi", "Advertisement", 123);
};
