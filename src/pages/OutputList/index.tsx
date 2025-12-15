import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { t } from "i18next";
import NoData from "@/components/NoData";
import { Spin } from "antd";
import { DownOutline } from "antd-mobile-icons";
import BackHeader from "@/components/BackHeader";
import logoIcon from "@/assets/home/logoIcon.png";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { userAddress } from "@/Store/Store.ts";
import { InfiniteScroll } from "antd-mobile";
import { fromWei } from "@/Hooks/Utils";
interface listItem {
  blockTime: string;
  amount: string;
  tokenId: number | string;
}

const OutputList: React.FC = () => {
  const walletAddress = userAddress((state) => state.address);
  // const walletAddress = "0xcd75ef45514081cc98c93aebac2dac7035fb74c4";
  const [list, setList] = useState<listItem[]>([]);
  // 列表是否加载
  const [listLoding, setListLoding] = useState<boolean>(false);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  // 获取更多团队列表
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Method:"post",
      Url: "nft/claimRecord",
      Data: {
        current: nexPage,
        size: 20,
        address: walletAddress,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [...prevList, ...res.data.data.records]);
        if (res.data.data.records.length === 20) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };
  const getDataList = async () => {
   setList([])
    setListLoding(true);
    const result = await NetworkRequest({
      Url: "nft/claimRecord",
      Method:"post",
      Data: {
        current: 1,
        size: 20,
        address: walletAddress,
      },
    });
    if (result.data.code === 200) {
      setList((prevList) => [...prevList, ...result.data.data.records]);
      if (result.data.data.records.length === 20) {
        setIsMore(true);
      } else {
        setIsMore(false);
      }
      setListLoding(false);
    } else {
      setListLoding(false);
    }
  };
  useEffect(() => {
    getDataList();
  }, []);
  // 当前钱包地址
  return (
    <>
      <div className="out-put-list-page">
        <BackHeader title={t('产出记录')} />
        <div className="item-box">
          <div className="list-item-header">
            <div className="header-txt header-txt-1">{t('时间')}</div>
            <div className="header-txt header-txt-2">tokenId</div>
            <div className="header-txt header-txt-3">{t('数量')}</div>
          </div>
          <div className="list-item-option">
            {list.length == 0 ? (
              <NoData />
            ) : (
              <div className="record-body">
                {list.map((item, index) => {
                  return (
                    <div className="list-item" key={index}>
                      <div className="item-txt">{item.blockTime}</div>
                      <div className="item-txt-no">{item.tokenId}</div>
                      <div className="item-txt item-txt-right">
                        +{fromWei(item.amount)}
                      </div>
                    </div>
                  );
                })}
                <InfiniteScroll loadMore={loadMoreAction} hasMore={isMore}>
                  <div>
                    {listLoding && (
                      <div className="loding flex flexCenter">
                        <Spin />
                      </div>
                    )}
                  </div>
                </InfiniteScroll>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default OutputList;
