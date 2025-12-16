import { useEffect, useState } from "react";
import "./App.css";
import { ensureWalletConnected, listenWalletEvents } from "@/Hooks/WalletHooks";
import { userAddress } from "@/Store/Store.ts";
import { Spin } from "antd";
import { storage } from "@/Hooks/useLocalStorage";
import EnvManager from "@/config/EnvManager";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import InviteModal from "@/components/InviteModal";
import { ethers } from "ethers";
import AppRouter from "@/router/index";
EnvManager.print()
function App() {
  const [invite, setInvite] = useState<string | null>(null); // 新增 invite 状态
  // 1️⃣ 先检查 URL 是否有 invite 参数
  const params = new URLSearchParams(location.search);
  const inviteParam = params.get("invite");
  if (inviteParam) {
    setInvite(inviteParam); // 保存到 state
    storage.set("invite", inviteParam); // 可选：存本地
  }
  const walletAddress = userAddress((state) => state.address);
  const [loading, setLoading] = useState(true);
  const [inviteShow, setInviteShow] = useState<boolean>(false);
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
  const isInviterFn = async () => {
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
  // isInviterFn();
  return (
    <>
      {walletAddress ? (
        <AppRouter />
      ) : (
        <div className="loding">
          <div>请先连接钱包</div>
        </div>
      )}
      <InviteModal
        isShow={inviteShow}
        onClose={() => setInviteShow(false)}
      ></InviteModal>
    </>
  );
}

export default App;
