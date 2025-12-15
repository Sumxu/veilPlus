import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import i18n, { t } from "i18next";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { Totast, isValidAddress, concatSign } from "@/Hooks/Utils.ts";
import { userAddress } from "@/Store/Store";
import { UseSignMessage } from "@/Hooks/UseSignMessage.ts";
import { storage } from "@/Hooks/useLocalStorage";
import ContractSend from "@/Hooks/ContractSend.ts";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { ethers } from "ethers";

interface PropsClass {
  isShow: boolean;
  onClose: () => void;
}
const InviteModal = (Props: PropsClass) => {
  const invite = storage.get("invite");
  const navigate = useNavigate();
  const { signMessage } = UseSignMessage(); //获取钱包签名
  // 绑定的邀请人地址
  const [inputAddress, setInputAddress] = useState<string>("");
  // 绑定按钮加载
  const [butLoading, setLoading] = useState<boolean>(false);
  // 关闭绑定邀请人
  const closeBindFloat = () => {
    Props.onClose();
  };
  // 绑定按钮执行
  const bindInviteAction = async () => {
    if (!inputAddress) {
      Totast(t("请输入邀请人地址"), "warning"); //
      return;
    }
    setLoading(true);
    //判断当前邀请人格式是否正确
    if (isValidAddress(inputAddress)) {
      //判断输入的邀请人上级是否有邀请人
      const result = await ContractRequest({
        tokenName: "storeToken",
        methodsName: "userInfo",
        params: [inputAddress],
      });
      console.log("result==",result)
      if (result.value) {

        if (result.value[0] != ethers.constants.AddressZero) {
          bindInviter();
        } else {
          setLoading(false);
          Totast(t("邀请人地址无效"), "warning"); //
        }
      }
    } else {
      //提示无效地址
      Totast(t("邀请人地址无效"), "warning"); //
    }
  };
  const bindInviter = async () => {
    const result = await ContractSend({
      tokenName: "storeToken",
      methodsName: "bind",
      params: [inputAddress],
    });
    console.log("result==", result);
    if (result.value) {
      closeBindFloat();
    }
    setLoading(false);
  };
  useEffect(() => {
    setInputAddress(invite);
  }, [invite]);
  return (
    <div className="InviteModalPage">
      {/*绑定邀请人*/}
      <Modal
        title=""
        open={Props.isShow}
        closable={false}
        maskClosable={false}
        onCancel={closeBindFloat}
        footer={null}
      >
        <div className="RestConnectWallBox">
          <div className="Title">{t("绑定邀请人")}</div>
          <div className="Message">{t("请在下方输入或粘贴邀请人地址！")}</div>
          <div className="inviteAddress">
            <input
              type="text"
              placeholder={t("请输入或粘贴邀请人地址！")}
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
            />
          </div>
          <div className="But">
            <Button
              type="primary"
              loading={butLoading}
              onClick={() => {
                bindInviteAction();
              }}
            >
              {t("绑定")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default InviteModal;
