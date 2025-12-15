import { Spin } from "antd";
import { useLocation } from "react-router-dom";
import TaBbarBottom from "@/components/TaBbarBottom";
import AppRouter from "@/router";
import useWalletListener from "@/Hooks/useWalletListener";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { userAddress } from "@/Store/Store";
import { storage } from "@/Hooks/useLocalStorage";
import InviteModal from "@/components/InviteModal";
import { useState, useEffect } from "react";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { ethers } from "ethers";
function App() {
  const { ready, invite } = useAuthGuard();
  const location = useLocation();
  const walletAddress = userAddress((s) => s.address);
  const showTab = ["/home", "/classify", "/my"].includes(location.pathname);
  const noLoginPage = !["/login",'/'].includes(location.pathname);
  const [inviteShow, setInviteShow] = useState<boolean>(false);
  const { search } = useLocation();
  const clearFn = () => {
    storage.remove("token");
    storage.remove("editAddressInfo");
    storage.remove("payMethodName");
    storage.remove("checkAddress");
  };
  // 统一监听钱包事件
  useWalletListener({
    onAccountsChanged: () => {
      clearFn();
      window.location.href = "/login"; // 更保险，不会出现 React 状态问题
    },
    onDisconnected: () => {
      clearFn();
      window.location.href = "/login";
    },
    onChainChanged: () => {
      window.location.reload();
    },
  });
  if (!ready) {
    return (
      <div className="loading">
        <Spin />
      </div>
    );
  }
  const isInviterFn = async () => {
    if (!noLoginPage) return; // login 页面不查
    if (!walletAddress) return; // 地址不存在不查
    const result = await ContractRequest({
      tokenName: "storeToken",
      methodsName: "userInfo",
      params: [walletAddress],
    });
    if (result.value) {
      if (result.value[0] == ethers.constants.AddressZero) {
        setInviteShow(true);
      }
    }
  };
  isInviterFn();
  return (
    <div className="app">
      <div className="body">
        <AppRouter />
      </div>

      <div className="bottom">
        {walletAddress && showTab && <TaBbarBottom />}
      </div>
    </div>
  );
}

export default App;
