import "./index.scss";
import type { FC } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import React, { useEffect, useState } from "react";
import { ProgressCircle } from "antd-mobile";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import rightIcon from "@/assets/basic/right.png";
import logoIcon from "@/assets/basic/logo.png";
import { t } from "i18next";
import { InfiniteScroll } from "antd-mobile";
import { Spin } from "antd";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber } from "ethers";
import NoData from "@/components/NoData";
import type { DepositItem } from "@/Ts/DepositList";
import { fromWei } from "@/Hooks/Utils";
const DonateStartListPage: FC = () => {
  const [isMore, setIsMore] = useState<boolean>(false);
  const [list, setList] = useState<DepositItem[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const walletAddress = userAddress((state) => state.address);

  const [current, setCurrent] = useState<number>(1);
  const [tabIndex, setTabIndex] = useState<string>("0");
  const STATUS_CONFIG: Record<number, { text: string; className: string }> = {
    1: { text: "产出中", className: "producing" },
    2: { text: "已出局", className: "out" },
  };
  const renderStatus = (status: number) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG[0];
    return (
      <div className={`statusTxt ${config.className}`}>
        {status == 1 && <div className="line" />}
        <div className="txt">{t(config.text)}</div>
      </div>
    );
  };
  const tabList = [
    {
      name: t("全部"),
      value: "0",
    },
    {
      name: t("挖矿中"),
      value: "1",
    },
    {
      name: t("已出局"),
      value: "2",
    },
  ];

  const getDataList = async () => {
    setList([]);
    setPageLoading(true);
    const result = await NetworkRequest({
      Url: "deposit/page",
      Method: "get",
      Data: {
        current: 1,
        size: 10,
        address: walletAddress,
        status: tabIndex == 0 ? "" : tabIndex,
      },
    });
    setPageLoading(false);
    if (result.success) {
      setList((prevList) => [...prevList, ...result.data.data.records]);
      if (result.data.data.records.length == 10) {
        setIsMore(true);
      } else {
        setIsMore(false);
      }
    }
  };
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "deposit/page",
      Method: "get",
      Data: {
        current: 1,
        size: 10,
        address: walletAddress,
        status: tabIndex == 0 ? " " : tabIndex,
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
  useEffect(() => {
    getDataList();
    setCurrent(1);
  }, [tabIndex]);
  return (
    <div className="DonateStartListPage">
      <LeftBackHeader title={t("我的捐赠")}></LeftBackHeader>
      <div className="tabBox">
        {tabList.map((item, index) => {
          return (
            <div
              onClick={() => setTabIndex(item.value)}
              className={`tabOption ${item.value == tabIndex ? "checked" : ""}`}
              key={index}
            >
              {item.name}
            </div>
          );
        })}
      </div>

      <div className="contentList">
        {pageLoading && (
          <div className="assetDetailSpinBox">
            <Spin />
          </div>
        )}
        {!pageLoading && list.length == 0 ? (
          <NoData />
        ) : (
          list.map((item, index) => {
            return (
              <div className="itemBox" key={index}>
                <div className="headerOption">
                  <div className="tag opacity">#1-000083</div>
                  <div className="rightOption">
                    {renderStatus(item.status)}
                    <div className="dateTime">{item.blockTime}</div>
                  </div>
                </div>
                <div className="centerBox">
                  <div className="leftOption">
                    <img src={logoIcon} className="logoIcon"></img>
                  </div>
                  <div className="rightOption">
                    <div className="rightItem">
                      <div className="txt">{t("预计总收益")}</div>
                      <div className="txt2">{fromWei(item.gasValues)} VIPL</div>
                    </div>
                    <div className="rightItem rightItemLeft">
                      <div className="txt">{t("参与金额")}</div>
                      <div className="txt2">{fromWei(item.amount)} USDT</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <InfiniteScroll
          loadMore={loadMoreAction}
          hasMore={isMore}
        ></InfiniteScroll>
      </div>
    </div>
  );
};
export default DonateStartListPage;
