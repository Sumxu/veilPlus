import "./index.scss";
import { userAddress } from "@/Store/Store.ts";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { BigNumber, ethers } from "ethers";
import listIcon from "@/assets/home/listIcon.png";
import { Drawer, Spin } from "antd";
import BuyNftPopup from "./component/BuyNftPopup";
import BackHeader from "@/components/BackHeader";
import { fromWei, Totast, toWei } from "@/Hooks/Utils.ts";
 
const Home: React.FC = () => {
  const navigate = useNavigate();
  const walletAddress = userAddress((state) => state.address);
  const [showBuyNftPopup, setShowBuyNftPopup] = useState(false);
  // 当前钱包地址
  const openPopupClick = () => {
    setShowBuyNftPopup(true);
  };
  const BuyNftPopupCloseChange = () => {
    setShowBuyNftPopup(false);
    //关闭弹窗后刷新数据
   
  };
  //总数量
  const totalNumer: number = 990.0;
 
  //nft列表加载状态
  const [nftListLoading, setNftListLoading] = useState<boolean>(false);
 
  const buyClick = () => {
    setShowBuyNftPopup(true);
  };
  const myTeamPath = () => {
    navigate("/myTeam");
  };
  useEffect(() => {
    // 查询价格和首期发售量
  }, []);
  return (
    <>
      <div className="home-page">
        <BackHeader
          title={t("节点")}
          rightIcon={listIcon}
          isHome={true}
          rightUrl="/outputList"
        />
        <div className="header-box">
          <div className="header-box-image">
            <div className="center-number-option">
              <div className="number-option">
                <span className="spn-1">{t("限量")}</span>
                <span className="spn-2">
                  {totalNumer}
                  {t("枚")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="me-tools-box">
          <div className="me-header-option">
            <div className="item-txt">节点列表</div>
            <div className="item-txt size-14" onClick={()=>myTeamPath()}>我的团队</div>
          </div>
          <div className="buy-box">
            {nftListLoading ? (
              <div className="loading-box">
                <Spin />
              </div>
            ) : (
              [1, 2].map((item, index) => (
                <div
                  className={`buy-option ${
                    12 !== 100
                      ? "buy-option-no-success-bg"
                      : "buy-option-success-bg"
                  }`}
                  key={index}
                >
                  <div className="buy-header-option">
                    <div className="left-option">
                      <div className="name">节点名称</div>
                      <div className="tag">USDT:12</div>
                    </div>
                    <span className="tag-right" onClick={() => buyClick()}>
                      {" "}
                      {t("购买")}
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-bar-check"
                      style={{ width: `12%` }}
                    ></div>
                  </div>

                  <div className="info-txt-option">
                    <div className="info-txt-1">{t("已售")}</div>
                    <div className="info-txt-1">{t("剩余")}</div>
                  </div>

                  <div className="info-txt-option">
                    <div className="info-txt-2">1200</div>
                    <div className="info-txt-2">1200</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Drawer
        rootClassName="buyNodeDrawer"
        maskClosable={true}
        destroyOnHidden={true}
        height={"auto"}
        closeIcon={false}
        open={showBuyNftPopup}
        title=""
        placement="bottom"
      >
        <BuyNftPopup onClose={() => BuyNftPopupCloseChange()} />
      </Drawer>

    </>
  );
};
export default Home;
