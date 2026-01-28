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
import { storage } from "@/Hooks/useLocalStorage";
import { fromWei } from "@/Hooks/Utils";
interface listItem {
  blockTime: string;
  erc20Amount: string;
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
      Url: "reward/page",
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
      Url: "reward/page",
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
    getDataList()
  }, []);
  // 当前钱包地址
  return (
    <>
      <div className="out-put-list-page">
        <LeftBackHeader title={t("收益记录")}></LeftBackHeader>
        <div className="item-box">
          <div className="list-item-header">
            <div className="header-txt header-txt-1">{t("时间")}</div>
            <div className="header-txt header-txt-2">{t("状态")}</div>
            <div className="header-txt header-txt-3">{t("金额(VIPL)")}</div>
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

                      <div className="item-txt-no">已完成</div>
                      <div className="item-txt item-txt-right">
                        +{fromWei(item.erc20Amount)}
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
