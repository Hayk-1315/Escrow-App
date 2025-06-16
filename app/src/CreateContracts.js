import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import { addNewContract } from './api';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  return await approveTxn.wait();
}

const CreateContracts = ({ walletAddr }) => {
  const [escrows, setEscrows] = useState([]);
  const [signer, setSigner] = useState();
  const [beneficiary, setBeneficiary] = useState('');
  const [arbiter, setArbiter] = useState('');
  const [value, setValue] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (walletAddr) {
      setSigner(provider.getSigner());
    }
  }, [walletAddr]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const depositWei = ethers.utils.parseEther(value);
      const durationSeconds = parseInt(duration) * 86400; // Convert days to seconds

      const escrowContract = await deploy(
        signer,
        arbiter,
        beneficiary,
        depositWei,
        durationSeconds
      );
      console.log("Contract deployed at:", escrowContract.address);

      await addNewContract({
        depositor: walletAddr,
        arbiter,
        beneficiary,
        value,
        duration,
        address: escrowContract.address,
        });

      const escrow = {
        address: escrowContract.address,
        arbiter,
        beneficiary,
        value: depositWei.toString(),
        handleApprove: async () => {
         try {
           await approve(escrowContract, signer);
           return { success: true };
      } catch (err) {
            return { success: false, error: err };
          }
          },
          handleCancel: async () => {
          try {
          const cancelTxn = await escrowContract.connect(signer).cancel();
          await cancelTxn.wait();
          return true;
        } catch (err) {
          console.error("Cancellation failed:", err);
          throw err;
          }
         }
        };

      setEscrows([...escrows, escrow]);

    } catch (err) {
      console.error("Failed to deploy contract:", err);
    }
  };

  return (
    <div className="flex flex-col items-center mt-24 px-4 py-6 text-white space-y-12 min-h-screen">
    <div className="bg-gray-800/90 p-8 rounded-2xl shadow-lg w-full max-w-xl border border-blue-700/40 backdrop-blur">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-400">Create New Escrow</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Arbiter Address"
          required
          value={arbiter}
          onChange={(e) => setArbiter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 bg-gray-800 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Beneficiary Address"
          required
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 bg-gray-800 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Deposit Amount (ETH)"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 bg-gray-800 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Contract Duration (days)"
          required
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 bg-gray-800 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-orange-400 hover:bg-orange-500 text-black font-semibold px-4 py-2 rounded-md shadow-md transition-colors"
        >
          Create Escrow
        </button>
      </form>
    </div>

    {escrows.length > 0 && (
      <div className= "space-y-4">
        <h2 className="text-xl font-semibold mb-4 text-center text-electric">Contracts to be Approved</h2>
        {escrows.map((escrow) => (
          <Escrow key={escrow.address} {...escrow} />
        ))}
      </div>
    )}
  </div>
);
};

export default CreateContracts;