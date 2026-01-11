import "./index.scss";
import { userAddress } from "@/Store/Store.ts";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { BigNumber, ethers } from "ethers";
import { Drawer, Flex, Spin } from "antd";
import { ProgressCircle } from "antd-mobile";
import BuyNftPopup from "@/pages/Node/component/BuyNftPopup";
import BackHeader from "@/components/BackHeader";
import { fromWei, Totast, toWei } from "@/Hooks/Utils.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import teamIcon from "@/assets/team/teamIcon.png";
import NodeList from "@/pages/Home/component/NodeList";
import NodeBuyList from "@/pages/Home/component/NodeBuyList";
interface nodeItem {
  amount: BigNumber;
  nodeName: string;
  inventory: BigNumber; //库存
  max: BigNumber; //最大
  id: number; //node 编号
}
interface userNodeInfo {
  nodeId: BigNumber; //0小 1大
  flg: boolean; //是否是节点
  weight: BigNumber;
  storeValue: BigNumber;
  rewardDebt: BigNumber;
}
const Node: React.FC = () => {
  const navigate = useNavigate();
  // 当前钱包地址
  const walletAddress = userAddress((state) => state.address);
  const [showBuyNftPopup, setShowBuyNftPopup] = useState<boolean>(false);
  const [userNodeInfo, setUserNodeInfo] = useState<userNodeInfo>({}); //用户节点信息
  const [nodeId, setNodeId] = useState<number>(0); //购买节点信息Id
  const [nodeList, setNodeList] = useState<nodeItem[]>([
    {
      amount: BigNumber.from("0"),
      nodeName: t("小节点"),
      max: BigNumber.from("0"),
      inventory: BigNumber.from("0"),
      id: 0,
      txtLst: [
        t("小节点合伙人赠送VIP1级别(激活即可享受)"),
        t(
          "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,小节点合伙人赠送250U账户(激活即可享受)"
        ),
      ],
    },
    {
      amount: BigNumber.from("0"),
      nodeName: t("大节点"),
      max: BigNumber.from("0"),
      inventory: BigNumber.from("0"),
      id: 1,
      txtLst: [
        t("大节点合伙人赠送VIP2级别(激活即可享受)"),
        t(
          "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,大节点合伙人赠送500U账户(激活即可享受)"
        ),
      ],
    },
  ]);
  const openPopupClick = () => {
    setShowBuyNftPopup(true);
  };
  const BuyNftPopupCloseChange = () => {
    setShowBuyNftPopup(false);
    //关闭弹窗后刷新数据
    initNodeInfo();
    getUserNodeInfo();
  };
  //总数量
  const totalNumer: number = 2600;

  //nft列表加载状态
  const [listLoading, setListLoading] = useState<boolean>(false);
  /**
   *
   * @param item 购买节点id
   */
  const buyClick = (id: number) => {
    setNodeId(id);
    setShowBuyNftPopup(true);
  };
  const myTeamPath = () => {
    navigate("/myTeam");
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
    const total = item.max.toString();
    const stock = selllNumber(item);
    const percent = (stock / total) * 100;
    return percent;
  };
  /**
   * 查询用户的节点信息
   */
  const getUserNodeInfo = async () => {
    const result = await ContractRequest({
      tokenName: "vailPlusNodeToken",
      methodsName: "userNode",
      params: [walletAddress],
    });
    setUserNodeInfo(result.value);
  };
  const nodeBtn = (item) => {
    if (item.id == Number(userNodeInfo.nodeId) && userNodeInfo.flg) {
      //已经是节点
      return <span>{t("待激活")}</span>;
    } else {
      return (
        <span>
          {fromWei(item.amount, 18, true, 2)}U{t("购买")}
        </span>
      );
    }
  };
  /**
   * 获取节点信息
   */
  const initNodeInfo = async () => {
    setListLoading(true);
    try {
      const nodeOne = await ContractRequest({
        tokenName: "vailPlusNodeToken",
        methodsName: "nodeInfo",
        params: [0],
      });

      const nodeTwo = await ContractRequest({
        tokenName: "vailPlusNodeToken",
        methodsName: "nodeInfo",
        params: [1],
      });

      if (!nodeOne.value || !nodeTwo.value) return;
      setNodeList([
        {
          nodeName: t("小节点"),
          amount: nodeOne.value[0],
          max: nodeOne.value[1],
          inventory: nodeOne.value[2],
          id: 0,
          txtLst: [
            t("小节点合伙人赠送VIP1级别(激活即可享受)"),
            t(
              "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,小节点合伙人赠送250U账户(激活即可享受)"
            ),
          ],
        },
        {
          nodeName: t("大节点"),
          amount: nodeTwo.value[0],
          max: nodeTwo.value[1],
          inventory: nodeTwo.value[2],
          id: 1,
          txtLst: [
            t("大节点合伙人赠送VIP2级别(激活即可享受)"),
            t(
              "赠送节点合伙人抢购金额的50%捐赠矿池收益账户,大节点合伙人赠送500U账户(激活即可享受)"
            ),
          ],
        },
      ]);
    } catch (error) {
    } finally {
      setListLoading(false);
    }
  };
  useEffect(() => {
    initNodeInfo();
    getUserNodeInfo();
  }, []);
  return (
    <>
      <div className="home-page">
        <BackHeader isHome={true} />
        <div className="header-box">
          <div className="header-box-image">
            <div className="appName">VEIL PLUS {t("生态节点")}</div>
            <div className="center-number-option">
              <div className="number-option">
                <span className="spn-1">{t("限量")}</span>
                <span className="spn-2">{totalNumer}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="nodesBox">
          {listLoading ? (
            <div className="assetDetailSpinBox">
              <Spin />
            </div>
          ) : !userNodeInfo.flg ? (
            <NodeList
              showBuyNftChange={buyClick}
              nodeList={nodeList}
              userNodeInfo={userNodeInfo}
            />
          ) : (
            <NodeBuyList nodeList={nodeList} userNodeInfo={userNodeInfo} />
          )}
        </div>
        <div className="teamBtn" onClick={() => myTeamPath()}>
          <img src={teamIcon} className="teamIcon"></img>
          <span className="spnTxt">{t("我的团队")}</span>
        </div>
      </div>
      <Drawer
        rootClassName="buyNodeDrawer"
        maskClosable={true}
        destroyOnHidden={true}
        height={"auto"}
        closeIcon={false}
        open={showBuyNftPopup}
        title=""
        placement="bottom"
      >
        <BuyNftPopup nodeId={nodeId} onClose={() => BuyNftPopupCloseChange()} />
      </Drawer>
    </>
  );
};
export default Node;
