import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import Info from "./Components/Info";
import Tools from "./Components/Tools";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber, ethers } from "ethers";
const My: React.FC = () => {
  const [userInfo, setUserInfo] = useState({}); //用户信息
  const [taxBalance, setTaxBalance] = useState<BigNumber>(BigNumber.from(0)); //tax余额
  const walletAddress = userAddress((state) => state.address);

  const getUserInfo = async () => {
    const result = await ContractRequest({
      tokenName: "storeToken",
      methodsName: "userInfo",
      params: [walletAddress],
    });
    if (result.value) {
      console.log("userinfo----",result.value)
      setUserInfo(result.value);
    }
  };

  //获取tax余额
  const getTaxBalance = async () => {
    const taxResult = await ContractRequest({
      tokenName: "TaxToken",
      methodsName: "balanceOf",
      params: [walletAddress],
    });
    if (taxResult.value) {
      setTaxBalance(taxResult.value);
    }
  };
  useEffect(() => {
    getUserInfo();
    getTaxBalance();
  }, []);
  return (
    <div className="my-page">
      <Header data={userInfo}></Header>
      <div className="tools-my-box">
        <Info
          data={userInfo}
          taxBalance={taxBalance}
          onUpData={getUserInfo}
        ></Info>
        <Tools></Tools>
      </div>
    </div>
  );
};
export default My;
