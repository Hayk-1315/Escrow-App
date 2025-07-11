import { useEffect, useState } from 'react';
import { getApprovedContracts } from './api';
import ContractList from './ContractList';
import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

const ApprovedContractsPage = ({ walletAddr  }) => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    async function fetchContracts() {
      const backendData = await getApprovedContracts(walletAddr);

      const enriched = await Promise.all(
        backendData.map(async (c) => {
          try {
            const instance = new ethers.Contract(c.address, Escrow.abi, provider);
            let originalDeposit = null;
          try {
             originalDeposit = await instance.originalDeposit(); // Solo funcionará en contratos nuevos
              } catch (err) {
              console.warn(`originalDeposit not available for ${c.address}`);
              }
            const [
              depositor,
              arbiter,
              beneficiary,
              balance,
              isApproved,
              isCancelled,
              createdAt,
              expiresAt
            ] = await instance.getInfo();

            return {
              ...c,
              onchain: {
                balance: ethers.utils.formatEther(balance),
                originalDeposit: originalDeposit ? ethers.utils.formatEther(originalDeposit) : null,
                isApproved,
                isCancelled,
                createdAt,
                expiresAt
              },
    
            };
          } catch (err) {
            console.warn(`Could not read on-chain data for ${c.address}`);
            return { ...c, onchain: null };
          }
        })
      );

      setContracts(enriched);
    }

    fetchContracts();
  }, []);

 return (
  <div className="pt-24 px-4 sm:px-6 text-white font-poppins min-h-screen flex flex-col items-center">
    <h2 className="text-2xl font-bold mb-6 text-electric text-center">Approved Contracts</h2>
    <div className="w-full max-w-2xl">
      <ContractList contracts={contracts} />
    </div>
  </div>
);
};

export default ApprovedContractsPage;