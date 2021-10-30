/*
Functional requirmenets:
---> listen() Create a new websocket server and connect to peers and add message handler and send this blockchain 
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
*/

const Websocket = require("ws");
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : []
const BlockChain = require("../blockchain");
const MESSAGE_TYPES = {
    chain : 'CHAIN',
    transaction : 'TRANSACTION',
    clear_transactions : 'CLEAR_TRANSACTIONS'
};

class P2pServer{
    constructor(blockchain,transactionPool){
        this.blockchain=blockchain;
        this.transactionPool=transactionPool;
        this.sockets=[];
    }

    /*
        Create a new websocket server
        Listen for new connections
        Connect to peers if any 
        handle message from each sockets
        send current blockchain to the server to all the sockets
    */
    listen(){
        //Create a new websocket server
        const server = new Websocket.Server({port:P2P_PORT});
        //Listen for new connections
        server.on('connection',socket => this.connectSocket(socket));
        //Connect to peers if any 
        this.connectToPeers();
        console.log(`Listening for peer-peer connections on port ${P2P_PORT}`);
    }

    connectToPeers(){
        peers.forEach(peer=>{
            const socket = new Websocket(peer);
            socket.on('open',()=> this.connectSocket(socket));
        })
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log(`New Socket Connected`);
        //handle message from this socket
        this.messageHandler(socket);
        //send current blockchain to the server via this socket
        this.SendChain(socket);
    }

    messageHandler(socket){
        socket.on('message',message=>{
            const data=JSON.parse(message);
            switch(data.type){
                case MESSAGE_TYPES.chain:
                    let blockchain = new BlockChain();
                    blockchain.chain=data.chain;
                    this.blockchain.replaceChain(blockchain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransactions(data.transaction);
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
        });
    }

    // To be called by mineblock to sync the chain
    SyncChain(){
        this.sockets.forEach(socket=>{
            this.SendChain(socket);
        });
    }

    SendChain(socket){
        socket.send(JSON.stringify({type:MESSAGE_TYPES.chain,chain:this.blockchain.chain}));
    }

    sendTransaction(socket,t){
        socket.send(JSON.stringify({type:MESSAGE_TYPES.transaction,transaction:t}));
    }

    broadcastTransaction(transaction){
        this.sockets.forEach(socket => this.sendTransaction(socket,transaction));
    }

    broadcastClearTransaction(){
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type:MESSAGE_TYPES.clear_transactions
        })));
    }
}


module.exports=P2pServer;