import "./index.scss";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import address from "@/assets/component/address.png";
import tusd from "@/assets/home/TUSD.png";
import usdt from "@/assets/home/USDT.png";
import langCheck from "@/assets/lang/langCheck.png";
import langNoCheck from "@/assets/lang/langNoCheck.png";
import { Button, Input } from "antd-mobile";
import { RightOutline } from "antd-mobile-icons";
import { t } from "i18next";
import { storage } from "@/Hooks/useLocalStorage";
import shopPng from "@/assets/component/shopPng.png";
import { fromWei, Totast, toWei } from "@/Hooks/Utils";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber, ethers } from "ethers";
import ContractSend from "@/Hooks/ContractSend.ts";
import ContractList from "@/Contract/Contract.ts";
import { Calc } from "@/Hooks/calc";
interface OrderInfo {
  id: string;
  amount: number;
  specIndex: number;
  // 根据你的实际字段补充
}

interface AddressInfo {
  id: number | string;
  name: string;
  phone: string;
  province: string;
  details: string;
  isDefault: boolean;
}
const CreatOrder: React.FC = () => {
  const walletAddress = userAddress((state) => state.address);
  const [userInfo, setUserInfo] = useState({}); //用户信息
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [payMethod, setPayMethods] = useState<number>(1); //1usdt 2tusd

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({}); //选中的地址信息

  const [usdtBalance, setUsdtBalance] = useState<BigNumber>(BigNumber.from(0)); //usdt余额

  const [payType, setPayType] = useState<number>(1); //1usdt 2tusd

  const payOptions = [
    { id: 1, icon: usdt, label: "USDT", balance: usdtBalance },
    { id: 2, icon: tusd, label: "TUSD", balance: userInfo.tusd },
    { id: 3, icon: tusd, label: "USD", balance: userInfo.usd },
  ];
  const navigate = useNavigate();
  //切换购买方式
  const payMethodClick = (index) => {
    if (payMethod != index) {
      setPayMethods(index);
    }
  };
  //提交订单
  const submitOrder = () => {
    //判断地址是否选择了
    if (!addressInfo.id) {
      return Totast(t("请选择地址"), "info");
    }
    const paramData = [
      orderInfo.items[orderInfo.specIndex].id,
      orderInfo.specNum,
      addressInfo.id,
      payMethod == 1 ? true : false,
    ];

    const price: BigNumber = payOptions[payMethod - 1].balance;

    const totalPrice = Calc.toFixed(
      Calc.mul(orderInfo?.price, orderInfo?.specNum),
      4
    );
    const balance = price; // price本身就是BigNumber
    const totalPriceBN = toWei(totalPrice); // 根据你的token精度自行调整
    if (balance.lt(totalPriceBN)) {
      return Totast(t("余额不足"), "info");
    }
    storage.set("payMethodName", payOptions[payMethod - 1].label);
    if (payMethod == 1) {
      usdtBuyFn(paramData, totalPrice);
    } else {
      userInfoBuyFn(paramData);
    }
  };
  //usdt支付
  const usdtBuyFn = async (params, totalPrice) => {
    //开始授权 进行购买
    let applyAmount: BigNumber = BigNumber.from(0);
    let isApply = false;
    //授权
    try {
      setSubmitLoading(true);
      // 1. 获取 allowance（返回 BigNumber）
      const res = await ContractRequest({
        tokenName: "USDTToken",
        methodsName: "allowance",
        params: [walletAddress, ContractList["storeToken"].address],
      });

      const applyAmount = BigNumber.from(res?.value || "0");

      let isApply = false;
      // 2. 判断授权是否足够
      if (fromWei(applyAmount) < totalPrice) {
        // 需要授权
        const approveRes = await ContractSend({
          tokenName: "USDTToken",
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
        Totast(
          t("检查授权或者授权时发生了错误，请检查网络后重新尝试"),
          "error"
        );
        return;
      }
      //交易
      const submitResult = await ContractSend({
        tokenName: "storeToken",
        methodsName: "buy",
        params,
      });
      if (submitResult.value) {
        setSubmitLoading(false);
        paySuccessFn();
      }
      setSubmitLoading(false);
    } catch (e) {
      setSubmitLoading(false);
      console.error(e);
      Totast(t("发生异常，请稍后重试"), "error");
    }
  };
  //tusd  usd支付
  const userInfoBuyFn = async (params) => {
    setSubmitLoading(true);
    const submitResult = await ContractSend({
      tokenName: "storeToken",
      methodsName: "buy",
      params,
    });
    if (submitResult.value) {
      setSubmitLoading(false);
      paySuccessFn();
    } else {
      setSubmitLoading(false);
    }
  };
  const getPayName = (payMethod) => {
    const filterArray = payOptions.filter((item) => item.id == payMethod);
    if (filterArray.length == 0) return "";
    return filterArray[0].label;
  };

  const paySuccessFn = () => {
    navigate("/payResult");
  };
  const checkAddress = () => {
    navigate("/address?type=check");
  };

  const getPageAddress = async () => {
    const result = await NetworkRequest({
      Url: "address/list",
      Method: "get",
    });
    if (result.success) {
      if (result.data.data.length > 0) {
        const checkAddress = storage.get("checkAddress", {});
        if (checkAddress) {
          setAddressInfo(checkAddress);
        }
      }
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
  //获取tax余额
  const getUsdtBalance = async () => {
    const result = await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "balanceOf",
      params: [walletAddress],
    });
    if (result.value) {
      setUsdtBalance(result.value);
    }
  };
  useEffect(() => {
    getPageAddress();
    getUserInfo(); //拿到tusd 和usd 余额
    getUsdtBalance();
    const orderParam = storage.get("orderParam", {});
    if (orderParam) {
      setOrderInfo(orderParam);
      setPayType(orderParam.classify);
      if (orderParam.classify == 4) {
        setPayMethods(3);
      } else {
        setPayMethods(1);
      }
    }
  }, []);
  return (
    <div className="CreatOrderPage">
      <LeftBackHeader title={t("确认订单")}></LeftBackHeader>
      <div className="CreatOrderContent">
        <div className="checkAddressBox" onClick={() => checkAddress()}>
          <div className="iconOption">
            <img src={address} className="icon"></img>
          </div>
          {addressInfo.id ? (
            <div className="addressContent">
              <div className="topOption">
                {addressInfo.name} {addressInfo.phone}
              </div>
              <div className="endOption">
                {addressInfo.province} {addressInfo.city} {addressInfo.area}{" "}
                {addressInfo.details}
              </div>
            </div>
          ) : (
            <div className="content">{t("选择或添加收货地址")}</div>
          )}
          <div className="icon">
            <RightOutline color="#888888" fontSize={14} />
          </div>
        </div>

        <div className="box goodsBox">
          <div className="headerTop">
            <img src={shopPng} className="icon"></img>
            <div className="txt">{orderInfo?.merchantName}</div>
          </div>
          <div className="goodsInfo">
            <img
              src={orderInfo?.items?.[orderInfo.specIndex]?.pic}
              className="goodsImg"
            ></img>
            <div className="rightOption">
              <div className="topOption">
                <div className="txt">{orderInfo?.name}</div>
                <div className="count">x{orderInfo?.specNum}</div>
              </div>
              <div className="price">
                <img src={usdt} className="icon"></img>
                <div className="txt">{orderInfo?.items?.[orderInfo.specIndex]?.price}</div>
              </div>
              <div className="hintTxt">
                {t("已选规格")}：{orderInfo?.items?.[orderInfo.specIndex]?.name}
              </div>
            </div>
          </div>
          <div className="goodsList">
            <div className="goodsItem">
              <div className="leftOption">{t("配送方式")}：</div>
              <div className="rightOption">
                <div className="txt">{t("快递包邮")}</div>
                <RightOutline color="#888888" fontSize={14} />
              </div>
            </div>

            <div className="goodsItem">
              <div className="leftOption">{t("商品总金额")}：</div>
              <div className="rightOption">
                <div className="txt">
                  {orderInfo?.items?.[orderInfo.specIndex]?.price *
                    orderInfo?.specNum}
                </div>
              </div>
            </div>

            <div className="goodsItem">
              <div className="leftOption">{t("补贴积分")}：</div>
              <div className="rightOption">
                <div className="txt txtColor">
                  {orderInfo?.items?.[orderInfo.specIndex]?.integral *
                    orderInfo?.specNum}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="box payFn">
          <div className="hintTxt">{t("支付方式")}</div>
          {payOptions
            .filter((item) => {
              if (payType === 4) {
                return item.id === 3; // 只能显示 USD
              }
              return item.id !== 3; // 其他情况不显示 USD
            })
            .map((item, index, arr) => (
              <div
                key={item.id}
                className={`payItem ${index > 0 ? "payItemTop" : ""} ${
                  index < arr.length - 1 ? "payItemBorder" : ""
                }`}
              >
                <div className="leftOption">
                  <img src={item.icon} className="icon" />
                  <span className="price">{item.label}</span>
                </div>
                <div className="rightOption">
                  <span className="spn1">
                    {t("余额")}：{fromWei(item.balance)}
                  </span>
                  {payMethod === item.id ? (
                    <img src={langCheck} className="check" />
                  ) : (
                    <img
                      src={langNoCheck}
                      className="check"
                      onClick={() => payMethodClick(item.id)}
                    />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="endFixedBox">
        <div className="leftOption">
          <span className="spn1">{t("需支付")}：</span>
          {orderInfo?.specNum && (
            <span className="spn2">
              {Calc.toFixed(
                Calc.mul(
                  orderInfo?.items?.[orderInfo.specIndex]?.price,
                  orderInfo?.specNum
                ),
                4
              )}
              {getPayName(payMethod)}
            </span>
          )}
        </div>
        <Button
          loading={submitLoading}
          loadingText={t("确认中")}
          className="rightOption"
          onClick={() => submitOrder()}
        >
          {t("提交订单")}
        </Button>
      </div>
    </div>
  );
};
export default CreatOrder;
