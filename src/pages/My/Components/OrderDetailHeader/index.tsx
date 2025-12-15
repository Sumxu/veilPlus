import "./index.scss";
import React, { useEffect, useState } from "react";
import leftBackIcon from "@/assets/component/leftBackIcon.png";
import orderDetailIng from "@/assets/component/orderDetailIng.png";
import orderDetailNone from "@/assets/component/orderDetailNone.png";
import orderDetailSuccess from "@/assets/component/orderDetailSuccess.png";
import logoOrderDetailBg from "@/assets/component/logoOrderDetailBg.png";
import { icons } from "antd/es/image/PreviewGroup";
import { useNavigate } from "react-router-dom";

import { t } from "i18next";
const OrderDetailHeader: React.FC = ({ status }) => {
  const navigate = useNavigate();
  const leftBackClick = () => {
    navigate(-1);
  };
  const statusArray = [
    {
      status: "1",
      name: t("等待卖家发货"),
      desc: t("商家将在48小时内发货,请耐心等待！"),
      icons: orderDetailNone,
    },
    {
      status: "2",
      name: t("商品已发货"),
      desc: t("您可以复制物流单号查询物流动态"),
      icons: orderDetailIng,
    },
    {
      status: "3",
      name: t("商品已送达"),
      desc: t("您的订单已完成，欢迎下次光临"),
      icons: orderDetailSuccess,
    },
  ];
  const getOrderStatusDom = (status) => {
    const findObj = statusArray.find((item) => item.status == status);
    return (
      <div>
        <div className="status-option">
          <div className="status-left">
            <img src={findObj?.icons} className="status-icon"></img>
          </div>
          <div className="status-right">
            <div className="hint-txt-1">{findObj?.name}</div>
            <div className="hint-txt-2">{findObj?.desc}</div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="header-box">
      <div className="left-option">
        <img
          className="left-icon"
          src={leftBackIcon}
          onClick={() => leftBackClick()}
        ></img>
      </div>
      {getOrderStatusDom(status)}
      <img src={logoOrderDetailBg} className="logo-order-detail"></img>
    </div>
  );
};
export default OrderDetailHeader;
