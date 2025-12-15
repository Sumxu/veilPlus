import "./index.scss";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import USDTIcon from "@/assets/home/USDT.png";
import moenyIcon from "@/assets/home/moenyIcon.png";
import { t } from "i18next";
import NoData from "@/components/NoData";
import { InfiniteScroll } from "antd-mobile";
import { Spin } from "antd";
import { useZoneConfig } from "@/config/classifyData";
interface Props {
  contentList: goodsInfoItem[];
  contentTxt: string;
}
interface goodsInfoItem {
  id: number;
  name: string;
  pic: string;
  price: number;
  classify: number;
  details: string; // 富文本 html
  merchantName: string;
  merchantAddress: string;
  publishTime: string;
  sellCount: number;
  picImg: string;
  items: GoodsItemSpec[];
}
export interface GoodsItemSpec {
  id: number;
  name: string;
  pic: string;
  price: number;
}
const ContentItem = ({ data }) => {
  const { getZoneInfo } = useZoneConfig();

  const navigate = useNavigate();
  const goodDetail = (data) => {
    navigate(`/goodsDetail?id=${data.id}`);
  };

  return (
    <div
      className="content-scroll-item"
      onClick={() => {
        goodDetail(data);
      }}
    >
      <img src={data.picImg} className="left-img"></img>
      <div className="right-content">
        <div className="title-s">{data.name}</div>
        <div className="info-bottom">
          <div className="left-bottom">
            {/* <img src={USDTIcon} className="usdt-icon"></img> */}
            <img src={moenyIcon} className="usdt-icon"></img>
            <div className="price-number">{data.price}</div>
          </div>
          {data.classify != "" && (
            <div className="right-btn">
              {t("补贴")}
              {getZoneInfo(data.classify)?.subsidy}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const ClassifyContent: React.FC<Props> = ({
  contentList,
  contentTxt,
  isMore,
  contentLoadMore,
  listLoding,
}) => {
  const loadMoreAction = () => {
    contentLoadMore();
  };
  return (
    <div className="classify-option">
      <div className="classify-title">{t(contentTxt)}</div>
      <div className="classify-content-scroll">
        {/* 加载中 */}
        {listLoding && (
          <div className="spinBoxClasify">
            <Spin />
          </div>
        )}

        {/* 无数据 */}
        {!listLoding && contentList.length === 0 && <NoData />}

        {/* 内容列表 + 无限加载 */}
        {!listLoding && contentList.length > 0 && (
          <>
            {contentList.map((item, index) => (
              <ContentItem data={item} key={index} />
            ))}

            <InfiniteScroll loadMore={loadMoreAction} hasMore={isMore} />
          </>
        )}
      </div>
    </div>
  );
};
export default ClassifyContent;
