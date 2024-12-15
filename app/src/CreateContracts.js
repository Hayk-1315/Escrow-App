import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';


const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
    const approveTxn = await escrowContract.connect(signer).approve();
    await approveTxn.wait();
}

const CreateContracts = ({ walletAddr }) => {
    const [escrows, setEscrows] = useState([]);
    const [signer, setSigner] = useState();
    const [beneficiary, setBeneficiary] = useState('');
    const [arbiter, setArbiter] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {
        setSigner(provider.getSigner());
    }, [walletAddr]);


    async function newContract() {

        const convertEtherToWei = () => {
            return ethers.utils.parseEther(value);
        }

        const escrowContract = await deploy(signer, arbiter, beneficiary, convertEtherToWei);

        const escrow = {
            address: escrowContract.address,
            arbiter,
            beneficiary,
            value: convertEtherToWei().toString(),
            handleApprove: async () => {
                escrowContract.on('Approved', () => {
                    document.getElementById(escrowContract.address).className =
                        'complete';
                    document.getElementById(escrowContract.address).innerText =
                        "✓ It's been approved!";
                });

                await approve(escrowContract, signer);
            },
        };

        setEscrows([...escrows, escrow]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        newContract();

        const depositor = await signer.getAddress();
        const contracts = { depositor, arbiter, beneficiary, value };

        fetch("http://localhost:8000/contracts", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contracts)
        }).then(() => {
            console.log("new contract added");
        })
    }

    return (
        <>
            <div className="new-contract">
                <h1> New Escrow </h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Arbiter Address
                        <input
                            type="text"
                            required
                            value={arbiter}
                            onChange={(e) => setArbiter(e.target.value)}
                        />
                    </label>

                    <label>
                    Beneficiary Address
                        <input
                            type="text"
                            required
                            value={beneficiary}
                            onChange={(e) => setBeneficiary(e.target.value)}
                        />
                    </label>

                    <label>
                        Deposit Amount (in Ether)
                        <input
                            type="text"
                            required
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </label>

                    <button
                        type="submit"
                        className="button"
                        id="deploy"
                    >
                        Create Escrow
                    </button>
                </form>
            </div>

            <div className="existing-contracts">
                <h1> Contracts to be approved </h1>

                <div id="container">
                    {escrows.map((escrow) => {
                        return <Escrow key={escrow.address} {...escrow} />;
                    })}
                </div>
            </div>
        </>
    );
}

export default CreateContracts;