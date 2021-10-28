const BlockChain = require("../blockchain/index");
const Block = require("../blockchain/block");
describe('BlockChain',()=>{
    let bc,bc2;

    beforeEach(()=>{
        bc=new BlockChain();
        bc2=new BlockChain();
    });

    it('Does it adds the genesis block ?',()=>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    })

    it('Add a block to blockchain',()=>{
        let data="block1";
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    })

    it('Is it a valid chain without tampering the data ?',()=>{
        let data="block1-bc2";
        bc2.addBlock(data);
        expect(bc.isValidChain(bc2)).toBe(true);
    })

    it('Is it a valid chain with tampering the data?',()=>{
        bc2.chain[bc2.chain.length-1].data="tampered-data";
        expect(bc.isValidChain(bc2)).toBe(false);
    })

    it('Is it a valid chain with tampering the genesis block?',()=>{
        bc2.chain[0].data="tampered-data";
        bc2.chain[0].timestamp=Date.now();
        expect(bc.isValidChain(bc2)).toBe(false);
    })

    it('Trying to Replace a blockchainwith the greater length',()=>{
        let blockchain1=new BlockChain();
        let blockchain2=new BlockChain();
        blockchain2.addBlock("new-block1");
        expect(blockchain1.replaceChain(blockchain2)).toBe(true);
    })

    it('Trying to Replace a blockchain with the same length',()=>{
        let blockchain1=new BlockChain();
        let blockchain2=new BlockChain();
        expect(blockchain1.replaceChain(blockchain2)).toBe(false);
    })

    it('Trying to Replace a blockchainwith the tampered  data',()=>{
        let blockchain1=new BlockChain();
        let blockchain2=new BlockChain();
        blockchain2.addBlock("new-block1");
        blockchain2.chain[0].data="Tampered data";
        expect(blockchain1.replaceChain(blockchain2)).toBe(false);
    })
});