const { exportAllDeclaration } = require("@babel/types");
const Block = require("./block.js");

describe('Block',()=>{
    let data,lastBlock,block;

    beforeEach(()=>{
        data='block1';
        lastBlock=Block.genesis();
        block=Block.mineBlock(lastBlock,data);
    });

    it('Sets the data to match to input',()=>{
        expect(block.data).toEqual(data);
    })

    it('Check the lastHash to map the Hash of the last block',()=>{
        expect(block.lasthash).toEqual(lastBlock.hash);
    })


});