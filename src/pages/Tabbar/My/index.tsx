import "./index.scss";
import Tools from "./Components/Tools";
import Info from "./Components/Info";
import WalletHeader from "./Components/WalletHeader";
import { useEffect, useState } from "react";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber } from "ethers";
import type { PendIngInfo } from "@/Ts/PendIngInfo";

interface userInfo {
  level: BigNumber;
  isNode: boolean;
}
const My: React.FC = () => {
  const walletAddress = userAddress((state) => state.address);
  const [userInfo, setUserInfo] = useState({});
  const [usdtBalance, setUsdtBalance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [viplBalance, setViplBalance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [pendingInfo, setPendIngInfo] = useState<PendIngInfo>({});

  const getUserInfo = async () => {
    const result = await ContractRequest({
      tokenName: "vailPlusUserToken",
      methodsName: "userInfo",
      params: [walletAddress],
    });
    if (result.value) {
      const data = {
        level: result.value.level,
        isNode: result.value.isNode,
      };
      setUserInfo(data);
    }
  };
  const getUsdtBalance = async () => {
    const result = await ContractRequest({
      tokenName: "veilPlusToken",
      methodsName: "balanceOf",
      params: [walletAddress],
    });
    if (result.value) {
      setViplBalance(result.value);
    }
  };
  const getViplBalance = async () => {
    const result = await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "balanceOf",
      params: [walletAddress],
    });
    if (result.value) {
      setUsdtBalance(result.value);
    }
  };
  const getPending = async () => {
    const result = await ContractRequest({
      tokenName: "VailPlusPool",
      methodsName: "pending",
      params: [walletAddress],
    });
    if (result.value) {
      const data = {
        rewardValue: result.value.rewardValue,
        releaseValue: result.value.releaseValue,
        totalRewardValue: result.value.totalRewardValue,
        totalReleaseValue: result.value.totalReleaseValue,
      };
      setPendIngInfo(data);
    }
  };
  const onChange = () => {
    getUsdtBalance();
    getViplBalance();
    getPending(); //查询静态收益
  };
  useEffect(() => {
    getUserInfo();
    getUsdtBalance();
    getViplBalance();
    getPending(); //查询静态收益
  }, []);
  return (
    <div className="myPage">
      <WalletHeader userInfo={userInfo}></WalletHeader>
      <Info
        pendingInfo={pendingInfo}
        usdtBalance={usdtBalance}
        viplBalance={viplBalance}
        onChange={() => onChange()}
      ></Info>
      <Tools userInfo={userInfo}></Tools>
    </div>
  );
};
export default My;
