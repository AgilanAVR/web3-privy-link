const { expect } = require("chai");
const {ethers} =require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {

  describe('Deployment',async()=>{
    let dappcord;
    let deployer , user;

    beforeEach(async()=>{
      ///setup accounts
      [deployer, user]=await ethers.getSigners();

      ///contract deployment
      const Dappcord=await ethers.getContractFactory("Dappcord");
       dappcord=await Dappcord.deploy("Dappcord" , "DC");

       //creating channel
       let transaction =await dappcord.connect(deployer).createChannel("channel-1",tokens(10));
       await transaction.wait();
      
    })

    it("Returns Owner",async()=>{
      let result=await dappcord.owner();
      expect(result).to.equal(deployer.address);
    })



    it("returning channel id",async()=>{
      let result= await dappcord.channels(1);
      expect(result.id).to.equal(1);
    })

      it("returning channel name",async()=>{
        let result= await dappcord.channels(1);
        expect(result.name).to.equal("channel-1");
    })


    it("returning channel cost",async()=>{
      let result= await dappcord.channels(1);
      expect(result.cost).to.equal(tokens(10));
  })




  
  describe("minting",async()=>{
    beforeEach(async()=>{
      let transaction=await dappcord.connect(user).mint(1,{value:tokens(10)});
      await transaction.wait();

      transaction=await dappcord.connect(deployer).withDraw();
      await transaction.wait();

    })
    it("checking channel joined",async()=>{
      let result =await dappcord.hasJoined(1,user.address);
      expect(result).to.equal(true);
    })

    it("total user updated",async()=>{
      let result =await dappcord.totalSupply();
      expect(result).to.equal(1);
    })

    
    it("amount updated",async()=>{
      let result =await ethers.provider.getBalance(deployer.address);
      expect(result).to.be.greaterThanOrEqual(tokens(10));
    })

  })
})


})
