import Erc20 from "./ABI/Erc20.ts";
import SpaceNFTABI from "./ABI/SpaceNFTABI.ts";
import EnvManager from "@/config/EnvManager";
import TaxPoolABI from "./ABI/TaxPoolABI.ts";
import StoreABI from "./ABI/StoreABI.ts";
import swapRouterABI from "./ABI/SwapRouterABI.ts";
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
  TaxToken: {
    address: EnvManager.contractTAXToken,
    abi: Erc20,
  },
  SpaceNFT: {
    address: EnvManager.contractSpaceNFT,
    abi: SpaceNFTABI,
  },
  TaxPool: {
    address: EnvManager.taxPool,
    abi: TaxPoolABI,
  },
  storeToken: {
    address: EnvManager.storeToken,
    abi: StoreABI,
  },
  swapRouterToken: {
    address: EnvManager.swapRouter,
    abi: swapRouterABI,
  },
};
// 正式
export default Contract;
