# WhitelistedMintableToken - Foundry Deployment Guide

## 📌 Prerequisites
Before you begin, ensure you have the following installed:
- [Foundry](https://github.com/foundry-rs/foundry) (Forge & Cast)
- Node.js & npm (for managing dependencies, if needed)
- A funded wallet with **Base Sepolia** testnet ETH
- An **Etherscan API key** for contract verification

## 🔧 Installation
### 1️⃣ Install Foundry
Run the following command to install Foundry:
```sh
curl -L https://foundry.paradigm.xyz | bash
foundryup  # Updates Foundry to the latest version
```

### 2️⃣ Clone the Repository & Install Dependencies
```sh
git clone https://github.com/raj210809/anthiasAssign
cd erc-20
forge install
```

### 3️⃣ Install OpenZeppelin Contracts
To use OpenZeppelin’s standard contracts, install them with:
```sh
forge install OpenZeppelin/openzeppelin-contracts
```

## 🚀 Deployment
Before deploying, set up environment variables:
```sh
export PRIVATE_KEY=<your-private-key>
export BASE_SEPOLIA_RPC_URL=<your-rpc-url>
export ETHERSCAN_API_KEY=<your-etherscan-api-key>
```

### 1️⃣ Run the Deployment Script
Execute the following command to deploy the contract to **Base Sepolia**:
```sh
forge script --etherscan-api-key $ETHERSCAN_API_KEY script/WhitelistedMinterToken.sol \
    --rpc-url $BASE_SEPOLIA_RPC_URL \
    --broadcast --private-key $PRIVATE_KEY --verify -vvvv
```

### 2️⃣ Verify Deployment
If the deployment is successful, Foundry will output a **contract address**. You can verify it manually on [Base Sepolia Etherscan](https://sepolia.basescan.org/).

## 🛠 Testing
To run tests before deploying, execute:
```sh
forge test -vvv
```

## 📄 License
This project is licensed under the MIT License.

