import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import deafultUserImg from "@/assets/my/deafultUserImg.png";
import copy from "@/assets/my/copy.png";
import { Dialog } from "antd-mobile";
import logoOut from "@/assets/component/logoOut.png";
import { userAddress } from "@/Store/Store.ts";
import { formatAddress, Totast, copyToClipboard } from "@/Hooks/Utils";
import { t } from "i18next";
import { storage } from "@/Hooks/useLocalStorage";

const Header: React.FC = ({ data }) => {
  const navigate = useNavigate();
  const wallertAddress = userAddress().address;
  const logOutClick = () => {
    Dialog.confirm({
      content: t("是否退出登录？"),
      confirmText: t("确认"), // 确认按钮文字
      cancelText: t("取消"), // 取消按钮文字
      onConfirm: () => {
        // 清除本地存储
        storage.remove("token");
        storage.remove("editAddressInfo");
        storage.remove("orderParam");
        storage.remove("checkAddress");
        navigate("/login");
        Totast(t("已退出登录"),'info');
      },
      onCancel: () => {
        Totast(t("已取消"),'info');
      },
    });
  };
  const copyClick = () => {
    copyToClipboard(wallertAddress, t("已复制"));
  };
  return (
    <div className="my-header-box">
      <img
        src={logoOut}
        className="logOut-icon"
        onClick={() => logOutClick()}
      ></img>
      <div className="deafult-user-box">
        <div className="user-img-box">
          <img className="userImg-icon" src={deafultUserImg} />
          {data?.merchantName&&<div className="user-type-option">{data?.merchantName}</div>}
        </div>
        <div className="user-name-option">
          <div className="user-name">{formatAddress(wallertAddress)}</div>
          <img
            className="copy-img"
            src={copy}
            onClick={() => copyClick()}
          ></img>
        </div>
        {(data?.level?.toNumber() ?? 0) !== 0 && (
          <div className="tag-leave-option">LV{data.level.toString()}</div>
        )}
      </div>
    </div>
  );
};
export default Header;
