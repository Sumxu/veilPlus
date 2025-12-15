import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import { Input, Toast } from "antd-mobile";
import { t } from "i18next";
import RedemptionPopup from "@/components/Popup/RedemptionPopup";
import { InfiniteScroll, Button } from "antd-mobile";
import NoData from "@/components/NoData";
import { useNFTMulticall } from "@/Hooks/useNFTTokensByOwner";
import ContractRequest from "@/Hooks/ContractRequest.ts";
import ContractSend from "@/Hooks/ContractSend.ts";
import ContractList from "@/Contract/Contract";
import { userAddress } from "@/Store/Store.ts";
import { BigNumber } from "ethers";
import { fromWei, toWei, timestampToFull, Totast } from "@/Hooks/Utils";
interface TaxInfo {
  claimed: BigNumber;
  amount: BigNumber;
  ping: BigNumber;
  claim: BigNumber;
  rate: BigNumber;
  startTime: number;
  isRedeem: boolean;
}
const TaxPledge: React.FC = () => {
  const navigate = useNavigate();

  const [inputNumber, setInputNumber] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false); // ✅ 是否获得焦点
  const [list, setList] = useState<listItem[]>([]);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [redemptionShow, setRedemptionShow] = useState<boolean>(false);
  const walletAddress = userAddress((state) => state.address);

  const [redeemLoadingIndex, setRedeemLoadingIndex] = useState<number | null>(null);
const [claimLoadingIndex, setClaimLoadingIndex] = useState<number | null>(null);
  //得到taxList数组
  const [taxList, setTaxList] = useState<TaxInfo[]>([]);
  //得到pendingList数组
  const [pendingList, setPendingList] = useState<BigNumber[]>([]);
  const [totalDesposit, setTotalDesposit] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [totalReward, setTotalReward] = useState<BigNumber>(BigNumber.from(0));

  const [dataIndex, setDataIndex] = useState<string>("");
  const { fetch } = useNFTMulticall();

  const getDataListSize = async () => {
    const result = await ContractRequest({
      tokenName: "TaxPool",
      methodsName: "depositLength",
      params: [walletAddress],
    });
    if (result.value) {
      const depositLength = Number(result.value);
      if (depositLength < 0) return;
      const calls = Array.from({ length: depositLength }).map((_, index) => ({
        contractAddress: ContractList["TaxPool"].address,
        abi: ContractList["TaxPool"].abi,
        params: [walletAddress, index],
      }));
      fetch("depositInfo", calls).then((result) => {
        if (result.success) {
          setTaxList(result.data);
          queryPending(depositLength);
        }
      });
    }
  };
  //通过tokenId 拿到对应的待领取内容
  const queryPending = async (depositLength) => {
    const calls = Array.from({ length: depositLength }).map((_, index) => ({
      contractAddress: ContractList["TaxPool"].address,
      abi: ContractList["TaxPool"].abi,
      params: [walletAddress, index],
    }));
    fetch("pending", calls).then((result) => {
      if (result.success) {
        setPendingList(result.data);
      }
    });
  };
  //赎回
  const getRedeem = async (index) => {
     setRedeemLoadingIndex(index)
    const result = await ContractSend({
      tokenName: "TaxPool",
      methodsName: "redeem",
      params: [index],
    });
    if (result.value) {
      initData();
    }
   setRedeemLoadingIndex(null);
  };
  //领取收益
  const getClaim = async (index) => {
    if (pendingList[index].isZero()) {
      return Totast(t("不能领取"), "info");
    }
     setClaimLoadingIndex(index); // 只让当前 index loading
    const result = await ContractSend({
      tokenName: "TaxPool",
      methodsName: "claim",
      params: [index],
    });
    if (result.value) {
      initData();
    }
   setClaimLoadingIndex(null);
  };
  const closeRedemptionShow = () => {
    setRedemptionShow(false);
    initData();
  };
  //获取总质押
  const getTotalDeposit = async () => {
    const result = await ContractRequest({
      tokenName: "TaxPool",
      methodsName: "totalDeposit",
      params: [walletAddress],
    });
    if (result.value) {
      setTotalDesposit(result.value);
    }
  };
  //获取总收益
  const getTotalReward = async () => {
    const result = await ContractRequest({
      tokenName: "TaxPool",
      methodsName: "totalReward",
      params: [walletAddress],
    });
    if (result.value) {
      setTotalReward(result.value);
    }
  };
  const initData = () => {
    getDataListSize();
    getTotalDeposit();
    getTotalReward();
  };
  useEffect(() => {
    initData();
  }, []);

  return (
    <div className="TaxPledgePage">
      <LeftBackHeader title={t("TAX质押")}></LeftBackHeader>
      <div className="headerBox">
        <div className="headerTopOption">
          <div className="itemNumber">
            <div className="number">{fromWei(totalDesposit)}</div>
            <div className="txt">{t("质押数量")}(TAX)</div>
          </div>
          <div className="line"></div>
          <div className="itemNumber">
            <div className="number">{fromWei(totalReward)}</div>
            <div className="txt">{t("获得收益")}(TAX)</div>
          </div>
        </div>
        <div className="btn-option">
          <div className="btn black-bg" onClick={() => setRedemptionShow(true)}>
            {t("质押")}
          </div>
        </div>
      </div>
      <div className="hintTeamListTxt">{t("质押列表")}</div>
      <div className="box teamList">
        {taxList.length == 0 ? (
          <NoData />
        ) : (
          <div className="record-body">
            {taxList.map((item, index) => {
              return (
                <div className="teamListBox" key={index}>
                  <div className="teamItem">
                    <div className="itemTxt">
                      <div className="itemOption">
                        {t('投入时间')}:
                        <span>
                          {timestampToFull(item.startTime.toString())}
                        </span>
                      </div>
                      <div className="itemOption">
                        {t('投入值')}:<span>{fromWei(item.amount)}</span>
                      </div>
                    </div>
                    <div className="itemTxt">
                      <div className="itemOption">
                        {t('待领取收益')}:<span>{fromWei(pendingList[index])}</span>
                      </div>
                      <div className="itemOption">
                        {t('已领取收益')}:<span>{fromWei(item.claim)}</span>
                      </div>
                    </div>
                    <div className="itemTxt">
                      <Button
                        className="btn btnOne"
                        onClick={() => getRedeem(index)}
                        disabled={item.isRedeem}
                         loadingText={t('确认中')}
                        loading={redeemLoadingIndex === index}
                      >
                        {t('赎回')}
                      </Button>
                      <Button
                        className="btn btnTwo"
                        disabled={item.isRedeem}
                        loadingText={t('确认中')}
                        onClick={() => getClaim(index)}
                        loading={claimLoadingIndex === index}
                      >
                        {t('领取收益')}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <RedemptionPopup
        isShow={redemptionShow}
        onClose={() => closeRedemptionShow()}
      ></RedemptionPopup>
    </div>
  );
};
export default TaxPledge;
