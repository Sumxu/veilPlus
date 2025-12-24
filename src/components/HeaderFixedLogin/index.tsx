import "./index.scss";
import { FC} from "react";
import logoTop from "@/assets/home/logoTop.png";
import WalletBox from "../WalletBox";

const HeaderFixedLogin: FC = () => {
  return (
    <div
      className={`headerFixedLoginBox scrolled`}
    >
      <img src={logoTop} className="logoTopIcon" />
      <WalletBox />
    </div>
  );
};

export default HeaderFixedLogin;
