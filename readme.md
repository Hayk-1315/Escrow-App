# 🛡️ Escrow App

Escrow App is a fully functional decentralized application (dApp) that simulates an Ethereum-based escrow system. It allows users to deploy new escrow smart contracts, approve or cancel them through an arbiter, and observe contract state updates in real time via blockchain event listeners.

---

## 🚀 Live Demo

🔗 The app is deployed on:
- **Frontend (Vercel):** https://escrow-app-blue.vercel.app
- **Backend (Render):**  https://escrow-backend-nbkb.onrender.com

> The app runs on the **Sepolia Ethereum testnet**.

---

## 📦 Tech Stack

- **Smart Contract:** Solidity, Ethereum, Sepolia testnet  
- **Frontend:** React, Tailwind CSS, ethers.js  
- **Backend:** Node.js, Express, LowDB  
- **Deployment:** Vercel (frontend), Render (backend)  
- **Testing Network:** Sepolia  

---

## 🧠 Features

### ✅ Core Functionality
- Deploy new escrow contracts with:
  - `depositor` (auto-filled by connected wallet)
  - `arbiter`
  - `beneficiary`
  - deposit amount (ETH)
  - contract duration (days)
- Approve or cancel a contract by the arbiter
- Display **pending** and **approved** contracts with real-time status
- Filter contracts to show only those where the connected wallet is `depositor` or `arbiter`
- Read on-chain contract details: `balance`, `status`, `createdAt`, `expiresAt`

### 🔁 Real-Time Event Listeners
- Listens for `Approved` and `Cancelled` smart contract events
- Automatically updates the UI when a contract is approved/cancelled — even from another wallet/browser
- Displays contextual messages with ETH amount and timestamp

### 💾 Data Persistence
- Contracts are stored in a JSON-based backend (`lowdb`)
- The backend filters results to show only relevant contracts per user

---

## 🧪 Testing

The smart contract and dApp have been **extensively tested**:
- Tested manually with multiple MetaMask accounts and different browsers
- Validated the full contract lifecycle on **Sepolia testnet** (deploy → approve/cancel → state updates)
- Includes an automated test suite powered by **Hardhat** to verify all edge cases and expected behaviors

### ✅ What’s Covered by the Tests

- ✅ **Deployment validation** — Confirms the contract is deployed with the correct arbiter, depositor, beneficiary, and expiry time.
- ✅ **Approval flow** — Only the arbiter can call `approve()`. Tests verify successful approval, event emission, and state updates.
- ✅ **Cancellation flow** — Only the arbiter can call `cancel()`. Tests verify successful cancellation, event emission, and correct refunding of the depositor.
- ✅ **Expiry behavior** — Demonstrates that after the expiry time passes, the arbiter cannot approve the escrow.
- ✅ **Access control** — Tests that non-arbiters cannot call `approve()` or `cancel()`.
- ✅ **Info retrieval** — Confirms `getInfo()` returns the correct data structure.
- ✅ **Double execution prevention** — Confirms that the contract cannot be approved or canceled more than once.

### 🧪 Running the Tests

After cloning the repository and installing the dependencies:

npm install
npx hardhat test
If all tests pass successfully, you'll see output like:

Escrow Contract
  ✔ Should deploy with correct data (69ms)
  ✔ Should allow arbiter to approve and emit event (88ms)
  ✔ Should not allow non-arbiter to approve (70ms)
  ✔ Should allow arbiter to cancel and emit event (58ms)
  ✔ Should not allow double cancellation or approval (51ms)
  ✔ Should respect expiration time for approval
  ✔ getInfo() returns expected data

7 passing

---


## 🛠️ How to Run Locally

1. **Clone the repo**

```bash
git clone https://github.com/Hayk-1315/Escrow-App.git
cd Escrow-app
Install dependencies

bash

# Frontend
cd app
npm install

# Backend
cd ../server
npm install
Create .env file

bash

# Backend
Run backend

bash

cd server
npm run dev

# Frontend
Run frontend

bash

cd ../app
npm run dev

Make sure MetaMask is connected to Sepolia testnet

🧱 Smart Contract Details
Constructor accepts arbiter, beneficiary, duration

Deposit made at deployment time by depositor

approve() function callable by arbiter — transfers ETH to beneficiary

cancel() callable by arbiter — refunds depositor

Emits events:

Approved(uint amount, uint timestamp)

Cancelled(uint amount, uint timestamp)

Tracks createdAt, expiresAt, and internal flags

📌 Future Improvements

Search/sort/filter for contract views

Optional GraphQL integration for better indexing

ℹ️ Notes on Backend Persistence
This project uses lowdb as a lightweight JSON-based database, hosted on Render. While fully functional, it does not include a persistent external database.

As a result, any escrow contracts created or approved during use will be lost when the Render server restarts, which may happen due to inactivity, redeployment, or updates. After a restart, the server reloads the initial db.json file stored in the repository, which contains a predefined set of contracts for demonstration purposes.

This limitation is intentional, given that the project's main purpose is to showcase on-chain integration, smart contract logic, and fullstack dApp development, rather than to provide permanent data storage.

A future version could easily integrate a persistent solution like MongoDB Atlas or PostgreSQL for production-grade storage.


📚 License
MIT – feel free to fork, test, or adapt for your own use.

👤 Author
Built with care by Albert Khudaverdyan

LinkedIn: https://www.linkedin.com/in/albert-khudaverdyan-656902253/

GitHub: https://github.com/Hayk-1315

