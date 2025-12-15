import { lazy, useEffect, useState } from "react";
import type { FC } from "react";
import "@/App.css";
import "./index.scss";
import { TabBar } from "antd-mobile";
import { Spin } from "antd";
import home from "@/assets/tabbar/home.png";
import { t } from "i18next";

import homeActive from "@/assets/tabbar/homeActive.png";
import classify from "@/assets/tabbar/classify.png";
import classifyActive from "@/assets/tabbar/classifyActive.png";
import my from "@/assets/tabbar/my.png";
import myActive from "@/assets/tabbar/myActive.png";
import EnvManager from "@/config/EnvManager";
EnvManager.print();
import { useNavigate, useLocation } from "react-router-dom";
const TaBbarBottom: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const setRouteActive = (value: string) => {
    navigate(value);
  };
  const tabs = [
    {
      key: "/home",
      title: t("首页"),
      icon: { default: home, active: homeActive },
    },
    {
      key: "/classify",
      title: t("分类"),
      icon: { default: classify, active: classifyActive },
    },
    {
      key: "/my",
      title: t("我的"),
      icon: { default: my, active: myActive },
    },
  ];
  return (
    <TabBar
      className="custom-tabbar"
      activeKey={pathname}
      safeArea
      onChange={(value) => setRouteActive(value)}
    >
      {tabs.map((item) => (
        <TabBar.Item
          key={item.key}
          title={
            <span
              style={{
                color: pathname === item.key ? "#0BE72F" : "#ACACAC", // 选中蓝色，未选中灰色
              }}
            >
              {item.title}
            </span>
          }
          icon={
            <img
              src={pathname === item.key ? item.icon.active : item.icon.default}
              style={{ width: 22, height: 22 }}
              alt={item.title}
            />
          }
        />
      ))}
    </TabBar>
  );
};

export default TaBbarBottom;
