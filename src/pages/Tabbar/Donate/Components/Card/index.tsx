import "./index.scss";
import { useEffect, useState, type FC } from "react";
import DrawPopup from "@/components/Popup/DrawPopup";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import ContractRequest from "@/Hooks/ContractRequest";
import { userAddress } from "@/Store/Store";
import type { UserInfo } from "@/Ts/UserInfo";
import type { PendIngInfo } from "@/Ts/PendIngInfo";
import { fromWei } from "@/Hooks/Utils";

const Card: FC = ({listChange}) => {
  const [isShow, setIsShow] = useState(false);
  const walletAddress = userAddress((state) => state.address);

  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [pendingInfo, setPendIngInfo] = useState<PendIngInfo>({});

  const navigate = useNavigate();

  const openShow = () => {
    setIsShow(true);
  };

  const onClose = () => {
    setIsShow(false);
    getUserInfo();
    getPending();
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
  }, [walletAddress]);

  return (
    <div className="CardPage">
      <div className="headerTopBox">
        <div>
          <div className="txtOption">
            <div className="txt">{t("累计捐赠")}</div>
            <div className="txt">{t("累计收益")}</div>
          </div>
          <div className="txtOption txtOptionMt4">
            <div className="txt">
              {fromWei(userInfo.usdtValue)} USDT
            </div>
            <div className="txt">
              {fromWei(userInfo.rewardTotalValue)} VIPL
            </div>
          </div>
        </div>

        <div style={{ marginTop: "12px" }}>
          <div className="txtOption">
            <div className="txt">{t("剩余动静额度")}</div>
          </div>
          <div className="txtOption txtOptionMt4">
            <div className="txt">
              {fromWei(userInfo.usdtValue)} USDT
            </div>
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
            <div className="hintTitle colorBlack">
              {t("总待领取收益")}
            </div>
            <div className="hintNumber colorBlack">
              {fromWei(pendingInfo.totalRewardValue)} VIPL
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

      <DrawPopup
        isShow={isShow}
        onClose={onClose}
        pendingInfo={pendingInfo}
      />
    </div>
  );
};

export default Card;