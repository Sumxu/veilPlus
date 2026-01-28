import "./index.scss";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import wallet from "@/assets/basic/wallet.png";
import { userAddress } from "@/Store/Store";
import { formatAddress, concatSign } from "@/Hooks/Utils";
import { ensureWalletConnected } from "@/Hooks/WalletHooks";
import { storage } from "@/Hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { UseSignMessage } from "@/Hooks/UseSignMessage.ts";
import { t } from "i18next";

export type WalletBoxRef = {
  initWallet: () => void;
};
type Props = {
  onLoginSuccess?: (walletAddress: string) => void; // 登录成功事件
};
const WalletBox = forwardRef<WalletBoxRef, Props>(({ onLoginSuccess }, ref) => {
  const [sign, setSign] = useState<any>(null);
  const navigate = useNavigate();
  const { signMessage } = UseSignMessage();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const walletTitle = t("链接钱包");
  // 初始化钱包状态
  const initWallet = () => {
    const sign = storage.get("sign");
    const address = storage.get("address");
    if (sign) {
      setSign(sign);
      setWalletAddress(address);
    } else {
      setSign(null);
      setWalletAddress("");
    }
  };
  // 授权登录
  const connectWallet = async () => {
    const result = await ensureWalletConnected(navigate);
    if (result) {
      const address = userAddress.getState().address;
      setWalletAddress(address);
      const bigRes = concatSign(address);
      const sigResult = await signMessage(bigRes);
      if (sigResult) {
        storage.set("sign", sigResult);
        setSign(sigResult);
        // 登录成功，触发父组件回调
        onLoginSuccess?.(address);
      }
    }
  };
  // 对外暴露方法
  useImperativeHandle(ref, () => ({
    initWallet,
  }));
  return (
    <div className="walletBox">
      <img className="walletIcon" src={wallet} />
      <span className="walletTitle" onClick={connectWallet}>
        {sign ? formatAddress(walletAddress) : walletTitle}
      </span>
    </div>
  );
});

export default WalletBox;
