import { AccountId, Wallet } from '@hashgraph/sdk';
import { expect } from 'chai';
import * as fs from "fs";
import dotenv from "dotenv";
import { Provider } from '@hashgraph/sdk/lib/Provider';
import { Greeter } from '../typechain-types';

dotenv.config()

describe('RPC', function() {
  const init_message = 'initial_msg';
  let contractAddress: any;
  let wallet: Wallet;
  let provider: Provider;
  let greeter: Greeter;
  before(async () => {
    provider = await new ethers.providers.JsonRpcProvider(process.env.RELAY_ENDPOINT);
    wallet = await new ethers.Wallet( process.env.OPERATOR_PRIVATE_KEY, provider);
    const Greeter = await ethers.getContractFactory('Greeter', wallet);
    greeter = await Greeter.deploy(init_message);
    contractAddress = (await greeter.deployTransaction.wait()).contractAddress;
  });
  it('should be able to deploy a contract', async function() {
    expect(contractAddress).to.not.be.null;
  });
  it('should be able to call a contract', async function() {
    const result = await greeter.greet();
    console.log(result);
    expect(result).to.be.equal(init_message);
  });
});
