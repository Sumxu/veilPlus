import "./index.scss";
import type { FC } from "react";
import { useState } from "react";
import type { DonateItem } from "@/Ts/DonateList.ts";
import DonatePopup from "@/components/Popup/DonatePopup";
import { t } from "i18next";

const List: FC = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [checkItem, setCheckItem] = useState<DonateItem>({});
  const openShow = (item: DonateItem) => {
    setIsShow(true);
    setCheckItem(item);
  };
  const onClose = () => {
    setIsShow(false);
  };
  const list: DonateItem[] = [
    {
      title: t("100-1000U专区"),
      hintTxt: t("日化收益"),
      hintNumber: "1.0",
      number: "0.1",
      id: 1,
    },
    {
      title: t("1100-3000U专区"),
      hintTxt: t("日化收益"),
      hintNumber: "1.2",
      number: "1.2",
      id: 2,
    },
    {
      title: t("31000U以上专区"),
      hintTxt: t("日化收益"),
      hintNumber: "1.5",
      number: "1.5",
      id: 3,
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
              <div className="rightBtnOption" onClick={() => openShow(item)}>
                {t("去捐赠")}
              </div>
            </div>
          </div>
        );
      })}
      <DonatePopup
        isShow={isShow}
        onClose={onClose}
        checkItem={checkItem}
      ></DonatePopup>
    </div>
  );
};
export default List;
