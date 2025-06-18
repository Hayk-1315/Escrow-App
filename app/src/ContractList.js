const ContractList = ({ contracts }) => {
  const formatAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
  <div className="space-y-4 w-full max-w-2xl mx-auto">
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
        <p><strong className="text-lava">Duration:</strong> {contract.duration} day</p>

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
      </div>
    ))}
  </div>
);
}
export default ContractList;