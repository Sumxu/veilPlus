import "./index.scss";
import { useEffect, useState } from "react";
import { userAddress } from "@/Store/Store.ts";
import { Input, Button, Toast } from "antd-mobile";
import LeftBackHeader from "@/components/LeftBackHeader";
import USDT from "@/assets/basic/usdt.png";
import toggle from "@/assets/basic/toggle.png";
import { ethers, BigNumber } from "ethers";
import { Totast } from "@/Hooks/Utils.ts";
import blackIcon from "@/assets/basic/blackIcon.png";
import tip from "@/assets/basic/hintIcon.png";
import { fromWei, toWei, formatDate } from "@/Hooks/Utils";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import ContractList from "@/Contract/Contract.ts";
import ContractSend from "@/Hooks/ContractSend.ts";
import VIPL from "@/assets/my/token.png";
import { InfiniteScroll } from "antd-mobile";

import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { t } from "i18next";
import { storage } from "@/Hooks/useLocalStorage";
import NoData from "@/components/NoData";

interface SwapFee {
  buyFee: BigNumber;
  sellFee: BigNumber;
}
interface SwapRecord {
  blockTime: string;
  type: number;
  amount0: BigNumber;
  amount1: BigNumber;
}
const Swap: React.FC = () => {
  const navigate = useNavigate();
  const wallertAddress = storage.get("address");
  // 按钮加载
  const [current, setCurrent] = useState<number>(1);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [buyFee, setBuyFee] = useState<BigNumber>(BigNumber.from(0)); //税点
  const [maxUsdtAmount, setMaxUsdtAmount] = useState<BigNumber>(
    BigNumber.from(0),
  ); //税点
  // 兑换比例
  const [ratios, setRatios] = useState<BigNumber>(BigNumber.from(0));
  const [isMore, setIsMore] = useState<boolean>(false);
  //最大出购额度
  const [maxBuyBalance, setMaxBuyBalance] = useState<BigNumber>(
    BigNumber.from(0),
  );

  //USDT 余额
  const [USDTokenBalance, setUSDTokenBalance] = useState<BigNumber>(
    BigNumber.from(0),
  );
  //vipl 余额
  const [viplTokenBalance, setViplTokenBalance] = useState<BigNumber>(
    BigNumber.from(0),
  );
  //swap 记录
  const [swapList, setSwapList] = useState<SwapRecord>([]);
  //输入需要换的数量
  const [inputSwapAmount, setInputSwapAmount] = useState<string>("0");
  //输出获得的数量
  const [outputSwapAmount, setOutputSwapAmount] = useState<BigNumber>(
    BigNumber.from(0),
  );
  //当前兑换类型 1代表ca兑换USDT 2USDT兑换ca
  const [swapType, setSwapType] = useState<number>(1);
  const [swapNumList, setSwapNumList] = useState([
    {
      label: "25%",
      value: 250,
      status: false,
    },
    {
      label: "50%",
      value: 500,
      status: false,
    },
    {
      label: "75%",
      value: 750,
      status: false,
    },
    {
      label: "MAX",
      value: 1000,
      status: false,
    },
  ]);
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "memberSwap/page",
      Data: {
        address: wallertAddress,
        current: nexPage,
        size: 10,
      },
    }).then((res) => {
      if (res.success) {
        setSwapList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length === 10) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };
  //获取用户USDT和CA余额
  const getPageInfo = async () => {
    try {
      const resPromise = await Promise.allSettled([
        ContractRequest({
          tokenName: "SwapRouter",
          methodsName: "getAmountsOut",
          params: [
            toWei("1"),
            [
              ContractList["veilPlusToken"].address,
              ContractList["USDTToken"].address,
            ],
          ],
        }),
        ContractRequest({
          tokenName: "veilPlusToken",
          methodsName: "balanceOf",
          params: [wallertAddress],
        }),
        ContractRequest({
          tokenName: "USDTToken",
          methodsName: "balanceOf",
          params: [wallertAddress],
        }),
        ContractRequest({
          tokenName: "VailPlusPool",
          methodsName: "tOwnedU",
          params: [wallertAddress],
        }),
        ContractRequest({
          tokenName: "VailPlusPool",
          methodsName: "getSellQuota",
          params: [wallertAddress],
        }),
        NetworkRequest({
          Url: "memberSwap/page",
          Method: "get",
          Data: {
            current: 1,
            size: 10,
            address: wallertAddress,
          },
        }),
      ]);
      setRatios(resPromise[0].value.value[1]);
      setViplTokenBalance(resPromise[1].value.value);
      setUSDTokenBalance(resPromise[2].value.value);
      setMaxBuyBalance(resPromise[3].value.value);
      setBuyFee(resPromise[4].value.value.fee);
      setMaxUsdtAmount(resPromise[4].value.value.erc20Amount);
      const listDataResult = resPromise[5].value.data;
      if (listDataResult.success) {
        setSwapList(listDataResult.data.records);
        if (listDataResult.data.records.length == 10) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    } catch (error) {}
  };
  const clearCheckStatus = () => {
    setSwapNumList((prevList) =>
      prevList.map((item) => ({
        ...item, // 保留其他字段
        status: false, // 更新 status 为 false
      })),
    );
  };
  const swapInputChange = async (amount) => {
    setInputSwapAmount(amount);
    if (amount == null || amount <= 0) {
      setOutputSwapAmount(BigNumber.from(0));
      return;
    }
    if (swapType == 1) {
      const usdtValue = toWei(amount).mul(ratios).div(toWei("1"));
      setOutputSwapAmount(usdtValue);
    }
  };
  const estimateAmount = (amount: BigNumber) => {
    // 原来的百分比费用
    const feePart = amount.mul(buyFee).div(100);
    // 万分之一费用
    const tinyFee = amount.mul(1).div(10000);
    // 最终结果
    const result = amount.sub(feePart).sub(tinyFee);
    return result;
  };
  const swapRateChange = (index) => {
    clearCheckStatus();
    setSwapNumList((prevList) =>
      prevList.map((item, i) => ({
        ...item,
        status: i === index ? true : item.status, // 如果是目标下标，status 设置为 true，否则保持原值
      })),
    );
    const rateItem = swapNumList[index];
    let inputAmount: BigNumber = BigNumber.from(0); // 默认值是 0
    if (swapType == 1) {
      inputAmount = inputAmount = viplTokenBalance
        .mul(rateItem.value)
        .div(1000);
    }
    swapInputChange(fromWei(inputAmount));
  };
  //开始兑换
  const confirmBtnClick = async () => {
    if (toWei(inputSwapAmount).isZero()) {
      return Totast(t("请输入"), "info");
    }
    if (toWei(inputSwapAmount).gt(viplTokenBalance)) {
      return Totast(t("VIPL余额不足"), "info");
    }
    if (estimateAmount(outputSwapAmount).gt(maxBuyBalance)) {
      return Totast(t("剩余额度不足，盈利部分请到 Ave Swap 或者 PancakeSwap 交易"), "info");
    }
    if (buttonLoading == true) {
      return;
    }
    setButtonLoading(true);
    if (swapType === 1) {
      //判断最大出售的额度是否超出了
      try {
        //2. 检查授权额度
        const allowanceRes = await ContractRequest({
          tokenName: "veilPlusToken",
          methodsName: "allowance",
          params: [wallertAddress, ContractList["VailPlusPool"].address],
        });
        // 2. 如果额度不足，则发起 approve 授权
        if (allowanceRes.value.lt(toWei(inputSwapAmount))) {
          const approveRes = await ContractSend({
            tokenName: "veilPlusToken",
            methodsName: "approve",
            params: [
              ContractList["VailPlusPool"].address,
              ethers.constants.MaxUint256, //授权最大值
            ],
          });
          if (!approveRes || !approveRes.value) {
            setButtonLoading(false);
            return; // 授权失败则中止
          }
        }
      } catch (error) {
        setButtonLoading(false);
      }
    }
    const swapRes = await ContractSend({
      tokenName: "VailPlusPool",
      methodsName: "sellVIPL", //
      params: [toWei(inputSwapAmount)],
    });
    if (swapRes && swapRes.value) {
      setButtonLoading(false);
      // 兑换成功后，刷新页面数据，例如用户余额
      getPageInfo();
      setInputSwapAmount("0");
      clearCheckStatus();
    }
    setButtonLoading(false);
  };
  useEffect(() => {
    getPageInfo();
  }, []);
  return (
    <div className="swap-page">
      <LeftBackHeader title={t("Swap")}></LeftBackHeader>
      <div className="swapContent">
        <div className="scale-tip">
          <img src={tip} className="tip-img" alt="" />
          <span>
            {t("兑换比例")}：1 VIPL ≈ {fromWei(ratios)} USDT
          </span>
        </div>
        <div className="select-assets">{t("选择资产")}</div>
        <div className="from-box">
          <div className="token-info">
            <div className="symbol-box">
              <img src={swapType == 1 ? VIPL : USDT} alt="" />
              <span>{swapType == 1 ? "VIPL" : "USDT"}</span>
            </div>
            <div className="balance">
              {t("余额")}：
              {swapType == 1
                ? fromWei(viplTokenBalance)
                : fromWei(USDTokenBalance)}
            </div>
          </div>
          <Input
            className="from-input"
            value={inputSwapAmount}
            type="number"
            onChange={swapInputChange}
          />
          <div className="scale-list">
            {swapNumList.map((item, index) => (
              <div
                key={item.value}
                className={`scale-item ${item.status ? "active" : ""}`}
                onClick={() => {
                  swapRateChange(index);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="toggle-img">
          <img src={blackIcon} className="endIcon"></img>
        </div>
        <div className="to-box">
          <div className="token-info">
            <div className="symbol-box">
              <img src={swapType == 1 ? USDT : VIPL} alt="" />
              <span>{swapType == 1 ? "USDT" : "VIPL"}</span>
            </div>
            <div className="balance">
              {t("余额")}：
              {swapType == 1
                ? fromWei(USDTokenBalance)
                : fromWei(viplTokenBalance)}
            </div>
          </div>
          <div className="get-amount">{fromWei(outputSwapAmount)}</div>
        </div>
        <div className="swap-data">
          <span className="key">
            {buyFee.toString() == 5 ? t("兑换滑点") : t("暴跌滑点")}
          </span>
          <span className="val">{buyFee.toString()}%</span>
        </div>
        <div className="swap-data">
          <span className="key">{t("预计获得")}：</span>
          <span className="val">
            {fromWei(estimateAmount(outputSwapAmount))}
            {swapType == 2 ? " VIPL" : " USDT"}
          </span>
        </div>
        <div className="gas-balance">
          <span className="balance">
            {t("最大出售额度")}:{fromWei(maxBuyBalance, 18, true, 1)}USDT
          </span>
        </div>
        <Button className="swap-btn" onClick={confirmBtnClick}>
          {buttonLoading ? <Spin /> : t("兑换")}
        </Button>
        <div className="recordList">
          <div className="records-title">
            <span className="title-text">{t("我的记录")}</span>
          </div>
          <div className="records-head">
            <span>{t("时间")}</span>
            <span className="span-2">{t("交易对")}</span>
            <span>{t("状态")}</span>
          </div>
          {swapList.length == 0 ? (
            <NoData></NoData>
          ) : (
            swapList.map((item, index) => {
              return (
                <div className="record-item" key={index}>
                  <span>{formatDate(item.blockTime).dateTime}</span>
                  <span className="span-2">
                    {fromWei(item.erc20Amount, 18, true, 3)}
                    VIPL {"=>"} {fromWei(item.usdtAmount, 18, true, 3)} USDT
                  </span>
                  <span>{t("已完成")}</span>
                </div>
              );
            })
          )}
          <InfiniteScroll
            loadMore={loadMoreAction}
            hasMore={isMore}
          ></InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default Swap;
