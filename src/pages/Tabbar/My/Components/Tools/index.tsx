import "./index.scss";
import { RightOutline } from "antd-mobile-icons";
import type { MyToolItem } from "@/Ts/MyToolItem";
import teamTools from "@/assets/my/teamTools.png";
import nodeTools from "@/assets/my/nodeTools.png";
import aboutIcon from "@/assets/my/about.png";
import lanIcon from "@/assets/my/lanIcon.png";
import moneyTools from "@/assets/my/moneyTools.png";
const Tools: React.FC = () => {
  const toolList: MyToolItem[] = [
    {
      icon: moneyTools,
      toolsName: "我的捐赠",
      type: 0,
      desc: "",
      path: "",
    },
    {
      icon: teamTools,
      toolsName: "我的团队",
      type: 0,
      desc: "",
      path: "",
    },
    {
      icon: nodeTools,
      toolsName: "VIPL PLUS节点",
      type: 0,
      desc: "",
      path: "",
    },
    {
      icon: aboutIcon,
      toolsName: "关于我们",
      type: 0,
      desc: "",
      path: "",
    },
    {
      icon: lanIcon,
      toolsName: "语言设置",
      type: 1,
      desc: "简体中文",
      path: "",
    },
  ];
  return (
    <div className="ToolsPage">
      {toolList.map((item, index) => {
        return (
          <div className="toolItem" key={index}>
            <img src={item.icon} className="toolIcon"></img>
            <div className="toolName">{item.toolsName}</div>
            <div className="rightOption">
              {item.type == 1 && <div className="toolDesc">{item.desc}</div>}
              <RightOutline fontSize={12} color="#00F8F3" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Tools;
