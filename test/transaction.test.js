const { MINING_REWARD } = require("../blockchain/config");
const Wallet = require("../wallet/index");
const Transaction = require("../wallet/transaction");

let transaction,wallet,recepient,amount;

describe('Testing Transaction',()=>{

    beforeEach(()=>{
        wallet = new Wallet();
        amount = 50;
        recepient = "r3cpientaddr";
        transaction = Transaction.newTransaction(wallet,recepient,amount);  
    });

    it('Check the balance in the amount',()=>{
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('Output the `amount` added to the recipient',()=>{
        expect(transaction.outputs.find(output=>output.address===recepient).amount).toEqual(amount);
    });

    it('Output the `amount` added to the recipient',()=>{
        expect(transaction.outputs.find(output=>output.address===recepient).amount).toEqual(amount);
    });

    it('It must Validates a valid transaction',()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('It invalidates the invalid transaction',()=>{
        transaction.outputs[0].amount=500000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

});


describe('Transacting the amount > than the original balance',()=>{
    beforeEach(()=>{
        amount=50000;
        transaction = Transaction.newTransaction(wallet,recepient,amount);
    });
    it('It does not create the transaction',()=>{
        expect(transaction).toEqual(undefined);
    });
});

describe('Update the transaction and check if the new transaction is verified or not',()=>{
    beforeEach(()=>{
        wallet = new Wallet();
        amount = 50;
        recepient = "r3cpientaddr";
        transaction = Transaction.newTransaction(wallet,recepient,amount);
        transaction = transaction.update(wallet,recepient,10);
    });
    it('Check if the new signature is defined or not',()=>{
        expect(Transaction.verifyTransaction(transaction)).toEqual(true);
    });

    it('Updating the transaction to amount>balance and the new transaction object must be undefined',()=>{
        transaction = transaction.update(wallet,recepient,10000);
        expect(transaction).toEqual(undefined);
    });

});

describe('Create a reward transaction',()=>{
    beforeEach(()=>{
        transaction = Transaction.RewardTransaction(wallet,Wallet.blockchainWallet());
    });
    it(`It rewards the miner's wallet`,()=>{
        expect(transaction.outputs.find(output=>output.address===wallet.publickey).amount).toEqual(MINING_REWARD);
    });
});
