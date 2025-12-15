import "./index.scss";
import { userAddress } from "@/Store/Store.ts";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { BigNumber, ethers } from "ethers";
import logoIcon from "@/assets/home/logoIcon.png";
import listIcon from "@/assets/home/listIcon.png";
import { Drawer, Spin } from "antd";
import BuyNftPopup from "./component/BuyNftPopup";
import BackHeader from "@/components/BackHeader";
import { fromWei, Totast, toWei } from "@/Hooks/Utils.ts";
import { useNFTQuery } from "@/Hooks/contractNft";
import { useNFTMulticall } from "@/Hooks/useNFTTokensByOwner";
import ContractList from "@/Contract/Contract";
interface MinerInfo {
  claimed: BigNumber;
  status: boolean;
  lastClaimTime: BigNumber;
}
const Home: React.FC = () => {
  const walletAddress = userAddress((state) => state.address);

  const [showBuyNftPopup, setShowBuyNftPopup] = useState(false);
  // 当前钱包地址
  const openPopupClick = () => {
    setShowBuyNftPopup(true);
  };
  const BuyNftPopupCloseChange = () => {
    setShowBuyNftPopup(false);
    //关闭弹窗后刷新数据
    fetchPrice();
  };
  const { fetch } = useNFTMulticall();
  const { callMethod, sendTransaction } = useNFTQuery();
  //总数量
  const totalNumer: number = 990.0;

  //发售USDT价格
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));

  //首期发售量(枚)
  const [maxMint, setMaxMint] = useState<BigNumber>(BigNumber.from(0));
  //nft balanceOf
  const [balanceOf, setBalanceOf] = useState<BigNumber>(BigNumber.from(0));
  //已售卖
  const [soldOutNumbers, setSoldOutNumbers] = useState<BigNumber>(
    BigNumber.from(0)
  );
  //总产值
  const [maxAmount, setMaxAmount] = useState<BigNumber>(BigNumber.from(0));

  //得到tokenIds数组
  const [tokenIds, setTokenIds] = useState<BigNumber[]>([]);

  //得到minerList数组
  const [minerList, setMinerList] = useState<MinerInfo[]>([]);

  //得到pendingList数组
  const [pendingList, setPendingList] = useState<BigNumber[]>([]);

  //nft列表加载状态
  const [nftListLoading, setNftListLoading] = useState<boolean>(false);

  //领取状态
  const [pendIngBtnLoading, setPendIngBtnLoading] = useState<string>("");
  //剩余
  const [surplus, setSurplus] = useState<number>(0);
  //进度条百分比
  const [percentage, setPercentage] = useState<number>(0);
  useEffect(() => {
    let soldOutNumber = Number(soldOutNumbers);
    const surplusNumber = maxMint.toNumber() - soldOutNumber;
    const percentage = (soldOutNumber / maxMint.toNumber()) * 100;
    setSurplus(surplusNumber);
    setPercentage(percentage);
  }, [soldOutNumbers]);

  const fetchPrice = async () => {
    const priceRes = await callMethod("price"); // price() 无参数
    const maxMintRes = await callMethod("maxMint"); // price() 无参数
    const totalSupplyRes = await callMethod("totalSupply"); // price() 无参数
    const balanceOfRes = await callMethod("balanceOf", [walletAddress]); // price() 无参数
    const maxAmountRes = await callMethod("maxAmount"); // price() 无参数
    if (priceRes.success) {
      setPrice(priceRes.data);
    }
    if (maxMintRes.success) {
      setMaxMint(maxMintRes.data);
    }
    if (totalSupplyRes.success) {
      setSoldOutNumbers(totalSupplyRes.data);
    }
    if (balanceOfRes.success) {
      setBalanceOf(balanceOfRes.data);
    }
    if (maxAmountRes.success) {
      setMaxAmount(maxAmountRes.data);
    }
  };
  //得到当前进度百分比
  const nftPercentage = (index) => {
    const claimed = Number(fromWei(minerList[index].claimed, 18, true, 2));
    const percentage =
      (claimed / Number(fromWei(maxAmount, 18, true, 2))) * 100;
    return percentage;
  };
  const buyClick=()=>{
    console.log("buyClick--")
    setShowBuyNftPopup(true)
  }
  //获取tokenId 数组
  const multicallFn = () => {
    const calls = Array.from({ length: Number(balanceOf) }).map((_, index) => ({
      contractAddress: ContractList["SpaceNFT"].address,
      abi: ContractList["SpaceNFT"].abi,
      params: [walletAddress, index],
    }));

    fetch("tokenOfOwnerByIndex", calls).then((result) => {
      if (result.success) {
        setTokenIds(result.data);
        minerInfoFn(result.data);
        queryPending(result.data);
      } else {
        console.error(result.error);
      }
    });
  };
  //通过tokenId 拿到对应的待领取内容
  const queryPending = (data: BigNumber[]) => {
    const contractAddress = ContractList["SpaceNFT"].address;
    const abi = ContractList["SpaceNFT"].abi;
    const calls = data.map((bn) => ({
      contractAddress,
      abi,
      params: [bn],
    }));
    fetch("pending", calls).then((result) => {
      if (result.success) {
        setPendingList(result.data);
      }
    });
  };

  //通过tokenId 拿到对应的信息 minerInfo
  const minerInfoFn = (data: BigNumber[]) => {
    setNftListLoading(true);
    const contractAddress = ContractList["SpaceNFT"].address;
    const abi = ContractList["SpaceNFT"].abi;
    const calls = data.map((bn) => ({
      contractAddress,
      abi,
      params: [bn],
    }));
    fetch("minerInfo", calls).then((result) => {
      setNftListLoading(false);
      if (result.success) {
        setMinerList(result.data);
      }
    });
  };
  //领取奖励
  const getPendIng = async (index) => {
    //如果领取奖励为0则提示不能领取
    if (pendingList[index].eq(BigNumber.from(0))) {
      Totast(t("暂无奖励"), "warning");
      return;
    }
    setPendIngBtnLoading(index);
    const claimRes = await sendTransaction("claim", [tokenIds[index]], {});
    if (claimRes.success) {
      Totast(t("领取成功"), "success");
      fetchPrice();
    }
    setPendIngBtnLoading("");
  };
  useEffect(() => {
    if (Number(balanceOf) > 0) {
      //如果大于0的话就去进行查询
      multicallFn();
    }
  }, [balanceOf]);
  useEffect(() => {
    // 查询价格和首期发售量
    fetchPrice();
  }, []);
  return (
    <>
      <div className="home-page">
        <BackHeader
          title={t("节点")}
          rightIcon={listIcon}
          rightUrl="/outputList"
        />
        <div className="header-box">
          <div className="header-box-image">
            <div className="center-number-option">
              <div className="number-option">
                <span className="spn-1">{t("限量")}</span>
                <span className="spn-2">
                  {totalNumer}
                  {t("枚")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="me-tools-box">
          <div className="me-header-option">
            <div className="item-txt">节点列表</div>
          </div>

          <div className="buy-box">
            {nftListLoading ? (
              <div className="loading-box">
                <Spin />
              </div>
            ) : (
              [1, 2].map((item, index) => (
                <div
                  className={`buy-option ${
                    12 !== 100
                      ? "buy-option-no-success-bg"
                      : "buy-option-success-bg"
                  }`}
                  key={index}
                >
                  <div className="buy-header-option">
                    <div className="left-option">
                      <div className="name">节点名称</div>
                      <div className='tag'>
                          USDT:12
                      </div>
                    </div>
                    <span className="tag-right" onClick={()=>buyClick()}> {t("购买")}</span> 
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-bar-check"
                      style={{ width: `12%` }}
                    ></div>
                  </div>

                  <div className="info-txt-option">
                    <div className="info-txt-1">{t("已售")}</div>
                    <div className="info-txt-1">{t("剩余")}</div>
                  </div>

                  <div className="info-txt-option">
                    <div className="info-txt-2">1200</div>
                    <div className="info-txt-2">1200</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Drawer
        rootClassName="buyNodeDrawer"
        maskClosable={true}
        destroyOnHidden={true}
        height={"auto"}
        closeIcon={false}
        open={showBuyNftPopup}
        title=""
        placement="bottom"
      >
        <BuyNftPopup onClose={() => BuyNftPopupCloseChange()} />
      </Drawer>
    </>
  );
};
export default Home;
