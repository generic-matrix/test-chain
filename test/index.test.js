const Wallet = require("../wallet/index");
const TransactionPool = require("../wallet/transaction-pool");
const BlockChain = require("../blockchain/index");

describe('Wallet',()=>{
    let wallet,tp,bc;

    beforeEach(()=>{
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new BlockChain();
    });

    describe('Creating a transaction',()=>{
        let transaction,sendAmount,recipient;
        beforeEach(()=>{
            sendAmount = 50;
            recipient = 'r4tioueiot-345';
            transaction = wallet.CreateTransaction(recipient,sendAmount,bc,tp);
            transaction = wallet.CreateTransaction(recipient,sendAmount,bc,tp);
        });
        it('Doubles the `sendAmount` substracted from the wallet balance',()=>{
            expect(transaction.outputs.find(output=> output.address===wallet.publickey).amount).toEqual(wallet.balance-sendAmount*2);
        });

        it('clones the `SendAmount` output for the recipient',()=>{
            expect(transaction.outputs.filter(output=>output.address===recipient).map(output=>output.amount)).toEqual([sendAmount,sendAmount]);
        });
    });
});