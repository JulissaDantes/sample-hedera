
const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, AccountId, TransferTransaction, ScheduleCreateTransaction} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    /* //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.OPERATOR_ACCOUNT_ID;
    const myPrivateKey = process.env.OPERATOR_PRIVATE_KEY;

    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forName('testnet');

    client.setOperator(myAccountId, myPrivateKey);
    //0x81EE95c219dF88cFEF34010d42d100b9Fb5aa8d5
    //0x81EE95c219dF88cFEF34010d42d100b9Fb5aa8d5

    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generateECDSA(); 
    console.log(`The raw private key (use this for JSON RPC wallet import): ${newAccountPrivateKey.toStringRaw()}`);
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(10000000))
        .execute(client);

    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " +newAccountId, "with this private key", newAccountPrivateKey.toString());

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");
 */
    const operatorId = process.env.OPERATOR_ACCOUNT_ID;
    const operatorPrivateKey = process.env.OPERATOR_PRIVATE_KEY;
    const client = Client.forTestnet().setOperator(operatorId, operatorPrivateKey).setDefaultMaxTransactionFee(new Hbar(10));
    console.log('"Creating" a new account');

    const privateKey = PrivateKey.generateECDSA();
    const publicKey = privateKey.publicKey;

    const aliasAccountId = publicKey.toAccountId(0, 0);

    console.log(`New account ID: ${aliasAccountId.toString()}`);
    console.log(`Just the aliasKey: ${aliasAccountId.aliasKey.toString()}`);

    console.log('privateKey.toStringRaw()', privateKey.toStringRaw());
    console.log('publicKey.toStringRaw()', publicKey.toStringRaw());
        
    console.log("Transferring some Hbar to the new account");
    const transaction = new TransferTransaction()
        .addHbarTransfer(operatorId, -1)
        .addHbarTransfer(aliasAccountId, 1)

    /*const scheduleTransaction = await new ScheduleCreateTransaction()
        .setScheduledTransaction(transaction)
        .execute(client);

    const receipt = await scheduleTransaction.getReceipt(client);*/

    const txResponse = await transaction.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    console.log('receipt', receipt.status.toString());

    console.log('done');
}
main();