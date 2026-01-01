import "./index.scss";
import type { FC } from "react";
import { useState } from "react";
import type { DonateItem } from "@/Ts/DonateList.ts";
import DonatePopup from "@/components/Popup/DonatePopup";
import { t } from "i18next";

const List: FC = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const openShow = () => {
    setIsShow(true);
  };
  const onClose = () => {
    setIsShow(false);
  };
  const list: DonateItem[] = [
    {
      title: t("100-1000U专区"),
      hintTxt: t("日化收益"),
      hintNumber: "1.0",
    },
    {
      title: t("1100-3000U专区"),
      hintTxt: t("日化收益"),
      hintNumber: "1.2",
    },
    {
      title: t("31000U以上专区"),
      hintTxt: t("日化收益"),
      hintNumber: "1.5",
    },
  ];
  return (
    <div className="listPage">
      <div className="hintTitle">{t("捐赠档位")}</div>
      {list.map((item, index) => {
        return (
          <div className="itemBox" key={index}>
            <div className="hintTitle">{item.title}</div>
            <div className="endBox">
              <div className="leftOption">
                <div className="hintTxt">{item.hintTxt}</div>
                <div className="hintNumber">{item.hintNumber}%</div>
              </div>
              <div className="rightBtnOption" onClick={openShow}>
                {t("去捐赠")}
              </div>
            </div>
          </div>
        );
      })}
      <DonatePopup isShow={isShow} onClose={onClose}></DonatePopup>
    </div>
  );
};
export default List;
