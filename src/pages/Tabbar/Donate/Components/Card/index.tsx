import "./index.scss";
import { useState, type FC } from "react";
import DrawPopup from "@/components/Popup/DrawPopup";
import { useNavigate } from "react-router-dom";
const Card: FC = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const navigate=useNavigate()
  const openShow=()=>{
    setIsShow(true)
  }
  const onClose = () => {
    setIsShow(false);
  };
  return (
    <div className="CardPage">
      <div className="headerTopBox">
        <div className="txtOption">
          <div className="txt">当前捐赠</div>
          <div className="txt">累计收益</div>
        </div>
        <div className="txtOption txtOptionMt4">
          <div className="txt">800.00 USDT</div>
          <div className="txt">1200.00 VIPL</div>
        </div>
      </div>
      <div className="headerEndBox">
        <div className="leftOption">
          <div className="hintTitle">待领取收益</div>
          <div className="hintNumber">500.00 VIPL</div>
        </div>
        <div className="rightOption">
          <div className="btn btnOne" onClick={()=>navigate('/OutputList')}>记录</div>
          <div className="btn btnTwo" onClick={()=>openShow()}>领取</div>
        </div>
      </div>
      <DrawPopup isShow={isShow} onClose={onClose}></DrawPopup>
    </div>
  );
};
export default Card;
