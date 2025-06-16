# 🛡️ Escrow App

Escrow App is a fully functional decentralized application (dApp) that simulates an Ethereum-based escrow system. It allows users to deploy new escrow smart contracts, approve or cancel them through an arbiter, and observe contract state updates in real time via blockchain event listeners.

---

## 🚀 Live Demo

🔗 The app is deployed on:
- **Frontend (Vercel):** _to be added_
- **Backend (Render):** _to be added_

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

The smart contract and app have been **extensively tested manually**:
- Tested with **multiple MetaMask accounts** and **different browsers**
- Verified full contract lifecycle: deploy → approve/cancel → state sync
- All tests and interactions have been conducted on the **Sepolia testnet**

> Future improvements may include automated unit testing with Hardhat.

---

## 🛠️ How to Run Locally

1. **Clone the repo**

```bash
git clone https://github.com/your-username/Escrow-app.git
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
Add unit tests for Escrow.sol using Hardhat or Foundry

Search/sort/filter for contract views

Optional GraphQL integration for better indexing


📚 License
MIT – feel free to fork, test, or adapt for your own use.

👤 Author
Built with care by Albert Khudaverdyan

LinkedIn: https://www.linkedin.com/in/albert-khudaverdyan-656902253/

GitHub: https://github.com/Hayk-1315

