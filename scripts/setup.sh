#!/bin/bash

echo "🚀 Setting up Skill Trading DApp..."

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo "Installing Foundry..."
    curl -L https://foundry.paradigm.xyz | bash
    source ~/.bashrc
    foundryup
fi

# Install Foundry dependencies
echo "📦 Installing smart contract dependencies..."
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Install Node.js dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual values!"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your private key and RPC URLs"
echo "2. Run 'forge test' to test smart contracts"
echo "3. Deploy with 'forge script script/Deploy.s.sol --rpc-url sepolia --broadcast'"
echo "4. Update REACT_APP_CONTRACT_ADDRESS in .env"
echo "5. Run 'npm start' to start the frontend"
