class TransactionPool{
    constructor(){
        //HashMap would suite better
        this.transactions = [];
    }

    //Worst case O(n) 
    updateOrAddTransactions(transaction){
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);
        if(transactionWithId){
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        }else{
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address){
        return this.transactions.find(t => t.input.address === address);
    }
}

module.exports = TransactionPool;