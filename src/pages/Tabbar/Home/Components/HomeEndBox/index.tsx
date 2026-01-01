import "./index.scss";
import type { FC } from "react";
import topOneIcon from "@/assets/home/top1.png";
import topTwoIcon from "@/assets/home/top2.png";
import topThreeIcon from "@/assets/home/top3.png";
import { t } from "i18next";

const HomeEndBox: FC = () => {
  return (
    <div className="HomeEndBox">
      <div className="title">{t('捐赠排行榜')}</div>
      <div className="listHeaderOption">
        <div className="txt">{t('用户名')}</div>
        <div className="txt">{t('捐赠量')}(USDT)</div>
      </div>
      <div className="rankingTopBox">
        <div className="topOption oneTop">
          <img src={topOneIcon} className="icon"></img>
          <div className="walletTxt">0xab6…803cc</div>
          <div className="usdtNumber">398,800.00</div>
        </div>
        <div className="topOption twoTop">
          <img src={topTwoIcon} className="icon"></img>
          <div className="walletTxt">0xab6…803cc</div>
          <div className="usdtNumber">398,800.00</div>
        </div>
        <div className="topOption threeTop">
          <img src={topThreeIcon} className="icon"></img>
          <div className="walletTxt">0xab6…803cc</div>
          <div className="usdtNumber">398,800.00</div>
        </div>
      </div>
      <div className="rankingListBox">
        <div className="rankingOption">
          <div className="indexItem">1</div>
          <div className="indexWallet">0xab6…803cc</div>
          <div className="indexNumber">398,800.00</div>
        </div>
        {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
          return (
            <div className="rankingOption" key={index}>
              <div className="indexItem">1</div>
              <div className="indexWallet">0xab6…803cc</div>
              <div className="indexNumber">398,800.00</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default HomeEndBox;
