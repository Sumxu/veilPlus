// src/config/EnvConfigProvider.ts

/** 环境配置接口（已去掉 VITE_ 前缀，字段名更友好） */
export interface EnvConfig {
  apiBase: string;
  contractPool: string;
  contractUsdt: string;
  contractCa: string;
  contractIdoPool: string;
  chainId: string;
  rpcUrl: string;
  blockExplorerUrls: string;
  chainName: string;
}

/** 环境配置提供类：集中维护 dev / prod 原始值 */
export default class EnvConfigProvider {
  /** 开发环境配置（测试网） */
  static getDevConfig(): EnvConfig {
    return {
      apiBase: "https://api.veilplus.com/api/",
      contractUsdt: "0x0158953982FbF5f42D5eb934046cD0707D1B2E74",
      contractVeillUser: "0x29baD8Ea5311014B1A9cda2aeAaE178C1A6E7484",
      contractVeillNode: "0x1e42247F4f5De8A51DAdfD1c544b921Ed1c8bC8e",
      chainId: "0x61",
      rpcUrl: "https://bsc-testnet-rpc.publicnode.com/",
      blockExplorerUrls: "http://143.92.39.28:9030/api",
      chainName: "BNB Smart Chain Mainnet",
    };
  }
  /** 生产环境配置（主网） */
  static getProdConfig(): EnvConfig {
    return {
      apiBase: "https://api.veilplus.com/api/",
      contractUsdt: "0x55d398326f99059fF775485246999027B3197955",
      contractVeillUser: "0x0647C3F22ad415cAB132c8D7B0639a500498c3cE",
      contractVeillNode: "0x6818087D9cd968A6d8DC3914F2bce74d07114204",
      chainId: "0x38",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      blockExplorerUrls: "https://bscscan.com",
      chainName: "BNB Smart Chain Mainnet",
    };
  }
}
