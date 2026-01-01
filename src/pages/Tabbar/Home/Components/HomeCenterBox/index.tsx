import "./index.scss";
import type { FC } from "react";
import copyIcon from '@/assets/basic/copyIcon.png';
import { t } from "i18next";

const HomeCenterBox: FC = () => {
  return (
    <div className="HomeCenterBox">
      <div className="title">{t("全网数据")}</div>
      <div className="box">
        <div className="boxTitle">{t("全网总捐赠量")}</div>
        <div className="boxContent">3,280,900.00 USDT</div>
      </div>
      <div className="box totalBox">
        <div className="totalOption">
          <div className="font12Option">
            <span className="txt">{t('全网总LP质押')}(VIPL)</span>
            <span className="txt">{t('全网总销毁')}(VIPL)</span>
          </div>

          <div className="font16Option">
            <span className="txt">20,560,000.00</span>
            <span className="txt">10,809,300.00</span>
          </div>
        </div>

        <div className="totalOption totalTop20">
          <div className="font12Option">
            <span className="txt">{t('节点总分红')}(USDT)</span>
            <span className="txt">{t('回购池')}(USDT)</span>
          </div>
          <div className="font16Option">
            <span className="txt">8,89,200.00</span>
            <span className="txt">10,809,300.00</span>
          </div>
        </div>
      </div>
      <div className="biTitle">{t('代币经济学')}</div>
      <div className="box vipBox">
        <div className="title">VIPL</div>
        <div className="hintTxt">Veil Labs {t('生态首个可移植身份协议的功能性代币')}</div>
        <div className="centerBox">
            <div className="centerTxtOption">
              <div className="centerTxt">{t('代币名称')}：VIPL</div>
              <div className="centerTxt">{t('总发行量')}：1.3{t('亿')}</div>
            </div>
            <div className="centerTxtOption centerTxtTop12">
              <div className="centerTxt">{t('发行价')}：0.08USDT</div>
              <div className="centerTxt">{t('初始发行量')}：1000{t('万')}</div>
            </div>
        </div>
        <div className="stepBox">
          <div className="lpOption">35%
            <div className="lpTxt">LP{t('池')}</div>
          </div>
          <div className="lpLine"></div>
          <div className="nodeOption">5%
            <div className="nodeTxt">{t('节点')}</div>
          </div>
          <div className="nodeLine"></div>
          <div className="donateOption">60%
            <div className="donateTxt">{t('捐赠池')}</div>
          </div>
        </div>

        <div className="addressBox">
          <div className="adddressTxt">
            <span className="spn1">{t('合约地址')}:</span>
            <span className="spn2">0xC0B51b2633b809C3c82554e084E17397D0e2EaC5</span>
          </div>
          <img src={copyIcon} className="copyIcon"></img>
        </div>
      </div>
    </div>
  );
};
export default HomeCenterBox;
