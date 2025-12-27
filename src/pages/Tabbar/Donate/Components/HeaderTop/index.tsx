import "./index.scss";
import type { FC } from "react";
import { RightOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
const HeaderTop: FC = () => {
  const  navigate=useNavigate()
  return (
    <div className="headerTopPage">
      <div className="leftTxt">捐赠挖矿</div>
      <div className="rightOption" onClick={()=>navigate('/DonateStartList')}>
        <div className="txt">
          我的捐赠
        </div>
          <RightOutline fontSize={12} color="#00F8F3" />
      </div>
    </div>
  );
};
export default HeaderTop;
