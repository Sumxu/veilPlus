import "./index.scss";
import React, { useEffect, useState } from "react";
import { Input } from "antd-mobile";
import leftBackIcon from "@/assets/component/leftBackIcon.png";
import { SearchOutline } from "antd-mobile-icons";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const OrderHeaderSearch: React.FC = ({ inputChange }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>("");
  const leftBackClick = () => {
    navigate("/my");
  };
  useEffect(() => {
    inputChange(inputValue);
  }, [inputValue]);
  return (
    <div className="order-header-search-box">
      <img
        src={leftBackIcon}
        className="left-icon"
        onClick={() => leftBackClick()}
      ></img>
      <div className="right-input-option">
        <div className="search-icon">
          <SearchOutline fontSize={14} color="#A9A9A9" />
        </div>
        <Input
          placeholder={t("搜索订单")}
          className="input-class"
          value={inputValue}
          onChange={(value) => setInputValue(value)}
        ></Input>
      </div>
    </div>
  );
};
export default OrderHeaderSearch;
