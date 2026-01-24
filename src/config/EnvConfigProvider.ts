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
      apiBase: "http://3.0.146.249:8001/api/",
      contractUsdt: "0x0158953982FbF5f42D5eb934046cD0707D1B2E74",
      contractVeillUser: "0xB8D7772733b9b1C4655910a0774D23Fd50183F39",
      contractVeillNode: "0x95DBF309d12651bb8B75F0112d00ADcABf2de372",
      veilPlusToken: "0x628381d53614D9ef7CBe0d68b35bF63F290046dC",
      veilPlusPool: "0x036BC45dd059749fd2888893C1bF744a38fCe1fB",//捐赠池
      veilPlusSafety: "0xe4e96e139aFb35b4FFB089D9dD96e44E6bF75657",//托底
      veilPlusRepurchase: "0xde3127d3e8239F541108050Ac451E092A1f82Cc5",//回购池
      veilPlusBasePair:"0x5097a670ac73714c74eB8A61d6F373e7635c9A6B",//lp池
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
      veilPlusSafety: "0xe4e96e139aFb35b4FFB089D9dD96e44E6bF75657",
      veilPlusRepurchase: "0xde3127d3e8239F541108050Ac451E092A1f82Cc5",
      veilPlusBasePair:"0x5097a670ac73714c74eB8A61d6F373e7635c9A6B",
      chainId: "0x38",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      blockExplorerUrls: "https://bscscan.com",
      chainName: "BNB Smart Chain Mainnet",
    };
  }
}
