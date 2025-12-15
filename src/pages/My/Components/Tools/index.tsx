import "./index.scss";
import React, { useEffect, useState } from "react";
import tools1 from "@/assets/my/tools1.png";
import tools2 from "@/assets/my/tools2.png";
import tools3 from "@/assets/my/tools3.png";
import tools4 from "@/assets/my/tools4.png";
import tools5 from "@/assets/my/tools5.png";
import tools6 from "@/assets/my/tools6.png";
import tools7 from "@/assets/my/tools7.png";
import { RightOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import {getLangObj} from '@/Hooks/Utils'
import { t } from "i18next";
const Tools: React.FC = () => {
  const navigate = useNavigate();

  const toolArray = [
    {
      name: t("订单中心"),
      icon: tools1,
      type: "1",
      path: "/order",
    },
    {
      name: t("收货地址"),
      icon: tools2,
      type: "1",
      path: "/address",
    },
    {
      name: t("TAX质押"),
      icon: tools3,
      type: "1",
      path: "/taxPledge",
    },
    {
      name: t("商家入驻"),
      icon: tools4,
      type: "1",
      path: "/shopApplication",
    },
    {
      name: t("NFT股东"),
      icon: tools5,
      type: "1",
      path: "/nft",
    },
    {
      name: t("我的团队"),
      icon: tools6,
      type: "1",
      path: "/myTeam",
    },
    {
      name: t("语言设置"),
      icon: tools7,
      type: "2",
      typeTxt:getLangObj().label??'简体中文',
      path: "/langPage",
    },
  ];
  const toolsClick = (item) => {
    navigate(item.path);
  };
  return (
    <>
      <div className="tools-page-box">
        {toolArray.map((item, index) => {
          const itemType = item.type;
          return (
            <div
              key={index}
              onClick={() => toolsClick(item)}
              className={`tools-item-option ${
                toolArray.length - 1 != index && "tools-item-border-bottom"
              }`}
            >
              <div className="left-option">
                <img className="left-icon" src={item.icon}></img>
                <div className="item-name">{item.name}</div>
              </div>
              <div className="right-option">
                {itemType == 2 && (
                  <div className="hint-txt">{item.typeTxt}</div>
                )}
                <div className="right-icon">
                  <RightOutline color="#A6A6A6" fontSize={17} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Tools;
