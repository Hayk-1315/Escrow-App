import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        console.log("Navbar rendered. walletAddress:", walletAddress);
        getCurrentWalletConnected();
        addWalletListener();
    }, [walletAddress]);

    const connectWallet = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                /* MetaMask is installed */
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
            } catch (err) {
                console.error(err.message);
            }
        } else {
            /* MetaMask is not installed */
            console.log("Please install MetaMask");
        }
    };

    const getCurrentWalletConnected = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                } else {
                    console.log("Connect to MetaMask using the Connect button");
                }
            } catch (err) {
                console.error(err.message);
            }
        } else {
            /* MetaMask is not installed */
            console.log("Please install MetaMask");
        }
    };

    const addWalletListener = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            window.ethereum.on("accountsChanged", (accounts) => {
                setWalletAddress(accounts[0]);
            });
        } else {
            /* MetaMask is not installed */
            setWalletAddress("");
            console.log("Please install MetaMask");
        }
    };

    return (
        <nav className="navbar">
            <h1>Escrow</h1>
            <div className="links">
                <Link to="/contracts">All contracts</Link>
                <Link to="/">New escrow</Link>
                <button className='metamask-button' onClick={connectWallet}>
                    {walletAddress && walletAddress.length > 0
                        ? `Connected: ${walletAddress.substring(
                            0,
                            6
                        )}...${walletAddress.substring(36)}`
                        : "Connect Wallet"}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;