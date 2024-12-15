import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';


export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {

  // Convert the value from Wei to Ether
  const valueInEther = ethers.utils.formatUnits(value, "ether");
  // Format the value for better readability
  const formattedValue = new BigNumber(valueInEther).toFormat();


  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {formattedValue} ETH </div>
        </li>
        <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}
