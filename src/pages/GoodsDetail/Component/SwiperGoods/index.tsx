import "./index.scss";
import React from "react";
import { Swiper } from "antd-mobile";

interface SwiperGoodsProps {
  pic: string[]; // 轮播图数组
}

const SwiperGoods: React.FC<SwiperGoodsProps> = ({ pic }) => {
  return (
    <div className="swiperBox">
      <Swiper
        indicator={(total, current) => (
          <div className="customIndicator">
            {`${current + 1} / ${total}`}
          </div>
        )}
      >
        {pic && pic.length > 0 ? (
          pic.map((src, index) => (
            <Swiper.Item key={index}>
              <div className="imgWrap">
                <img src={src} alt="" className="swiperImg" />
              </div>
            </Swiper.Item>
          ))
        ) : (
          <Swiper.Item>
            <div className="imgWrap noImg">暂无图片</div>
          </Swiper.Item>
        )}
      </Swiper>
    </div>
  );
};

export default SwiperGoods;
