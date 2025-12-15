import "./index.scss";
import toolIcon1 from "@/assets/home/tools1.png";
import toolIcon2 from "@/assets/home/tools2.png";
import toolIcon3 from "@/assets/home/tools3.png";
import toolIcon4 from "@/assets/home/tools4.png";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
interface toolsItem {
  name: string;
  iconPath: string;
  classify: number;
}
const Banner: React.FC = () => {
  const toolsList: Array<toolsItem> = [
    {
      name: t("安品区"),
      iconPath: toolIcon4,
      classify: 1,
    },
    {
      name: t("优品区"),
      iconPath: toolIcon1,
      classify: 2,
    },
    {
      name: t("臻品区"),
      iconPath: toolIcon2,
      classify: 3,
    },
    {
      name: t("兑换区"),
      iconPath: toolIcon3,
      classify: 4,
    },
  ];
  const navigate = useNavigate();
  const toolClick = (item) => {
    navigate(`/classify?id=${item.classify}`);
  };
  return (
    <>
      <div className="tools-box">
        {toolsList.map((item, index) => {
          return (
            <div
              className="tools-item"
              onClick={() => toolClick(item)}
              key={index}
            >
              <img src={item.iconPath} className="item-icon"></img>
              <div className="item-name">{item.name}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Banner;
