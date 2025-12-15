import "./index.scss";
import React, { useRef } from "react";
import { Swiper, Toast } from "antd-mobile";
import BannerIcon from '@/assets/home/Banner.png'
const items = [1,2,3,4].map((index) => (
  <Swiper.Item key={index}>
    <img
    src={BannerIcon}
      className="swiper-content"
    >
    </img>
  </Swiper.Item>
));

const Banner: React.FC = () => {
  return (
    <>
      <div className="swiper-page">
        <Swiper   indicatorProps={{
              color: 'white',
            }}>{items}</Swiper>
      </div>
    </>
  );
};
export default Banner;
