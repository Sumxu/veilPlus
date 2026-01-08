import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Popup, Input, Toast } from "antd-mobile";
import closeIcon from "@/assets/basic/close.png";
import { t } from "i18next";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import ContractList from "@/Contract/Contract";
import { fromWei, Totast, toWei } from "@/Hooks/Utils";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber, utils } from "ethers";
import { Button } from "antd-mobile";
import ContractSend from "@/Hooks/ContractSend.ts";
import hintIcon from "@/assets/basic/hintIcon.png";
const MyPopup: React.FC = ({ isShow, onClose, pendingInfo }) => {
  const [userInfo, setUserInfo] = useState({}); //用户信息
  const walletAddress = userAddress((state) => state.address);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const onCloseChange = () => {
    onClose();
  };
  //确认提现
  const submitClick = async () => {
    if (pendingInfo.rewardValue.isZero()) {
      return Totast("不可领取", "info");
    }
    try {
      setSubmitLoading(true);
      const result = await ContractSend({
        tokenName: "VailPlusPool",
        methodsName: "reward",
        params: [],
      });
      if (result.value) {
        onClose();
      }
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  };
  useEffect(() => {
    if (isShow == false) return;
  }, [isShow]);
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
            <div className="title">{t("领取收益")}</div>
            <img
              src={closeIcon}
              className="close-icon"
              onClick={onCloseChange}
            ></img>
          </div>
          <div className="tag-box">
            <img src={hintIcon} className="icon"></img>
            <div className="txt-option">领取收益将直接到账已绑定的钱包!</div>
          </div>
          <div className="input-draw-box">
            <div className="input-hint-txt-option">
              <div className="txt-option">
                {t("领取数量")}:{fromWei(pendingInfo.rewardValue)}VIPL
              </div>
            </div>
          </div>
          <Button
            loading={submitLoading}
            loadingText={t("确认中")}
            className="btn-draw-submit"
            onClick={() => {
              submitClick();
            }}
          >
            {t("确认领取")}
          </Button>
        </div>
      </Popup>
    </>
  );
};
export default MyPopup;
