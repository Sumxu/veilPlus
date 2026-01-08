import "./index.scss";
import { useEffect, useState, type FC } from "react";
import DrawPopup from "@/components/Popup/DrawPopup";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import ContractSend from "@/Hooks/ContractSend.ts";
import { userAddress } from "@/Store/Store.ts";
import type { UserInfo } from "@/Ts/UserInfo";
import type { PendIngInfo } from "@/Ts/PendIngInfo";
import { fromWei } from "@/Hooks/Utils";
const Card: FC = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const walletAddress = userAddress((state) => state.address);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [pendingInfo, setPendIngInfo] = useState<PendIngInfo>({});
  const navigate = useNavigate();
  const openShow = () => {
    setIsShow(true);
  };
  const onClose = () => {
    setIsShow(false);
  };
  const getUserInfo = async () => {
    // 当前钱包地址
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
      };
      setUserInfo(data);
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
  useEffect(() => {
    getUserInfo(); //查询用户信息
    getPending(); //查询静态收益
  }, []);
  return (
    <div className="CardPage">
      <div className="headerTopBox">
        <div>
          <div className="txtOption">
            <div className="txt">{t("累计捐赠")}</div>
            <div className="txt">{t("累计收益")}</div>
          </div>
          <div className="txtOption txtOptionMt4">
            <div className="txt">{fromWei(userInfo.usdtValue)} USDT</div>
            <div className="txt">{fromWei(userInfo.rewardTotalValue)} VIPL</div>
          </div>
        </div>
        <div style={{ marginTop: "12px" }}>
          <div className="txtOption">
            <div className="txt">{t("剩余动静额度")}</div>
          </div>
          <div className="txtOption txtOptionMt4">
            <div className="txt">{fromWei(userInfo.usdtValue)} USDT</div>
          </div>
        </div>
      </div>

      <div className="headerEndBox">
        <div className="endBox">
          <div className="leftOption">
            <div className="hintTitle">{t("待领取收益")}</div>
            <div className="hintNumber">
              {fromWei(pendingInfo.rewardValue)} VIPL
            </div>
          </div>
          <div className="leftOption">
            <div className="hintTitle colorBlack">{t("总待领取收益")}</div>
            <div className="hintNumber colorBlack">
              {fromWei(pendingInfo.totalRewardValue)} VIPL
            </div>
          </div>
        </div>
        <div className="endBox">
          <div className="btn btnOne" onClick={() => navigate("/OutputList")}>
            {t("记录")}
          </div>
          <div className="btn btnTwo" onClick={() => openShow()}>
            {t("领取")}
          </div>
        </div>
      </div>
      <DrawPopup
        isShow={isShow}
        onClose={onClose}
        pendingInfo={pendingInfo}
      ></DrawPopup>
    </div>
  );
};
export default Card;
