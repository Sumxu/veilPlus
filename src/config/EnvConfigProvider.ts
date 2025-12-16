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
      apiBase: "http://192.168.31.123:8702/",
      contractUsdt: "0x0158953982FbF5f42D5eb934046cD0707D1B2E74",
      contractVeillUser:"0x29baD8Ea5311014B1A9cda2aeAaE178C1A6E7484",
       contractVeillNode:"0x1e42247F4f5De8A51DAdfD1c544b921Ed1c8bC8e",
      chainId: "0x61",
      rpcUrl: "https://bsc-testnet-rpc.publicnode.com/",
      blockExplorerUrls: "http://143.92.39.28:9030/api",
      chainName: "BNB Smart Chain Mainnet",
    };
  }
  /** 生产环境配置（主网） */
  static getProdConfig(): EnvConfig {
    return {
      apiBase: "https://api.taxshop.plus/dapp/",
      contractUsdt: "0x2Cba653C50e9A2e97411104d1460EBFAECE50E9C",
      contractVeillUser:"0xc609d0DCb39da1655ae2cBf8039dba798d49a65D",
      contractVeillNode:"0xd4948CE85494bF0Af4F89104AD8FDFf98D2c54f2",
      chainId: "0x38",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      blockExplorerUrls: "https://bscscan.com",
      chainName: "BNB Smart Chain Mainnet",
    };
  }
}
