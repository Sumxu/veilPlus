import "./index.scss";
import type { FC } from "react";
const HomeTopBox: FC = () => {
  return (
    <div className="HomeTopBox">
      <div className="dappTitle">VEIL PLUS</div>
      <div className="homeTopBg">
        <div className="dappHintTxt">让行为成为资产，让身份自由流动</div>
        <div className="dappHintBgTxt">构建可移植的全链上身份协议</div>
        <div className="btnList">
          <div className="btn bgOne">捐赠挖矿</div>
          <div className="btn bgTwo">节点购买</div>
        </div>
      </div>
    </div>
  );
};
export default HomeTopBox;
