import { useEffect, useState } from "react";
import "./App.css";
import { ensureWalletConnected, listenWalletEvents } from "@/Hooks/WalletHooks";
import { userAddress } from "@/Store/Store.ts";
import { Spin } from "antd";
import EnvManager from "@/config/EnvManager";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { ethers } from "ethers";
import AppRouter from "@/router/index";
EnvManager.print()
function App() {

  const walletAddress = userAddress((state) => state.address);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listenWalletEvents(); // ✅ 挂载全局监听
    const checkWallet = async () => {
      if (!walletAddress) {
        await ensureWalletConnected();
      }
      setLoading(false);
    };
    checkWallet();
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="loading">
        <Spin />
      </div>
    );
  }
 
  return (
    <>
      {walletAddress ? (
        <AppRouter />
      ) : (
        <div className="loding">
          <div>请先连接钱包</div>
        </div>
      )}
   
    </>
  );
}

export default App;
