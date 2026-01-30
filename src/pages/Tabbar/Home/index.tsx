import "./index.scss";
import { useEffect, useState, type FC } from "react";
import HeaderFixedLogin from "@/components/HeaderFixedLogin";
import type { HeaderFixedLoginRef } from "@/components/HeaderFixedLogin";
import HomeTopBox from "@/pages/Tabbar/Home/Components/HomeTopBox";
import HomCenterBox from "@/pages/Tabbar/Home/Components/HomeCenterBox";
import HomeEndBox from "./Components/HomeEndBox";
import InviteModal from "@/components/InviteModal";
import { userAddress } from "@/Store/Store.ts";
import { ethers } from "ethers";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { storage } from "@/Hooks/useLocalStorage";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

const Home: FC = () => {
  const location = useLocation();
  const headerRef = useRef<HeaderFixedLoginRef>(null);
  const [inviteShow, setInviteShow] = useState<boolean>(false);
  const [invite, setInvite] = useState<string | null>(null); // 新增 invite 状态
  /**
   *
   * @returns 当前用户是否存在上级
   */
  const isInviterFn = async (address) => {
    const inviteParam = storage.get("invite");
    if (inviteParam) {
      setInvite(inviteParam); // 保存到 state
    }
    if (!address) return; // 地址不存在不查
    const result = await ContractRequest({
      tokenName: "vailPlusUserToken",
      methodsName: "userInfo",
      params: [address],
    });
    if (result.value) {
      if (result.value[0] == ethers.constants.AddressZero) {
        setInviteShow(true);
      }
    }
  };
  const initLogin = () => {
    setInviteShow(false);
    headerRef.current?.initWallet();
  };
  const onLoginSuccess = (address) => {
    isInviterFn(address);
  };
  const initInviter = () => {
    // 1️⃣ 先检查 URL 是否有 invite 参数
    const params = new URLSearchParams(location.search);
    const inviteParam = params.get("invite");
    if (inviteParam) {
      setInvite(inviteParam); // 保存到 state
      storage.set("invite", inviteParam); // 可选：存本地
    }
  };
  useEffect(() => {
    initLogin();
    initInviter();
  }, [location]);
  return (
    <div className="homePageBox">
      <HeaderFixedLogin
        ref={headerRef}
        onLoginSuccess={onLoginSuccess}
      ></HeaderFixedLogin>
      <HomeTopBox></HomeTopBox>
      <HomCenterBox></HomCenterBox>
      <HomeEndBox></HomeEndBox>
      <InviteModal
        isShow={inviteShow}
        onClose={() => setInviteShow(false)}
      ></InviteModal>
    </div>
  );
};
export default Home;
