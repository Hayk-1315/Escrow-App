const ContractList = ({ contracts }) => {
    const Tooltip = ({ text }) => {
        return (
          <span className="tooltip">
            {text}
          </span>
        );
      };
      
    const sliceAddress = (address, label) => {
        const visible = address.slice(0, 8);
        const hidden = '...'; 
        const tooltipText =  `${visible}${hidden}${address.slice(-8)}`;

        return label === 'Depositor' ? (
            <span>
                {tooltipText}
                <Tooltip text={tooltipText} />
            </span>
        ) : tooltipText;
    };

    return (
        <div className="contract-list">
            {contracts.length > 0 && (
                <div className="contract-header">
                    <p>Depositor</p>
                    <p>Arbiter</p>
                    <p>Beneficiary</p>
                    <p>Value</p>
                </div>
            )}

            {contracts.map((contract) => (
                <div className="contract-box" key={contract.id}>
                    <p>{sliceAddress(contract.depositor, 'Depositor')}</p>
                    <p>{sliceAddress(contract.arbiter, 'Arbiter')}</p>
                    <p>{sliceAddress(contract.beneficiary, 'Beneficiary')}</p>
                    <p>{contract.value}</p>
                </div>
            ))}
        </div>
    );
}


export default ContractList;