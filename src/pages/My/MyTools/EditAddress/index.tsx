import "./index.scss";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LeftBackHeader from "@/components/LeftBackHeader";
import { Switch, Input } from "antd-mobile";
import { storage } from "@/Hooks/useLocalStorage";
import NetworkRequest from "@/Hooks/NetworkRequest.ts";
import { Totast } from "@/Hooks/Utils";
import { Spin } from "antd";
import { t } from "i18next";
import { useRouteRecorder } from "@/hooks/useRouteRecorder";
import { Cascader } from "antd-mobile";
import { rawData } from "@/config/chinaRegion"; // 你的省市区数据
type AddressInfo = {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  details: string;
  isDefault: boolean;
};

const EditAddress: React.FC = () => {
  const navigate = useNavigate();
  const { lastPath } = useRouteRecorder();
  const [addressCascader, setAddressCascader] = useState(["", "", ""]); // 默认回显
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [cascaderVisible, setCascaderVisible] = useState<boolean>(false);
  // 初始化 state，保证省市区不会是 undefined
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    id: "",
    name: "",
    phone: "",
    province: "",
    city: "",
    area: "",
    details: "",
    isDefault: false,
  });

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  // 清空地址
  const clearAddress = () => {
    const info = storage.get("editAddressInfo", {});
    if (typeof info === "object") {
      const cleared = Object.fromEntries(
        Object.keys(info).map((key) => [key, ""])
      );
      storage.set("editAddressInfo", cleared);
      setAddressInfo((prev) => ({ ...prev, ...cleared }));
    }
  };
  const transformToCascader = (data) =>
    data.map((item) => ({
      label: item.name,
      value: item.areaId,
      children: item.children ? transformToCascader(item.children) : undefined,
    }));

  // 根据 value 数组查找对应的 label 数组
  const findLabelsByValue = (data, valueArray) => {
    const labels = [];
    let currentLevel = data;
    for (const val of valueArray) {
      const found = currentLevel.find((item) => item.value === val);
      if (found) {
        labels.push(found.label);
        currentLevel = found.children || [];
      } else {
        break;
      }
    }

    return labels;
  };

  const CascaderOptions = useMemo(() => transformToCascader(rawData), []);
  // 文本回显
  const addressText = findLabelsByValue(CascaderOptions, addressCascader).join(
    " "
  );

  // 初始化数据
  const initData = () => {
    console.log("lastPath00", lastPath);
    if (type === "add") {
      clearAddress();
    } else {
      const info = storage.get("editAddressInfo", {});

      if (typeof info === "object") {
        setAddressInfo((prev) => ({ ...prev, ...info }));
        const value = findValuesByLabels(CascaderOptions, [
          info.province,
          info.city,
          info.area,
        ]);
        setAddressCascader(value);
      }
    }
  };
  function findValuesByLabels(
    options: any[],
    labels: string[]
  ): (number | string)[] {
    let currentLevel = options;
    let values: (number | string)[] = [];

    for (const label of labels) {
      const found = currentLevel.find((item) => item.label === label);

      if (!found) return []; // 找不到则返回空数组

      values.push(found.value);
      currentLevel = found.children || [];
    }

    return values;
  }
  // 根据 value 数组找到对应的 items（路径上的所有节点）
  function getItemsByValue(
    options: CascaderOption[],
    valueArr: (string | number)[]
  ) {
    const result: CascaderOption[] = [];
    let current = options;
    for (const val of valueArr) {
      const found = current.find((item) => item.value === val);
      if (!found) break;
      result.push(found);
      current = found.children || [];
    }

    return result; // 等同于 extend.items
  }

  const onConfirmCascader = (val) => {
    setAddressCascader(val);
    setCascaderVisible(false);
  };
  useEffect(() => {
    initData();
  }, []);

  // 校验
  const validateAddressInfo = (info: AddressInfo): boolean => {
    if (!info.name.trim()) {
      Totast("姓名不能为空", "error");
      return false;
    }
    if (!info.phone.trim()) {
      Totast("手机号不能为空", "error");
      return false;
    }
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(info.phone)) {
      Totast("手机号格式不正确", "error");
      return false;
    }
    console.log("info--", info);
    if (!info.province.trim()) {
      Totast("省市不能为空", "error");
      return false;
    }
    if (!info.city) {
      Totast("市区不能为空", "error");
      return false;
    }

    if (!info.area) {
      Totast("地区不能为空", "error");
      return false;
    }

    if (!info.details.trim()) {
      Totast("详细地址不能为空", "error");
      return false;
    }
    return true;
  };

  // 保存
  const saveClick = async () => {
    setBtnLoading(true);
    const items = getItemsByValue(CascaderOptions, addressCascader);
    const labels = items.map((i) => i.label);

    const param: AddressInfo = { ...addressInfo };

    let urlPath = "";
    param.province = labels[0];
    param.city = labels[1];
    param.area = labels[2];
    if (!validateAddressInfo(param)) {
      setBtnLoading(false);
      return;
    }
    if (type === "add") {
      delete param.id;
      param.isDefault ? param.isDefault : false;
      urlPath = "address/add";
    } else {
      urlPath = "address/update";
    }
    if (param.isDefault == "" || param.isDefault == null) {
      param.isDefault = false;
    }
    setBtnLoading(true);
    const result = await NetworkRequest({
      Url: urlPath,
      Method: "post",
      Data: { ...param },
    });
    if (result.success) {
      navigate(-1);
    }
    setBtnLoading(false);
  };

  return (
    <div className="addressEditPage">
      <LeftBackHeader
        title={t(type === "add" ? "新增收货地址" : "编辑收货地址")}
      />
      <div className="addressContent">
        <div className="box">
          {/* 姓名 */}
          <div className="addressInfoItem addressInfoBottomBorder">
            <div className="leftLabel">{t("姓名")}</div>
            <div className="rightContent">
              <Input
                placeholder={t("输入收货人姓名")}
                clearable
                value={addressInfo.name}
                onChange={(val) =>
                  setAddressInfo((prev) => ({ ...prev, name: val }))
                }
                style={{
                  "--font-size": "14px",
                  "--color": "#fff",
                  "--placeholder-color": "rgba(255,255,255,0.35)",
                }}
              />
            </div>
          </div>

          {/* 手机号 */}
          <div className="addressInfoItem addressInfoBottomBorder">
            <div className="leftLabel">{t("手机号")}</div>
            <div className="rightContent">
              <Input
                placeholder={t("输入手机号")}
                clearable
                value={addressInfo.phone}
                onChange={(val) =>
                  setAddressInfo((prev) => ({ ...prev, phone: val }))
                }
                style={{
                  "--font-size": "14px",
                  "--color": "#fff",
                  "--placeholder-color": "rgba(255,255,255,0.35)",
                }}
              />
            </div>
          </div>

          {/* 省市区 */}
          <div className="addressInfoItem addressInfoBottomBorder">
            <div className="leftLabel">{t("所在地区")}</div>
            <div className="rightContent">
              <div
                className="distpickerWrapper"
                onClick={() => setCascaderVisible(true)}
              >
                {addressText || "请选择"}
              </div>
            </div>
          </div>

          {/* 详细地址 */}
          <div className="addressInfoItem">
            <div className="leftLabel">{t("详细地址")}</div>
            <div className="rightContent">
              <Input
                placeholder={t("输入详细地址")}
                clearable
                value={addressInfo.details}
                onChange={(val) =>
                  setAddressInfo((prev) => ({ ...prev, details: val }))
                }
                style={{
                  "--font-size": "14px",
                  "--color": "#fff",
                  "--placeholder-color": "rgba(255,255,255,0.35)",
                }}
              />
            </div>
          </div>
        </div>

        {/* 默认地址开关 */}
        <div className="box settingCheck">
          <div className="leftItem">{t("设为默认")}</div>
          <div className="rightItem">
            <Switch
              className="switchCss"
              checked={addressInfo.isDefault}
              onChange={(checked) =>
                setAddressInfo((prev) => ({ ...prev, isDefault: checked }))
              }
              style={{
                "--checked-color": "#0be72f",
                "--height": "16px",
                "--width": "32px",
              }}
            />
          </div>
        </div>
      </div>
      <Cascader
        options={CascaderOptions}
        visible={cascaderVisible}
        onClose={() => setCascaderVisible(false)}
        value={addressCascader}
        onSelect={(val, extend) => {
          console.log("onSelect", val, extend.items);
        }}
        onConfirm={onConfirmCascader}
      />
      {/* 保存按钮 */}
      <div className="addressBtnBox">
        <div className="addressBtn" onClick={saveClick}>
          {btnLoading ? <Spin /> : t("保存")}
        </div>
      </div>
    </div>
  );
};

export default EditAddress;
