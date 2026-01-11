import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import NoData from "@/components/NoData";
import { Spin } from "antd";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import LeftBackHeader from "@/components/LeftBackHeader";
import { userAddress } from "@/Store/Store.ts";
import { InfiniteScroll } from "antd-mobile";
import { fromWei,formatAddress } from "@/Hooks/Utils";
import type { BigNumber } from "ethers";
interface listItem {
  blockTime: string;
  usdtAmount: BigNumber;
  address: string;
}

const TeamClaim: React.FC = () => {
  const walletAddress = userAddress((state) => state.address);
  const [list, setList] = useState<listItem[]>([]);
  // 列表是否加载
  const [listLoding, setListLoding] = useState<boolean>(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "nodeReward/page",
      Method: "get",
      Data: {
        current: nexPage,
        size: 20,
        address: walletAddress,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length === 20) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };
  const getDataList = async () => {
    setList([]);
    setListLoding(true);
    const result = await NetworkRequest({
      Url: "nodeReward/page",
      Method: "get",
      Data: {
        current: 1,
        size: 20,
        address: walletAddress,
      },
    });
    if (result.data.code === 200) {
      setList((prevList) => [...prevList, ...result.data.data.records]);
      if (result.data.data.records.length === 20) {
        setIsMore(true);
      } else {
        setIsMore(false);
      }
      setListLoding(false);
    } else {
      setListLoding(false);
    }
  };
  useEffect(() => {
    getDataList();
  }, []);
  // 当前钱包地址
  return (
    <>
      <div className="out-put-list-page">
        <LeftBackHeader title={t("节点收益记录")}></LeftBackHeader>
        <div className="item-box">
          <div className="list-item-header">
            <div className="header-txt header-txt-1">{t("时间")}</div>
            <div className="header-txt header-txt-2">{t("地址")}</div>
            <div className="header-txt header-txt-3">{t("数量")}</div>
          </div>
          <div className="list-item-option">
            {list.length == 0 ? (
              <NoData />
            ) : (
              <div className="record-body">
                {list.map((item, index) => {
                  return (
                    <div className="list-item" key={index}>
                      <div className="item-txt">{item.blockTime}</div>

                      <div className="item-txt-no">
                        {formatAddress(item.address)}
                      </div>
                      <div className="item-txt item-txt-right">
                        {fromWei(item.usdtAmount)}
                      </div>
                    </div>
                  );
                })}
                <InfiniteScroll loadMore={loadMoreAction} hasMore={isMore}>
                  <div>
                    {listLoding && (
                      <div className="loding flex flexCenter">
                        <Spin />
                      </div>
                    )}
                  </div>
                </InfiniteScroll>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default TeamClaim;
