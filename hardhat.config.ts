import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const operatorPrivateKey = process.env.OPERATOR_PRIVATE_KEY!;
const config: HardhatUserConfig = {
  defaultNetwork: "hedera",
  solidity: "0.8.9",
  networks: {
    hedera: {
      url: "https://testnet.hashio.io/api",
      accounts:  [operatorPrivateKey]  
    }
  },
};

export default config;
