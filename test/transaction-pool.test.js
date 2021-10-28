const Wallet = require("../wallet/index");
const Transaction = require("../wallet/transaction");
const TransactionPool = require("../wallet/transaction-pool");


describe('TransactionPool',()=>{
    let tp,wallet,transaction;
    beforeEach(()=>{
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet,'rterotfgj-43534',30);
        tp.updateOrAddTransactions(transaction);
    });

    it('Adds a transaction to the pool',()=>{
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('Updates a transaction in the pool',()=>{
        const OldTxn = JSON.stringify(transaction);
        const NewTxn = transaction.update(wallet,'foo-test-x',40);
        tp.updateOrAddTransactions(NewTxn);
        expect(JSON.stringify(tp.transactions.find(t=> t.id === NewTxn.id))).not.toEqual(OldTxn);
    });
});