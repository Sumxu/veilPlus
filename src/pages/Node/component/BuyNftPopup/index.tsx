import "./index.scss";
import { userAddress } from "@/Store/Store.ts";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { BigNumber, ethers } from "ethers";
import { fromWei, Totast, toWei } from "@/Hooks/Utils.ts";
import { t } from "i18next";
import ContractSend from "@/Hooks/ContractSend.ts";
import ContractList from "@/Contract/Contract.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import closeIcon from "@/assets/basic/close.png";
import checkIcon from "@/assets/team/check.png";
interface nodeItem {
  amount: BigNumber;
  inventory: BigNumber; //库存
  max: BigNumber; //最大
}
interface buyNftPopupClass {
  onClose: () => void;
  nodeId: number;
}
function BuyNftPopup(Props: buyNftPopupClass) {
  const hintTxts = [
    t("全网入金1%永久分红"),
    t("买入手续费1%永久分红"),
    t("卖出手续费1.5%永久分红"),
    t("防暴跌机制手续费30%永久分红"),
    t("盈利税2%分红"),
  ];
  const mapTxts = {
    0: [
      t("小节点合伙人赠送VIP1级别(激活即可享受)"),
      t(
        "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,小节点合伙人赠送250U账户(激活即可享受)"
      ),
      t("前1～500位: 奖励2000枚VIPL"),
      t("前501～1000位: 奖励1400枚VIPL"),
      t("前1001～1600位: 奖励980枚VIPL"),
    ],
    1: [
      t("大节点合伙人赠送VIP2级别(激活即可享受)"),
      t(
        "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,大节点合伙人赠送500U账户(激活即可享受)"
      ),
      t("前1～300位: 奖励5000枚VIPL"),
      t("前301～600位: 奖励3500枚VIPL"),
      t("前601～1000位: 奖励2450枚VIPL"),
    ],
  };
  const walletAddress = userAddress((state) => state.address);
  //usdt 余额
  const [usdtBalanceOf, setUsdtBalanceOf] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [nodeInfo, setNodeInfo] = useState<nodeItem>({});
  //
  const [buyLoding, setBuyLoding] = useState(false);
  //获取自己的usdt余额
  const fetchUsdt = async () => {
    const usdtRes = await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "balanceOf",
      params: [walletAddress],
    });
    console.log("usdtRes==", usdtRes);
    if (usdtRes.value) {
      setUsdtBalanceOf(usdtRes.value);
    }
  };
  //购买nft购买逻辑
  const btnClick = async () => {
    //判断库存是否不足
    if (nodeInfo.inventory.eq(0)) {
      Totast(t("库存不足"), "warning");
      return;
    }
    //先判断自己的usdt是否满足购买
    if (usdtBalanceOf.lt(nodeInfo.amount)) {
      Totast(t("余额不足"), "warning");
      return;
    }

    setBuyLoding(true);
    //开始授权 进行购买
    let applyAmount: BigNumber = BigNumber.from(0);
    let isApply = false;
    await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "allowance",
      params: [walletAddress, ContractList["vailPlusNodeToken"].address],
    }).then((res) => {
      if (res.value) {
        applyAmount = res.value;
      }
    });
    if (applyAmount.lt(nodeInfo.amount)) {
      await ContractSend({
        tokenName: "USDTToken",
        methodsName: "approve",
        params: [
          ContractList["vailPlusNodeToken"].address,
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
        tokenName: "vailPlusNodeToken",
        methodsName: "ido",
        params: [Props.nodeId],
      });
      if (result.value) {
        Props.onClose();
        Totast(t("购买成功"), "success"); // 检查授权或者授权时发生了错误，请检查网络后重新尝试
      }
    } finally {
      // 无论成功或失败，都需要关闭加载状态
      setBuyLoding(false);
    }
  };
  const getNodeInfo = async () => {
    const nodeInfo = await ContractRequest({
      tokenName: "vailPlusNodeToken",
      methodsName: "nodeInfo",
      params: [Props.nodeId],
    });
    setNodeInfo(nodeInfo.value);
  };
  useEffect(() => {
    if (Props.nodeId == null) return;
    getNodeInfo();
    fetchUsdt();
  }, [Props.nodeId]);
  return (
    <div className="BuyNftPopup">
      <div className="header-top-box">
        <div className="txt">
          {t("购买")}
          {Props.nodeId == 0 ? t("小节点") : t("大节点")}
        </div>
        <img
          src={closeIcon}
          className="icon-close"
          onClick={() => Props.onClose()}
        ></img>
      </div>
      <div className="price-option">
        {fromWei(nodeInfo.amount, 18, true, 2)} USDT
      </div>
      <div className="get-txt-option">
        {t("即可获得")}
        {Props.nodeId == 0 ? t("小节点") : t("大节点")}
      </div>
      <div className="buy-hint-option">
        <div className="hintOption">{t("获得权益")}</div>
        <div className="right-option">
          {hintTxts.map((item, index) => {
            return (
              <div className="txtOption" key={index}>
                <img className="iconIcon" src={checkIcon}></img>
                <div className="txt-1-item">{item}</div>
              </div>
            );
          })}

          {mapTxts[Props.nodeId].map((item, index) => {
            return (
              <div className="txtOption" key={index}>
                <img className="iconIcon" src={checkIcon}></img>
                <div className="txt-1-item">{item}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="need-pay-option">
        <div className="need-txt-1">
          {t("需支付")}：{fromWei(nodeInfo.amount, 18, true, 2)} USDT
        </div>
        <div className="need-txt-2">
          {t("余额")}：{fromWei(usdtBalanceOf, 18, true, 2)} USDT
        </div>
      </div>
      <div className="btn-option" onClick={() => btnClick()}>
        {buyLoding ? <Spin /> : t("确认购买")}
      </div>
    </div>
  );
}

export default BuyNftPopup;
