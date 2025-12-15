import "./index.scss";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import OrderItem from "../../Components/OrderItem";
import OrderHeaderSearch from "../../Components/OrderHeaderSearch";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { InfiniteScroll } from "antd-mobile";
import { t } from "i18next";
import NoData from "@/components/NoData";
import { Spin } from "antd";

const Order: React.FC = () => {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  // 列表是否加载
  const [listLoding, setListLoding] = useState<boolean>(false);
  // 是否还有更多数据可以加载
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [orderSn, setOrderSn] = useState<string>("");
  const [dataParam, setDataParam] = useState({
    current: 1,
    size: 10,
  });
  const tabArray = [
    {
      label: t("全部"),
      value: "0",
    },
    {
      label: t("已购买"),
      value: "1",
    },
    {
      label: t("已发货"),
      value: "2",
    },
    {
      label: t("已完成"),
      value: "3",
    },
  ];
  const [tabIndex, setTabIndex] = useState<string>("0");
  const orderItemClick = (id) => {
    navigate(`/orderDetail?id=${id}`);
  };
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "order/list",
      Method: "post",
      Data: {
        current: nexPage,
        size: dataParam.size,
        orderSn,
        status: tabIndex == 0 ? "" : tabIndex,
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

  const getDataList = async () => {
    setList([]);
    setPageLoading(true);
    const result = await NetworkRequest({
      Url: "order/list",
      Method: "post",
      Data: {
        current: 1,
        size: dataParam.size,
        orderSn,
        status: tabIndex == 0 ? "" : tabIndex,
      },
    });
    setPageLoading(false);
    if (result.success) {
      setList((prevList) => [...prevList, ...result.data.data.records]);
      if (result.data.data.records.length == dataParam.size) {
        setIsMore(true);
      } else {
        setIsMore(false);
      }
    }
  };
  const tabChange = (value) => {
    setTabIndex(value);
  };

  useEffect(() => {
    getDataList();
    setCurrent(1);
  }, [tabIndex]);
  useEffect(() => {
    if (orderSn == "") return;
    getDataList();
    setCurrent(1);
  }, [orderSn]);
  return (
    <>
      <div className="order-page">
        <OrderHeaderSearch
          inputChange={(value) => {
            setOrderSn(value);
          }}
        ></OrderHeaderSearch>
        <div className="order-content-box">
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
          <div className="order-list-box">
            {pageLoading && (
              <div className="assetDetailSpinBox">
                <Spin />
              </div>
            )}
            {!pageLoading && list.length == 0 ? (
              <NoData />
            ) : (
              <div className="record-body">
                {list.map((item, index) => {
                  return (
                    <OrderItem
                      data={item}
                      key={index}
                      onClickDetail={(id) => orderItemClick(id)}
                    ></OrderItem>
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
export default Order;
