import "./index.scss";
import type { FC } from "react";
const HomeCenterBox: FC = () => {
  return (
    <div className="HomeCenterBox">
      <div className="title">全网数据</div>
      <div className="box">
        <div className="boxTitle">全网总捐赠量</div>
        <div className="boxContent">3,280,900.00 USDT</div>
      </div>
      <div className="box totalBox">
        <div className="totalOption">
          <div className="font12Option">
            <span className="txt">全网总LP质押(VIPL)</span>
            <span className="txt">全网总销毁(VIPL)</span>
          </div>

          <div className="font16Option">
            <span className="txt">20,560,000.00</span>
            <span className="txt">10,809,300.00</span>
          </div>
        </div>

        <div className="totalOption totalTop20">
          <div className="font12Option">
            <span className="txt">节点总分红(USDT)</span>
            <span className="txt">回购池(USDT)</span>
          </div>
          <div className="font16Option ">
            <span className="txt">8,89,200.00</span>
            <span className="txt">10,809,300.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeCenterBox;
