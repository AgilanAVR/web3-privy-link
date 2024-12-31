const hre = require("hardhat");
const {ethers} =require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
 const [deployer] = await ethers.getSigners();

  ///contract deployment
  const Dappcord = await ethers.getContractFactory("Dappcord");
  let dappcord = await Dappcord.deploy("Dappcord", "DC");
  await dappcord.deployed();

  console.log(`Dappcord smart contract address : ${dappcord.address}`);

//creating three channels
const channel_names=["HOMIES" , "JOBS" , "TRIPS"];
const cost=[tokens(4), tokens(2) , tokens(3)];

for(let i=0;i<3;i++){
  let transaction =await dappcord.connect(deployer).createChannel( channel_names[i],cost[i]);
  await transaction.wait();
}
console.log("Channel created");

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
