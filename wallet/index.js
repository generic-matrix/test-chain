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

    CreateTransaction(recipient,amount,transactionPool){
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
        
}

module.exports = Wallet;