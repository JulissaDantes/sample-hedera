const { ethers } = require("hardhat");


async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RELAY_ENDPOINT);
  const wallet = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY as any, provider);
  const Greeter = await ethers.getContractFactory('Greeter', wallet);
  const greeter = await Greeter.deploy('initial_msg');
  const contractAddress = (await greeter.deployTransaction.wait()).contractAddress;

  console.log(`Greeter deployed to ${contractAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
