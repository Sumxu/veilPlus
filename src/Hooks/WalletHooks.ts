import { userAddress, userChainId } from "@/Store/Store";
import { message } from "antd";
import EnvManager from "@/config/EnvManager";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ✅ 保证全局只注册一次监听
let isListenerAdded = false;

export function listenWalletEvents() {
  if (!window.ethereum || isListenerAdded) return;

  isListenerAdded = true;

  console.log("✅ Wallet Event Listener Registered");

  window.ethereum.on("accountsChanged", (accounts: string[]) => {
    if (accounts.length === 0) {
      console.log("钱包已断开");
     window.location.reload();
    } else {
      console.log("钱包切换为:", accounts[0]);
      window.location.reload();
    }
  });

  window.ethereum.on("chainChanged", () => {
    console.log("链切换，刷新页面");
    window.location.reload();
  });
}

// ✅ 连接钱包逻辑
export async function ensureWalletConnected(): Promise<boolean> {
  const { setAddress } = userAddress.getState();
  const { setChain } = userChainId.getState();

  if (!window.ethereum) return false;

  const ethereum = window.ethereum;

  const currentChainId = await ethereum.request({ method: "eth_chainId" });
  setChain(currentChainId);
  const BNB_PARAMS = {
    chainId: EnvManager.chainId,
    chainName: EnvManager.chainName,
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: [EnvManager.rpcUrl],
    blockExplorerUrls: [EnvManager.blockExplorerUrls],
  };

  let accounts: string[] = [];

  try {
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
  } catch {
    return false;
  }

  if (accounts.length > 0) {
    setAddress(accounts[0]);
    localStorage.setItem("address", accounts[0]);
  }

  if (currentChainId.toLowerCase() !== BNB_PARAMS.chainId) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BNB_PARAMS.chainId }],
      });
      window.location.reload();
    } catch (err: any) {
      if (err.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [BNB_PARAMS],
          });
          window.location.reload();
        } catch {
        }
      }
    }
  }

  return true;
}
