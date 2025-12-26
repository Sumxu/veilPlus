import "./index.scss";
import appIcon from "@/assets/my/token.png";
import logOutIcon from "@/assets/my/logOutIcon.png";
import copyIcon from "@/assets/basic/copyIcon.png";
import nodeIcon from "@/assets/my/node.png";
import memberIcon from "@/assets/my/member.png";
const WalletHeader: React.FC = () => {
  return (
    <div className="WalletHeaderPage">
        <img src={appIcon} className="logoBox"></img>
      <div className="rightBox">
        <div className="centerBox">
          <div className="walletOption">
            <div className="walletTxt">0x325…0086</div>
            <img src={copyIcon} className="copyIcon"></img>
          </div>
          <div className="nodeBox">
            <div className="nodeOption">
              <img src={nodeIcon} className="nodeIcon"></img> 节点用户
            </div>
            
            <div className="memberOption">
              <img src={memberIcon} className="memberIcon"></img> 等级:v8
            </div>
          </div>
        </div>
        <img src={logOutIcon} className="logOutIcon"></img>
      </div>
    </div>
  );
};
export default WalletHeader;
