# 🛠️ Skill Trading DApp

A fully functional Ethereum-based decentralized application (DApp) for tokenizing and trading skills as NFTs.

## 🚀 Features

### Smart Contract (Solidity + Foundry)
- **SkillToken.sol**: ERC-721 NFT contract for skill tokenization
- **Mint Skills**: Create NFTs representing your expertise
- **Trade Skills**: List, buy, and transfer skill NFTs
- **Marketplace**: Decentralized trading with ETH payments
- **Events**: Complete event logging for all activities

### Frontend (React + CSS)
- **Home Page**: Skill feed and platform overview
- **Mint Skill**: Create and tokenize your skills
- **Marketplace**: Browse and purchase skill NFTs
- **My Skills**: Manage your skill portfolio
- **MetaMask Integration**: Seamless wallet connection
- **Real-time Updates**: Live blockchain data synchronization

## 🏗️ Tech Stack

- **Frontend**: React 18+ with JavaScript/JSX and CSS
- **Blockchain**: Ethereum (Sepolia/Goerli Testnet)
- **Smart Contracts**: Solidity ^0.8.19
- **Development**: Foundry framework
- **Web3**: ethers.js 6.x
- **Styling**: Custom CSS (no frameworks)
- **State Management**: React Context API

## 📦 Project Structure

\`\`\`
skill-trading-dapp/
├── contracts/
│   └── SkillToken.sol          # Main NFT contract
├── test/
│   └── SkillToken.t.sol        # Comprehensive tests
├── script/
│   └── Deploy.s.sol            # Deployment script
├── src/
│   ├── components/             # React components with CSS
│   ├── contexts/               # Web3 context
│   ├── hooks/                  # Custom hooks
│   ├── pages/                  # Application pages with CSS
│   └── index.js               # React entry point
├── public/
│   └── index.html             # HTML template
├── foundry.toml               # Foundry configuration
└── README.md
\`\`\`

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+
- Git
- MetaMask browser extension

### 1. Install Foundry
\`\`\`bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
\`\`\`

### 2. Clone and Install Dependencies
\`\`\`bash
git clone <repository-url>
cd skill-trading-dapp

# Install Foundry dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Install React dependencies
npm install
\`\`\`

### 3. Environment Setup
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your values:
\`\`\`env
PRIVATE_KEY=your_private_key_without_0x
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address
REACT_APP_NETWORK_ID=11155111
\`\`\`

### 4. Smart Contract Development

#### Run Tests
\`\`\`bash
forge test -vvv
\`\`\`

#### Deploy to Sepolia Testnet
\`\`\`bash
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify
\`\`\`

#### Local Development
\`\`\`bash
# Start local blockchain
anvil

# Deploy locally (new terminal)
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
\`\`\`

### 5. Frontend Development
\`\`\`bash
# Update contract address in .env
# Start React development server
npm start
\`\`\`

## 🧪 Testing

### Smart Contract Tests
\`\`\`bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testMintSkill
\`\`\`

### Test Coverage
\`\`\`bash
forge coverage
\`\`\`

## 📋 Smart Contract Functions

### Core Functions
- `mintSkill(string skillName, string metadataURI)`: Create skill NFT
- `listSkillForSale(uint256 tokenId, uint256 price)`: List for trading
- `buySkill(uint256 tokenId)`: Purchase skill NFT
- `transferSkill(address to, uint256 tokenId)`: Transfer ownership
- `removeFromSale(uint256 tokenId)`: Remove from marketplace

### View Functions
- `getSkillsForSale()`: Get all listed skills
- `getUserSkills(address user)`: Get user's skills
- `getAllSkills()`: Get all minted skills
- `getSkill(uint256 tokenId)`: Get skill details

## 🌐 Frontend Features

### Pages
1. **Home**: Platform overview and recent skills
2. **Mint Skill**: Create new skill NFTs
3. **Marketplace**: Browse and buy skills
4. **My Skills**: Manage owned skills

### Key Components
- **Web3Provider**: Ethereum wallet integration
- **SkillCard**: Reusable skill display component
- **Navbar**: Navigation with wallet status
- **Modal**: Custom modal component

## 🎨 Styling

The project uses custom CSS with:
- **Responsive Design**: Mobile-first approach
- **CSS Grid & Flexbox**: Modern layout techniques
- **Custom Components**: No external CSS frameworks
- **Consistent Design System**: Unified colors, spacing, and typography
- **Smooth Animations**: Hover effects and transitions

## 🔧 Configuration

### Foundry Configuration (`foundry.toml`)
\`\`\`toml
[profile.default]
src = "contracts"
out = "out"
libs = ["lib"]
remappings = ["@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/"]
\`\`\`

### Network Configuration
- **Sepolia Testnet**: Chain ID 11155111
- **Goerli Testnet**: Chain ID 5
- **Local Development**: Chain ID 31337

## 🚀 Deployment Guide

### 1. Prepare Environment
- Fund wallet with testnet ETH
- Set up Infura/Alchemy RPC endpoint
- Configure Etherscan API key

### 2. Deploy Contract
\`\`\`bash
forge script script/Deploy.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
\`\`\`

### 3. Update Frontend
- Copy deployed contract address to `.env`
- Update `REACT_APP_CONTRACT_ADDRESS`
- Deploy frontend to Vercel/Netlify

## 🔍 Usage Examples

### Minting a Skill
1. Connect MetaMask wallet
2. Navigate to "Mint Skill"
3. Fill in skill details
4. Confirm transaction
5. Skill NFT created!

### Trading Skills
1. Go to "Marketplace"
2. Browse available skills
3. Click "Buy" on desired skill
4. Confirm purchase transaction
5. Skill transferred to your wallet

### Managing Skills
1. Visit "My Skills"
2. View owned skills
3. List skills for sale
4. Set prices and manage listings

## 🛡️ Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Owner-only functions
- **Input Validation**: Comprehensive parameter checking
- **Safe Transfers**: Secure ETH and NFT transfers

## 🧩 Integration Guide

### Adding to Existing Project
\`\`\`javascript
import { useSkillContract } from './hooks/useSkillContract';

function MyComponent() {
  const { mintSkill, buySkill, getUserSkills } = useSkillContract();
  
  // Use contract functions
  const handleMint = async () => {
    await mintSkill("React Development", "Expert level React skills");
  };
}
\`\`\`

### Custom Integration
\`\`\`javascript
import { ethers } from 'ethers';

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  signer
);

const skills = await contract.getSkillsForSale();
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: This README

## 🔗 Links

- **Etherscan**: View contract on blockchain explorer
- **OpenSea**: View NFTs on marketplace
- **Demo**: Live application demo

---

Built with ❤️ using React, CSS, Solidity, and Foundry
