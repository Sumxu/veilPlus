import { t } from "i18next";
import "./index.scss";
import React, { useEffect, useState } from "react";
const MerchantDataInfo: React.FC = ({data}) => {
  return (
    <div className="MerchantDataInfoPage">
      <div className="hintTxt">{t('店铺销售数据')}</div>
      <div className="boxList">
        <div className="boxItem">
          <div className="price yellowColor">{data.todaySell}USDT</div>
          <div className="txt">{t('今日销量')}</div>
        </div>
         <div className="boxItem">
          <div className="price">{data.monthSell}USDT</div>
          <div className="txt">{t('本月销量')}</div>
        </div>
         <div className="boxItem">
          <div className="price">{data.yearSell}USDT</div>
          <div className="txt">{t('本年销量')}</div>
        </div>
         <div className="boxItem">
          <div className="price">{data.totalSell}USDT</div>
          <div className="txt">{t('累计销量')}</div>
        </div>
      </div>
    </div>
  );
};
export default MerchantDataInfo;
