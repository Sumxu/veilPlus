import type { FC } from "react";
import "@/App.css";
import "./index.scss";
import { TabBar } from "antd-mobile";
import { t } from "i18next";
import home from "@/assets/tabbar/home.png";
import homeActive from "@/assets/tabbar/homeActive.png";
import my from "@/assets/tabbar/my.png";
import myActive from "@/assets/tabbar/myActive.png";
import donate from "@/assets/tabbar/donate.png";
import donateActive from "@/assets/tabbar/donateActive.png";
import { useNavigate, useLocation } from "react-router-dom";
import { storage } from "@/Hooks/useLocalStorage";
import { Totast } from "@/Hooks/Utils";
import { userAddress } from "@/Store/Store";

const TaBbarBottom: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { pathname } = location;
  const setRouteActive = (value: string) => {
    //如果没有签名就不能登录
    if (storage.get("sign")) {
      navigate(value);
    } else {
      Totast(t("请先链接钱包"), "info");
    }
  };
  const tabs = [
    {
      key: "/Home",
      keys: "/Home/",
      title: t("首页"),
      icon: { default: home, active: homeActive },
    },
    {
      key: "/Donate",
      keys: "/Donate/",
      title: t("捐赠"),
      icon: { default: donate, active: donateActive },
    },
    {
      key: "/My",
      keys: "/My/",
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
                color:
                  pathname === item.key || pathname === item.keys
                    ? "#00F8F3"
                    : "#717784",
              }}
            >
              {item.title}
            </span>
          }
          icon={
            <img
              src={
                pathname === item.key || pathname === item.keys
                  ? item.icon.active
                  : item.icon.default
              }
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
