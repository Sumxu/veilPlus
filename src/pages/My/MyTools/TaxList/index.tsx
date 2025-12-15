import "./index.scss";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import { t } from "i18next";
const AssetDetails: React.FC = () => {
  const tabArray = [
    {
      label: t("质押赎回记录"),
      value: "1",
    },
    {
      label: t("收益记录"),
      value: "2",
    },
  ];
  const [tabIndex, setTabIndex] = useState<string>("1");

  return (
    <>
      <div className="tax-details-page">
        <LeftBackHeader title={t("TAX记录")}></LeftBackHeader>
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
        <div className="asset-details-list-box">
          <div className="header-list-box">
            <div className="header-item">{t("时间")}</div>
            <div className="header-item item-center">{t("类型")}</div>
            <div className="header-item">{t("数量")}</div>
          </div>
          <div className="list-box">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 1, 1].map((item, index) => {
              return (
                <div className="list-item-box" key={index}>
                  <div className="item-option date">2025-09-23 18:36:56</div>
                  <div className="item-option item-center">
                    <div>{t("赎回")}TAX</div>
                  </div>
                  <div className="item-option">+32.56</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default AssetDetails;
