import "./index.scss";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { BigNumber, ethers } from "ethers";
import { ProgressCircle } from "antd-mobile";
import { fromWei, Totast, toWei } from "@/Hooks/Utils.ts";

interface NodeItem {
  amount: BigNumber;
  nodeName: string;
  inventory: BigNumber; //库存
  max: BigNumber; //最大
  id: number; //node 编号
}
interface UserNodeInfo {
  nodeId: BigNumber; //0小 1大
  flg: boolean; //是否是节点
  weight: BigNumber;
  storeValue: BigNumber;
  rewardDebt: BigNumber;
}
interface NodeListClass {
  nodeList: NodeItem[];
  userNodeInfo: UserNodeInfo;
  showBuyNftChange: (value: number) => void;
}
const NodeList: React.FC<NodeListClass> = (props) => {
  /**
   *
   * @param item 购买节点
   */
  const buyClick = (item) => {
    if (props.userNodeInfo.flg) return; //已购买节点
    props.showBuyNftChange(item.id);
  };
  /**
   *
   * @param item 节点item
   * @returns 返回已售卖的数量
   */
  const selllNumber = (item) => {
    const result = item.max.sub(item.inventory);
    return result.toString();
  };
  /**
   *
   * @param item 节点item
   * @returns 返回已售卖的数量
   */
  const selllWith = (item) => {
    const total = item.max.toString();
    const stock = selllNumber(item);
    const percent = (stock / total) * 100;
    return percent;
  };
  const nodeBtn = (item) => {
    if (
      item.id == Number(props.userNodeInfo.nodeId) &&
      props.userNodeInfo.flg
    ) {
      //已经是节点
      return <span>{t("待激活")}</span>;
    } else {
      return (
        <span>
          {fromWei(item.amount, 18, true, 2)}U{t("购买")}
        </span>
      );
    }
  };
  return (
    <div className="nodeListBox">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B2FE" />
            <stop offset="100%" stopColor="#00FDE3" />
          </linearGradient>
        </defs>
      </svg>
      {props.nodeList.map((item, index) => {
        return (
          <div className="nodeItem" key={index}>
            <div
              className={`trapezoid ${
                item.id == 0 ? "trapezoidOne" : "trapezoidTwo"
              }`}
            >
              {" "}
              {item.nodeName}
            </div>
            <div className="progressCircleItem">
              <ProgressCircle
                className="progressCircleReverse"
                percent={selllWith(item)}
                style={{
                  "--size": "98px",
                  "--track-width": "4px",
                  "--fill-color": "url(#gradientColor)",
                  "--track-color": "#284647",
                }}
              >
                <div className="progressCircleNumber">
                  {item.inventory.toString()}
                </div>
                <div className="progressCircleTxt">{t("剩余")}</div>
              </ProgressCircle>
            </div>
            <div className="numberItem">
              <div className="itemHintTxt">
                <div className="hintTxt hintOne">{t("总量")}</div>
                <div className="hintTxt hintOne">{item.max.toString()}</div>
              </div>
              <div className="line"></div>
              <div className="itemHintTxt">
                <div className="hintTxt hintOne">{t("已售")}</div>
                <div className="hintTxt hintOne">{selllNumber(item)}</div>
              </div>
            </div>
            <div
              className={`btn ${item.id == 0 ? "oneBtn" : "twoBtn"}`}
              onClick={() => buyClick(item)}
            >
              {nodeBtn(item)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default NodeList;
