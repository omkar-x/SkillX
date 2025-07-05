"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWeb3 } from "../contexts/Web3Context"
import { useEffect, useState } from "react"
import "./Navbar.css"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/mint", label: "Mint" },
  { href: "/myskills", label: "My Skills" },
  { href: "/marketplace", label: "Marketplace" },
]

const Navbar = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3()
  const [uss, setUss] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    if (account) {
      setUss(1234) // Replace with actual USS fetch logic
    }
  }, [account])

  // Dark mode toggle (optional)
  useEffect(() => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (dark) document.body.classList.add("dark")
    else document.body.classList.remove("dark")
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href="/">
          <span className="logo">
            <span className="logo-icon"><span>🧠</span></span>
            <span className="logo-text">SkillX</span>
          </span>
        </Link>
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="wallet-section">
          <div className="navbar-uss animate-uss">
            USS: <span className="uss-value">{uss}</span>
          </div>
          {isConnected ? (
            <div className="wallet-info">
              <span className="wallet-address">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button className="nav-link" onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="nav-link" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      {/* Mobile nav */}
      <div className="mobile-nav">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`mobile-nav-link${pathname === link.href ? " active" : ""}`}
          >
            <span className="mobile-nav-label">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
