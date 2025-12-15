import "./index.scss";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import edit from "@/assets/address/edit.png";
import del from "@/assets/address/del.png";
import LeftBackHeader from "@/components/LeftBackHeader";
import { t } from "i18next";
import { Dialog } from "antd-mobile";
import { Spin } from "antd";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { storage } from "@/Hooks/useLocalStorage";
import NoData from "@/components/NoData";
import { Totast } from "@/Hooks/Utils";
interface AddressItem {
  id: number | string;
  name: string;
  phone: string;
  province: string;
  details: string;
  isDefault: boolean;
}
const Address: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<AddressItem[]>([]); //列表数据
  const [listLoading, setListLoading] = useState<boolean>(false); //列表请求中
  //编辑地址
  const editClick = (item) => {
    storage.set("editAddressInfo", item);
    navigate("/editAddress?type=edit");
  };
  //添加地址
  const addClick = () => {
    navigate("/editAddress?type=add");
  };
  const getPageData = async () => {
    setListLoading(true);
    const result = await NetworkRequest({
      Url: "address/list",
      Method: "get",
    });
    if (result.success) {
      setList(result.data.data); //赋值
    }
    setListLoading(false);
  };
  //删除地址
  const delClick = async (id, index) => {
    Dialog.confirm({
      content: t("确定要删除该地址吗?"),
      confirmText: t("确认"), // 确认按钮文字
      cancelText: t("取消"), // 取消按钮文字
      onConfirm: async () => {
        try {
          const result = await NetworkRequest({
            Url: "address/del",
            Method: "get",
            Data: { id },
          });

          if (result.success) {
            // 删除成功，从数组中移除
            setList((prev) => {
              const newList = [...prev];
              newList.splice(index, 1); // 删除对应下标
              return newList;
            });
            Totast(t("删除成功"), "success");
          } else {
            Totast(t("删除失败"), "info");
          }
        } catch (error) {
          Totast(t("删除失败"), "info");
          console.error(error);
        }
      },
    });
  };
  //选择地址
  const checkAddressClick = (item) => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    console.log("type==", type);
    if (type === "check") {
      storage.set("checkAddress", item);
      navigate(-1);
    }
  };
  useEffect(() => {
    getPageData();
  }, []);
  return (
    <div className="addressPage">
      <LeftBackHeader title={t("选择收货地址")} />
      <div className="addressContent">
        {listLoading ? (
          // 👉 加载中
          <div className="spinBox">
            <Spin />
          </div>
        ) : list.length === 0 ? (
          // 👉 加载完成且无数据
          <NoData />
        ) : (
          // 👉 有数据时渲染列表
          list.map((item, index) => {
            const isDefault = item.isDefault;
            return (
              <div className="addressItem" key={index}>
                <div
                  className="addressLeft"
                  onClick={() => checkAddressClick(item)}
                >
                  <div className="addressNameTel">
                    <span className="spn1">
                      {item.name} {item.phone}
                    </span>
                    {isDefault && <span className="spn2">{t("默认")}</span>}
                  </div>
                  <div className="addressDetail">
                    {item.province} {item.city} {item.area} {item.details}
                  </div>
                </div>

                <div className="addressLine"></div>

                <div className="addressRight">
                  <img
                    src={edit}
                    className="editIcon"
                    onClick={() => editClick(item)}
                  />
                  <img
                    src={del}
                    className="delIcon"
                    onClick={() => delClick(item.id, index)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="addressBtnBox">
        <div className="addressBtn" onClick={() => addClick()}>
          +{t("添加收货地址")}
        </div>
      </div>
    </div>
  );
};
export default Address;
