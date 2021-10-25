const Block = require("./block");

class BlockChain{
    constructor(){
        this.chain=[Block.genesis()];
    }

    addBlock(data){
        let new_block=Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(new_block);
        return new_block;
    }

    //O(n)
    isValidChain(blockchain){
        if(JSON.stringify(blockchain.chain[0])!==JSON.stringify(Block.genesis())) return false;
        
        for(let i=1;i<blockchain.length;i++){
            const block=blockchain.chain[i];
            const prior_block=blockchain.chain[i-1];
            if(block.lastHash!==prior_block.hash || block.hash!==Block.generatedHash(block)) return false;
        }
        return true;
    }

    replaceChain(newChain){
        if(newChain.chain.length<=this.chain.length){
            console.log("The new chain is lesser or equal to the old chain");
            return false;
        }
        else if(!this.isValidChain(newChain)){
            console.log("The new chain is invalid ");
            return false;
        }
        console.log("Replacing blockchain with the new chain");
        this.chain=newChain;
        return true;
    }
}

module.exports=BlockChain;