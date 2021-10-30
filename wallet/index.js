//Wallet class
const {INITIAL_BALANCE} = require("../blockchain/config");
const ChainUtil = require("../chain-util");
const Transaction = require("./transaction");

class Wallet{
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publickey = this.keyPair.getPublic().encode("hex");
    }

    toString(){
        return `Wallet -
        publicKey : ${this.publickey.toString()}
        balance   : ${this.balance}`;
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    CreateTransaction(recipient,amount,blockchain,transactionPool){
        this.balance = this.calculateBalance(blockchain);
        if(amount>this.balance){
            console.log(`Amount ${amount} exceceds the current balance ${this.balance}`);
            return;
        }

        let  transaction = transactionPool.existingTransaction(this.publickey);
        if(transaction){
            transaction.update(this,recipient,amount);
        }else{
            transaction = Transaction.newTransaction(this,recipient,amount);
            transactionPool.updateOrAddTransactions(transaction);
        }
        return transaction;
    }

    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = "blockchain-wallet";
        return blockchainWallet;
    }

    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];
        // Get data elements of each blocks
        blockchain.chain.forEach(block=>{
            block.data.forEach(data=>{
                transactions.push(data);
            });
        });
        // Filter by input.address === public key
        const walletTransactions = transactions.filter(transaction=> transaction.input.address===this.publickey);
        // Compare and get latest transactions
        let startTime = 0;
        if(walletTransactions.length>0){
            const recentTransaction = walletTransactions.reduce((prev,current)=>prev.input.timestamp>current.input.timestamp?prev:current);
            // get the balance from latest transaction
            balance = recentTransaction.outputs.find(output=>output.address===this.publickey).amount;
            // get the starttime from latest transaction
            startTime = recentTransaction.input.timestamp;
        }
        // foreach transaction if input.timestamp>starttime for each outputs add amount for the pubkey
        transactions.forEach(transaction => {
            if(transaction.input.timestamp>startTime){
                transaction.outputs.find(output=>{
                    if(output.balance === this.publickey){
                        balance = balance + output.amount;
                    }
                });
            }
        });
        return balance;
    }
        
}

module.exports = Wallet;