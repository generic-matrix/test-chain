const SHA256 = require('crypto-js/sha256');
const config = require('./config');

class Block{
    constructor(timestamp,lasthash,hash,data,nounce,difficulty){
        this.timestamp=timestamp;
        this.lasthash=lasthash;
        this.hash=hash;
        this.data=data;
        this.nounce=nounce;
        this.difficulty=difficulty;
    }

    toString(){
        return `
            Timestamp : ${this.timestamp}
            Last Hash : ${this.lasthash.substring(0,10)}
            Hash      : ${this.hash.substring(0,10)}
            Nounce    : ${this.nounce}
            Difficulty: ${this.difficulty}
            Data      : ${this.data}
        `
    }

    static genesis(){
        return new this("genesis time","---","f213-gh564",[],0,config.DIFFICULTY);
    }

    static mineBlock(lastBlock,data){
        const timestamp=Date.now();
        const lastHash=lastBlock.hash;
        // -------------- POC Algo ------------------------------
        let hash;
        let nounce=0;
        let difficulty=(lastBlock.difficulty+config.MINE_RATE<Date.now())?(lastBlock.difficulty+1):(lastBlock.difficulty-1);
        if(difficulty<0) difficulty=0;
        do {
            hash=this.hash(Date.now(),lastHash,data,nounce);
            nounce++;
        }while(hash.substring(0,difficulty)!=="0".repeat(difficulty));
        //--------------------------------------------------------
        return new this(timestamp,lastHash,hash,data,nounce,difficulty);
    }

    static hash(timestamp,lastHash,data,nounce){
        return SHA256(`${timestamp}${lastHash}${data}${nounce}`).toString();
    }

    static generatedHash(block){
        return this.hash(block.timestamp,block.lastHash,block.data,block.nounce);
    }
}

module.exports=Block;