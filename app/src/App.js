import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateContracts from './CreateContracts';
import Navbar from './Navbar';
import PendingContractsPage from './PendingContractsPage';
import ApprovedContractsPage from './ApprovedContractsPage';
import Footer from './Footer.js';

function App() {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <Router>
  <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 font-poppins">
    <Navbar walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
    
    <div className="flex-grow">
      <Routes>
        <Route path="/" element={<CreateContracts walletAddr={walletAddress} />} />
        <Route path="/pending" element={<PendingContractsPage walletAddr={walletAddress} />} />
        <Route path="/approved" element={<ApprovedContractsPage walletAddr={walletAddress} />} />
      </Routes>
    </div>

    <Footer />
  </div>
</Router>
  );
}


export default App;
