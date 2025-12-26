import "./index.scss";
import type { FC } from "react";
const Card: FC = () => {
  return(
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
                    <div className="btn btnOne">记录</div>
                    <div className="btn btnTwo">领取</div>
            </div>
        </div>
  </div>
  )
};
export default Card;
