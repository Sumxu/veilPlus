import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import MerchantDataInfo from "@/pages/My/Components/MerchantDataInfo";
import MerchantGoods from "@/pages/My/Components/MerchantGoods";
import { Picker } from "antd-mobile";
import shopPng from "@/assets/Component/shopPng.png";
import { t } from "i18next";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";

const basicColumns = [
  [
    { value: "1", label: t("安品区") },
    { value: "2", label: t("优品区") },
    { value: "3", label: t("臻品区") },
  ],
];

interface MerchantInfo {
  /** 用户类型 1.普通 2.安品区 3.优品区 4.臻品区 */
  userType: 0 | 1 | 2 | 3;
  /** 商家名称 */
  merchantName: string;

  /** 钱包地址 */
  address: string;

  /** 商品总数 */
  productCount: number;

  /** 安品区总数 */
  apCount: number;

  /** 优品总数 */
  yxCount: number;

  /** 臻品总数 */
  zpCount: number;

  /** 今日销量 */
  todaySell: number;

  /** 总销量 */
  totalSell: number;

  /** 月销量 */
  monthSell: number;

  /** 年销量 */
  yearSell: number;
}
enum UserType {
  Normal = 0,
  Anpin = 1,
  Youpin = 2,
  Zhenpin = 3,
}

const userTypeMap: Record<UserType, string> = {
  [UserType.Normal]: "普通",
  [UserType.Anpin]: t("安品区"),
  [UserType.Youpin]: t("优品区"),
  [UserType.Zhenpin]: t("臻品区"),
};
const MerchantCenter: React.FC = () => {
    const [userInfo, setUserInfo] = useState({}); //用户信息
    const walletAddress = userAddress((state) => state.address);
  
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo>({});
  const [leavelVisible, setLeavelVisible] = useState(false);
  const [leavelValue, setLeavelValue] = useState("");
  const getPageInfo = async () => {
    const result = await NetworkRequest({
      Url: "merchant/info",
    });
    if (result.success) {
      setMerchantInfo(result.data.data);
    }
  };
  const leaveChange = () => {
    setLeavelVisible(true);
  };
  const getUserInfo = async () => {
    const result = await ContractRequest({
      tokenName: "storeToken",
      methodsName: "userInfo",
      params: [walletAddress],
    });
    if (result.value) {
      console.log("result.value--", result.value);
      setUserInfo(result.value);
    }
  };
  useEffect(() => {
    getPageInfo();
    getUserInfo();
  }, []);
  return (
    <div className="MerchantCenterPage">
      <LeftBackHeader title={t("商家中心")}></LeftBackHeader>
      <div className="MerchantCenterContent">
        <div className="headerTopBox">
          <div className="shopLogo">
            <img src={shopPng} className="logo"></img>
          </div>

          <div className="topInfo">
            <div className="topTxt">
              <span className="spn1">{userInfo.merchantName}</span>
              <span className="spn2">
                {userTypeMap[(userInfo?.merchantLevel?.toNumber() ?? 0)] || "未入驻"}
              </span>
            </div>
          </div>

          <div className="endOption">
            <div className="leftItem">
              <div className="price">{merchantInfo.productCount}</div>
              <div className="txt">{t("商品总数")}</div>
            </div>
            <div className="line"></div>
            <div className="rightItem">
              <div className="goodsInfoOption">
                <span className="spn1">{t('安品区')}：</span>
                <span className="spn2">{merchantInfo.apCount}</span>
              </div>
              <div className="goodsInfoOption margin14">
                <span className="spn1">{t('优品区')}：</span>
                <span className="spn2">{merchantInfo.yxCount}</span>
              </div>
              <div className="goodsInfoOption margin14">
                <span className="spn1">{t('臻品区')}：</span>
                <span className="spn2">{merchantInfo.zpCount}</span>
              </div>
            </div>
          </div>
        </div>
        <Picker
          columns={basicColumns}
          visible={leavelVisible}
          onClose={() => {
            setLeavelVisible(false);
          }}
          value={leavelValue}
          onConfirm={(v) => {
            setLeavelValue(v);
          }}
        />
        <MerchantDataInfo data={merchantInfo}></MerchantDataInfo>
        <MerchantGoods></MerchantGoods>
      </div>
    </div>
  );
};
export default MerchantCenter;
