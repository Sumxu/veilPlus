import "./index.scss";
import { useEffect, useState, type FC } from "react";
import DrawPopup from "@/components/Popup/DrawPopup";
import TeamPopup from "@/components/Popup/TeamPopup";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import ContractRequest from "@/Hooks/ContractRequest";
import { userAddress } from "@/Store/Store";
import type { UserInfo } from "@/Ts/UserInfo";
import type { PendIngInfo } from "@/Ts/PendIngInfo";
import { fromWei, Totast } from "@/Hooks/Utils";
import ContractSend from "@/Hooks/ContractSend.ts";
import { Button } from "antd-mobile";
import { storage } from "@/Hooks/useLocalStorage";
import { BigNumber } from "ethers";
const Card: FC = ({ listChange }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const walletAddress = storage.get('address');
  const [isTeamShow, setIsTeamShow] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [poolUserInfo, setPoolUserInfo] = useState<UserInfo>({});
  const [pendingInfo, setPendIngInfo] = useState<PendIngInfo>({});
  const [teamIng, setTeamIng] = useState<BigNumber>(BigNumber.from("0"));
  const [totalAmount, setTotalAmount] = useState<BigNumber>(
    BigNumber.from("0"),
  );
  const navigate = useNavigate();

  const openShow = () => {
    setIsShow(true);
  };
  const openTeamShow = () => {
    setIsTeamShow(true);
  };
  const onClose = () => {
    setIsShow(false);
    getUserInfo();
  };
  const teamOnClose = () => {
    setIsTeamShow(false);
    getUserInfo();
  };
  /** 查询用户信息 */
  const getUserInfo = async () => {
    if (!walletAddress) return;
    const result = await ContractRequest({
      tokenName: "VailPlusPool",
      methodsName: "userInfo",
      params: [walletAddress],
    });
    if (result.value) {
      setUserInfo({
        usdtValue: result.value.usdtValue,
        gasValues: result.value.gasValues,
        rewardTotalValue: result.value.rewardTotalValue,
      });
      setTimeout(() => {
        getTeamPending();
      }, 1000);
    }
  };
  /** 查询待领取收益 */
  const getPending = async () => {
    if (!walletAddress) return;

    const result = await ContractRequest({
      tokenName: "VailPlusPool",
      methodsName: "pending",
      params: [walletAddress],
    });
    if (result.value) {
      setPendIngInfo({
        rewardValue: result.value.rewardValue,
        releaseValue: result.value.releaseValue,
        totalRewardValue: result.value.totalRewardValue,
        totalReleaseValue: result.value.totalReleaseValue,
      });
    }
  };
  //查询pool的团队奖励
  const getPoolUserInfo = async () => {
    const result = await ContractRequest({
      tokenName: "VailPlusPool",
      methodsName: "userInfo",
      params: [walletAddress],
    });
    if (result.value) {
      const data: UserInfo = {
        usdtValue: result.value.usdtValue,
        gasValues: result.value.gasValues,
        rewardTotalValue: result.value.rewardTotalValue,
        claimTeamTotalValue: result.value.claimTeamTotalValue,
        claimTeamTotalUsdtValue: result.value.claimTeamTotalUsdtValue,
        rewardTotalUsdtValue: result.value.rewardTotalUsdtValue,
      };
      setPoolUserInfo(data);
    }
  };

  const totalValue = () => {
    return safeBN(poolUserInfo?.claimTeamTotalUsdtValue).add(
      safeBN(poolUserInfo?.rewardTotalUsdtValue),
    );
  };
  const BN0 = BigNumber.from(0);
  const safeBN = (val: any) => (BigNumber.isBigNumber(val) ? val : BN0);
  //团队领取弹窗用的是erc20Value
  const getTeamPending = async () => {
    const result = await ContractRequest({
      tokenName: "VailPlusPool",
      methodsName: "teamPending",
      params: [walletAddress],
    });
    if (result.value) {
      setTeamIng(result.value.usdtValue);
      setTimeout(() => {
        getPoolUserInfo();
      }, 1000);
    }
  };
  useEffect(() => {
    if (
      teamIng &&
      poolUserInfo.claimTeamTotalUsdtValue &&
      poolUserInfo.rewardTotalUsdtValue
    ) {
      setTotalAmount(totalValue());
    }
  }, [
    poolUserInfo.claimTeamTotalUsdtValue,
    poolUserInfo.rewardTotalUsdtValue,
  ]);
  /** 初始化 + 定时轮询 pending（1 秒） */
  useEffect(() => {
    if (!walletAddress) return;
    // 进页面先查一次
    getUserInfo();
    getPending();
    // 每 1 秒查询一次 pending
    const timer = setInterval(() => {
      getPending();
    }, 3000);
    // 组件卸载时清理定时器
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className="CardPage">
      <div className="headerTopBox">
        <div>
          <div className="txtOption">
            <div className="txt">{t("捐赠额度")}</div>
            <div className="txt">{t("总累计收益")}</div>
          </div>
          <div className="txtOption txtOptionMt4">
            <div className="txt">{fromWei(userInfo.usdtValue)} USDT</div>
            <div className="txt">{fromWei(totalAmount)} USDT</div>
          </div>
        </div>

        <div style={{ marginTop: "12px" }}>
          <div className="txtOption">
            <div className="txt">{t("剩余额度")}</div>
          </div>
          <div className="txtOption txtOptionMt4">
            <div className="txt">{fromWei(userInfo.gasValues)} USDT</div>
          </div>
        </div>
      </div>

      <div className="headerEndBox">
        <div className="headerBottomBorder">
          <div className="endBox">
            <div className="leftOption">
              <div className="hintTitle colorBlack">{t("实时捐赠收益")}</div>
              <div className="hintNumber colorBlack">
                {fromWei(pendingInfo.totalReleaseValue)} USDT
              </div>
            </div>

            <div className="leftOption">
              <div className="hintTitle rightTxt">{t("捐赠收益")}</div>
              <div className="hintNumber">
                {fromWei(pendingInfo.releaseValue)} USDT
              </div>
            </div>
          </div>

          <div className="endBox">
            <div className="btn btnOne" onClick={() => navigate("/OutputList")}>
              {t("记录")}
            </div>
            <div className="btn btnTwo" onClick={openShow}>
              {t("领取")}
            </div>
          </div>
        </div>

        <div className="top12">
          <div className="endBox">
            <div className="leftOption">
              <div className="hintTitle colorBlack">
                {t("累计领取社区奖励")}
              </div>
              <div className="hintNumber colorBlack">
                {fromWei(poolUserInfo.claimTeamTotalUsdtValue)} USDT
              </div>
            </div>

            <div className="leftOption">
              <div className="hintTitle rightTxt">{t("待领取社区奖励")}</div>
              <div className="hintNumber">{fromWei(teamIng)} USDT</div>
            </div>
          </div>

          <div className="endBox">
            <div className="btn btnOne" onClick={() => navigate("/TeamReward")}>
              {t("记录")}
            </div>
            <div className="btn btnTwo" onClick={openTeamShow}>
              {t("领取")}
            </div>
          </div>
        </div>
      </div>

      <DrawPopup isShow={isShow} onClose={onClose} pendingInfo={pendingInfo} />
      <TeamPopup isShow={isTeamShow} onClose={teamOnClose} />
    </div>
  );
};

export default Card;
