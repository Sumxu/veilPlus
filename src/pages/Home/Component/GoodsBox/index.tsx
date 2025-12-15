import "./index.scss";
import moreIcon from "@/assets/home/moreIcon.png";
import goodsImg from "@/assets/home/goodsImg.png";
import usdtIcon from "@/assets/home/USDT.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { t } from "i18next";
import { Spin } from "antd";
import { userAddress } from "@/Store/Store.ts";
import NoData from "@/components/NoData";
import { useZoneConfig } from "@/config/classifyData";

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
const GoodsBox: React.FC = () => {
  const wallertAddress = userAddress().address;
  const [list, setList] = useState<RecordItem[]>([]);
  const { getZoneInfo } = useZoneConfig();
  //加载数据
  const [goodsLoding, setGoodsLoding] = useState<boolean>(false);

  // 列表是否加载更多
  const [listLoding, setListLoding] = useState<boolean>(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
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
    setGoodsLoding(true);
    const result = await NetworkRequest({
      Url: "product/list",
      Method: "post",
      Data: {
        current: 1,
        size: dataParam.size,
        isHome: dataParam.isHome,
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
      setGoodsLoding(false);
    } else {
      setGoodsLoding(false);
    }
  };

  useEffect(() => {
    getDataList();
  }, []);
  return (
    <div className="goods-box">
      <div className="goods-name-option">
        <div className="goods-left-title">{t("精选推荐")}</div>
        <div className="goods-right" onClick={() => navigate("/search")}>
          <div className="right-txt">{t("更多商品")}</div>
          <img src={moreIcon} className="right-icon" />
        </div>
      </div>

      {goodsLoding ? (
        <div className="loading-box">
          <Spin />
        </div>
      ) : list.length === 0 ? (
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
                <img className="goods-img" src={item.picImg} />
                <div className="goods-txt">{item.name}</div>

                <div className="goods-bottom-option">
                  <img src={usdtIcon} className="usdt-icon" />
                  <div className="goods-price">{item.price}</div>
                </div>

                {getZoneInfo(item.classify).subsidy !== 0 && (
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
      {goodsLoding == false && (
        <div className="loading-more-option" onClick={() => loadMoreAction()}>
          {isMore ? t("查看更多商品") : t("没有更多商品了")}
          {listLoding && (
            <div className="loding flex flexCenter">
              <Spin />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default GoodsBox;
