import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import { markAsApproved, cancelContract } from './api';

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  handleCancel
}) {
  const [approved, setApproved] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState(null);

  const valueInEther = ethers.utils.formatUnits(value, "ether");
  const formattedValue = new BigNumber(valueInEther).toFormat();

  const onApproveClick = async () => {
  const { success, error } = await handleApprove();

  if (success) {
    setError(null);
    setApproved(true);
    await markAsApproved(address);
  } else {
    const message = error?.error?.message || error?.message || "";

    if (message.includes("Only arbiter can call this")) {
      setError("Approval failed. Only the arbiter can approve this contract.");
    } else if (message.includes("Escrow has expired")) {
      setError("This escrow contract has expired and can no longer be approved.");
    } else {
      setError("Transaction failed. Please try again.");
    }

    setApproved(false);
  }
};

 const onCancelClick = async () => {
    setError("");
    try {
      const success = await handleCancel();
      if (success) setCancelled(true);
      setError(null);
      await cancelContract(address);
    } catch (err) {
      const message = err?.error?.message || err?.message || "";
      setError(message);
    }
  };

   return (
  <div className="bg-gray-900/90 border border-electric shadow-lg rounded-xl p-9 transition duration-300  text-white font-poppins">
    <p><strong className="text-lava">Escrow Address:</strong> {address}</p>
    <p><strong className="text-lava">Arbiter:</strong> {arbiter}</p>
    <p><strong className="text-lava">Beneficiary:</strong> {beneficiary}</p>
    <p><strong className="text-lava">Value:</strong> {formattedValue} ETH</p>

    <div className="pt-3 space-y-2">
      {!approved && !cancelled && (
        <div className="flex gap-3">
          <button
            onClick={onApproveClick}
            className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white text-sm font-medium transition"
          >
            Approve
          </button>
          <button
            onClick={onCancelClick}
            className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white text-sm font-medium transition"
          >
            Cancel
          </button>
        </div>
      )}

      {approved && (
        <p className="text-green-400 font-semibold text-sm">✓ It's been approved!</p>
      )}
      {cancelled && (
        <p className="text-red-400 font-semibold text-sm">✕ Contract cancelled.</p>
      )}
      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  </div>
);
}

