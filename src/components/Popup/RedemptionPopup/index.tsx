import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Popup, Input, Button } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import ContractSend from "@/Hooks/ContractSend.ts";
import popupHintIcon from "@/assets/popup/popupHintIcon.png";
import ContractList from "@/Contract/Contract.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { t } from "i18next";
import { BigNumber, ethers, utils } from "ethers";
import { fromWei, Totast, toWei } from "@/Hooks/Utils";
const RedemptionPopup: React.FC = ({ isShow, onClose }) => {
  const walletAddress = userAddress((state) => state.address);
  const [inputNumber, setInputNumber] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false); // ✅ 是否获得焦点
  const [taxBalance, setTaxBalance] = useState<BigNumber>(BigNumber.from(0)); //tax余额
  const [dayRate, setDayRate] = useState<BigNumber>(BigNumber.from(0)); //预计日收益

  const onCloseChange = () => {
    onClose();
  };
  //获取tax余额
  const getTaxBalance = async () => {
    const taxResult = await ContractRequest({
      tokenName: "TaxToken",
      methodsName: "balanceOf",
      params: [walletAddress],
    });
    if (taxResult.value) {
      setTaxBalance(taxResult.value);
    }
  };
  //获取日收益
  const getDayRate = async () => {
    const dayRateResult = await ContractRequest({
      tokenName: "TaxPool",
      methodsName: "dayRate",
      params: [],
    });
    if (dayRateResult.value) {
      setDayRate(dayRateResult.value);
    }
  };
  //提交质押
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

    if (amount.gt(taxBalance)) {
      return Totast(t("余额不足"), "info");
    }
    //开始授权 进行购买
    let applyAmount: BigNumber = BigNumber.from(0);
    let isApply = false;
    //授权
    setSubmitLoading(true);
    try {
      setSubmitLoading(true);
      // 1. 获取 allowance（返回 BigNumber）
      const res = await ContractRequest({
        tokenName: "TaxToken",
        methodsName: "allowance",
        params: [walletAddress, ContractList["TaxPool"].address],
      });

      const applyAmount = BigNumber.from(res?.value || "0");
      let isApply = false;
      // 2. 判断授权是否足够
      if (applyAmount.lt(amount)) {
        // 需要授权
        const approveRes = await ContractSend({
          tokenName: "TaxToken",
          methodsName: "approve",
          params: [
            ContractList["TaxPool"].address,
            ethers.constants.MaxUint256,
          ],
        });
        // approve 一般返回 tx 对象或 hash
        if (approveRes?.value) {
          isApply = true;
        } else {
          setSubmitLoading(false);
          return;
        }
      } else {
        // 已经足够授权
        isApply = true;
      }
      // 3. 最终检查
      if (!isApply) {
        setSubmitLoading(false);
        return;
      }
      //交易
      const submitResult = await ContractSend({
        tokenName: "TaxPool",
        methodsName: "deposit",
        params: [amount],
      });
      setSubmitLoading(false);

      if (submitResult.value) {
        setSubmitLoading(false);
        onClose();
      }
    } catch (e) {
      setSubmitLoading(false);
      console.error(e);
      Totast(t("发生异常，请稍后重试"), "error");
    }
  };
  useEffect(() => {
    if (!isShow) return;
    getTaxBalance();
    getDayRate();
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
            <div className="title">{t("质押")}</div>
            <div className="close-icon" onClick={() => onCloseChange()}>
              <CloseOutline fontSize={12} color="#969797" />
            </div>
          </div>

          <div className="input-box">
            <div className="input-hint-txt-option">
              <div className="txt-option">{t("质押TAX")}:</div>
              <div className="txt-option right-txt">
                {t("余额")}：{fromWei(taxBalance)}
              </div>
            </div>
            <div className={`input-option ${isFocus ? "input-focus" : ""}`}>
              <Input
                placeholder={t("请输入")}
                value={inputNumber}
                onChange={(val) => {
                  // 只允许数字
                  let v = val.replace(/\D/g, "");
                  // 去掉前导0，例如 01 → 1
                  if (v.startsWith("0")) {
                    v = v.replace(/^0+/, "");
                  }
                  setInputNumber(v);
                }}
                onFocus={() => setIsFocus(true)} // ✅ 获得焦点
                onBlur={() => setIsFocus(false)} // ✅ 失去焦点
                clearable
                className="input-class"
              />
              <div className="input-txt">TAX</div>
            </div>
            <div className="input-hint-txt-option margin-12">
              <div className="txt-option">{t("预计日收益")}:</div>
              <div className="txt-option right-txt">
                {Number(dayRate) / 100}%
              </div>
            </div>
          </div>
          <Button
            className="btn-redemption-submit"
            loading={submitLoading}
            loadingText={t("确认中")}
            onClick={() => submitClick()}
          >
            {t("确认质押")}
          </Button>
        </div>
      </Popup>
    </>
  );
};
export default RedemptionPopup;
