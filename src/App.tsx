import { Spin } from "antd";
import { useLocation } from "react-router-dom";
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
  const walletAddress = userAddress((s) => s.address);
  const noLoginPage = !["/nft", "/"].includes(location.pathname);
  const [inviteShow, setInviteShow] = useState<boolean>(true);
  // const clearFn = () => {
  //   storage.remove("token");
  //   storage.remove("editAddressInfo");
  //   storage.remove("payMethodName");
  //   storage.remove("checkAddress");
  // };
  // // 统一监听钱包事件
  // useWalletListener({
  //   onAccountsChanged: () => {
  //     clearFn();
  //     window.location.href = "/login"; // 更保险，不会出现 React 状态问题
  //   },
  //   onDisconnected: () => {
  //     clearFn();
  //     window.location.href = "/login";
  //   },
  //   onChainChanged: () => {
  //     window.location.reload();
  //   },
  // });
  // if (!ready) {
  //   return (
  //     <div className="loading">
  //       <Spin />
  //     </div>
  //   );
  // }
  //判断邀请人
  const isInviterFn = async () => {
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
    </div>
  );
}

export default App;
