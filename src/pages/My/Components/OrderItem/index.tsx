import "./index.scss";
import React, { useEffect, useState } from "react";
import usdt from "@/assets/home/USDT.png";
import shopIcon from "@/assets/component/shopPng.png";
import { t } from "i18next";
import { Calc } from "@/Hooks/calc";

const statusMap: Record<number, { text: string; className: string }> = {
  1: { text: t("已购买"), className: "spn-status-none" },
  2: { text: t("已发货"), className: "spn-status-ing" },
  3: { text: t("已完成"), className: "spn-status-success" },
};

function OrderItem({ onClickDetail, data }) {
  const itemClick = () => {
    onClickDetail(data.id);
  };
  return (
    <div className="order-item">
      <div className="item-header-option">
        <div className="header-left">
          <img className="icon" src={shopIcon} />
          <div className="order-shop-name">{data.merchantName}</div>
        </div>
        <div className="header-status-right">
          <span className={statusMap[data.status]?.className}>
            {statusMap[data.status]?.text}
          </span>
        </div>
      </div>
      <div className="item-order-info-option">
        <img src={data.pic} className="order-info-left"></img>
        <div className="order-info-right">
          <div className="info-txt-option">
            <div className="txt">{data.name}</div>
            <div className="count">x{data.count}</div>
          </div>
          <div className="info-price-option">
            <img src={usdt} className="icon"></img>
            <div className="price-number">{data.price}</div>
          </div>
          <div className="info-spc">
            {t("已选规格")}：{data.itemName}{" "}
          </div>
        </div>
      </div>
      <div className="logistics-information">
        <span className="spn-label">{t("实付款")}:</span>
        <span className="spn-value">
          {Calc.toFixed(Calc.mul(data.price, data.count), 4)}
        </span>
      </div>
      <div className="tools-btn-option">
        <div className="btn" onClick={() => itemClick()}>
          {t("订单详情")}
        </div>
        {data.status != 1 && (
          <div className="btn" onClick={() => itemClick()}>
            {t("查看物流")}
          </div>
        )}
      </div>
    </div>
  );
}
export default OrderItem;
