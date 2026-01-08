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
      // apiBase: "https://api.veilplus.com/api/",
      apiBase: "http://192.168.31.123:8702/",
      contractUsdt: "0x0158953982FbF5f42D5eb934046cD0707D1B2E74",
      contractVeillUser: "0x9E1390A5fE24CdfCEdAe50f8F1a252E653b3C4c1",
      contractVeillNode: "0x963102A48a14f2882b5f23BbeA28b8Eb38b73707",
      veilPlusToken: "0x846d777EBC4653A646714E65919e6Be2bBEFc073",
      veilPlusPool: "0x59269AAAb8e8c25Bc20c26CDd3F80562a37848A9",
      chainId: "0x61",
      rpcUrl: "https://bsc-testnet-rpc.publicnode.com/",
      blockExplorerUrls: "http://143.92.39.28:9030/api",
      chainName: "BNB Smart Chain Testnet",
    };
  }
  /** 生产环境配置（主网） */
  static getProdConfig(): EnvConfig {
    return {
      apiBase: "https://api.veilplus.com/api/",
      contractUsdt: "0x55d398326f99059fF775485246999027B3197955",
      contractVeillUser: "0x0647C3F22ad415cAB132c8D7B0639a500498c3cE",
      contractVeillNode: "0x6818087D9cd968A6d8DC3914F2bce74d07114204",
      veilPlusToken: "0x846d777EBC4653A646714E65919e6Be2bBEFc073",
      veilPlusPool: "0x2b93c86fc50A402D10f2BD282fE8F802eC806592",
      chainId: "0x38",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      blockExplorerUrls: "https://bscscan.com",
      chainName: "BNB Smart Chain Mainnet",
    };
  }
}
