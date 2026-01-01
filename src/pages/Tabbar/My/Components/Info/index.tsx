import "./index.scss";
import { RightOutline } from "antd-mobile-icons";
import { t } from "i18next";

const Info: React.FC = () => {
  return (
    <div className="InfoPage">
      <div className="infoBox">
        <div className="detailList">
          <div className="txt">{t('资产明细')}</div>
          <RightOutline color="#fff" fontSize={12} />
        </div>
        <div className="hintTxt">{t('资产中心')}</div>
        <div className="numberBox">
          <div className="numberItem">
            <div className="itemTxt">VIPL{t('余额')}</div>
            <div className="itemNumber">123123</div>
          </div>
          <div className="line"></div>
          <div className="numberItem numberTwoItem">
            <div className="itemTxt">USDT{t('余额')}</div>
            <div className="itemNumber">123123</div>
          </div>
        </div>
        <div className="infoEnd">
          <div className="leftOption">
            <div className="txt">{t('待领取挖矿收益')}:</div>
            <div className="number">2080.35</div>
          </div>
          <div className="btn">{t('领取')}</div>
        </div>
      </div>
    </div>
  );
};
export default Info;
