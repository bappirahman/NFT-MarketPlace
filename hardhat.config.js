require("@nomiclabs/hardhat-waffle");
const {projectId, privateKey} = require('./secret.json');

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${projectId}`,
      accounts: [privateKey]
    }
  }
};
