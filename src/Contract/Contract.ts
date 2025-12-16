import Erc20 from "./ABI/Erc20.ts";
import EnvManager from '@/config/EnvManager.ts'
import VailPlusNodeABI from "./ABI/VailPlusNodeABI.ts";
import VailPlusUserABI from "./ABI/VailPlusUserABI.ts";
interface ContractItem {
  address: string;
  abi: any[]; // 或具体ABI类型
}
interface ContractMap {
  [key: string]: ContractItem;
}

const Contract: ContractMap = {
  USDTToken: {
    address: EnvManager.contractUsdt,
    abi: Erc20,
  },
  vailPlusUserToken: {
    address: EnvManager.contractVeillUser,
    abi: VailPlusUserABI,
  },
  vailPlusNodeToken: {
    address: EnvManager.contractVeillNode,
    abi: VailPlusNodeABI,
  },
};
// 正式
export default Contract;
