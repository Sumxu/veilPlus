import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "@/pages/Home/Component/Header";
import ClassifyLeft from "./Component/classifyLeft";
import ClassifyContent from "./Component/classifyContent";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { useZoneConfig } from "@/config/classifyData";
import { t } from "i18next";

interface RecordItem {
  id: number;
  name: string;
  pic: string; // 后端返回的 pic
  picImg?: string; // 我们本地添加的新字段
  // 你可以加更多字段...
}
interface RecordItem {
  pic: string;
  [key: string]: any;
}
const Classify: React.FC = () => {
  // 列表加载中
  const [listLoding, setListLoding] = useState<boolean>(false);
  //获取浏览器路径参数 判断是否从别的页面跳转进来的
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "0";
  const [classifyId, setClassifyId] = useState<string>("");
  const [list, setList] = useState<RecordItem[]>([]);
  const { getZoneInfo } = useZoneConfig();
  const [current, setCurrent] = useState<number>(1);
  // 是否还有更多数据可以加载
  const [isMore, setIsMore] = useState<boolean>(false);
  const getGoodsData = async () => {
    setList([]);
    setIsMore(false);
    setListLoding(true)
    const result = await NetworkRequest({
      Url: "product/list",
      Method: "post",
      Data: {
        size: 10,
        current: 1,
        classify: classifyId == 0 ? "" : classifyId,
      },
    });
    if (result.success) {
      setList((prevList) => [
        ...prevList,
        ...result.data.data.records.map((item) => {
          const picImg = item.pic?.includes(",")
            ? item.pic.split(",")[0]
            : item.pic;

          return {
            ...item,
            picImg,
          };
        }),
      ]);
      if (result.data.data.records.length == 10) {
        setIsMore(true);
      } else {
        setIsMore(false);
      }
    }
    setListLoding(false)

  };
  //加载更多
  const loadMoreAction = async () => {
    const nexPage = current + 1;
    setCurrent(nexPage);
    await NetworkRequest({
      Url: "userRecord/ticketRecord",
      Data: {
        size: 10,
        current: nexPage,
        classify: classifyId == 0 ? "" : classifyId,
      },
    }).then((res) => {
      if (res.success) {
        setList((prevList) => [
          ...prevList,
          ...res.data.data.records.map((item: RecordItem) => {
            const picImg = item.pic?.includes(",")
              ? item.pic.split(",")[0]
              : item.pic;
            return {
              ...item,
              picImg,
            };
          }),
        ]);
        if (res.data.data.records.length == 10) {
          setIsMore(true);
        } else {
          setIsMore(false);
        }
      }
    });
  };
  useEffect(() => {
    if (id === classifyId) return; // 防止重复调用
    setClassifyId(id);
  }, [id]);
  useEffect(() => {
    if (!classifyId) return;
    getGoodsData();
  }, [classifyId]);
  return (
    <>
      <div className="classify-page-box">
        <div className="header-box">
          <Header isIconShow={false}></Header>
        </div>
        <div className="classify-list-box">
          <div className="classify-left-option">
            <ClassifyLeft
              classifyId={classifyId}
              classifyLeftChange={(value) => setClassifyId(value)}
            />
          </div>
          <div className="classify-content-option">
            <ClassifyContent
              contentList={list}
              isMore={isMore}
              listLoding={listLoding}
              contentLoadMore={() => loadMoreAction()}
              contentTxt={
                getZoneInfo(Number(classifyId))?.name || t("全部商品")
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Classify;
