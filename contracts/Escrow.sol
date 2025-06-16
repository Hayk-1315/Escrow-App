// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/// @title Escrow Smart Contract
/// @notice Allows an arbiter to approve or cancel a payment between depositor and beneficiary
/// @dev Enhanced version with expiration logic and status introspection

contract Escrow {
    address public arbiter;
    address public beneficiary;
    address public depositor;

    uint public createdAt;
    uint public expiresAt;

    bool public isApproved;
    bool public isCancelled;

    event Approved(uint amount, uint timestamp);
    event Cancelled(uint amount, uint timestamp);

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Only arbiter can call this");
        _;
    }

    modifier notCompleted() {
        require(!isApproved && !isCancelled, "Escrow already completed");
        _;
    }

    /// @notice Initializes the contract with arbiter, beneficiary and expiration time
    /// @param _arbiter Address allowed to approve or cancel
    /// @param _beneficiary Address that will receive the funds upon approval
    /// @param _durationSeconds Duration in seconds before the escrow expires
    constructor(address _arbiter, address _beneficiary, uint _durationSeconds) payable {
        require(_arbiter != address(0) && _beneficiary != address(0), "Invalid address");
        require(msg.value > 0, "Must deposit some ETH");
        require(_arbiter != msg.sender && _beneficiary != msg.sender, "Depositor must be different");

        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        createdAt = block.timestamp;
        expiresAt = block.timestamp + _durationSeconds;
    }

    /// @notice Approves the escrow and sends the funds to the beneficiary
    function approve() external onlyArbiter notCompleted {
        require(!hasExpired(), "Escrow has expired");
        uint balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
        isApproved = true;
        emit Approved(balance, block.timestamp);
    }

    /// @notice Cancels the escrow and refunds the depositor
    function cancel() external onlyArbiter notCompleted {
        uint balance = address(this).balance;
        (bool sent, ) = payable(depositor).call{value: balance}("");
        require(sent, "Failed to refund Ether");
        isCancelled = true;
        emit Cancelled(balance, block.timestamp);
    }

    /// @notice Checks whether the escrow contract has expired
    /// @return Boolean indicating if expiration has occurred
    function hasExpired() public view returns (bool) {
        return block.timestamp >= expiresAt;
    }

    /// @notice Returns detailed info of the escrow contract
    function getInfo() external view returns (
        address _depositor,
        address _arbiter,
        address _beneficiary,
        uint balance,
        bool _isApproved,
        bool _isCancelled,
        uint _createdAt,
        uint _expiresAt
    ) {
        return (
            depositor,
            arbiter,
            beneficiary,
            address(this).balance,
            isApproved,
            isCancelled,
            createdAt,
            expiresAt
        );
    }
}