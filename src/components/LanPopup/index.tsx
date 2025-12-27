import "./index.scss";
import { Mask } from "antd-mobile";
import closeIcon from "@/assets/basic/close.png";
interface LanPopupProps {
  isShow: boolean;
  lanChange: () => void;
}
const LanPopup: React.FC<LanPopupProps> = (props: LanPopupProps) => {
const closeClick=()=>{
    props.lanChange()
}
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
            <div className="lanOption checkLan">EngList</div>
            <div className="lanOption noCheckLan">简体中文</div>
            <div className="lanOption noCheckLan">简体中文1</div>
            <div className="lanOption noCheckLan">简体中文2</div>
            <div className="lanOption noCheckLan">简体中文3</div>
            <div className="lanOption noCheckLan">简体中文4</div>
            <div className="lanOption noCheckLan">简体中文5</div>
          </div>
        </div>
      </div>
    </Mask>
  );
};
export default LanPopup;
