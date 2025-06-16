import { ethers } from "ethers";
import EscrowABI from "./artifacts/contracts/Escrow.sol/Escrow.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function readEscrowState(address) {
  try {
    const contract = new ethers.Contract(address, EscrowABI.abi, provider);
    const [
      depositor,
      arbiter,
      beneficiary,
      balance,
      isApproved,
      isCancelled,
      createdAt,
      expiresAt,
    ] = await contract.getInfo();

    return {
      depositor,
      arbiter,
      beneficiary,
      balance: ethers.utils.formatEther(balance),
      isApproved,
      isCancelled,
      createdAt: Number(createdAt),
      expiresAt: Number(expiresAt),
    };
  } catch (err) {
    console.error(`Error reading on-chain data for ${address}:`, err);
    return null;
  }
}