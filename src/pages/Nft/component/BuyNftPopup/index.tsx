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
import { useNFTQuery } from "@/Hooks/contractNft";
import { CloseOutline } from "antd-mobile-icons";
import nftIcon from "@/assets/home/nftIcon.png";
import lpIcon from "@/assets/home/lpIcon.png";
import jifenIcon from "@/assets/home/jifenIcon.png";
interface buyNftPopupClass {
  onClose: () => void;
}
function BuyNftPopup(Props: buyNftPopupClass) {
  const walletAddress = userAddress((state) => state.address);
  //得到usdt 余额 和 需要支付的price
  const { callMethod, sendTransaction } = useNFTQuery();
  //发售USDT价格
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  //usdt 余额
  const [usdtBalanceOf, setUsdtBalanceOf] = useState<BigNumber>(
    BigNumber.from(0)
  );
  //nft 余额
  const [nftBalanceOfRes, setNftBalanceOfRes] = useState<BigNumber>(
    BigNumber.from(0)
  );
  //
  const [buyLoding, setBuyLoding] = useState(false);
  //获取需要支付的nft价格
  const fetchPrice = async () => {
    const priceRes = await callMethod("price"); // price() 无参数
    if (priceRes.success) {
      setPrice(priceRes.data);
    }
    const nftBalanceOfRes = await callMethod("balanceOf", [walletAddress]); // price() 无参数
    if (nftBalanceOfRes.success) {
      setNftBalanceOfRes(nftBalanceOfRes.data);
    }
  };
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
    //先判断自己的usdt是否满足购买
    if (usdtBalanceOf.lt(price)) {
      Totast(t("余额不足"), "warning");
      return;
    }
    //判断nft数量大于4也不能进行购买
    if (nftBalanceOfRes.gt(BigNumber.from(4))) {
      Totast(t("您已购买次数到达上限"), "warning");
      return;
    }
    setBuyLoding(true);
    //开始授权 进行购买
    let applyAmount: BigNumber = BigNumber.from(0);
    let isApply = false;
    await ContractRequest({
      tokenName: "USDTToken",
      methodsName: "allowance",
      params: [walletAddress, ContractList["SpaceNFT"].address],
    }).then((res) => {
      if (res.value) {
        applyAmount = res.value;
      }
    });
    if (applyAmount.lt(price)) {
      await ContractSend({
        tokenName: "USDTToken",
        methodsName: "approve",
        params: [
          ContractList["SpaceNFT"].address,
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
      const mintRes = await sendTransaction("mint", [walletAddress], {});
      if (mintRes.success) {
        fetchPrice();
        fetchUsdt();
        Props.onClose();
        Totast(t("购买成功"), "success"); // 检查授权或者授权时发生了错误，请检查网络后重新尝试
      }
    } finally {
      // 无论成功或失败，都需要关闭加载状态
      setBuyLoding(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    fetchUsdt();
  }, []);
  return (
    <div className="BuyNftPopup">
      <div className="header-top-box">
        <div className="txt">{t("购买")}NFT</div>
        <div className="icon-close" onClick={() => Props.onClose()}>
          <CloseOutline fontSize={14} color="#969696" />
        </div>
      </div>
      <div className="price-option">{fromWei(price, 18, true, 2)} USDT</div>
      <div className="get-txt-option">{t("即可获得NFT股东")}</div>
      <div className="hint-txt">{t('获得权益')}</div>
      <div className="buy-hint-option">
        <img className="left-icon" src={nftIcon} />
        <div className="right-option">
          <div className="txt-1-item">{t('股东NFT*1张')}</div>
          <div className="txt-2-item">{t('NFT总产值1000TAX,每日产0.55TAX')}</div>
        </div>
      </div>
      <div className="buy-hint-option">
        <img className="left-icon" src={jifenIcon} />

        <div className="right-option">
          <div className="txt-1-item">3000{t('积分')}</div>
          <div className="txt-2-item">600USD+2400TUSD</div>
        </div>
      </div>
      <div className="buy-hint-option">
        <img className="left-icon" src={lpIcon} />
        <div className="right-option">
          <div className="txt-1-item">{t('初始LP占比权')}</div>
          <div className="txt-2-item">
            {t('获得初始LP底池的占比权(底池LP锁仓三年)')}
          </div>
        </div>
      </div>
      <div className="need-pay-option">
        <div className="need-txt-1">
          {t("需支付")}：{fromWei(price, 18, true, 2)} USDT
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
