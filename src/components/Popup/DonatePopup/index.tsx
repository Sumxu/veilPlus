import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Popup, Input } from "antd-mobile";
import closeIcon from "@/assets/basic/close.png";
import { t } from "i18next";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import ContractList from "@/Contract/Contract";
import { fromWei, Totast, toWei } from "@/Hooks/Utils";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber, utils, ethers } from "ethers";
import { Button } from "antd-mobile";
import { Calc } from "@/Hooks/calc";
import type { DonateItem } from "@/Ts/DonateList";
import ContractSend from "@/Hooks/ContractSend.ts";
const MyPopup: React.FC = ({ isShow, onClose, checkItem }) => {
  const walletAddress = userAddress((state) => state.address);
  const [rate, setRate] = useState<BigNumber>(BigNumber.from(0));
  const [inputNumber, setInputNumber] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState(false); // ✅ 是否获得焦点
  //usdt 余额
  const [usdtBalanceOf, setUsdtBalanceOf] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const onCloseChange = () => {
    onClose();
  };
  /**
   *
   * @param val 输入的内容
   * @returns 监听输入的内容
   */
  const inputChange = (val) => {
    // 空或 <=0
    if (!val || Number(val) <= 0) {
      setInputNumber("");
      return;
    }
    setInputNumber(val);
  };
  /**
   * 校验输入值是否符合当前 item 的规则
   */
  const validateDonateItem = (item: DonateItem, value: number): boolean => {
    switch (item.id) {
      case 1:
        return value >= 100 && value <= 1000;
      case 2:
        return value >= 1100 && value <= 3000;
      case 3:
        return value >= 3100;
      default:
        return false;
    }
  };
  //确认提现
  const submitClick = async () => {
    if (inputNumber == "") {
      return Totast(t("请输入"), "info");
    }
    if (!validateDonateItem(checkItem, Number(inputNumber))) {
      return Totast(t(`请输入 ${checkItem.title} 范围内的金额`), "info");
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
    if (amount.gt(usdtBalanceOf)) {
      return Totast(t("余额不足"), "info");
    }
    //开始授权 进行购买
    let applyAmount: BigNumber = BigNumber.from(0);
    let isApply = false;
    setSubmitLoading(true);
    await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "allowance",
      params: [walletAddress, ContractList["VailPlusPool"].address],
    }).then((res) => {
      if (res.value) {
        applyAmount = res.value;
      }
    });
    if (applyAmount.lt(amount)) {
      await ContractSend({
        tokenName: "USDTToken",
        methodsName: "approve",
        params: [
          ContractList["VailPlusPool"].address,
          ethers.constants.MaxUint256, //授权最大值
        ],
      }).then((res) => {
        if (res.value) {
          isApply = true;
        } else {
          return;
        }
      });
    } else {
      isApply = true;
    }
    if (!isApply) {
      return;
    }
    try {
      const result = await ContractSend({
        tokenName: "VailPlusPool",
        methodsName: "deposit",
        params: [amount],
      });
      if (result.value) {
        onClose();
        Totast(t("购买成功"), "success"); // 检查授权或者授权时发生了错误，请检查网络后重新尝试
      }
    } finally {
      // 无论成功或失败，都需要关闭加载状态
      setSubmitLoading(false);
    }
  };
  const getUsdtBalance = async () => {
    const usdtRes = await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "balanceOf",
      params: [walletAddress],
    });
    if (usdtRes.value) {
      setUsdtBalanceOf(usdtRes.value);
    }
  };
  useEffect(() => {
    if (isShow == false) return;
    setInputNumber("");
    getUsdtBalance();
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
            <div className="title">{t("捐赠挖矿")}</div>
            <img
              src={closeIcon}
              className="close-icon"
              onClick={onCloseChange}
            ></img>
          </div>
          <div className="title">{checkItem.title}</div>
          <div className="input-box">
            <div className="input-hint-txt-option">
              <div className="txt-option">{t("参与金额")}:</div>
              <div className="txt-option right-txt">
                余额:{fromWei(usdtBalanceOf)}USDT
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
              <div className="input-txt">USDT</div>
              <div className="line"></div>
              <div
                className="input-txt"
                onClick={() => setInputNumber(fromWei(usdtBalanceOf))}
              >
                MAX
              </div>
            </div>
          </div>
          <div className="hintBox">
            <div className="txtOption">
              <div className="txt">日收益率</div>
              <div className="txt">预计日收益</div>
            </div>
            <div className="txtOption txtEndOption">
              <div className="txt txtEnd">{checkItem.hintNumber}%</div>
              <div className="txt txtEnd">
                {checkItem?.number && (
                  <span>{Calc.mul(inputNumber, checkItem.number)}</span>
                )}
                USDT
              </div>
            </div>
          </div>
          <div className="hintOption">
            *当获得价值
            <span className="spn1">{Calc.mul(inputNumber, 2)}USDT</span>
            收益后，将自动出局
          </div>
          <Button
            loading={submitLoading}
            loadingText={t("确认中")}
            className="btn-withdraw-submit"
            onClick={() => {
              submitClick();
            }}
          >
            {t("确认捐赠")}
          </Button>
        </div>
      </Popup>
    </>
  );
};
export default MyPopup;
