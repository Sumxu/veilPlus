import "./index.scss";
import { useEffect, useState, type FC } from "react";
import copyIcon from "@/assets/basic/copyIcon.png";
import { t } from "i18next";
import EnvManager from "@/config/EnvManager.ts";
import { copyText, fromWei } from "@/Hooks/Utils";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { BigNumber } from "ethers";
import { userAddress } from "@/Store/Store.ts";

const HomeCenterBox: FC = () => {
  const walletAddress = userAddress((state) => state.address);

  const [totalDepositAmount, setTotalDepositAmount] = useState<BigNumber>(
    BigNumber.from("0")
  ); //总捐赠
  const [totalFundValue, setTotalFundValue] = useState<BigNumber>(
    BigNumber.from("0")
  ); //节点总分红

  const [lpValue, setLpValue] = useState<BigNumber>(BigNumber.from("0")); //lp质押

  const [destroyValue, setDestroyValue] = useState<BigNumber>(
    BigNumber.from("0")
  ); //销毁
  const [buyBack, setBuyBack] = useState<BigNumber>(BigNumber.from("0")); //回购池

  const copyClick = () => {
    copyText(EnvManager.veilPlusToken);
  };
  const getTotalDepositAmount = async () => {
    const result = await ContractRequest({
      tokenName: "VailPlusPool",
      methodsName: "totalDepositAmount",
      params: [],
    });
    if (result.value) {
      setTotalDepositAmount(result.value);
    }
  };
  const getTotalFundValue = async () => {
    const result = await ContractRequest({
      tokenName: "vailPlusNodeToken",
      methodsName: "totalFundValue",
      params: [],
    });
    if (result.value) {
      setTotalFundValue(result.value);
    }
  };
  const getVeilPlusToken = async () => {
    const result = await ContractRequest({
      tokenName: "veilPlusToken",
      methodsName: "balanceOf",
      params: [EnvManager.veilPlusToken],
    });
    if (result.value) {
      setLpValue(result.value);
    }
  };
  const getVeilPlusPool = async () => {
    const result = await ContractRequest({
      tokenName: "veilPlusToken",
      methodsName: "balanceOf",
      params: ["0x000000000000000000000000000000000000dEaD"],
    });
    if (result.value) {
      setDestroyValue(result.value);
    }
  };
  const getVeilUsdt = async () => {
    const result = await ContractRequest({
      tokenName: "veilPlusToken",
      methodsName: "balanceOf",
      params: [walletAddress],
    });
    if (result.value) {
      setBuyBack(result.value);
    }
  };
  useEffect(() => {
    getTotalDepositAmount(); ///总捐赠
    getTotalFundValue(); //节点总分红
    getVeilPlusToken(); //全网总销毁
    getVeilPlusPool(); //LP质押
    getVeilUsdt(); //usdt
  }, []);
  return (
    <div className="HomeCenterBox">
      <div className="title">{t("全网数据")}</div>
      <div className="box">
        <div className="boxTitle">{t("全网总捐赠量")}</div>
        <div className="boxContent">{fromWei(totalDepositAmount)} USDT</div>
      </div>
      <div className="box totalBox">
        <div className="totalOption">
          <div className="font12Option">
            <span className="txt">{t("全网总LP质押")}(VIPL)</span>
            <span className="txt">{t("全网总销毁")}(VIPL)</span>
          </div>

          <div className="font16Option">
            <span className="txt">{fromWei(lpValue)}</span>
            <span className="txt">{fromWei(destroyValue)}</span>
          </div>
        </div>

        <div className="totalOption totalTop20">
          <div className="font12Option">
            <span className="txt">{t("节点总分红")}(USDT)</span>
            <span className="txt">{t("回购池")}(USDT)</span>
          </div>
          <div className="font16Option">
            <span className="txt">{fromWei(totalFundValue)}</span>
            <span className="txt">{fromWei(buyBack)}</span>
          </div>
        </div>
      </div>
      <div className="biTitle">{t("代币经济学")}</div>
      <div className="box vipBox">
        <div className="title">VIPL</div>
        <div className="hintTxt">
          Veil Labs {t("生态首个可移植身份协议的功能性代币")}
        </div>
        <div className="centerBox">
          <div className="centerTxtOption">
            <div className="centerTxt">{t("代币名称")}：VIPL</div>
            <div className="centerTxt">
              {t("总发行量")}：1.3{t("亿")}
            </div>
          </div>
          <div className="centerTxtOption centerTxtTop12">
            <div className="centerTxt">{t("发行价")}：0.08USDT</div>
            <div className="centerTxt">
              {t("初始发行量")}：1000{t("万")}
            </div>
          </div>
        </div>
        <div className="stepBox">
          <div className="lpOption">
            35%
            <div className="lpTxt">LP{t("池")}</div>
          </div>
          <div className="lpLine"></div>
          <div className="nodeOption">
            5%
            <div className="nodeTxt">{t("节点")}</div>
          </div>
          <div className="nodeLine"></div>
          <div className="donateOption">
            60%
            <div className="donateTxt">{t("捐赠池")}</div>
          </div>
        </div>

        <div className="addressBox">
          <div className="adddressTxt">
            <span className="spn1">{t("合约地址")}:</span>
            <span className="spn2">{EnvManager.veilPlusToken}</span>
          </div>
          <img
            src={copyIcon}
            onClick={() => copyClick()}
            className="copyIcon"
          ></img>
        </div>
      </div>
    </div>
  );
};
export default HomeCenterBox;
