import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ walletAddress, setWalletAddress }) => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hasConnectedOnce = useRef(false);

  useEffect(() => {
    const connectedBefore = sessionStorage.getItem("hasConnectedOnce");
    if (connectedBefore) {
      hasConnectedOnce.current = true;
    }

    getCurrentWalletConnected();
    addWalletListener();
    checkNetwork();

    const interval = setInterval(async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length === 0 && walletAddress !== "") {
            setWalletAddress("");
            setSessionExpired(true);
          }
        } catch (err) {
          console.error("Error checking account status:", err);
        }
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setSessionExpired(false);
          hasConnectedOnce.current = true;
          sessionStorage.setItem("hasConnectedOnce", "true");
        }
      } catch (err) {
        console.error("Connection error:", err.message);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setSessionExpired(false);
          hasConnectedOnce.current = true;
          sessionStorage.setItem("hasConnectedOnce", "true");
        } else {
          setWalletAddress("");
          setSessionExpired(hasConnectedOnce.current);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setSessionExpired(false);
          hasConnectedOnce.current = true;
          sessionStorage.setItem("hasConnectedOnce", "true");
        } else {
          setWalletAddress("");
          setSessionExpired(true);
        }
      });
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const expectedChainId = "0xaa36a7"; // Sepolia
      if (chainId !== expectedChainId) {
        alert("Please switch to Sepolia Testnet in MetaMask");
      }
    }
  };

  // Mensaje de reconexión
  const buttonText = walletAddress
    ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)}`
    : hasConnectedOnce.current
      ? "Reconnect Wallet"
      : "Connect Wallet";

  // Ocultar automáticamente el mensaje de sesión expirada
  useEffect(() => {
    if (sessionExpired) {
      const timeout = setTimeout(() => {
        setSessionExpired(false);
      }, 10000); 
      return () => clearTimeout(timeout);
    }
  }, [sessionExpired]);

return (
  <nav className="fixed top-0 w-full z-50 bg-gray-900 shadow-lg border-b border-blue-700 font-poppins">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide text-orange-500 drop-shadow-md">EscrowApp</h1>

      <div className="block lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-300 hover:text-blue-400 focus:outline-none focus:text-blue-400"
        >
          ☰
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
        <Link
          to="/pending"
          className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium tracking-wide"
        >
          Pending Contracts
        </Link>
        <Link
          to="/approved"
          className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium tracking-wide"
        >
          Approved Contracts
        </Link>
        <Link
          to="/"
          className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium tracking-wide"
        >
          New Escrow
        </Link>

        <button
          onClick={connectWallet}
          className={`${
            walletAddress ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-400 hover:bg-orange-500'
          } text-black font-semibold px-4 py-2 rounded-lg shadow-md transition-colors duration-200`}
        >
          <span title={walletAddress || ""}>{buttonText}</span>
        </button>
      </div>
    </div>

    {/* Mobile menu */}
    {menuOpen && (
      <div className="lg:hidden px-4 pb-4 space-y-2">
        <Link
          to="/pending"
          className="block text-gray-300 hover:text-blue-400"
          onClick={() => setMenuOpen(false)}
        >
          Pending Contracts
        </Link>
        <Link
          to="/approved"
          className="block text-gray-300 hover:text-blue-400"
          onClick={() => setMenuOpen(false)}
        >
          Approved Contracts
        </Link>
        <Link
          to="/"
          className="block text-gray-300 hover:text-blue-400"
          onClick={() => setMenuOpen(false)}
        >
          New Escrow
        </Link>
        <button
          onClick={() => {
            connectWallet();
            setMenuOpen(false);
          }}
          className={`${
            walletAddress ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-400 hover:bg-orange-500'
          } w-full text-black font-semibold px-4 py-2 rounded-lg shadow-md transition-colors duration-200`}
        >
          <span title={walletAddress || ""}>{buttonText}</span>
        </button>
      </div>
    )}

    {sessionExpired && (
      <div className="absolute top-full right-4 mt-2 bg-red-600 text-white text-xs px-4 py-2 rounded-md shadow-md animate-fade-in-out z-50">
        Session expired. Please reconnect.
      </div>
    )}
  </nav>
);
};

export default Navbar;