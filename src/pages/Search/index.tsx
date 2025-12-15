import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import { SearchOutline } from "antd-mobile-icons";
import { Input } from "antd-mobile";
import { t } from "i18next";
import { Spin } from "antd";
import { userAddress } from "@/Store/Store.ts";
import NoData from "@/components/NoData";
import { useZoneConfig } from "@/config/classifyData";
import goodsImg from "@/assets/home/goodsImg.png";
import usdtIcon from "@/assets/home/USDT.png";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
interface RecordItem {
  pic: string;
  [key: string]: any;
}
interface RecordItem {
  id: number;
  name: string;
  pic: string; // 后端返回的 pic
  picImg?: string; // 我们本地添加的新字段
  // 你可以加更多字段...
}

const Search: React.FC = () => {
  const [list, setList] = useState<RecordItem[]>([]);
  const { getZoneInfo } = useZoneConfig();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  // 列表是否加载
  const [listLoding, setListLoding] = useState<boolean>(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [goodsName, setGoodsName] = useState<string>("");
  const [dataParam, setDataParam] = useState({
    current: 1,
    isHome: true,
    size: 10,
  });
  // 获取更多列表数据
  const loadMoreAction = async () => {
    if (!isMore) {
      return;
    }
    const nexPage = current + 1;
    setCurrent(nexPage);
    setListLoding(true);
    await NetworkRequest({
      Url: "product/list",
      Method: "post",
      Data: {
        current: nexPage,
        size: dataParam.size,
        isHome: dataParam.isHome,
        name: goodsName,
      },
    })
      .then((res) => {
        if (res.success) {
          setList((prevList) => [
            ...prevList,
            ...res.data.data.records.map((item: RecordItem) => {
              const picImg = item.pic?.includes(",")
                ? item.pic.split(",")[0]
                : item.pic;

              return {
                ...item,
                picImg,
              };
            }),
          ]);
          if (res.data.data.records.length == dataParam.size) {
            setIsMore(true);
          } else {
            setIsMore(false);
          }
        }
      })
      .finally(() => {
        setListLoding(false);
      });
  };

  const navigate = useNavigate();
  const goodsItemClick = (item) => {
    navigate(`/goodsDetail?id=${item.id}`);
  };
  const getDataList = async () => {
    setList([]);
    setPageLoading(true);
    const result = await NetworkRequest({
      Url: "product/list",
      Method: "post",
      Data: {
        current: 1,
        size: dataParam.size,
        isHome: dataParam.isHome,
        name: goodsName,
      },
    });
    if (result.data.code == 200) {
      setList((prevList) => [
        ...prevList,
        ...result.data.data.records.map((item: RecordItem) => {
          const picImg = item.pic?.includes(",")
            ? item.pic.split(",")[0]
            : item.pic;
          return {
            ...item,
            picImg,
          };
        }),
      ]);
      if (result.data.data.records.length == dataParam.size) {
        setIsMore(true);
      } else {
        setIsMore(false);
      }
      console.log("isMore", isMore);
      setPageLoading(false);
    } else {
      setListLoding(false);
    }
  };
  useEffect(() => {
    getDataList();
  }, []);

  useEffect(() => {
    if (goodsName == "") return;
    getDataList();
  }, [goodsName]);

  return (
    <div className="SearchPage">
      <LeftBackHeader title={t("搜索商品")}></LeftBackHeader>
      <div className="SearchPageContent">
        <div className="SearchGoods">
          <div className="inputBox">
            <div className="searchIcon">
              <SearchOutline fontSize={14} color="rgba(255,255,255,0.35)" />
            </div>
            <Input
              placeholder={t("输入商品名称")}
              className="inputClass"
              value={goodsName}
              onChange={(value) => setGoodsName(value)}
              style={{
                "--color": "#fff",
                "--font-size": "14px",
                "--placeholder-color": "rgba(255,255,255,0.35)",
              }}
            ></Input>
          </div>
        </div>
        <div className="goodsList">
          {pageLoading && (
            <div className="spinBox">
              <Spin />
            </div>
          )}
          {!pageLoading&&list.length == 0 ? (
            <NoData />
          ) : (
            <div className="goods-item-box">
              {list.map((item, index) => {
                return (
                  <div
                    onClick={() => goodsItemClick(item)}
                    className="goods-item"
                    key={index}
                  >
                    <img className="goods-img" src={item.picImg}></img>
                    <div className="goods-txt">{item.name}</div>
                    <div className="goods-bottom-option">
                      <img src={usdtIcon} className="usdt-icon"></img>
                      <div className="goods-price">{item.price}</div>
                    </div>
                    {getZoneInfo(item.classify).subsidy != 0 && (
                      <div className="goods-hint-txt">
                        {t("补贴")}
                        {getZoneInfo(item.classify).subsidy}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="loading-more-option" onClick={() => loadMoreAction()}>
            {isMore ? t("查看更多商品") : t("没有更多商品了")}
            {listLoding && (
              <div className="loding flex flexCenter">
                <Spin />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Search;
