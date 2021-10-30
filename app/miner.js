const { thisExpression } = require("@babel/types");
const Wallet = require("../wallet/index");
const Transaction = require("../wallet/transaction");
class Miner{
    constructor(blockchain,transactionPool,wallet,p2pServer){
        this.blockchain=blockchain;
        this.transactionPool=transactionPool;
        this.wallet=wallet;
        this.p2pServer=p2pServer;
    }

    mine(){
        // Get the valid transactions from the pool 
        const validTransactions = this.transactionPool.validTransactions();
        // Add a reward for the miner
        let transaction = Transaction.RewardTransaction(this.wallet,Wallet.blockchainWallet());
        validTransactions.push(transaction);
        // Create a block of valid trasaction
        const block = this.blockchain.addBlock(validTransactions);
        // Sync the chains of peer to peer server
        this.p2pServer.SyncChain()
        // Clear the transaction pool
        this.transactionPool.clear();
        // Broadcast every miner to clear their txn pool
        this.p2pServer.broadcastClearTransaction();
        return block;
    }
}

module.exports=Miner;