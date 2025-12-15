import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import OrderDetailHeader from "../../Components/OrderDetailHeader";
import copyIcon from "@/assets/my/copy.png";
import address from "@/assets/component/address.png";
import usdt from "@/assets/home/USDT.png";
import { RightOutline } from "antd-mobile-icons";
import car from "@/assets/component/wuliuIcon.png";
import { Calc } from "@/Hooks/calc";

import { t } from "i18next";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import shopPng from "@/assets/component/shopPng.png";
import { Totast, copyToClipboard } from "@/Hooks/Utils.ts";

export interface OrderDetail {
  id: number;
  orderSn: string;
  name: string;
  itemName: string;
  pic: string;
  price: number;
  integral: number;
  classify: number;
  count: number;
  payType: number;
  status: number;
  remark: string;
  logisticsCompany: string;
  trackingNumber: string;

  receiverName: string;
  receiverPhone: string;
  detailAddress: string;

  merchantName: string;
  merchantAddress: string;

  createTime: string;
}
const Order: React.FC = () => {
  const payOptions = [
    { id: 1, label: "USDT" },
    { id: 2, label: "USD" },
    { id: 3, label: "TUSD" },
  ];
  const [orderInfo, setOrderInfo] = useState<OrderDetail>({});
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  //获取订单详细信息
  const getPageData = async () => {
    const result = await NetworkRequest({
      Url: "order/info",
      Data: {
        id,
      },
    });
    if (result.success) {
      setOrderInfo(result.data.data);
    }
  };
  const getPayName = (payMethod) => {
    const filterArray = payOptions.filter((item) => item.id == payMethod);
    if (filterArray.length == 0) return "";
    return filterArray[0].label;
  };
  const copyClick = (txt, val) => {
    copyToClipboard(val, txt);
  };
  useEffect(() => {
    getPageData();
  }, []);
  return (
    <div className="order-detail-page">
      <OrderDetailHeader status={orderInfo.status}></OrderDetailHeader>
      <div className="content-box">
        {orderInfo.status != 1 && (
          <div className="wuLiuBox">
            <div className="leftIconOption">
              <img src={car} className="icon"></img>
            </div>
            <div className="contentOption">
              <div className="topContent">
                {orderInfo.logisticsCompany} {orderInfo.trackingNumber}
              </div>
              <div className="bottomOption">{t("物流状态请自行查询")}</div>
            </div>
            <div className="rightOption">
              <img
                className="copyIcon"
                src={copyIcon}
                onClick={() =>
                  copyClick("物流单号复制成功", orderInfo.trackingNumber)
                }
              ></img>
            </div>
          </div>
        )}

        <div className="address-info-box">
          <div className="info-header-option">
            <div className="icon-option">
              <img src={address} className="address-icon"></img>
            </div>
            <div className="right-option">
              <span className="spn-1">{orderInfo.receiverName}</span>
              <span className="spn-2">{orderInfo.receiverPhone}</span>
            </div>
          </div>
          <div className="addressDetailsOption">{orderInfo.detailAddress}</div>
        </div>

        <div className="goodsInfoBox">
          <div className="headerTopOption">
            <img src={shopPng} className="Icon"></img>
            <div className="txt"> {orderInfo.merchantName}</div>
          </div>
          <div className="goodsItemOption">
            <img src={orderInfo.pic} className="goodsImg"></img>

            <div className="goodsItemRightOption">
              <div className="goodsItemHeader">
                <div className="goodsItemTxt">{orderInfo.name}</div>
                <div className="goodsItemCount">X{orderInfo.count}</div>
              </div>
              <div className="goodsItemPrice">
                <img src={usdt} className="priceIcon"></img>
                <div className="goodsPrice">{orderInfo.price}</div>
              </div>
              <div className="goodsItemSpec">
                {t("已选规格")}：{orderInfo.itemName}
              </div>
            </div>
          </div>
          <div className="goodsItemLineOption">
            <div className="leftOption">{t("配送方式")}：</div>
            <div className="rightOption">
              <div className="rightTxt">{t("快递包邮")}</div>
              <RightOutline color="#888888" fontSize={14} />
            </div>
          </div>
          {orderInfo.price && (
            <div className="goodsItemLineOption">
              <div className="leftOption">{t("支付金额")}：</div>
              <div className="rightOption">
                <div className="rightTxt">
                  {Calc.toFixed(Calc.mul(orderInfo.price, orderInfo.count), 4)}
                </div>
              </div>
            </div>
          )}
          <div className="goodsItemLineOption">
            <div className="leftOption">{t("补贴积分")}：</div>
            <div className="rightOption">
              <div className="rightTxt rightTxtOrige">{orderInfo.integral}</div>
            </div>
          </div>
        </div>

        <div className="order-info-box">
          <div className="item-option">
            <div className="left-item-option">{t("订单编号")}：</div>
            <div className="right-item-option">
              <span className="spn-1">{orderInfo.orderSn}</span>
              <img
                src={copyIcon}
                className="copyIcon"
                onClick={() => copyClick("复制成功", orderInfo.orderSn)}
              ></img>
            </div>
          </div>

          <div className="item-option">
            <div className="left-item-option">{t("支付方式")}：</div>
            <div className="right-item-option">
              <span className="spn-1">{getPayName(orderInfo.payType)}</span>
            </div>
          </div>

          <div className="item-option">
            <div className="left-item-option">{t("下单时间")}：</div>
            <div className="right-item-option">
              <span className="spn-1">{orderInfo.createTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Order;
