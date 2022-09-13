import { Client, ContractCallQuery, ContractFunctionParameters, Wallet, Hbar, ContractId } from '@hashgraph/sdk';
import { expect } from 'chai';
import * as fs from "fs";
import dotenv from "dotenv";
import { Provider } from '@hashgraph/sdk/lib/Provider';
import { Greeter } from '../typechain-types';

dotenv.config()
const baseURL = 'https://testnet.mirrornode.hedera.com/api/v1/';
const axios = require('axios').default.create({ baseURL });

const operatorId = process.env.OPERATOR_ACCOUNT_ID!;
const operatorPrivateKey = process.env.OPERATOR_PRIVATE_KEY!;
const client = Client.forTestnet().setOperator(operatorId, operatorPrivateKey).setDefaultMaxTransactionFee(new Hbar(10));

describe('RPC', function() {
  const init_message = 'initial_msg';
  let contractAddress: any;
  let wallet: Wallet;
  let provider: Provider;
  let greeter: Greeter;
  let contractID: ContractId;

  before(async () => {
    provider = await new ethers.providers.JsonRpcProvider(process.env.RELAY_ENDPOINT);
    wallet = await new ethers.Wallet( process.env.OPERATOR_PRIVATE_KEY, provider);
    const Greeter = await ethers.getContractFactory('Greeter', wallet);
    greeter = await Greeter.deploy(init_message);
    const receipt = await greeter.deployTransaction.wait();
    contractAddress = receipt.contractAddress;
    contractID = ContractId.fromSolidityAddress(contractAddress);
    console.log(contractID, contractAddress);
  });

  it('should be able to deploy a contract', async function() {
    expect(contractAddress).to.not.be.null;
  });

  it.only('should be able to call a contract', async function() {
    let partialTxParams = await greeter.populateTransaction.greet() as any;
    partialTxParams.to = contractID.toSolidityAddress();
    
    const fullTxParams = await wallet.populateTransaction(partialTxParams);
    const signedTx = await wallet.signTransaction(fullTxParams);
    
    const tx = await ethers.provider.send('eth_sendRawTransaction', [signedTx]);
    expect(tx).to.not.be.null;
    // wait for consensus
    await new Promise((resolve) => setTimeout(resolve, 10000));

    const receipt = await ethers.provider.getTransactionReceipt(tx);
    console.log("the reciept", receipt);
    const resMirrorNode = await axios.get(`contracts/results/${tx}`);

    console.log('resMirrorNode.data', resMirrorNode.data)
  });
});
