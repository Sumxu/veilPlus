import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import shopIcon from "@/assets/component/shopIcon.png";
import { t } from "i18next";
import ApplyStore from "@/components/Popup/ApplyStore";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber } from "ethers";
import { fromWei, Totast } from "@/Hooks/Utils";

const ShopApplication: React.FC = () => {
  const walletAddress = userAddress((state) => state.address);
  const [applyStoreShow, setApplyStoreShow] = useState<boolean>(false);
  const [shopPriceOne, setShopPriceOne] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [shopPriceTwo, setShopPriceTwo] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [shopPriceThree, setShopPriceThree] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const prices = (
    shopPriceOne: BigNumber,
    shopPriceTwo: BigNumber,
    shopPriceThree: BigNumber
  ) => ({
    1: { name: t("安品区"), price: shopPriceOne },
    2: { name: t("优品区"), price: shopPriceTwo },
    3: { name: t("臻品区"), price: shopPriceThree },
  });
  const [buyInfo, setBuyInfo] = useState({});
  const [userInfo, setUserInfo] = useState({}); //用户信息
  const [level, setLevel] = useState<BigNumber>(BigNumber.from(0)); //0是未开通 1安品区 2优品区 3 臻品区
  const navigate = useNavigate();
  const detailClick = () => {
    navigate("/merchantCenter");
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
  const isOpened = (needLevel: number) => {
    return (userInfo?.merchantLevel?.toNumber() ?? 0) >= needLevel;
  };

  const getEnterText = (needLevel: number, t: any) => {
    return isOpened(needLevel) ? t("查看商户") : t("申请入驻");
  };

  //得到商户开通的价格
  const getShopPrice = async () => {
    const resultOne = await ContractRequest({
      tokenName: "storeToken",
      methodsName: "merchantInfo",
      params: [1],
    });
    if (resultOne.value) {
      setShopPriceOne(resultOne.value.amount);
    }

    const resultTwo = await ContractRequest({
      tokenName: "storeToken",
      methodsName: "merchantInfo",
      params: [2],
    });
    if (resultTwo.value) {
      setShopPriceTwo(resultTwo.value.amount);
    }

    const resultThree = await ContractRequest({
      tokenName: "storeToken",
      methodsName: "merchantInfo",
      params: [3],
    });
    if (resultThree.value) {
      setShopPriceThree(resultThree.value.amount);
    }
  };
  const closeAppLyStoreShow = () => {
    setApplyStoreShow(false);
    getUserInfo();
    getShopPrice();
  };
  const openApplyStoreShow = () => {
    setApplyStoreShow(true);
  };
  const handleEnter = (needLevel: number) => {
    const priceMap = {
      1: { name: t("安品区"), price: shopPriceOne }, // BigNumber
      2: { name: t("优品区"), price: shopPriceTwo },
      3: { name: t("臻品区"), price: shopPriceThree },
    };

    const userLevel = Number(userInfo?.merchantLevel) ?? 0;

    // 已开通等级或更高级别，直接跳转
    if (userLevel >= needLevel) {
      return detailClick(needLevel);
    }

    let needPay = BigNumber.from(0);

    //计算支付差价： 目标价 - 已有等级对应的最低价
    const alreadyPrice = priceMap[userLevel]?.price ?? BigNumber.from(0);
    const targetPrice = priceMap[needLevel].price;

    needPay = targetPrice.sub(alreadyPrice);
    setBuyInfo({
      taxPrice: needPay,
      name: priceMap[needLevel].name,
      needLevel,
      merchantName: userInfo.merchantName,
    });

    openApplyStoreShow();
  };
  useEffect(() => {
    getUserInfo();
    getShopPrice();
  }, []);
  return (
    <div className="shopApplicationPage">
      <LeftBackHeader title={t("商家入驻")} />
      <div className="shopApplicationContentBox">
        <div className="item">
          <div className="itemHeaderOption">
            <img src={shopIcon} className="iconImg" />
            <div className="shopTxt">{t("安品区入驻")}</div>
          </div>
          <div className="hintTxt">{t("获得安品区产品售卖资格")}</div>
          <div className="bottomInfoOption">
            <div className="leftTxt">
              <span className="spn1">{t("入驻费用")}</span>
              <span className="spn2">{fromWei(shopPriceOne)} TAX</span>
            </div>
            <div className="btnTxt" onClick={() => handleEnter(1)}>
              {getEnterText(1, t)}
            </div>
          </div>
        </div>
        <div className="item">
          <div className="itemHeaderOption">
            <img src={shopIcon} className="iconImg" />
            <div className="shopTxt">{t("优品区入驻")}</div>
          </div>
          <div className="hintTxt">{t("获得优品区产品售卖资格")}</div>
          <div className="bottomInfoOption">
            <div className="leftTxt">
              <span className="spn1">{t("入驻费用")}</span>
              <span className="spn2">{fromWei(shopPriceTwo)} TAX</span>
            </div>
            <div className="btnTxt" onClick={() => handleEnter(2)}>
              {getEnterText(2, t)}
            </div>
          </div>
        </div>
        <div className="item">
          <div className="itemHeaderOption">
            <img src={shopIcon} className="iconImg" />
            <div className="shopTxt">{t("臻品区入驻")}</div>
          </div>
          <div className="hintTxt">
            {t("获得安品区、优品区、臻品区产品售卖资格")}
          </div>
          <div className="bottomInfoOption">
            <div className="leftTxt">
              <span className="spn1">{t("入驻费用")}</span>
              <span className="spn2">{fromWei(shopPriceThree)} TAX</span>
            </div>
            <div className="btnTxt" onClick={() => handleEnter(3)}>
              {getEnterText(3, t)}
            </div>
          </div>
        </div>
      </div>
      <ApplyStore
        data={buyInfo}
        isShow={applyStoreShow}
        onClose={() => closeAppLyStoreShow()}
      ></ApplyStore>
    </div>
  );
};
export default ShopApplication;
