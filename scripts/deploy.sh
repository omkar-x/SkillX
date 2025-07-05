#!/bin/bash

# Load environment variables
source .env

echo "🚀 Deploying SkillToken to Sepolia..."

# Deploy the contract
forge script script/Deploy.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY

echo "✅ Deployment complete!"
echo "Don't forget to update REACT_APP_CONTRACT_ADDRESS in your .env file"
