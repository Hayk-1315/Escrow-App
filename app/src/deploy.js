  import { ethers } from 'ethers';
  import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

  export default async function deploy(signer, arbiter, beneficiary, value, durationSeconds) {
    const factory = new ethers.ContractFactory(
      Escrow.abi,
      Escrow.bytecode,
      signer
    );
    return factory.deploy(arbiter, beneficiary, durationSeconds, { value });
  }
