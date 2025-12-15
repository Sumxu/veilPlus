import "./index.scss";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import { t } from "i18next";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { InfiniteScroll } from "antd-mobile";
import NoData from "@/components/NoData";
import { Spin } from "antd";
const AssetDetails: React.FC = () => {
  const tabArray = [
    {
      label: "TUSD",
      value: "3",
    },
    {
      label: "USD",
      value: "2",
    },
    {
      label: "TAX",
      value: "4",
    },
    {
      label: t("积分"),
      value: "5",
    },
  ];
  const [list, setList] = useState([]);
  const [listLoading, setListLoading] = useState<boolean>(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [tabIndex, setTabIndex] = useState<string>("3");
  // 获取更多
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "account/record",
      Method: "post",
      Data: {
        current: nexPage,
        size: 10,
        coinType: tabIndex,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length == dataParam.size) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };
  //加载数据
  const getDataPage = async () => {
    setList([]);
    setListLoading(true);
    const result = await NetworkRequest({
      Url: "account/record",
      Method: "post",
      Data: {
        current: 1,
        size: 10,
        coinType: tabIndex,
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
  function getBizTypeName(bizType: number) {
    const map: Record<number, string> = {
      1: t("积分释放"),
      2: t("购买商品"),
      3: t("提现"),
      4: t("质押"),
      5: t("赎回"),
      6: t("质押收益"),
      7: t("卖出商品"),
      8: t("团队加速"),
      9: t("平级加速"),
      10: t("直推"),
      11: t("间推"),
      12: t("派送"),
    };
    return map[bizType] ?? t("未知类型");
  }
  const tabChange = (value) => {
    setTabIndex(value);
    setCurrent(1);
  };
  useEffect(() => {
    getDataPage();
  }, [tabIndex]);
  useEffect(() => {
    getDataPage();
  }, []);
  return (
    <>
      <div className="asset-details-page">
        <LeftBackHeader title={t("资产明细")}></LeftBackHeader>
        <div className="tab-box">
          {tabArray.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => tabChange(item.value)}
                className={`tab-item ${
                  tabIndex == item.value && "tab-active-item"
                }`}
              >
                {item.label}
              </div>
            );
          })}
        </div>
        <div className="asset-details-list-box">
          <div className="header-list-box">
            <div className="header-item">{t("时间")}</div>
            <div className="header-item item-center">{t("类型")}</div>
            <div className="header-item">{t("数量")}</div>
          </div>
          <div className="list-box">
            {listLoading ? (
              <div className="assetDetailSpinBox">
                <Spin />
              </div>
            ) : list.length == 0 ? (
              <NoData />
            ) : (
              <div className="record-body">
                {list.map((item, index) => {
                  return (
                    <div className="list-item-box" key={index}>
                      <div className="item-option date">{item.createTime}</div>
                      <div className="item-option item-center">
                        <div>{getBizTypeName(item.bizType)}</div>
                      </div>
                      <div className="item-option">
                        {item.amount.toFixed(4)}
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
    </>
  );
};
export default AssetDetails;
