import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  defaultNetwork: "hedera",
  solidity: "0.8.9",
  networks: {
    hedera: {
      url: "https://testnet.hashio.io/api"
    }
  },
};

export default config;
