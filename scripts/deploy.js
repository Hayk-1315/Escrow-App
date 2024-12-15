const hre = require("hardhat");

async function main() {
    const ARBITOR_ADDR = "0xdC4B924b566c380E5e090150b176e42D58ec172a";
    const BENEFICIARY_ADDR = "0x8d91E9dC8d53A175381C856BFb9F08a5EB244f36";

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

