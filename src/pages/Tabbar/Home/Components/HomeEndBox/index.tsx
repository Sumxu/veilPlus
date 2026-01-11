import "./index.scss";
import { useEffect, useState, type FC } from "react";
import topOneIcon from "@/assets/home/top1.png";
import topTwoIcon from "@/assets/home/top2.png";
import topThreeIcon from "@/assets/home/top3.png";
import { t } from "i18next";
import NetworkRequest from "@/Hooks/NetworkRequest";
import { BigNumber, ethers } from "ethers";
import { fromWei } from "@/Hooks/Utils";
import { Spin } from "antd";

interface ListItem {
  address: string;
  amount: BigNumber;
}

interface RenderItem {
  address: string;
  amount: BigNumber | "-";
}

const MAX_RANK_COUNT = 10;

const HomeEndBox: FC = () => {
  const [listLoading, setListLoading] = useState(false);
  const [list, setList] = useState<ListItem[]>([]);

  /** 获取排行榜数据 */
  const getTopData = async () => {
    setListLoading(true);
    try {
      const result = await NetworkRequest({
        Url: "deposit/top",
        Method: "get",
        Data: { current: 1, size: MAX_RANK_COUNT },
      });
      if (result?.success) {
        setList(result.data?.data || []);
      } else {
        setList([]);
      }
    } catch (e) {
      setList([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    getTopData();
  }, []);

  /** 补齐排行榜数据（不足用 - 填充） */
  const getRenderList = (): RenderItem[] => {
    const result: RenderItem[] = [];
    for (let i = 0; i < MAX_RANK_COUNT; i++) {
      if (list[i]) {
        result.push(list[i]);
      } else {
        result.push({ address: "-", amount: "-" });
      }
    }
    return result;
  };

  /** 地址缩写 */
  const formatAddress = (address: string) => {
    if (address === "-") return "-";
    return `${address.slice(0, 4)}…${address.slice(-4)}`;
  };

  /** USDT 格式化（6 位精度） */
  const formatUSDT = (amount: BigNumber | "-") => {
    if (amount === "-") return "-";
    return Number(ethers.utils.formatUnits(amount, 6)).toLocaleString();
  };

  const renderList = getRenderList();
  const topThree = renderList.slice(0, 3);
  const normalList = renderList.slice(3);

  return (
    <div className="HomeEndBox">
      <div className="title">{t("捐赠排行榜")}</div>

      <div className="listHeaderOption">
        <div className="txt">{t("用户名")}</div>
        <div className="txt">{t("捐赠量")} (USDT)</div>
      </div>

      {/* Top 3 */}
      <div className="rankingTopBox">
        {[topOneIcon, topTwoIcon, topThreeIcon].map((icon, index) => (
          <div className={`topOption top${index + 1}`} key={index}>
            <img src={icon} className="icon" />
            <div className="walletTxt">
              {formatAddress(topThree[index]?.address)}
            </div>
            <div className="usdtNumber">{fromWei(topThree[index]?.amount)}</div>
          </div>
        ))}
      </div>

      {/* 普通排行榜 */}
      <div className="rankingListBox">
        {listLoading ? (
          <div className="loading">
            <Spin />
          </div>
        ) : (
          normalList.map((item, index) => (
            <div className="rankingOption" key={index}>
              <div className="indexItem">{index + 4}</div>
              <div className="indexWallet">{formatAddress(item.address)}</div>
              <div className="indexNumber">{fromWei(item.amount)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeEndBox;
