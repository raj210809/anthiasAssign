import { createConfig } from "ponder";
import { Abi, http } from "viem";

import WhitelistedMintableTokenAbi from "./abis/WhitelistedMintableToken.json";

export default createConfig({
  networks: {
    baseSepolia: {
      chainId: 84532, // Base Sepolia Chain ID
      transport: http(process.env.PONDER_RPC_URL_1),
    },
  },
  contracts: {
    WhitelistedMintableToken: {
      network: "baseSepolia",
      abi: WhitelistedMintableTokenAbi as Abi,
      address: process.env.TOKEN as any, //0xbA0D56FC7544ED41D385F5b23471C6E5c05624a2
      startBlock: 23432562,
    },
  },
  database : {
    kind: "postgres",
    connectionString: process.env.DATABASE_URL,
  }
});
