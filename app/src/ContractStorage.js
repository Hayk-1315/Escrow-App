import { useState } from "react";
import { useEffect } from "react";
import ContractList from "./ContractList";

const ContractStorage = () => {
    const [contracts, setContracts] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/contracts')
            .then(res => {
                if (!res.ok) {
                    throw Error('could not fetch the data for that resource');
                }
                return res.json();
            })
            .then(contracts => {
                setContracts(contracts);
                setIsPending(false);
                setError(null);
            })
            .catch((err) => {
                setIsPending(false);
                setError(err.message);
            })
    }, [])

    return (
        <div className="contract-storage">
            <h1>All escrow contracts</h1>
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {contracts && <ContractList contracts={contracts} />}
        </div>
    );
}

export default ContractStorage;