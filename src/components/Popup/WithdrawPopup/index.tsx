import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Popup, Input } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import popupHintIcon from "@/assets/popup/popupHintIcon.png";
import { t } from "i18next";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import ContractList from "@/Contract/Contract";
import { fromWei, Totast, toWei } from "@/Hooks/Utils";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber, utils } from "ethers";
import { Button } from "antd-mobile";
import ContractSend from "@/Hooks/ContractSend.ts";
const MyPopup: React.FC = ({ isShow, onClose }) => {
  const [userInfo, setUserInfo] = useState({}); //用户信息
  const walletAddress = userAddress((state) => state.address);
  const [rate, setRate] = useState<BigNumber>(BigNumber.from(0));
  const [inputNumber, setInputNumber] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [getTaxNumber, setGetTaxNumber] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [isFocus, setIsFocus] = useState(false); // ✅ 是否获得焦点
  const onCloseChange = () => {
    onClose();
  };
  //兑换比例
  const getTusdSwap = async () => {
    const paramsData = [
      toWei(1),
      [ContractList["USDTToken"].address, ContractList["TaxToken"].address],
    ];
    const result = await ContractRequest({
      tokenName: "swapRouterToken",
      methodsName: "getAmountsOut",
      params: paramsData,
    });
    if (result.value) {
      const usdtIn = result.value[0]; // 1 USDT
      const taxOut = result.value[1]; // 能换多少 TAX
      // 计算兑换比例
      const rate = fromWei(taxOut); // 比例：1 USDT = rate TAX
      console.log("兑换比例: 1 USDT =", rate, "TAX");
      setRate(taxOut);
    }
  };

  const getUserInfo = async () => {
    const result = await ContractRequest({
      tokenName: "storeToken",
      methodsName: "userInfo",
      params: [walletAddress],
    });
    if (result.value) {
      setUserInfo(result.value);
    }
  };
  const inputChange = (val) => {
    setInputNumber(val);
    // 空或 <=0
    if (!val || Number(val) <= 0) {
      setGetTaxNumber(BigNumber.from(0));
      return;
    }
    try {
      /**
       * 1) USDT 输入转 wei（保持整数）
       * parseUnits("105.3936", 18)
       * 得到 105.3936 * 1e18 的 BigNumber
       */
      const usdtWei = utils.parseUnits(val, 18); // BigNumber

      /**
       * 2) rate 必须是 18 decimals（你的 rate 应该是 parseUnits 出来的）
       * 比如 rate=0.1 → parseUnits("0.1", 18)
       */
      const rateWei = BigNumber.from(rate.toString());
      /**
       * 3) TAX = usdtWei * rateWei / 1e18
       * 中间结果是 36 位精度，再 / 1e18
       */
      const taxWei = usdtWei.mul(rateWei).div(utils.parseUnits("1", 18));
      // 保存（wei）
      setGetTaxNumber(taxWei);
    } catch (error) {
      console.error("转换错误:", error);
    }
  };

  //确认提现
  const submitClick = async () => {
    if (inputNumber == "") {
      return Totast(t("请输入"), "info");
    }
    if (!/^\d+(\.\d+)?$/.test(inputNumber))
      return Totast(t("输入格式不正确"), "info");
    const decimals = 18; // 根据 token 实际 decimals
    let amount: BigNumber;
    try {
      amount = utils.parseUnits(inputNumber, decimals); // 返回 ethers.BigNumber
    } catch (err) {
      return Totast(t("输入超出精度范围"), "info");
    }

    if (amount.gt(userInfo.tusd)) {
      return Totast(t("余额不足"), "info");
    }
    setSubmitLoading(true);
    const submitResult = await ContractSend({
      tokenName: "storeToken",
      methodsName: "withdraw",
      params: [amount],
    });
    setSubmitLoading(false);
    if (submitResult.value) {
      onClose();
    }
  };
  useEffect(() => {
    if (isShow == false) return;
    getTusdSwap(); //获取兑换比例
    getUserInfo(); //获取用户信息
  }, [isShow]);
  return (
    <>
      <Popup
        visible={isShow}
        onClose={() => {
          onCloseChange();
        }}
      >
        <div className="my-popup-page">
          <div className="header-option">
            <div className="title">{t("提现")}</div>
            <div className="close-icon" onClick={() => onCloseChange()}>
              <CloseOutline fontSize={12} color="#969797" />
            </div>
          </div>
          <div className="tag-box">
            <img src={popupHintIcon} className="icon"></img>
            <div className="txt-option">
              {t("兑换比例")}：1.00 TUSD ≈ {fromWei(rate, 18, true, 2)}
            </div>
          </div>
          <div className="input-box">
            <div className="input-hint-txt-option">
              <div className="txt-option">{t("提现数量")}:</div>
              <div className="txt-option right-txt">
                {t("余额")}:{fromWei(userInfo.tusd)} TUSD
              </div>
            </div>
            <div className={`input-option ${isFocus ? "input-focus" : ""}`}>
              <Input
                placeholder={t("请输入内容")}
                value={inputNumber}
                onChange={(val) => {
                  inputChange(val);
                }}
                onFocus={() => setIsFocus(true)} // ✅ 获得焦点
                onBlur={() => setIsFocus(false)} // ✅ 失去焦点
                clearable
                className="input-class"
              />
              <div className="input-txt">TUSD</div>
            </div>
          </div>

          <div className="input-box">
            <div className="input-hint-txt-option">
              <div className="txt-option">{t("预计获得")}TAX:</div>
            </div>
            <div className="input-option input-no">
              <div className="input-number">{fromWei(getTaxNumber)}</div>
              <div className="input-txt">TAX</div>
            </div>
          </div>
          <Button
            loading={submitLoading}
            loadingText={t("确认中")}
            className="btn-withdraw-submit"
            onClick={() => {
              submitClick();
            }}
          >
            {t("确认提现")}
          </Button>
        </div>
      </Popup>
    </>
  );
};
export default MyPopup;
