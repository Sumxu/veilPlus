import React, { useEffect, useState } from "react";
import "./index.scss";
import LeftBackHeader from "@/components/LeftBackHeader";
import langCheck from "@/assets/lang/langCheck.png";
import langNoCheck from "@/assets/lang/langNoCheck.png";
import i18n, { t } from "i18next";
import { getLangObj } from "@/Hooks/Utils";
const LangPage: React.FC = () => {
  const langList = [
    {
      label: "简体中文",
      value: "zh",
      id: "1",
    },
    {
      label: "繁体中文",
      value: "zhHant",
      id: "3",
    },
    {
      label: "English",
      value: "en",
      id: "2",
    },
  ];
  useEffect(() => {
    setLangIndex(getLangObj().value);
  }, []);
  const [langIndex, setLangIndex] = useState<string>("");
  const setLangClick = (item) => {
    setLangIndex(item.id);
    i18n.changeLanguage(item.value);
    window.localStorage.setItem("lang", item.value);
    window.location.reload();
  };
  return (
    <div className="langPage">
      <LeftBackHeader title={t("语言设置")} />
      <div className="box">
        {langList.map((item, index) => {
          return (
            <div
              key={index}
              className={`boxInfoItem ${
                langList.length - 1 != index && "boxInfoBottomBorder"
              }`}
              onClick={() => setLangClick(item)}
            >
              <div className="leftLabel">{item.label}</div>
              <div className="rightBox">
                {item.id == langIndex ? (
                  <img src={langCheck} className="checkIcon"></img>
                ) : (
                  <img src={langNoCheck} className="checkIcon"></img>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default LangPage;
