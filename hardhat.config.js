require("@nomiclabs/hardhat-waffle");
const {projectId, privateKey} = require('./secret.json');

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    }
  }
};
