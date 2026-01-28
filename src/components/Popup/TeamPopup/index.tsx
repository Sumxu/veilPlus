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
import { storage } from "@/Hooks/useLocalStorage";

const TeamPopup: React.FC = ({ isShow, onClose }) => {
  const walletAddress = storage.get('address');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [teamIng, setTeamIng] = useState<BigNumber>(BigNumber.from("0"));
  const onCloseChange = () => {
    onClose();
  };
  //团队领取弹窗用的是erc20Value
  const getTeamPending = async () => {
    const result = await ContractRequest({
      tokenName: "VailPlusPool",
      methodsName: "teamPending",
      params: [walletAddress],
    });
    if (result.value) {
      setTeamIng(result.value.erc20Value);
    }
  };
  //确认提现
  const submitClick = async () => {
    if (teamIng.isZero()) {
      return Totast("不可领取", "info");
    }
    try {
      setSubmitLoading(true);
      const result = await ContractSend({
        tokenName: "VailPlusPool",
        methodsName: "teamReward",
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
    getTeamPending();
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
            <div className="title">{t("领取社区收益")}</div>
            <img
              src={closeIcon}
              className="close-icon"
              onClick={onCloseChange}
            ></img>
          </div>
          <div className="tag-box">
            <img src={hintIcon} className="icon"></img>
            <div className="txt-option">
              {t("领取收益将直接到账已绑定的钱包")}!
            </div>
          </div>
          <div className="input-draw-box">
            <div className="input-hint-txt-option">
              <div className="txt-option">
                {t("领取数量")}:{fromWei(teamIng)}VIPL
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
export default TeamPopup;
