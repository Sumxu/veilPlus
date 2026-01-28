import "./index.scss";
import { t } from "i18next";
import checkIcon from "@/assets/team/check.png";
import back from "@/assets/basic/back.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber, ethers } from "ethers";
import { formatAddress, fromWei, Totast } from "@/Hooks/Utils";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import ContractSend from "@/Hooks/ContractSend.ts";
import { Button } from "antd-mobile";
import { storage } from "@/Hooks/useLocalStorage";

interface userNodeInfo {
  nodeId: BigNumber; //0小 1大
  flg: boolean; //是否是节点
  weight: BigNumber;
  storeValue: BigNumber;
  rewardDebt: BigNumber;
}
interface TeamInfo {
  teamPerf?: BigNumber; //团队业绩
  selfPerf?: BigNumber; //个人业绩
  directCount?: number; //直推人数
  teamCount?: number; //团队人数
}
const NodeDetail: React.FC = () => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const walletAddress = storage.get('address');
  const [nodePref, setNodePref] = useState<string | number>(0);
  const [nodeId, setNodeId] = useState<BigNumber>(BigNumber.from("0")); //节点类型
  const [pingValue, setPingValue] = useState<BigNumber>(BigNumber.from("0")); //待领取收益
  const [claimTotalValue, setClaimTotalValue] = useState<BigNumber>(
    BigNumber.from("0"),
  ); //节点累计收益
  const hintTxts = [
    t("全网入金2% 永久加权分红"),
    t("买入手续费2% 永久加权分红"),
    t("卖出手续费3% 永久加权分红"),
    t("盈利税4% 永久加权分红"),
    t("防暴跌手续费60% 永久加权分红"),
  ];
  const mapTxts = {
    0: [
      t("小节点合伙人赠送VIP1级别(激活即可享受)"),
      t(
        "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,小节点合伙人赠送250U账户(激活即可享受)",
      ),
      t("前1～500位: 奖励2000枚VIPL"),
      t("前501～1000位: 奖励1400枚VIPL"),
      t("前1001～1600位: 奖励980枚VIPL"),
    ],
    1: [
      t("大节点合伙人赠送VIP2级别(激活即可享受)"),
      t(
        "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,大节点合伙人赠送500U账户(激活即可享受)",
      ),
      t("前1～300位: 奖励5000枚VIPL"),
      t("前301～600位: 奖励3500枚VIPL"),
      t("前601～1000位: 奖励2450枚VIPL"),
    ],
  };
  const getNodeInfo = async () => {
    const result = await ContractRequest({
      tokenName: "vailPlusNodeToken",
      methodsName: "userNode",
      params: [walletAddress],
    });
    if (result.value) {
      setNodeId(result.value.nodeId);
      setClaimTotalValue(result.value.claimTotalValue);
    }
  };
  //获得节点总业绩
  const getNodePerf = async () => {
    const nodeRes = await NetworkRequest({
      Url: "user/info",
      Method: "get",
      Data: {
        address: walletAddress,
      },
    });
    if (nodeRes.success) {
      setNodePref(nodeRes.data.data.nodePerf);
    }
  };
  const getPending = async () => {
    const result = await ContractRequest({
      tokenName: "vailPlusNodeToken",
      methodsName: "pending",
      params: [walletAddress],
    });
    if (result.value) {
      setPingValue(result.value);
    }
  };

  const submitClick = async () => {
    if (pingValue.isZero()) {
      return Totast("不可领取", "info");
    }
    try {
      setSubmitLoading(true);
      const result = await ContractSend({
        tokenName: "vailPlusNodeToken",
        methodsName: "reward",
        params: [],
      });
      if (result.value) {
      }
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  };
  useEffect(() => {
    getNodeInfo();
    getNodePerf();
    getPending();
  }, []);
  return (
    <div className="NodeDetailBg">
      <div className="NodeDetailPage">
        <div className="leftIcon">
          <img
            src={back}
            className="backIcon"
            onClick={() => navigate(-1)}
          ></img>
        </div>
        <div className="hintTxt">
          Hi,{t("欢迎")}
          <div className="TagBox">
            <div className="tagName">{t("用户")}</div>
            <div className="tagNo">{formatAddress(walletAddress)}</div>
          </div>
        </div>
        <div className="hintTxts">
          {t("来到")} VEIL PLUS {t("生态节点中心")}
        </div>
        <div className="box usdtInfo">
          <div className="usdtTop">
            <div className="title">{t("节点总业绩")}(USDT)</div>
            <div className="number">{fromWei(nodePref)}</div>
          </div>
          <div className="usdtBottom">
            <div className="usdtItemBottom">
              <div className="title">{fromWei(claimTotalValue)}</div>
              <div className="number">{t("节点累计收益")}(USDT)</div>
              <div
                className="btn btnList"
                onClick={() => navigate("/TeamClaim")}
              >
                {t("明细记录")}
              </div>
            </div>
            <div className="usdtItemBottom">
              <div className="title txtColor">{fromWei(pingValue)}</div>
              <div className="number">{t("待领取节点收益")}(USDT)</div>
              <Button
                className="btn btnAward"
                loading={submitLoading}
                loadingText={t("确认中")}
                onClick={() => {
                  submitClick();
                }}
              >
                {t("领取收益")}
              </Button>
            </div>
          </div>
        </div>

        <div className="buy-hint-option">
          <div className="hintOption">{t("VEIL PLUS重磅上线")}</div>
          <div className="hintBoldTxt">{t("捐赠挖矿稀缺席位限时开抢")}</div>
          <div className="hintBoldTxt">
            {t("抢占节点权益，享全网永久加权分红")}
          </div>
          <div className="hintBoldTxt">
            🔥{t("小节点「500席」：一次性捐赠1000U")}
          </div>
          <div className="hintBoldTxt">
            💎{t("大节点「150席」：一次性捐赠2000U")}
          </div>
          <div className="hintBoldTxt top12">
            {t("五大核心加权分红 收益拉满")}
          </div>
          <div className="right-option">
            {hintTxts.map((item, index) => {
              return (
                <div className="txtOption" key={index}>
                  <img className="iconIcon" src={checkIcon}></img>
                  <div className="txt-1-item">{item}</div>
                </div>
              );
            })}
          </div>
          <div className="hintBoldTxt top12">
            {t('核心须知：账户持续保持捐赠额度，即可永久享有以上全部分红权益！')}
          </div>
          <div className="hintBoldTxt top12">
            {t('稀缺名额先到先得，抢占全网分红新机遇！')}
          </div>
        </div>
      </div>
    </div>
  );
};
export default NodeDetail;
