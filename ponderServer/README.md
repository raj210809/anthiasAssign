# Ponder Event Indexer with Supabase Postgres

This project uses **Ponder** to index blockchain events from a **WhitelistedMintableToken** smart contract and stores them in a **Supabase PostgreSQL** database. It listens to **Mint, Transfer, and Burn** events, processes them, and updates wallet balances and total supply accordingly.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Event Handling](#event-handling)
- [Database Schema](#database-schema)

---
## Overview
**Ponder** is used to capture and index Ethereum smart contract events efficiently. It subscribes to events emitted by the **WhitelistedMintableToken** contract and updates the Supabase PostgreSQL database accordingly.

### Features:
- Captures **Mint, Transfer, and Burn** events.
- Updates **wallet balances** and **total supply**.
- Ensures correct event ordering using timestamps.
- Uses **PostgreSQL on Supabase** as the database backend.

---
## Architecture

1. **Smart Contract (WhitelistedMintableToken)**  
   - Emits **Mint, Transfer, and Burn** events.

2. **Ponder Event Listener (Node.js + Ponder)**  
   - Listens to contract events.
   - Parses event data.
   - Writes to the PostgreSQL database.

3. **Supabase PostgreSQL Database**  
   - Stores indexed blockchain data.
   - Uses `wallet`, `mints`, `transfers`, `burns`, and `totalSupply` tables.
   - Handles event deduplication and updates wallet balances atomically.

---
## Setup
### Prerequisites
Ensure you have the following installed:
- **Node.js v18+**
- **PostgreSQL (Supabase)**
- **Docker (optional, for local Postgres testing)**

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/raj210809/anthiasAssign
   cd ponderServer
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (see below).
4. Start the event listener:
   ```sh
   TOKEN=YOUR_TOKEN_ADDRESS npm run dev
   ```

---
## Environment Variables
Create a `.env.local` file in the root directory and set the following variables:
```sh
DATABASE_URL=postgresql://your_user:your_password@your_supabase_host:5432/your_database
PONDER_RPC_URL_1=https://your-ethereum-node.com
```

---
## Running the Project
To start listening for contract events and indexing them in the database:
```sh
TOKEN=YOUR_TOKEN_ADDRESS npx ponder dev
```

---
## Event Handling
### **Mint Event**
When a **Mint** event is emitted:
1. Fetch the last mint timestamp for the wallet.
2. If the event is new, insert the **Mint** record.
3. Update the wallet's **balance** and **timestampForMint**.
4. Update **total supply**.

### **Transfer Event**
When a **Transfer** event is emitted:
1. Insert the transfer record.
2. Update sender and receiver balances.

### **Burn Event**
When a **Burn** event is emitted:
1. Fetch the last burn timestamp for the wallet.
2. If the event is new, insert the **Burn** record.
3. Deduct from the wallet balance.
4. Deduct from total supply.

---
## Database Schema
### **Wallet Table** (`wallet`)
| Column          | Type     | Description |
|---------------|----------|------------|
| id            | TEXT (PK) | Wallet address |
| balance       | TEXT      | Current balance |
| timestampForMint | BIGINT | Last mint timestamp |
| timestampForBurn | BIGINT | Last burn timestamp |

### **Mints Table** (`mints`)
| Column        | Type     | Description |
|-------------|----------|------------|
| id          | TEXT (PK) | Transaction hash |
| to          | TEXT      | Receiver address |
| amount      | TEXT      | Minted amount |
| blockNumber | BIGINT    | Block number |
| timestamp   | BIGINT    | Timestamp |

### **Transfers Table** (`transfers`)
| Column        | Type     | Description |
|-------------|----------|------------|
| id          | TEXT (PK) | Transaction hash |
| from        | TEXT      | Sender address |
| to          | TEXT      | Receiver address |
| amount      | TEXT      | Transfer amount |
| blockNumber | BIGINT    | Block number |
| timestamp   | BIGINT    | Timestamp |

### **Burns Table** (`burns`)
| Column        | Type     | Description |
|-------------|----------|------------|
| id          | TEXT (PK) | Transaction hash |
| from        | TEXT      | Sender address |
| amount      | TEXT      | Burned amount |
| blockNumber | BIGINT    | Block number |
| timestamp   | BIGINT    | Timestamp |

### **Total Supply Table** (`totalSupply`)
| Column        | Type     | Description |
|-------------|----------|------------|
| id          | TEXT (PK) | Always "totalSupply" |
| totalSupply | TEXT      | Current total supply |


## Conclusion
This project efficiently captures and indexes Ethereum events using **Ponder**, **Supabase PostgreSQL**, and **Node.js**. It ensures accurate balance tracking while handling potential event ordering issues.

