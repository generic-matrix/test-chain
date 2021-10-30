const ChainUtil = require("../chain-util");
const {MINING_REWARD} = require("../blockchain/config");
class Transaction{
    constructor(){
        this.id=ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet,recepient,amount){
        const senderOutput = this.outputs.find(output=>output.address===senderWallet.publickey);
        if(senderOutput.amount-amount<0){
            console.log(`The amount : ${amount} exceeds the balance`);
            return;
        }
        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({ amount,address:recepient});
        Transaction.signTransaction(senderWallet,this);
        return this;
    }

    static TransactionWithOutputs(senderWallet,outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(senderWallet,transaction);
        return transaction;
    }

    static newTransaction(senderWallet,recepient,amount){
        
        //TO-DO if amount<1 , return null
        //If amount excceds return null
        if(amount>senderWallet.balance){
            console.log(`Amount: ${amount} Exceeds balance`);
            return;
        }

        return Transaction.TransactionWithOutputs(senderWallet,[
            { amount: senderWallet.balance-amount, address: senderWallet.publickey},
            { amount,address:recepient}
        ]);
    }

    static RewardTransaction(minerWallet,blockchainWallet){
        return Transaction.TransactionWithOutputs(blockchainWallet,[
            { amount: MINING_REWARD, address: minerWallet.publickey}
        ]);
    }

    static signTransaction(senderWallet,transaction){
        transaction.input = {
            timestamp : Date.now(),
            amount : senderWallet.balance,
            address : senderWallet.publickey,
            signature : senderWallet.sign(ChainUtil.hash(transaction.outputs))
        };
    }

    static verifyTransaction(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address,transaction.input.signature,ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports=Transaction;