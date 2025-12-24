import "./index.scss";
import type { FC } from "react";
import wallet from "@/assets/basic/wallet.png";
const WalletBox: FC = () => {
  const walletTitle = "链接钱包";
  return (
    <div className="walletBox">
      <img className="walletIcon" src={wallet}></img>
      <span className="walletTitle">{walletTitle}</span>
    </div>
  );
};
export default WalletBox;
