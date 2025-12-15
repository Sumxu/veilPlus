import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Banner from "./Component/Banner";
import Tools from "./Component/Tools";
import Header from "./Component/Header";
import GoodsBox from "./Component/GoodsBox";
const Home: React.FC = () => {
  return (
    <>
      <div className="home-page-box">
        <div className="header-box">
          <Header></Header>
          <Banner></Banner>
          <Tools></Tools>
        </div>
        <div className="goods-list-box">
          <div className="goods-list-bg-box"></div>
          <GoodsBox></GoodsBox>
        </div>
      </div>
    </>
  );
};
export default Home;
