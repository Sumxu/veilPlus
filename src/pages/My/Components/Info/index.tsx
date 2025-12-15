import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import jifen from "@/assets/my/jifen.png";
import tusd from "@/assets/my/tusd.png";
import { t } from "i18next";
import WithdrawPopup from "@/components/Popup/WithdrawPopup";
import ConversionPopup from "@/components/Popup/ConversionPopup";
import ContractSend from "@/Hooks/ContractSend.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { fromWei ,Totast} from "@/Hooks/Utils";
import { Button } from "antd-mobile";
import { userAddress } from "@/Store/Store.ts";
const Info: React.FC = ({ data, taxBalance, onUpData }) => {
  const navigate = useNavigate();
  const [withDrawShow, setWithDrawShow] = useState<boolean>(false); //提现
  const walletAddress = userAddress((state) => state.address);
  const [conversionShow, setConversionShow] = useState<boolean>(false); //互转
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [rewarInfo, setRewarInfo] = useState({});
  const withDrawShowClick = () => {
    setWithDrawShow(true);
  };
  const conversionShowClick = () => {
    setConversionShow(true);
  };
  const withDrawShowCloseClick = () => {
    setWithDrawShow(false);
    onUpData();
  };
  //释放
  const releaseFn = async () => {
    if (rewarInfo.claimIntegral.isZero()) {
      return Totast(t("没有可释放值"), "info");
    }
    setSubmitLoading(true);
    const result = await ContractSend({
      tokenName: "storeToken",
      methodsName: "release",
      params: [],
    });
    setSubmitLoading(false);
    if (result.value) {
      onUpData();
      getRewardFn();
    }
  };
  //查询可释放数据
  const getRewardFn = async () => {
    const result = await ContractRequest({
      tokenName: "storeToken",
      methodsName: "reward",
      params: [walletAddress],
    });
    console.log("result=1=",result)
    if (result.value) {
      setRewarInfo(result.value);
    }
  };
  useEffect(() => {
    getRewardFn();
  }, []);
  return (
    <>
      <div className="my-info-box">
        <div className="info-number-option">
          <div className="info-number-item">
            <div className="number-option">{fromWei(data.tusd)}</div>
            <div className="txt-option">TUSD{t("余额")}</div>
          </div>
          <div className="info-number-line"></div>
          <div className="info-number-item">
            <div className="number-option">{fromWei(data.usd)}</div>
            <div className="txt-option">USD{t("余额")}</div>
          </div>
        </div>
        <div className="btn-box">
          <div
            className="btn-option btn-withdraw"
            onClick={() => withDrawShowClick()}
          >
            {t("提现")}
          </div>
        </div>
        <div className="info-tax-balance-box">
          <div className="info-tax-balance-option">
            <div className="topCenterInfo">
              <div className="left-option">
                <img className="icon" src={jifen} />
                <div className="left-info-item">
                  <div className="number-option">{fromWei(data.integral)}</div>
                  <div className="txt-option">{t("待释放积分")}</div>
                </div>
              </div>
              <Button
                className="right-option-btn"
                loading={submitLoading}
                loadingText={t("确认中")}
                onClick={() => releaseFn()}
              >
                {t("释放")}
              </Button>
            </div>
            <div className="endCenterInfo">
              <div className="txtOption">
                <span className="label">{t('可获得积分')}:</span>
                <span className="value">
                  {fromWei(rewarInfo.claimIntegral)}
                </span>
              </div>
              <div className="txtOption">
                <span className="label">{t('可获得')}USD:</span>
                <span className="value">
                  {fromWei(rewarInfo.usd)}
                </span>
              </div>
              <div className="txtOption">
                <span className="label">{t('可获得')}TUSD:</span>
                <span className="value">
                  {fromWei(rewarInfo.tusd)}
                </span>
              </div>
            </div>
          </div>
          <div className="info-tax-line"></div>
          <div className="info-tax-balance-option">
            <div className="topCenterInfo">
              <div className="left-option">
                <img className="icon" src={tusd} />
                <div className="left-info-item">
                  <div className="number-option">{fromWei(taxBalance)}</div>
                  <div className="txt-option">TAX{t("余额")}</div>
                </div>
              </div>
              <Button
                className="right-option-btn"
                onClick={() => navigate("/assetDetails")}
              >
                {t("资产明细")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* <ConversionPopup
        isShow={conversionShow}
        onClose={() => setConversionShow(false)}
      ></ConversionPopup> */}
      <WithdrawPopup
        isShow={withDrawShow}
        onClose={() => withDrawShowCloseClick()}
      ></WithdrawPopup>
    </>
  );
};
export default Info;
