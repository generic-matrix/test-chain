const express = require("express");
const BlockChain = require("../blockchain");
const bodyParser = require("body-parser");
const HTTP_PORT= process.env.HTTP_PORT||3001;
const P2pServer = require("./p2p-server");
const Wallet = require("../wallet/index");
const TransactionPool = require("../wallet/transaction-pool");

const app = express();
app.use(bodyParser.json());
var blockchain = new BlockChain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2pserver = new P2pServer(blockchain,transactionPool);

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
    const transaction = wallet.CreateTransaction(recipient,amount,transactionPool);
    p2pserver.broadcastTransaction(transaction);
    res.redirect("/transactions");
});

app.get('/public-key',(req,res)=>{
    res.json({publicKey : wallet.publickey});
});

app.listen(HTTP_PORT,()=>{
    console.log(`Listening to the port ${HTTP_PORT}`);
});
p2pserver.listen();