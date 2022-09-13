import { Client, ContractCallQuery, ContractFunctionParameters, Wallet, Hbar, ContractId } from '@hashgraph/sdk';
import { expect } from 'chai';
import * as fs from "fs";
import dotenv from "dotenv";
import { Provider } from '@hashgraph/sdk/lib/Provider';
import { Greeter } from '../typechain-types';

dotenv.config()

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
    contractID = ContractId.fromSolidityAddress(receipt.contractAddress);
    console.log(contractID);
  });

  it('should be able to deploy a contract', async function() {
    expect(contractAddress).to.not.be.null;
  });

  it('should be able to call a contract', async function() {
    const partialTxParams = await greeter.populateTransaction.greet() as any;

    const fullTxParams = await wallet.populateTransaction(partialTxParams);
    const signedTx = await wallet.signTransaction(fullTxParams);

    const tx = await ethers.provider.send('eth_sendRawTransaction', [signedTx]);
    expect(tx).to.not.be.null;
  });

  it('should be able to call a contract and read a returned value', async function() {
    const contractQueryTx1 = new ContractCallQuery()
    .setContractId(contractID)
    .setGas(100000)
    .setFunction(
      "greet",
      new ContractFunctionParameters()
    );

    const contractQuerySubmit1 = await contractQueryTx1.execute(client);
    const contractQueryResult1 = contractQuerySubmit1.getUint256(0);
    console.log(
      `- Here's the greeting you asked for: ${contractQueryResult1} \n`
    );
    expect(contractQueryResult1).to.be.equal(init_message);
  });
});
