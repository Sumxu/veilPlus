import "./index.scss";
import Tools from "./Components/Tools";
import Info from "./Components/Info";
import WalletHeader from "./Components/WalletHeader";
import { useEffect, useState } from "react";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber } from "ethers";
import right from "@/assets/basic/right.png";
import type { PendIngInfo } from "@/Ts/PendIngInfo";
import { storage } from "@/Hooks/useLocalStorage";
import { ensureWalletConnected } from "@/Hooks/WalletHooks";
import swapIcon from "@/assets/basic/swapIcon.jpg";

import { useNavigate } from "react-router-dom";
interface userInfo {
  level: BigNumber;
  isNode: boolean;
}
const My: React.FC = () => {
  const navigate = useNavigate();
  const walletAddress = storage.get("address");
  const [userInfo, setUserInfo] = useState({});
  const [usdtBalance, setUsdtBalance] = useState<BigNumber>(
    BigNumber.from("0"),
  );
  const [level, setLevel] = useState<BigNumber>(BigNumber.from("0"));
  const [viplBalance, setViplBalance] = useState<BigNumber>(
    BigNumber.from("0"),
  );
  const [pendingInfo, setPendIngInfo] = useState<PendIngInfo>({});
  const getUserInfo = async () => {
    const result = await ContractRequest({
      tokenName: "vailPlusUserToken",
      methodsName: "userInfo",
      params: [walletAddress],
    });
    console.log("getUserInfo",result)
    if (result.value) {
      const data = {
        level: result.value.level,
        isNode: result.value.isNode,
      };
      setUserInfo(data);
      setTimeout(() => {
        getUsdtBalance();
      }, 1000);
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
      setTimeout(() => {
        getViplBalance();
      }, 1000);
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
      setTimeout(() => {
        getLeavel();
      }, 1000);
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
  const getLeavel = async () => {
    const result = await ContractRequest({
      tokenName: "vailPlusUserToken",
      methodsName: "getUserLevel",
      params: [walletAddress],
    });
    console.log("result==",result)
    if (result.value) {
      setLevel(result.value);
      setTimeout(() => {
        getPending(); //查询静态收益
      }, 1000);
    }
  };
  const onChange = () => {
    getUsdtBalance();
    getViplBalance();
    getPending(); //查询静态收益
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div className="myPage">
      <WalletHeader userInfo={userInfo} level={level}></WalletHeader>
      <Info
        pendingInfo={pendingInfo}
        usdtBalance={usdtBalance}
        viplBalance={viplBalance}
        onChange={() => onChange()}
      ></Info>
      <div className="myPageContent">
        <div className="swapCardBox" onClick={() => navigate("/Swap")}>
          <img src={swapIcon} className="swapIcon"></img>
          <span className="txt">Ave Swap</span>
          {/* <img src={right} className="rightIcon"></img> */}
        </div>
        <Tools userInfo={userInfo}></Tools>
      </div>
    </div>
  );
};
export default My;
