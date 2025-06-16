const hre = require("hardhat");

async function main() {
    const ARBITOR_ADDR = "";
    const BENEFICIARY_ADDR = "";

    const Escrow = await hre.ethers.getContractFactory('Escrow');
    const escrow = await Escrow.deploy(ARBITOR_ADDR, BENEFICIARY_ADDR); 

    await escrow.deployed();
    console.log("deployed at: ", escrow.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

