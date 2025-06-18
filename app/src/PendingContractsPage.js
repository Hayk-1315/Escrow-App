import { useEffect, useState } from 'react';
import { getPendingContracts, markAsApproved, cancelContract } from './api';
import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

const PendingContractsPage = ({ walletAddr  }) => {
  const [contracts, setContracts] = useState([]);
 const [feedbackMessage, setFeedbackMessage] = useState(null);
 const [feedbackType, setFeedbackType] = useState("success"); // "success" o "error"
 const provider = new ethers.providers.Web3Provider(window.ethereum);

useEffect(() => {
    async function fetchData() {
      const baseContracts = await getPendingContracts(walletAddr);

      // Leer información desde la blockchain
      const enrichedContracts = await Promise.all(
        baseContracts.map(async (c) => {
          try {
            const instance = new ethers.Contract(c.address, Escrow.abi, provider);
            const [depositor, arbiter, beneficiary, balance, isApproved, isCancelled, createdAt, expiresAt] =
              await instance.getInfo();

            return {
              ...c,
              onchain: {
                balance: ethers.utils.formatEther(balance),
                isApproved,
                isCancelled,
                createdAt,
                expiresAt
              }
            };
          } catch (err) {
            console.error("Blockchain read error:", err);
            return { ...c, onchain: null };
          }
        })
      );

      setContracts(enrichedContracts);
    }

    fetchData();
  }, [walletAddr]);

  const handleApprove = async (contract) => {
  try {
    const signer = provider.getSigner();
    const instance = new ethers.Contract(contract.address, Escrow.abi, signer);
    const tx = await instance.approve();
    await tx.wait();

    await markAsApproved(contract.address);
    setContracts(contracts.filter(c => c.address !== contract.address));

    setFeedbackMessage("✅ Contract approved by arbiter. Deposit transferred to beneficiary.");
    setFeedbackType("success");
    setTimeout(() => setFeedbackMessage(null), 20000);
  } catch (err) {
    const message = err?.error?.message || err?.message || "";

    if (message.includes("Only the arbiter can approve this contract")) {
      alert("❌ Transaction failed: Only the arbiter can approve this contract.");
    } else if (message.includes("Escrow has expired")) {
      alert("⏰ Transaction failed: The contract duration has expired.");
    } else {
      console.error("Approval error:", err);
      alert("❌ Transaction failed: An unexpected error occurred during approval.");
    }
  }
};

  const handleCancel = async (contract) => {
  try {
    const signer = provider.getSigner();
    const instance = new ethers.Contract(contract.address, Escrow.abi, signer);
    const tx = await instance.cancel();
    await tx.wait();

    await cancelContract(contract.address);
    setContracts(contracts.filter(c => c.address !== contract.address));

    setFeedbackMessage("✖️ Contract cancelled by arbiter. Deposit refunded to depositor.");
    setFeedbackType("error");
    setTimeout(() => setFeedbackMessage(null), 20000);
  } catch (err) {
    const message = err?.error?.message || err?.message || "";

    if (message.includes("Only the arbiter can cancel this contract")) {
      alert("❌ Transaction failed: Only the arbiter can cancel this contract.");
    } else if (message.includes("Contract already completed or expired")) {
      alert("⏰ Transaction failed: This contract can no longer be cancelled.");
    } else {
      console.error("Cancellation error:", err);
      alert("❌ Transaction failed: An unexpected error occurred during cancellation.");
    }
  }
};

useEffect(() => {
  if (!contracts.length) return;

  const listeners = contracts.map((contract) => {
    const instance = new ethers.Contract(contract.address, Escrow.abi, provider);

    const approvedListener = (amount, timestamp) => {
      setContracts((prev) => prev.filter((c) => c.address !== contract.address));
      setFeedbackMessage(`📢 Contract ${contract.address} approved. ${ethers.utils.formatEther(amount)} ETH released at ${new Date(timestamp * 1000).toLocaleString()}`);
      setFeedbackType("success");
      setTimeout(() => setFeedbackMessage(null), 20000);
    };

    const cancelledListener = (amount, timestamp) => {
      setContracts((prev) => prev.filter((c) => c.address !== contract.address));
      console.log("Cancelled Event Params:", amount, timestamp);
      setFeedbackMessage(`📢 Contract ${contract.address} cancelled. Deposit refunded. ${ethers.utils.formatEther(amount)} ETH released at ${new Date(timestamp * 1000).toLocaleString()}`);
      setFeedbackType("error");
      setTimeout(() => setFeedbackMessage(null), 20000);
    };

    instance.on("Approved", approvedListener);
    instance.on("Cancelled", cancelledListener);

    // Cleanup function: se ejecuta al desmontar o cambiar contracts[]
    return () => {
      instance.off("Approved", approvedListener);
      instance.off("Cancelled", cancelledListener);
    };
  });

  // Cleanup global: elimina todos los listeners cuando cambian los contratos
  return () => {
    listeners.forEach((off) => off());
  };
}, [contracts]);

 return (
  <div className="pt-24 px-4 sm:px-6 text-white font-poppins min-h-screen flex flex-col items-center">
    <h2 className="text-2xl font-bold mb-6 text-electric text-center">Contracts to be Approved</h2>

    {feedbackMessage && (
      <div
        className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-opacity duration-500 ${
          feedbackType === "success"
            ? "bg-green-600 text-white border border-green-400"
            : "bg-red-600 text-white border border-red-400"
        }`}
      >
        {feedbackMessage}
      </div>
    )}

    <div className="space-y-4 w-full max-w-2xl">
      {contracts.map((contract) => (
        <div
          key={contract.address}
          className="bg-gray-900/90 border border-electric shadow-lg rounded-xl p-5 sm:p-9 transition duration-300 text-sm sm:text-base break-words"
        >
          <p><strong className="text-lava">Address:</strong> {contract.address}</p>
          <p><strong className="text-lava">Depositor:</strong> {contract.depositor}</p>
          <p><strong className="text-lava">Arbiter:</strong> {contract.arbiter}</p>
          <p><strong className="text-lava">Beneficiary:</strong> {contract.beneficiary}</p>
          <p><strong className="text-lava">Value (on-chain):</strong> {contract.onchain?.balance || contract.value} ETH</p>
          <p><strong className="text-lava">Duration:</strong> {contract.duration} day </p>

          {contract.onchain && (
            <>
              <p><strong className="text-lava">Created At:</strong> {new Date(contract.onchain.createdAt * 1000).toLocaleString()}</p>
              <p><strong className="text-lava">Expires At:</strong> {new Date(contract.onchain.expiresAt * 1000).toLocaleString()}</p>
              <p>
                <strong className="text-lava">Status:</strong>{" "}
                {contract.onchain.isApproved
                  ? <span className="text-green-400">Approved</span>
                  : contract.onchain.isCancelled
                  ? <span className="text-red-400">Cancelled</span>
                  : <span className="text-yellow-400">Pending</span>}
              </p>
            </>
          )}

          {walletAddr.toLowerCase() === contract.arbiter.toLowerCase() && (
            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                onClick={() => handleApprove(contract)}
                className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white text-sm font-medium transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleCancel(contract)}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white text-sm font-medium transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
}
export default PendingContractsPage;