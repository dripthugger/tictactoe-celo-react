// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // const Counter = await hre.ethers.getContractFactory("Counter");
  // const deployed = await Counter.deploy();

  // Transactions.sol deployment
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const Transactions_deployed = await Transactions.deploy();

  await Transactions_deployed.deployed();

  console.log("Transactions contract deployed to:", Transactions_deployed.address);

  // TICTACTOENFT.sol deployment
  const TICTACTOENFT = await hre.ethers.getContractFactory("TICTACTOENFT");
  const TICTACTOENFT_deployed = await TICTACTOENFT.deploy();

  await TICTACTOENFT_deployed.deployed();

  console.log("TICTACTOENFT contract deployed to:", TICTACTOENFT_deployed.address);

  // Storing contracts data
  storeContractData(Transactions_deployed, TICTACTOENFT_deployed)
}

function storeContractData(contract, second_contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/TransactionsAddress.json",
    JSON.stringify({ Transactions: contract.address }, undefined, 2)
  );

  const TransactionsArtifact = artifacts.readArtifactSync("Transactions");

  fs.writeFileSync(
    contractsDir + "/Transactions.json",
    JSON.stringify(TransactionsArtifact, null, 2)
  );

  // TICTACTOENFT contract

  fs.writeFileSync(
    contractsDir + "/TICTACTOENFTAddress.json",
    JSON.stringify({ TICTACTOENFT: second_contract.address }, undefined, 2)
  );

  const TICTACTOEArtifact = artifacts.readArtifactSync("TICTACTOENFT");

  fs.writeFileSync(
    contractsDir + "/TICTACTOENFT.json",
    JSON.stringify(TICTACTOEArtifact, null, 2)
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

