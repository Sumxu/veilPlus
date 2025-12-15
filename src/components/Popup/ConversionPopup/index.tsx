import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Popup, Input } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import { t } from "i18next";
import popupHintIcon from "@/assets/popup/popupHintIcon.png";
const ConversionPopup: React.FC = ({isShow,onClose}) => {
  const [inputNumber, setInputNumber] = useState<string>("");
  const [balaceInputNumber, setBalaceInputNumber] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false); // ✅ 是否获得焦点
  const [isBalanceFocus, setIsBalanceFocus] = useState(false); // ✅ 是否获得焦点
  const onCloseChange = () => {
    onClose();
  };
  return (
    <>
      <Popup
        visible={isShow}
        onClose={() => {
          onCloseChange();
        }}
      >
        <div className="my-popup-page">
          <div className="header-option">
            <div className="title">{t("互转")}</div>
            <div className="close-icon" onClick={() => onCloseChange()}>
              <CloseOutline fontSize={12} color="#969797" />
            </div>
          </div>
          <div className="tag-box">
            <img src={popupHintIcon} className="icon"></img>
            <div className="txt-option">{t("仅支持上下级之间互转")}</div>
          </div>
          <div className="input-box">
            <div className="input-hint-txt-option">
              <div className="txt-option">{t("互转数量")}:</div>
              <div className="txt-option right-txt">{t('待释放积分')}：2,805.78</div>
            </div>
            <div className={`input-option ${isFocus ? "input-focus" : ""}`}>
              <Input
                placeholder={t('请输入内容')}
                value={inputNumber}
                onChange={(val) => {
                  setInputNumber(val);
                }}
                onFocus={() => setIsFocus(true)} // ✅ 获得焦点
                onBlur={() => setIsFocus(false)} // ✅ 失去焦点
                clearable
                className="input-class"
              />
              <div className="input-txt">{t('积分')}</div>
            </div>
          </div>

          <div className="input-box">
            <div className="input-hint-txt-option">
              <div className="txt-option">{t('收款账户')}:</div>
            </div>
            <div
              className={`input-option ${isBalanceFocus ? "input-focus" : ""}`}
            >
              <Input
                placeholder={t('输入收款账户钱包地址')}
                value={balaceInputNumber}
                onChange={(val) => {
                  setBalaceInputNumber(val);
                }}
                onFocus={() => setIsBalanceFocus(true)} // ✅ 获得焦点
                onBlur={() => setIsBalanceFocus(false)} // ✅ 失去焦点
                clearable
                className="input-class"
              />
            </div>
          </div>

          <div className="hint-txt-box">
            <div className="hint-txt-option">{t('手续费')}(3.0%):</div>
            <div className="hint-txt-option right-bold">-0.00TAX</div>
          </div>
          <div className="hint-txt-box">
            <div className="hint-txt-option">{t('实际到账')}:</div>
            <div className="hint-txt-option right-option">0.00 TAX</div>
          </div>
          <div className="btn-submit">{t('确认互转')}</div>
        </div>
      </Popup>
    </>
  );
};
export default ConversionPopup;
