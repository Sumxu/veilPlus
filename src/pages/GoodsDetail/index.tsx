import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import SwiperGoods from "./Component/SwiperGoods";
import usdt from "@/assets/home/USDT.png";
import goodsCheck from "@/assets/img/goodsCheck.png";
import lineLeft from "@/assets/img/lineLeft.png";
import lineRight from "@/assets/img/lineRight.png";
import { RightOutline } from "antd-mobile-icons";
import GoodsBuyPopup from "@/components/Popup/GoodsBuyPopup";
import message from "@/assets/component/message.png";
import shopPng from "@/assets/component/shopPng.png";
import { t } from "i18next";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { useZoneConfig } from "@/config/classifyData";
import { SubAddress, Totast } from "@/Hooks/Utils";
import { storage } from "@/Hooks/useLocalStorage";
import { Spin } from "antd";

export interface GoodsItemSpec {
  id: number;
  name: string;
  pic: string;
  price: number;
}

export interface GoodsInfo {
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
  items: GoodsItemSpec[];
}

const GoodsDetail: React.FC = () => {
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [goodsLoding, setGoodsLoding] = useState<boolean>(false);

  const navigate = useNavigate();
  const [goodsInfo, setGoodsInfo] = useState<GoodsInfo | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [pic, setPic] = useState<string[]>([]); //商品轮播图
  const [specIndex, setSpecIndex] = useState<string>(""); //规格下标
  const [specNum, setSpecNum] = useState<string>(""); //规格数量
  const { zoneList, getZoneInfo } = useZoneConfig();
  const buyClick = (specIndexPopup = "", specNum = "") => {
    storage.remove("checkAddress");
    console.log("specIndexPopup==",specIndexPopup)
    console.log("specNum==",specNum)
    //判断是否选择了规格
    if (specIndexPopup==='') {
      return setShowPopup(true);
    }

    let orderParam = JSON.parse(JSON.stringify(goodsInfo));
    orderParam.specIndex = specIndexPopup;
    orderParam.specNum = specNum;
    storage.set("orderParam", orderParam);
    navigate("/creatOrder");
  };
  const submitOrderClick = (specIndex, specNum) => {
    console.log("specIndex",specIndex)
    console.log("specNum",specNum)
    setShowPopup(false);
    setSpecIndex(specIndex);
    setSpecNum(specNum);
    setTimeout(() => {
      buyClick(specIndex, specNum);
    }, 600);
  };
  const specOpen = () => {
    setShowPopup(true);
  };
  const getGoodsInfo = async () => {
    setGoodsLoding(true);
    const result = await NetworkRequest({
      Url: "product/info",
      Data: {
        id: id,
      },
    });
    if (result.success) {
      const data = result.data.data as GoodsInfo;
      setGoodsInfo(data as GoodsInfo);
      // 2. 从 pic 字符串拆分成数组
      const arr = data.pic ? data.pic.split(",") : [];
      // 3. 更新状态
      setGoodsInfo(data);
      setPic(arr);
    }
    setGoodsLoding(false);
  };

  useEffect(() => {
    getGoodsInfo();
  }, []);
  return (
    <div className="goodsDetailPage">
      <div className="leftBackBox">
        <LeftBackHeader title={t("商品详情")}></LeftBackHeader>
      </div>
      {goodsLoding ? (
        <div className="assetDetailSpinBox">
          <Spin />
        </div>
      ) : (
        <div className="goodsDetailContent">
          {pic.length > 0 && <SwiperGoods pic={pic}></SwiperGoods>}
          <div className="goodsInfoBox">
            <div className="goodsPrice">
              <img src={usdt} className="icon"></img>
              <div className="price">
                {goodsInfo?.items?.[specIndex]?.price}
              </div>
            </div>
            <div className="txt">{goodsInfo?.name}</div>
            <div className="hintOption">
              <div className="item item1bg">
                <div className="txt1 item1Color">
                  {getZoneInfo(goodsInfo?.classify)?.subsidy}%
                </div>
                <div className="txt2 item1Color">{t("补贴倍数")}</div>
              </div>
              <div className="item item2bg">
                <div className="txt1 item2TopColor">0.1%</div>
                <div className="txt2 item2EndColor">{t("每日释放")}</div>
              </div>
            </div>
          </div>

          <div className="goodsOptions">
            <div className="goodsInfoItem" onClick={() => specOpen()}>
              <div className="label">{t("规格")}</div>
              <div className="value">
                {" "}
                {specIndex == ""
                  ? t("请选择")
                  : goodsInfo?.items?.[specIndex]?.name}{" "}
              </div>
              <div className="icon">
                <RightOutline color="#727272" fontSize={12} />
              </div>
            </div>
            <div className="goodsInfoLine"></div>
            <div className="goodsInfoItem">
              <div className="label">{t("补贴")}</div>
              <div className="value">
                {specIndex == ""
                  ? t("暂未选择")
                  : `${goodsInfo?.items?.[specIndex]?.integral * specNum}${t(
                      t("积分")
                    )}`}
              </div>
              <div className="icon">
                <RightOutline color="#727272" fontSize={12} />
              </div>
            </div>
            <div className="goodsInfoLine"></div>
            <div className="goodsInfoItem">
              <div className="label">{t("服务")}</div>
              <div className="value">
                <div className="tagOption">
                  <img src={goodsCheck} className="icon"></img>
                  <div className="name">{t("品质保障")}</div>
                </div>
                <div className="tagOption">
                  <img src={goodsCheck} className="icon"></img>
                  <div className="name">{t("包邮")}</div>
                </div>
                <div className="tagOption">
                  <img src={goodsCheck} className="icon"></img>
                  <div className="name">{t("七天无理由")}</div>
                </div>
              </div>
              <div className="icon">
                <RightOutline color="#727272" fontSize={12} />
              </div>
            </div>
            <div className="goodsInfoLine"></div>
            <div className="goodsInfoItem">
              <div className="label">
                <img src={shopPng} className="leftIcon"></img>
              </div>
              <div className="value">{goodsInfo?.merchantName}</div>
              <div className="rightTxt">
                {SubAddress(goodsInfo?.merchantAddress)}
              </div>
            </div>
          </div>

          <div className="goodsDetailContent">
            <div className="goodsTopBox">
              <img src={lineLeft} className="leftLine"></img>
              <div className="centerTxt">{t("商品描述")}</div>
              <img src={lineRight} className="leftLine"></img>
            </div>

            <div
              className="richTextContent"
              dangerouslySetInnerHTML={{ __html: goodsInfo?.details }}
            />
          </div>
        </div>
      )}
      <div className="endFixedBox">
        <div className="leftOption">
          <img src={message} className="spn1"></img>
          <div className="spn2">{t("客服")}</div>
        </div>
        <div className="rightOption">
          <div className="btn" onClick={() => buyClick()}>
            {t("立即购买")}
          </div>
        </div>
      </div>
      <GoodsBuyPopup
        visible={showPopup}
        goodsData={goodsInfo}
        specIndex={specIndex}
        onClose={() => setShowPopup(false)}
        onSubmit={(index, goodsNum) => submitOrderClick(index, goodsNum)}
      ></GoodsBuyPopup>
    </div>
  );
};
export default GoodsDetail;
