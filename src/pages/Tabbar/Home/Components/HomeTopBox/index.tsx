import "./index.scss";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

const HomeTopBox: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="HomeTopBox">
      <div className="dappTitle">VEIL PLUS</div>
      <div className="homeTopBg">
        <div className="dappHintTxt">{t('让行为成为资产,让身份自由流动')}</div>
        <div className="dappHintBgTxt">{t('构建可移植的全链上身份协议')}</div>
        <div className="btnList">
          <div className="btn bgOne" onClick={() => navigate("/Donate")}>
            {t('捐赠挖矿')}
          </div>
          <div className="btn bgTwo" onClick={() => navigate("/Node")}>
            {t('节点购买')}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeTopBox;
