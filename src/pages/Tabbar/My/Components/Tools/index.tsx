import "./index.scss";
import { useEffect, useState } from "react";
import { RightOutline } from "antd-mobile-icons";
import type { MyToolItem } from "@/Ts/MyToolItem";
import teamTools from "@/assets/my/teamTools.png";
import nodeTools from "@/assets/my/nodeTools.png";
import aboutIcon from "@/assets/my/about.png";
import lanIcon from "@/assets/my/lanIcon.png";
import moneyTools from "@/assets/my/moneyTools.png";
import { useNavigate } from "react-router-dom";
import LanPopup from "@/components/LanPopup";
import i18n, { t } from "i18next";
import { Totast } from "@/Hooks/Utils";
import right from '@/assets/basic/right.png'
const Tools: React.FC = ({ userInfo }) => {
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [langTxt, setLangTxt] = useState<string>("");
  const [value, setValue] = useState<string>("");
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
      desc: langTxt,
      path: "",
    },
  ];
  const toolsClick = (item, index) => {
    if (item.type == 1) {
      setIsShow(true);
    } else {
      if (index == 2) {
        //判断是否是节点
        if (userInfo.isNode) {
          navigate(item.path);
        } else {
          Totast("未购买节点", "info");
          navigate(item.path);
        }
      } else {
        navigate(item.path);
      }
    }
  };
  /**
   * 显示隐藏语言设置
   */
  const lanSetChange = () => {
    setIsShow(!isShow);
  };
    const getCurrLang = () => {
    const localLang: string = window.localStorage.getItem("lang") ?? "zhHant";
    i18n.changeLanguage(localLang);
    console.log("localLang==", localLang);
    if (localLang == "zhHant") {
      setValue("1");
      setLangTxt("繁体中文");
    }
    if (localLang == "en") {
      setValue("2");
      setLangTxt("English");
    }
    if (localLang == "indonesian") {
      setValue("3");
      setLangTxt("Indonesian");
    }
    if (localLang == "thai") {
      setValue("4");
      setLangTxt("Thai");
    }
    if (localLang == "japanese") {
      setValue("5");
      setLangTxt("Japanese");
    }
    if (localLang == "korean") {
      setValue("6");
      setLangTxt("Korean");
    }
    if (localLang == "vietnamese") {
      setValue("7");
      setLangTxt("Vietnamese");
    }
  };
  useEffect(() => {
    getCurrLang();
  }, []);
  return (
    <div className="ToolsPage">
      {toolList.map((item, index) => {
        return (
          <div
            className="toolItem"
            onClick={() => toolsClick(item, index)}
            key={index}
          >
            <img src={item.icon} className="toolIcon"></img>
            <div className="toolName">{item.toolsName}</div>
            <div className="rightOption">
              {item.type == 1 && <div className="toolDesc">{item.desc}</div>}
               <img src={right} className="rightIcon"></img>
            </div>
          </div>
        );
      })}
      <LanPopup isShow={isShow} value={value} lanChange={lanSetChange}></LanPopup>
    </div>
  );
};
export default Tools;
