import { fromWei, Totast } from "@/Hooks/Utils";
import "./index.scss";
import { RightOutline } from "antd-mobile-icons";
import { t } from "i18next";
import { Button } from "antd-mobile";
import ContractSend from "@/Hooks/ContractSend.ts";
import { useState, type FC } from "react";

const Info: React.FC = ({ pendingInfo, viplBalance, usdtBalance,onChange}) => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  //确认提现
  const submitClick = async () => {
    if (pendingInfo.rewardValue.isZero()) {
      return Totast("不可领取", "info");
    }
    try {
      setSubmitLoading(true);
      const result = await ContractSend({
        tokenName: "VailPlusPool",
        methodsName: "reward",
        params: [],
      });
      if (result.value) {
        onChange()
      }
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  };
  return (
    <div className="InfoPage">
      <div className="infoBox">
        <div className="detailList">
          <div className="txt">{t("资产明细")}</div>
          <RightOutline color="#fff" fontSize={12} />
        </div>
        <div className="hintTxt">{t("资产中心")}</div>
        <div className="numberBox">
          <div className="numberItem">
            <div className="itemTxt">VIPL{t("余额")}</div>
            <div className="itemNumber">{fromWei(viplBalance)}</div>
          </div>
          <div className="line"></div>
          <div className="numberItem numberTwoItem">
            <div className="itemTxt">USDT{t("余额")}</div>
            <div className="itemNumber">{fromWei(usdtBalance)}</div>
          </div>
        </div>
        <div className="infoEnd">
          <div className="leftOption">
            <div className="txt">{t("待领取挖矿收益")}:</div>
            <div className="number">{fromWei(pendingInfo.rewardValue)}</div>
          </div>
          <Button
            className="btn"
            loading={submitLoading}
            loadingText={t("确认中")}
            onClick={() => {
              submitClick();
            }}
          >
            {t("领取")}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Info;
