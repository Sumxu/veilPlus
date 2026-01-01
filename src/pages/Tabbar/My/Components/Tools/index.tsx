import "./index.scss";
import { useState } from "react";
import { RightOutline } from "antd-mobile-icons";
import type { MyToolItem } from "@/Ts/MyToolItem";
import teamTools from "@/assets/my/teamTools.png";
import nodeTools from "@/assets/my/nodeTools.png";
import aboutIcon from "@/assets/my/about.png";
import lanIcon from "@/assets/my/lanIcon.png";
import moneyTools from "@/assets/my/moneyTools.png";
import { useNavigate } from "react-router-dom";
import LanPopup from "@/components/LanPopup";
import { t } from "i18next";

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState<boolean>(false);
  const toolList: MyToolItem[] = [
    {
      icon: moneyTools,
      toolsName: t("我的捐赠"),
      type: 0,
      desc: "",
      path: "/DonateStartList",
    },
    {
      icon: teamTools,
      toolsName: t("我的团队"),
      type: 0,
      desc: "",
      path: "/MyTeam",
    },
    {
      icon: nodeTools,
      toolsName: t("VIPL PLUS节点"),
      type: 0,
      desc: "",
      path: "/NodeDetail",
    },
    {
      icon: aboutIcon,
      toolsName: t("关于我们"),
      type: 0,
      desc: "",
      path: "/About",
    },
    {
      icon: lanIcon,
      toolsName: t("语言设置"),
      type: 1,
      desc: "简体中文",
      path: "",
    },
  ];
  const toolsClick = (item) => {
    if (item.type == 1) {
      setIsShow(true);
    } else {
      navigate(item.path);
    }
  };
  /**
   * 显示隐藏语言设置
   */
  const lanSetChange = () => {
    setIsShow(!isShow);
  };
  return (
    <div className="ToolsPage">
      {toolList.map((item, index) => {
        return (
          <div
            className="toolItem"
            onClick={() => toolsClick(item)}
            key={index}
          >
            <img src={item.icon} className="toolIcon"></img>
            <div className="toolName">{item.toolsName}</div>
            <div className="rightOption">
              {item.type == 1 && <div className="toolDesc">{item.desc}</div>}
              <RightOutline fontSize={12} color="#00F8F3" />
            </div>
          </div>
        );
      })}
      <LanPopup isShow={isShow} lanChange={lanSetChange}></LanPopup>
    </div>
  );
};
export default Tools;
