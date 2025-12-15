import { useMemo } from "react";

export interface ZoneItem {
  id: number;
  name: string;
  subsidy: number;
}

export function useZoneConfig() {
  const zoneList: ZoneItem[] = useMemo(
    () => [
      { id: 1, name: "安品区", subsidy: 100 },
      { id: 2, name: "优品区", subsidy: 200 },
      { id: 3, name: "臻品区", subsidy: 400 },
      { id: 4, name: "兑换区", subsidy: 0 },
    ],
    []
  );
  /** 根据 ID 获取区间配置 */
  const getZoneInfo = (id: number) => zoneList.find((z) => z.id === id);
  return {
    zoneList,
    getZoneInfo,
  };
}
