import "./index.scss";
import type { FC } from "react";
import wallet from "@/assets/basic/wallet.png";
import { userAddress } from "@/Store/Store.ts";
import { formatAddress } from "@/Hooks/Utils";
const WalletBox: FC = () => {
  const walletAddress = userAddress((state) => state.address);
  const walletTitle = "链接钱包";
  return (
    <div className="walletBox">
      <img className="walletIcon" src={wallet}></img>
      <span className="walletTitle">
        {walletAddress ? formatAddress(walletAddress) : walletTitle}
      </span>
    </div>
  );
};
export default WalletBox;
