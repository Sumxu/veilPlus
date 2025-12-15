import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import copyIcon from "@/assets/my/copy.png";
import { t } from "i18next";
import { InfiniteScroll } from "antd-mobile";
import { userAddress } from "@/Store/Store.ts";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { Spin } from "antd";
import {
  Totast,
  copyToClipboard,
  formatDate,
  SubAddress,
} from "@/Hooks/Utils.ts";
import NoData from "@/components/NoData";
export interface listItem {
  address?: string;
  createTime?: string;
  myPerf?: number;
}

const levelMap = [
  { performance: 10000, accelerate: 10, level: "1" },
  { performance: 50000, accelerate: 15, level: "2" },
  { performance: 200000, accelerate: 20, level: "3" },
  { performance: 600000, accelerate: 25, level: "4" },
  { performance: 1500000, accelerate: 30, level: "5" },
  { performance: 5000000, accelerate: 35, level: "6" },
];
const MyTeam: React.FC = () => {
  const [location, setLocation] = useState(""); //网页地址

  const walletAddress = userAddress().address;

  const [teamInfo, setTeamInfo] = useState<object>({});
  const [list, setList] = useState<listItem[]>([]);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);

  const [current, setCurrent] = useState<number>(1);
  //数据加载中
  const [listLoading, setListLoading] = useState<boolean>(false);

  function getLevel(level: number) {
    return levelMap.filter((item) => level == item.level).pop() || null;
  }

  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "userRecord/ticketRecord",
      Data: {
        current: nexPage,
        size: 10,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length == 10) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };

  const getDataPage = async () => {
    const result = await NetworkRequest({
      Url: "team/info",
      Method: "get",
    });
    if (result.success) {
      setTeamInfo(result.data.data);
    }
  };

  const copyAction = () => {
    const origin = window.location.origin;

    const inviteUrl = `${origin}/login?invite=${walletAddress}`;
    copyToClipboard(inviteUrl, t("邀请链接已复制"));
  };

  const getTeamList = async () => {
    setList([]);
    setListLoading(true);
    const result = await NetworkRequest({
      Url: "team/invitations",
      Method: "post",
      Data: {
        current: 1,
        size: 10,
      },
    });
    if (result.success) {
      setList((prevList) => [...prevList, ...result.data.data.records]);
      if (result.data.data.records.length == 10) {
        setIsMore(true);
      } else {
        setIsMore(false);
      }
    }
    setListLoading(false);
  };
  useEffect(() => {
    getDataPage();
    getTeamList(); //团队列表
    setLocation(window.location.origin);
  }, []);
  return (
    <div className="myTeamPage">
      <LeftBackHeader title={t("我的团队")}></LeftBackHeader>
      <div className="teamContentBox">
        <div className="headerBox">
          <div className="itemOption">
            <div className="number">{teamInfo.teamCount}</div>
            <div className="txt">{t("团队人数")}</div>
          </div>
          <div className="line"></div>
          <div className="itemOption">
            <div className="number">{teamInfo.directCount}</div>
            <div className="txt">{t("直推人数")}</div>
          </div>
        </div>
        <div className="box usdtInfo">
          <div className="usdtTop">
            <div className="usdtTopItem">
              <div className="usdtTxt">{t("团队总业绩")}</div>
              <div className="usdtNumber">{teamInfo.teamPerf || 0} USDT</div>
            </div>
            <div className="usdtTopItem">
              <div className="usdtTxt">{t("小区业绩")}</div>
              <div className="usdtNumber">
                {teamInfo.communityPerf || 0} USDT
              </div>
            </div>
          </div>
          <div className="usdtEndOption">
            {teamInfo.level == 0 ? (
              t("暂无团队")
            ) : (
              <>
                <div className="itemEnd">
                  <span className="spn1">{t("团队等级")}：</span>
                  <span className="spn2">
                    S{getLevel(teamInfo.level)?.level}
                  </span>
                </div>

                <div className="itemEnd">
                  <span className="spn1">{t("团队加速")}：</span>
                  <span className="spn2">
                    {getLevel(teamInfo.level)?.accelerate}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {teamInfo.myPerf != 0 && (
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
        )}
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
                        {item.myPerf}
                      </div>
                    </div>
                  </div>
                );
              })}

              <InfiniteScroll
                loadMore={loadMoreAction}
                hasMore={isMore}
              ></InfiniteScroll>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyTeam;
