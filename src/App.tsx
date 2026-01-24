import "./App.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";

import EnvManager from "@/config/EnvManager";
import TaBbarBottom from "@/components/TaBbarBottom";
import AppRouter from "@/router";
import { ensureWalletConnected, listenWalletEvents } from "@/Hooks/WalletHooks";
import { userAddress } from "@/Store/Store";

EnvManager.print();

function App() {
  const location = useLocation();
  // 是否显示底部 Tab
  console.log("location.pathname--",location.pathname)
  const showTab = ["/Home", "/Donate", "/My"].includes(location.pathname);
  console.log("showTab000",showTab)
  const walletAddress = userAddress((state) => state.address);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // 只注册一次全局监听
    listenWalletEvents();

    const checkWallet = async () => {
      try {
        if (!walletAddress) {
          await ensureWalletConnected();
        }
      } finally {
        setLoading(false);
      }
    };

    checkWallet();
  }, []); // ⚠️ 不要依赖 walletAddress，否则可能死循环

  if (loading) {
    return (
      <div className="loading">
        <Spin />
      </div>
    );
  }

  return (
    <div className="app">
      {walletAddress ? (
        <>
          <div className="body">
            <AppRouter />
          </div>
          {showTab && (
            <div className="bottom">
              <TaBbarBottom />
            </div>
          )}
        </>
      ) : (
        <div className="loading">
          <div>请先连接钱包</div>
        </div>
      )}
    </div>
  );
}

export default App;