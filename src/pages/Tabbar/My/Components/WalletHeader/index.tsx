import "./index.scss";
import appIcon from "@/assets/my/token.png";
import logOutIcon from "@/assets/my/logOutIcon.png";
import copyIcon from "@/assets/basic/copyIcon.png";
import nodeIcon from "@/assets/my/node.png";
import memberIcon from "@/assets/my/member.png";
import { t } from "i18next";
import { userAddress } from "@/Store/Store.ts";
import { formatAddress, copyText } from "@/Hooks/Utils";
import { storage } from "@/Hooks/useLocalStorage";

const WalletHeader: React.FC = ({ userInfo, level }) => {
  const walletAddress = storage.get("address");
  const copyClick = () => {
    copyText(walletAddress);
  };
  return (
    <div className="WalletHeaderPage">
      <img src={appIcon} className="logoBox"></img>
      <div className="rightBox">
        <div className="centerBox">
          <div className="walletOption">
            <div className="walletTxt">{formatAddress(walletAddress)}</div>
            <img
              src={copyIcon}
              className="copyIcon"
              onClick={() => copyClick()}
            ></img>
          </div>

          <div className="nodeBox">
            {userInfo.isNode && (
              <div className="nodeOption">
                <img src={nodeIcon} className="nodeIcon"></img> {t("节点用户")}
              </div>
            )}
            <div className="memberOption">
              <img src={memberIcon} className="memberIcon"></img> {t("等级")}
              :v{level.toString()}
            </div>
          </div>
        </div>
        {/* <img src={logOutIcon} className="logOutIcon"></img> */}
      </div>
    </div>
  );
};
export default WalletHeader;
