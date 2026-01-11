import "./index.scss";
import { useEffect, useState, type FC } from "react";
import HeaderFixedLogin from "@/components/HeaderFixedLogin";
import HomeTopBox from "@/pages/Tabbar/Home/Components/HomeTopBox";
import HomCenterBox from "@/pages/Tabbar/Home/Components/HomeCenterBox";
import HomeEndBox from "./Components/HomeEndBox";
import InviteModal from "@/components/InviteModal";
import { userAddress } from "@/Store/Store.ts";
import { ethers } from "ethers";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { storage } from "@/Hooks/useLocalStorage";

const Home: FC = () => {
  const [inviteShow, setInviteShow] = useState<boolean>(false);
  const walletAddress = userAddress((state) => state.address);
  const [invite, setInvite] = useState<string | null>(null); // 新增 invite 状态

  /**
   *
   * @returns 当前用户是否存在上级
   */
  const isInviterFn = async () => {
    // 1️⃣ 先检查 URL 是否有 invite 参数
    const params = new URLSearchParams(location.search);
    const inviteParam = params.get("invite");
    if (inviteParam) {
      setInvite(inviteParam); // 保存到 state
      storage.set("invite", inviteParam); // 可选：存本地
    }

    if (!walletAddress) return; // 地址不存在不查
    const result = await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "userInfo",
      params: [walletAddress],
    });
    if (result.value) {
      if (result.value[0] == ethers.constants.AddressZero) {
        setInviteShow(true);
      }
    }
  };
  useEffect(() => {
    isInviterFn();
  }, []);
  return (
    <div className="homePageBox">
      <HeaderFixedLogin></HeaderFixedLogin>
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
