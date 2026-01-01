import "./index.scss";
import { t } from "i18next";
import checkIcon from "@/assets/team/check.png";
import back from "@/assets/basic/back.png";


const NodeDetail: React.FC = () => {
  const nodeId=1
 const hintTxts = [
    t("全网入金1%永久分红"),
    t("买入手续费1%永久分红"),
    t("卖出手续费1.5%永久分红"),
    t("防暴跌机制手续费30%永久分红"),
    t("盈利税2%分红"),
  ];
  const mapTxts = {
    0: [
      t("小节点合伙人赠送VIP1级别(激活即可享受)"),
      t(
        "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,小节点合伙人赠送250U账户(激活即可享受)"
      ),
      t("前1～500位: 奖励2000枚VIPL"),
      t("前501～1000位: 奖励1400枚VIPL"),
      t("前1001～1600位: 奖励980枚VIPL"),
    ],
    1: [
      t("大节点合伙人赠送VIP2级别(激活即可享受)"),
      t(
        "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,大节点合伙人赠送500U账户(激活即可享受)"
      ),
      t("前1～300位: 奖励5000枚VIPL"),
      t("前301～600位: 奖励3500枚VIPL"),
      t("前601～1000位: 奖励2450枚VIPL"),
    ],
  };
  return (
    <div className="NodeDetailPage">
      <div className="leftIcon">
        <img src={back} className="backIcon"></img>
      </div>
      <div className="hintTxt">
        Hi,{t('欢迎')}
        <div className="TagBox">
          <div className="tagName">{t('编号')}</div>
          <div className="tagNo">#0089</div>
        </div>
      </div>
      <div className="hintTxts">{t('的节点用户来到')} VEIL PLUS {t('生态节点中心')}</div>
      <div className="box usdtInfo">
        <div className="usdtTop">
          <div className="title">{t('团队总业绩')}(USDT)</div>
          <div className="number">12321</div>
        </div>
        <div className="usdtBottom">
          <div className="usdtItemBottom">
            <div className="title">9800</div>
            <div className="number">{t('节点累计收益')}(USDT)</div>
            <div className="btn btnList">{t('明细记录')}</div>
          </div>
          <div className="usdtItemBottom">
            <div className="title txtColor">9800</div>
            <div className="number">{t('待领取节点收益')}(USDT)</div>
            <div className="btn btnAward">{t('领取收益')}</div>
          </div>
        </div>
      </div>

      <div className="buy-hint-option">
        <div className="hintOption">{t("获得权益")}</div>
        <div className="right-option">
          {hintTxts.map((item, index) => {
            return (
              <div className="txtOption" key={index}>
                <img className="iconIcon" src={checkIcon}></img>
                <div className="txt-1-item">{item}</div>
              </div>
            );
          })}

          {mapTxts[nodeId].map((item, index) => {
            return (
              <div className="txtOption" key={index}>
                <img className="iconIcon" src={checkIcon}></img>
                <div className="txt-1-item">{item}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default NodeDetail;
