# ERC-20 Token Indexing and Monitoring System

## Overview
This project consists of an ERC-20 token contract with minting and burning functions, a Ponder server that listens to on-chain events and indexes data into a Supabase PostgreSQL database, and a Node.js web server that provides APIs for querying token supply, holders, and balances. Additionally, a Bash script manages and monitors the health of both the Ponder server and the web server, ensuring reliability.

## Architecture
The system comprises the following key components:

1. **Foundry (Smart Contract Development & Deployment)**
   - ERC-20 token contract with `mint`, `burn`, and `transfer` functions.
   - Unit tests for contract functionalities.
   - Deployment script for deploying and verifying the contract on a blockchain.

2. **Ponder Server (Event Listener & Data Indexing)**
   - Captures events (`Transfer`, `Mint`, `Burn`) from the deployed contract.
   - Indexes data into a Supabase PostgreSQL database.

3. **Node.js Web Server (API & Alerts)**
   - Provides API endpoints for:
     - Fetching total supply.
     - Fetching all holders and their balances.
     - Fetching balance of a specific address.
   - Implements alerts:
     - When a holder possesses more than `X%` of the total supply.
     - When minting exceeds a threshold within 24 hours.

4. **Bash Script (Server Health Check & Management)**
   - Checks if the Ponder and Web servers are running.
   - Restarts them if they crash.
   - Logs server status.

## Flowchart
```mermaid
graph TD;
    A[Smart Contract Deployment] -->|Deploy & Verify| B[Blockchain]
    B -->|Emits Events| C[Ponder Server]
    C -->|Index Data| D[Supabase Database]
    E[Node.js Web Server] -->|Fetch Data| D
    E -->|Provide API| F[Clients]
    G[Bash Script] -->|Monitor| E & C
    G -->|Restart on Crash| E & C
```

## Setup & Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- Foundry (`forge` & `cast`)
- Supabase account
- PostgreSQL database
- Ponder
- Bash (for health check script)

### 1. Smart Contract Deployment
```bash
git clone https://github.com/raj210809/anthiasAssign
cd erc-20
forge install OpenZeppelin/openzeppelin-contracts
forge build
forge test
forge script --etherscan-api-key $ETHERSCAN_API_KEY script/WhitelistedMinterToken.sol \
    --rpc-url $BASE_SEPOLIA_RPC_URL \
    --broadcast --private-key $PRIVATE_KEY --verify -vvvv
```

### 2. Ponder Server Setup
```bash
cd ponderServer
npm install
TOKEN=YOUR_TOKEN_ADDRESS npx ponder dev
```

### 3. Web Server Setup
```bash
cd webserver
npm install
npm run dev
```

### 4. Environment Variables
Create a `.env.local` file in the respective folders and configure it:
#### **For Ponder Server**
```env
DATABASE_URL=postgresql://your_user:your_password@your_supabase_host:5432/your_database
PONDER_RPC_URL_1=https://your-ethereum-node.com
```
#### **For Web Server**
```env
SUPABASE_URL="https://your-supabase-url"
SUPABASE_KEY="your-supabase-key"
ALERT_SUPPLY_THRESHOLD=1000000
ALERT_HOLDER_PERCENTAGE=0.2
```

### 5. Running the Health Check Script
```bash
chmod +x monitor.sh
./monitor.sh
```

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/totalSupply` | Returns total supply of tokens |
| GET | `/holdersAndBalances` | Returns all token holders and balances |
| GET | `/balance?id=your_wallet_address` | Returns balance of a specific address |
| GET | `/triggersAndAlerts` | Checks and triggers supply/minting alerts |

## License
MIT License.

---
This README provides a structured guide for setting up, understanding, and contributing to the project.

