const express = require("express");
const BlockChain = require("../blockchain");
const bodyParser = require("body-parser");
const HTTP_PORT= process.env.HTTP_PORT||3001;
const P2pServer = require("./p2p-server");
const Wallet = require("../wallet/index");
const TransactionPool = require("../wallet/transaction-pool");
const Miner = require("./miner");

const app = express();
app.use(bodyParser.json());
var blockchain = new BlockChain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2pserver = new P2pServer(blockchain,transactionPool);
const miner = new Miner(blockchain,transactionPool,wallet,p2pserver);

app.get('/blocks',(req,res)=>{
    res.json(blockchain.chain);
});
app.post('/mine',(req,res)=>{
    if(req.body.data===undefined){
        res.json({
            "error": "data paramas missing"
        });
    }else{
        const block=blockchain.addBlock(req.body.data);
        console.log(`New block added: ${block.toString()}`);
        p2pserver.SyncChain();
        res.redirect("/blocks");
    }
});

app.get('/transactions',(req,res)=>{
    res.json(transactionPool.transactions);
});

app.post('/transact',(req,res)=>{
    const {recipient,amount} = req.body;
    const transaction = wallet.CreateTransaction(recipient,amount,blockchain,transactionPool);
    p2pserver.broadcastTransaction(transaction);
    res.redirect("/transactions");
});

app.get('/public-key',(req,res)=>{
    res.json({publicKey : wallet.publickey});
});

app.get('/wallet-balance',(req,res)=>{
    const wallet_balance = wallet.calculateBalance(blockchain);
    res.json({balance : wallet_balance});
});

app.get('/mine-transactions',(req,res)=>{
    const block = miner.mine();
    console.log(`New block added : ${block.toString()}`);
    res.redirect("/blocks");
});

app.listen(HTTP_PORT,()=>{
    console.log(`Listening to the port ${HTTP_PORT}`);
});
p2pserver.listen();