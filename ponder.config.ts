import { createConfig } from "ponder";
import { Abi, http } from "viem";

import WhitelistedMintableTokenAbi from "./abis/WhitelistedMintableToken.json";

export default createConfig({
  networks: {
    baseSepolia: {
      chainId: 84532, // Base Sepolia Chain ID
      transport: http(process.env.BASE_SEPOLIA_RPC_URL), // Add your RPC URL in .env
    },
  },
  contracts: {
    WhitelistedMintableToken: {
      network: "baseSepolia",
      abi: WhitelistedMintableTokenAbi as Abi,
      address: "0xbA0D56FC7544ED41D385F5b23471C6E5c05624a2",
      startBlock: 23432562,
    },
  },
  database : {
    kind: "postgres",
    connectionString: process.env.DATABASE_URL,
  }
});
