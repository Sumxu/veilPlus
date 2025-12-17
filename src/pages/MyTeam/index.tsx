import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import copyIcon from "@/assets/my/copy.png";
import { t } from "i18next";
import { InfiniteScroll } from "antd-mobile";
import { userAddress } from "@/Store/Store.ts";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { Spin } from "antd";
import {
  Totast,
  copyToClipboard,
  formatDate,
  SubAddress,
  fromWei,
} from "@/Hooks/Utils.ts";
import NoData from "@/components/NoData";
import { BigNumber } from "ethers";
interface listItem {
  address?: string;
  createTime?: string;
  selfPerf?: number;
}
interface TeamInfo {
  teamPerf?: BigNumber; //团队业绩
  selfPerf?: BigNumber; //个人业绩
  directCount?: BigNumber; //直推人数
  teamCount?: BigNumber; //团队人数
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
    directCount: BigNumber.from(0),
    teamCount: BigNumber.from(0),
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
    if (nodeRes.value) {
      setNodePref(nodeRes.value || 0);
    }
  };

  const copyAction = () => {
    const origin = window.location.origin;

    const inviteUrl = `${origin}/home?invite=${walletAddress}`;
    copyToClipboard(inviteUrl, t("邀请链接已复制"));
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
    setLocation(window.location.origin);
  }, []);
  return (
    <div className="myTeamPage">
      <LeftBackHeader title={t("我的团队")}></LeftBackHeader>
      <div className="teamContentBox">
        <div className="headerBox">
          <div className="itemOption">
            <div className="number">{fromWei(teamInfo.teamCount)}</div>
            <div className="txt">{t("团队人数")}</div>
          </div>
          <div className="line"></div>
          <div className="itemOption">
            <div className="number">{fromWei(teamInfo.directCount)}</div>
            <div className="txt">{t("直推人数")}</div>
          </div>
        </div>
        <div className="box usdtInfo">
          <div className="usdtTop">
            <div className="usdtTopItem">
              <div className="usdtTxt">{t("团队总业绩")}</div>
              <div className="usdtNumber">
                {fromWei(teamInfo.teamPerf)} USDT
              </div>
            </div>
            <div className="usdtTopItem">
              <div className="usdtTxt">{t("小区业绩")}</div>
              {maximumDirectPerf && teamInfo.teamPerf && (
                <div className="usdtNumber">{fromWei(xiaoQuUsdt())} USDT</div>
              )}
            </div>
            <div className="usdtTopItem">
              <div className="usdtTxt">{t("节点业绩")}</div>
              <div className="usdtNumber">
                {fromWei(nodePref)||'0.0000'} USDT
              </div>
            </div>
          </div>
        </div>

        <div className="box inviteBox">
          <div className="inviteEnd">
            <span className="spn1">{t("邀请链接")}：</span>
            <span className="spn2">{location}</span>
            <img
              src={copyIcon}
              className="copyIcon"
              onClick={() => {
                copyAction();
              }}
            ></img>
          </div>
        </div>

        <div className="hintTeamListTxt">{t("团队列表")}</div>
        <div className="box teamList">
          <div className="teamHeaderOption">
            <div className="itemTxt">{t("钱包地址")}</div>
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
                      <div className="itemTxt">{SubAddress(item.address)}</div>
                      <div className="itemTxt">{item.createTime}</div>
                      <div className="itemTxt txtUsdt itemTxtRight">
                        {fromWei(item.teamPerf)}
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
