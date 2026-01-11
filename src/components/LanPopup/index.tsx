import "./index.scss";
import { Mask } from "antd-mobile";
import closeIcon from "@/assets/basic/close.png";
import i18n, { t } from "i18next";

interface LanPopupProps {
  isShow: boolean;
  lanChange: () => void;
  value: string;
}
const LanPopup: React.FC<LanPopupProps> = (props: LanPopupProps) => {
  const basicColumns = [
    { label: "中文繁体", value: "1", name: "zhHant" },
    { label: "English", value: "2", name: "en" },
    { label: "Indonesian", value: "3", name: "indonesian" },
    { label: "Thai", value: "4", name: "thai" },
    { label: "Japanese", value: "5", name: "japanese" },
    { label: "Korean", value: "6", name: "korean" },
    { label: "Vietnamese", value: "7", name: "vietnamese" },
  ];
  const closeClick = () => {
    props.lanChange();
  };
  // 获取当前语言
  const changeLanguage = (name: string) => {
    i18n.changeLanguage(name);
    window.localStorage.setItem("lang", name);
    window.location.reload();
  };
  return (
    <Mask visible={props.isShow} onMaskClick={closeClick}>
      <div className="LanPopupPage">
        <div className="LanPopupContent">
          <div className="headerTopBox">
            <div className="centerTxt">语言设置</div>
            <img
              src={closeIcon}
              className="closeIcon"
              onClick={closeClick}
            ></img>
          </div>
          <div className="contentBox">
            {basicColumns.map((item, index) => {
              return (
                <div
                  onClick={() => changeLanguage(item.name)}
                  className={`lanOption ${
                    item.value == props.value ? "checkLan" : "noCheckLan"
                  }`}
                  key={index}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Mask>
  );
};
export default LanPopup;
