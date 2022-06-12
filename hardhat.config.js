require("@nomiclabs/hardhat-waffle");
const {projectId, privateKey} = require('./secret.json');

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${projectId}`,
      accounts: [privateKey]
    }
  }
};
