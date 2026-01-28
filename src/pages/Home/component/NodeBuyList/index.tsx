import "./index.scss";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { BigNumber, ethers } from "ethers";
import { Button, ProgressCircle } from "antd-mobile";
import { fromWei, Totast, toWei } from "@/Hooks/Utils.ts";
import { userAddress } from "@/Store/Store.ts";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { concatSign } from "@/Hooks/Utils.ts";
import { storage } from "@/Hooks/useLocalStorage";
import { UseSignMessage } from "@/Hooks/UseSignMessage.ts";
interface NodeItem {
  amount: BigNumber;
  nodeName: string;
  inventory: BigNumber; //库存
  max: BigNumber; //最大
  id: number; //node 编号
}
interface UserNodeInfo {
  nodeId: BigNumber; //0小 1大
  flg: boolean; //是否是节点
  weight: BigNumber;
  storeValue: BigNumber;
  rewardDebt: BigNumber;
}
interface NodeListClass {
  nodeList: NodeItem[];
  userNodeInfo: UserNodeInfo;
}
interface NodeInfo {
  address: string;
  coin: string;
  unclaimedCoin: string;
}
const NodeList: React.FC<NodeListClass> = (props) => {
  const { signMessage } = UseSignMessage(); //获取钱包签名
  const walletAddress = storage.get("address");
  const [nodeInfo, setNodeInfo] = useState<NodeInfo>({});
  const [btnIndexLoading, setBtnIndexLoading] = useState<number | null>(null);
  /**
   *
   * @param item 购买节点
   */
  const buyClick = async (index) => {
    if (index == 1) {
      if (valueTxt(index) == 0) return Totast(t("没有可领取的积分"), "info");
      const bigRes = concatSign(walletAddress);
      const sigResult = await signMessage(bigRes);
      setBtnIndexLoading(index);
      const result = await NetworkRequest({
        Url: "node/claim",
        Method: "post",
        Data: {
          address: walletAddress,
          msg: bigRes,
          signature: sigResult,
        },
      });
      setBtnIndexLoading(null);
      if (result.success) {
        Totast(t("领取成功"), "success");
        getNodeInfo()
      }
    }
    if (index == 0) {
      return Totast(t("待激活"), "info");
    }
  };
  /**
   *
   * @param item 节点item
   * @returns 返回已售卖的数量
   */
  const selllNumber = (item) => {
    const result = item.max.sub(item.inventory);
    return result.toString();
  };

  /**
   *
   * @param item 节点item
   * @returns 返回已售卖的数量
   */
  const selllWith = (item) => {
    const total = props.nodeList[props.userNodeInfo.nodeId].max.toString();
    const stock = selllNumber(item);
    const percent = (stock / total) * 100;
    return percent;
  };
  const getNodeInfo = async () => {
    const result = await NetworkRequest({
      Url: "node/info",
      Method: "get",
      Data: {
        address: walletAddress,
      },
    });
    if (result.success) {
      setNodeInfo(result.data.data);
    }
  };
  const labelTxt = (index) => {
    return index === 0 ? t("累计领取") : t("待领取积分");
  };
  const valueTxt = (index) => {
    return index === 0 ? nodeInfo?.coin || 0 : nodeInfo?.unclaimedCoin || 0;
  };

  useEffect(() => {
    getNodeInfo();
  }, []);
  return (
    <div className="nodeListBox">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B2FE" />
            <stop offset="100%" stopColor="#00FDE3" />
          </linearGradient>
        </defs>
      </svg>
      {props.nodeList.map((item, index) => {
        return (
          <div className="nodeItem" key={index}>
            <div
              className={`trapezoid ${
                props.userNodeInfo.nodeId == 0
                  ? "trapezoidOne"
                  : "trapezoidTwo"
              }`}
            >
              {" "}
              {/* {props.nodeList[props.userNodeInfo.nodeId].nodeName} */}
              {index == 0
                ? props.nodeList[props.userNodeInfo.nodeId].nodeName
                : `${t("每日赠送")}${
                    props.userNodeInfo.nodeId == 0 ? "50" : "100"
                  }`}
            </div>
            <div className="progressCircleItem">
              <ProgressCircle
                className="progressCircleReverse"
                percent={index == 0 ? 100 : 0}
                style={{
                  "--size": "98px",
                  "--track-width": "4px",
                  "--fill-color": "url(#gradientColor)",
                  "--track-color": "#284647",
                }}
              >
                <div className="progressCircleNumber">{valueTxt(index)}</div>
                <div className="progressCircleTxt">{labelTxt(index)}</div>
              </ProgressCircle>
            </div>
            <Button
              loadingText={t("正在加载")}
              loading={index == btnIndexLoading}
              className={`btn ${
                props.userNodeInfo.nodeId == 0 ? "oneBtn" : "twoBtn"
              }`}
              onClick={() => buyClick(index)}
            >
              {index == 0 ? t("待激活") : t("待领取")}
            </Button>
          </div>
        );
      })}
    </div>
  );
};
export default NodeList;
