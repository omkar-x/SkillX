"use client"

import abi from "../../contracts/abi.json";
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS




import { createContext, useContext, useState, useEffect } from "react"
import { ethers } from "ethers"
import toast from "react-hot-toast"

const Web3Context = createContext(undefined)

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

export const Web3Provider = ({ children }) => {

  const [contract, setContract] = useState(null)

  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", [])

        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const balance = await provider.getBalance(address)

        setProvider(provider)
        setSigner(signer)
        setAccount(address)
        setBalance(ethers.formatEther(balance))
        setIsConnected(true)

        const contractInstance = new ethers.Contract(contractAddress, abi, signer)
        setContract(contractInstance)

        localStorage.setItem("walletConnected", "true")
        toast.success("Wallet connected successfully!")
      } else {
        toast.error("MetaMask is not installed!")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast.error("Failed to connect wallet")
    }
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setBalance(null)
    setIsConnected(false)
    localStorage.removeItem("walletConnected")
    toast.success("Wallet disconnected")
  }

  const updateBalance = async () => {
    if (provider && account) {
      try {
        const balance = await provider.getBalance(account)
        setBalance(ethers.formatEther(balance))
      } catch (error) {
        console.error("Error updating balance:", error)
      }
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined" && localStorage.getItem("walletConnected")) {
        await connectWallet()
      }
    }

    checkConnection()
  }, [])

  useEffect(() => {
    if (provider && account) {
      updateBalance()

      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum?.on("accountsChanged", handleAccountsChanged)
      window.ethereum?.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum?.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [provider, account])

  const value = {
    provider,
    signer,
    account,
    balance,
    isConnected,
    connectWallet,
    disconnectWallet,
    contract,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}
