import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import wallets from "@/assets/basic/wallet.png";
import { t } from "i18next";
import { InfiniteScroll } from "antd-mobile";
import { userAddress } from "@/Store/Store.ts";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { Spin } from "antd";
import {
  Totast,
  copyToClipboard,
  copyText,
  formatDate,
  SubAddress,
  fromWei,
} from "@/Hooks/Utils.ts";
import NoData from "@/components/NoData";
import { BigNumber } from "ethers";
interface listItem {
  address?: string | number;
  createTime?: string;
  teamPerf?: number;
}
interface TeamInfo {
  teamPerf?: BigNumber; //团队业绩
  selfPerf?: BigNumber; //个人业绩
  directCount?: number; //直推人数
  teamCount?: number; //团队人数
}
const MyTeam: React.FC = () => {
  const [location, setLocation] = useState(""); //网页地址
  const walletAddress = userAddress().address;
  const [maximumDirectPerf, setMaximumDirectPerf] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    teamPerf: BigNumber.from(0),
    selfPerf: BigNumber.from(0),
    directCount: 0,
    teamCount: 0,
  });
  const [list, setList] = useState<listItem[]>([]);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  //数据加载中
  const [listLoading, setListLoading] = useState<boolean>(false);

  const [nodePref, setNodePref] = useState<string | number>(0);

  const getDataPage = async () => {
    const result = await NetworkRequest({
      Url: "user/directList",
      Method: "get",
      Data: {
        address: walletAddress,
      },
    });
    if (result.success) {
      setList(result.data.data);
    }
    //节点业绩
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

  const copyAction = () => {
    const origin = window.location.origin;
    const inviteUrl = `${origin}/home?invite=${walletAddress}`;
    copyText(inviteUrl);
  };
  const xiaoQuUsdt = () => {
    return teamInfo.teamPerf.sub(maximumDirectPerf);
  };
  //业绩 人数信息
  const getTeamInfo = async () => {
    const result = await ContractRequest({
      tokenName: "vailPlusUserToken",
      methodsName: "userInfo",
      params: [walletAddress],
    });

    if (result.value) {
      setTeamInfo({
        teamPerf: result.value[5],
        selfPerf: result.value[6],
        directCount: result.value[7],
        teamCount: result.value[8],
      });
    }
  };
  //得到大区业绩
  const getMaximumDirectPerf = async () => {
    const result = await ContractRequest({
      tokenName: "vailPlusUserToken",
      methodsName: "maximumDirectPerf",
      params: [walletAddress],
    });
    if (result.value) {
      setMaximumDirectPerf(result.value);
    }
  };
  useEffect(() => {
    getDataPage();
    getTeamInfo();
    getMaximumDirectPerf();
    const origin = window.location.origin;
    const inviteUrl = `${origin}/home?invite=${walletAddress}`;
    setLocation(inviteUrl);
  }, []);
  return (
    <div className="myTeamPage">
      <LeftBackHeader title={t("我的团队")}></LeftBackHeader>
      <div className="teamContentBox">
        <div className="headerBox">
          <div className="itemOption">
            <div className="number">{teamInfo.teamCount?.toString()}</div>
            <div className="txt">{t("团队人数")}</div>
          </div>
          <div className="line"></div>
          <div className="itemOption">
            <div className="number">{teamInfo.directCount?.toString()}</div>
            <div className="txt">{t("直推人数")}</div>
          </div>
        </div>
        <div className="box usdtInfo">
          <div className="usdtTop">
            <div className="title">{t("团队总业绩")}(USDT)</div>
            <div className="number">
              {" "}
              {fromWei(teamInfo.teamPerf, 18, true, 2)}{" "}
            </div>
          </div>
          <div className="usdtBottom">
            <div className="usdtItemBottom">
              {maximumDirectPerf && teamInfo.teamPerf && (
                <div className="title">
                  {fromWei(xiaoQuUsdt(), 18, true, 2)} USDT
                </div>
              )}

              <div className="number">{t("小区业绩")}</div>
            </div>
            <div className="usdtItemBottom">
              <div className="title">
                {" "}
                {fromWei(nodePref, 18, true, 2) || "0.00"} USDT
              </div>
              <div className="number">{t("节点业绩")}</div>
            </div>
          </div>
        </div>

        <div className="box inviteBox">
          <div className="inviteEnd">
            <span className="spn1">{t("邀请链接")}：</span>
            <span className="spn2">{location}</span>
            <div
              className="copyIcon"
              onClick={() => {
                copyAction();
              }}
            >
              复制
            </div>
          </div>
        </div>
        <div className="awardBox">
          <div className="itemBox">
            <div className="txt">{t('累计团队奖励')}(USDT)</div>
            <div className="number">9800.00</div>
            <div className="btn btnList">{t('明细记录')}</div>
          </div>
          <div className="itemBox">
            <div className="txt">{t('待领取团队奖励')}(USDT)</div>
            <div className="number awardColor">200.00</div>
            <div className="btn btnAward">{t('领取奖励')}</div>
          </div>
        </div>
        <div className="hintTeamListTxt">{t("团队列表")}</div>
        <div className="box teamList">
          <div className="teamHeaderOption">
            <div className="itemTxtOne">{t("钱包地址")}</div>
            <div className="itemTxt">{t("时间")}</div>
            <div className="itemTxt itemTxtRight">{t("贡献业绩")}(USDT)</div>
          </div>
          {listLoading ? (
            <div className="myTeamSpinBox">
              <Spin />
            </div>
          ) : list.length == 0 ? (
            <NoData />
          ) : (
            <div className="record-body">
              {list.map((item, index) => {
                return (
                  <div className="teamListBox" key={index}>
                    <div className="teamItem">
                      <div className="walletsOption">
                        <img src={wallets} className="walletsIcon"></img>
                      </div>
                      <div className="itemTxt marginLeft-6">
                        {SubAddress(item.address)}
                      </div>
                      <div className="itemTxt">{item.createTime}</div>
                      <div className="itemTxt txtUsdt itemTxtRight">
                        {fromWei(item.teamPerf) || "0"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyTeam;
