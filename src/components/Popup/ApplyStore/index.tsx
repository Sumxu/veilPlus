import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Popup, Input, Button } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import { t } from "i18next";
import popupHintIcon from "@/assets/popup/popupHintIcon.png";
import { fromWei, Totast } from "@/Hooks/Utils";
import ContractList from "@/Contract/Contract.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import ContractSend from "@/Hooks/ContractSend.ts";
import { BigNumber, ethers } from "ethers";
const ConversionPopup: React.FC = ({ isShow, onClose, data }) => {
  const [shopNameInput, setShopNameInput] = useState<string>("");
  const [isBalanceFocus, setIsBalanceFocus] = useState(false); // ✅ 是否获得焦点
  const walletAddress = userAddress((state) => state.address);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [taxBalance, setTaxBalance] = useState<BigNumber>(BigNumber.from(0)); //tax余额
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

  //申请开通店铺
  const submitClick = async () => {
    console.log("needPay==",data.taxPrice)
  
    //判断是否输入了
    if (shopNameInput == "") {
      return Totast(t("请输入店铺名称"), "info");
    }
    //判断输入值和大于余额
    if (data.taxPrice.gt(taxBalance)) {
      return Totast(t("余额不足"), "info");
    }
    //开始授权 进行购买
    let applyAmount: BigNumber = BigNumber.from(0);
    let isApply = false;
    //授权
    try {
      setSubmitLoading(true);
      // 1. 获取 allowance（返回 BigNumber）
      const res = await ContractRequest({
        tokenName: "TaxToken",
        methodsName: "allowance",
        params: [walletAddress, ContractList["storeToken"].address],
      });
      const applyAmount = BigNumber.from(res?.value || "0");
      let isApply = false;
      // 2. 判断授权是否足够
      if (applyAmount.lt(data.taxPrice)) {
        // 需要授权
        const approveRes = await ContractSend({
          tokenName: "TaxToken",
          methodsName: "approve",
          params: [
            ContractList["storeToken"].address,
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
        tokenName: "storeToken",
        methodsName: "settled",
        params: [data.needLevel, shopNameInput],
      });
      if (submitResult.value) {
        setSubmitLoading(false);
        onClose();
      }
      setSubmitLoading(false);
    } catch (e) {
      setSubmitLoading(false);
      console.error(e);
      Totast(t("发生异常，请稍后重试"), "error");
    }
  };

  useEffect(() => {
    if (isShow == false) return;
    if (data.merchantName) {
      setShopNameInput(data.merchantName);
    }
    //查询tax余额
    getTaxBalance();
  }, [isShow]);
  return (
    <>
      <Popup
        visible={isShow}
        onClose={() => {
          onCloseChange();
        }}
      >
        <div className="my-apply-store-popup-page">
          <div className="header-option">
            <div className="title">{t(`申请入驻${data?.name}`)}</div>
            <div className="close-icon" onClick={() => onCloseChange()}>
              <CloseOutline fontSize={12} color="#969797" />
            </div>
          </div>
          <div className="payPriceBox">
            <div className="priceTxt">{fromWei(data?.taxPrice)}TAX</div>
            <div className="priceHintTxt">
              {t("即可入驻")}
              {data?.name}
            </div>
          </div>

          <div className="input-box">
            <div className="input-hint-txt-option">
              <div className="txt-option">{t("店铺名称")}:</div>
            </div>
            <div
              className={`input-option ${isBalanceFocus ? "input-focus" : ""}`}
            >
              <Input
                disabled={data.merchantName ? true : false}
                placeholder={t("输入店铺名称")}
                value={shopNameInput}
                onChange={(val) => {
                  setShopNameInput(val);
                }}
                onFocus={() => setIsBalanceFocus(true)} // ✅ 获得焦点
                onBlur={() => setIsBalanceFocus(false)} // ✅ 失去焦点
                clearable
                className="input-class"
              />
            </div>
          </div>
          <div className="hint-txt-box">
            <div className="hint-txt-option">
              {t("需支付")}
              {fromWei(data?.taxPrice)}TAX:
            </div>
            <div className="hint-txt-option right-txt">
              {t("余额")}
              {fromWei(taxBalance)}TAX
            </div>
          </div>
          <Button
            className="btn-submit"
            loading={submitLoading}
            loadingText={t("确认中")}
            onClick={() => submitClick()}
          >
            {t("确认申请")}
          </Button>
        </div>
      </Popup>
    </>
  );
};
export default ConversionPopup;
