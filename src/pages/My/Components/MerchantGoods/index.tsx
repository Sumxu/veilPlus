import "./index.scss";
import React, { useEffect, useState } from "react";
import { Input } from "antd-mobile";
import { SearchOutline } from "antd-mobile-icons";
import usdtIcon from "@/assets/home/USDT.png";
import { t } from "i18next";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import NoData from "@/components/NoData";
import { InfiniteScroll } from "antd-mobile";
interface listItem {
  id: number;
  name: string;
  pic: string;
  classify: string;
  price: string;
  sellCount: string;
  publishTime: string;
}
const MerchantGoods: React.FC = () => {
  const tabArray = [
    {
      label: t("全部"),
      value: "0",
    },
    {
      label: t("安品区"),
      value: "1",
    },
    {
      label: t("优品区"),
      value: "2",
    },
    {
      label: t("臻品区"),
      value: "3",
    },
  ];
  const [current, setCurrent] = useState<number>(1);
  const [tabIndex, setTabIndex] = useState<string>("0");
  const [inputValue, setInputValue] = useState<string>("");
  const [list, setList] = useState<listItem[]>([]);
  const [isMore, setIsMore] = useState<boolean>(false);
  const getGoodsList = async () => {
    setList([]);
    const result = await NetworkRequest({
      Url: "merchant/products",
      Method: "post",
      Data: {
        current: 1,
        size: 10,
        name: inputValue,
        classify: tabIndex == 0 ? "" : tabIndex,
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
  };
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "merchant/products",
      Method: "post",
      Data: {
        current: nexPage,
        size: 10,
        name: inputValue,
        classify: tabIndex == 0 ? "" : tabIndex,
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
    getGoodsList();
  }, []);

  useEffect(() => {
    getGoodsList();
  }, [inputValue, tabIndex]);

  return (
    <div className="MerchantGoods">
      <div className="hintTxt">{t('店铺商品')}</div>
      <div className="inputBox">
        <div className="searchIcon">
          <SearchOutline fontSize={14} color="rgba(255,255,255,0.35)" />
        </div>
        <Input
          placeholder={t("输入商品名称/编号搜索")}
          className="inputClass"
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          style={{
            "--color": "#fff",
            "--font-size": "14px",
            "--placeholder-color": "rgba(255,255,255,0.35)",
          }}
        ></Input>
      </div>
      <div className="tab-box">
        {tabArray.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => setTabIndex(item.value)}
              className={`tab-item ${
                tabIndex == item.value && "tab-active-item"
              }`}
            >
              {item.label}
            </div>
          );
        })}
      </div>
      <div className="goodsListBox">
        {list.length == 0 ? (
          <NoData />
        ) : (
          <div className="record-body">
            {list.map((item, index) => {
              return (
                <div className="goodsItem" key={index}>
                  <div className="topOption">
                    <img src={item.pic} className="goodsImgLeft"></img>
                    <div className="goodsRight">
                      <div className="goodsName">{item.name}</div>
                      <div className="goodsTypeTxt">{item.classify}</div>
                      <div className="goodsPriceOption">
                        <img src={usdtIcon} className="usdtIcon"></img>
                        <span className="price">{item.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="endOption">
                    <span className="spn">
                      {t("上架日期")}：{item.publishTime}
                    </span>
                    <span className="spn">
                      {t("销量")}：{item.sellCount}
                    </span>
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
  );
};
export default MerchantGoods;
