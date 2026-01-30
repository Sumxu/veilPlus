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
import { fromWei, formatAddress } from "@/Hooks/Utils";
import { BigNumber } from "ethers";
import { storage } from "@/Hooks/useLocalStorage";
interface listItem {
  fromAddress: string;
  usdtAmount: BigNumber;
  rewardType: number;
  blockTime: string;
}
const OutputList: React.FC = () => {
  const walletAddress = storage.get('address');
  
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
      Url: "teamReward/page",
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
      Url: "teamReward/page",
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
  const rewardTypeTxt = (rewardType) => {
    switch (rewardType) {
      case 1:
        return t("推荐");
      case 2:
        return  t("团队");
      case 3:
        return  t("平级");
      default:
        return  t("未知类型");
    }
  };
  useEffect(() => {
    getDataList();
  }, []);
  // 当前钱包地址
  return (
    <>
      <div className="out-put-list-page">
        <LeftBackHeader title={t("团队奖励记录")}></LeftBackHeader>
        <div className="item-box">
          <div className="list-item-header">
            <div className="header-txt header-txt-32">{t("来源")}</div>
            <div className="header-txt header-txt-22">{t("收益USDT")}</div>
            <div className="header-txt header-txt-22">{t("类型")}</div>
            <div className="header-txt header-txt-22 header-txt-right">
              {t("时间")}
            </div>
          </div>
          <div className="list-item-option">
            {list.length == 0 ? (
              <NoData />
            ) : (
              <div className="record-body">
                {list.map((item, index) => {
                  return (
                    <div className="list-item" key={index}>
                      <div className="item-txt-one">
                        {formatAddress(item.fromAddress)}
                      </div>
                      <div className="item-txt-no header-txt-right">
                        {fromWei(item.usdtAmount, 18, true, 2)}
                      </div>
                      <div className="item-txt-no header-txt-right">
                        {rewardTypeTxt(item.rewardType)}
                      </div>
                      <div className="item-txt-no header-txt-right">
                        {item.blockTime}
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
export default OutputList;
