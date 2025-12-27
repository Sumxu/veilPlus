import "./index.scss";
import type { FC } from "react";
import LeftBackHeader from "@/components/LeftBackHeader";
import { useState } from "react";
import { RightOutline } from "antd-mobile-icons";
import { ProgressCircle } from "antd-mobile";
import rightIcon from '@/assets/basic/right.png';
const DonateStartListPage: FC = () => {
  const [tabIndex, setTabIndex] = useState<string>("0");
  const tabList = [
    {
      name: "全部",
      value: "0",
    },
    {
      name: "挖矿中",
      value: "1",
    },
    {
      name: "已完成",
      value: "2",
    },
  ];
  return (
    <div className="DonateStartListPage">
      <LeftBackHeader title="我的捐赠"></LeftBackHeader>
      <div className="tabBox">
        {tabList.map((item, index) => {
          return (
            <div
              onClick={() => setTabIndex(item.value)}
              className={`tabOption ${item.value == tabIndex ? "checked" : ""}`}
              key={index}
            >
              {item.name}
            </div>
          );
        })}
      </div>

      <div className="contentList">
        <svg width="0" height="0" className="svgCircle">
          <defs>
            <linearGradient
              id="gradientColor"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#00B2FE" />
              <stop offset="100%" stopColor="#00FDE3" />
            </linearGradient>
          </defs>
        </svg>
        <div className="itemBox">
          <div className="headerOption">
            <div className="tag">#1-000083</div>
            <div className="rightOption">
              <div className="statusTxt">
                <div className="line"></div>
                <div className="txt">挖矿中</div>
              </div>
              <div className="dateTime">09/05/2025 18:25:56</div>
            </div>
          </div>
          <div className="centerBox">
            <div className="leftOption">
              <div className="progressCircleItem">
                <ProgressCircle
                  percent={34}
                  style={{
                    "--size": "52px",
                    "--track-width": "4px",
                    "--fill-color": "url(#gradientColor)",
                    "--track-color": "#284647",
                  }}
                >
                  <div className="progressCircleNumber">50%</div>
                </ProgressCircle>
              </div>
            </div>
            <div className="rightOption">
              <div className="rightItem">
                <div className="txt">预计总收益</div>
                <div className="txt2">2,000.00 VIPL</div>
              </div>
              <div className="rightItem rightItemLeft">
                <div className="txt">参与金额</div>
                <div className="txt2">1,000.00 USDT</div>
              </div>
            </div>
          </div>
          <div className="endBox">
            <div className="leftOption">
              <span className="spn1">已收益:</span>
              <span className="spn2">12000VIPL</span>
            </div>
            <div className="rightOption">
              <span className="spn1">收益记录</span>
              <RightOutline fontSize={12} color="#fff" />
            </div>
          </div>
        </div>

        <div className="itemBox">
          <div className="headerOption">
            <div className="tag opacity">#1-000083</div>
            <div className="rightOption">
              <div className="statusTxt">
                <div className="line"></div>
                <div className="txt">挖矿中</div>
              </div>
              <div className="dateTime">09/05/2025 18:25:56</div>
            </div>
          </div>
          <div className="centerBox">
            <div className="leftOption">
              <div className="progressCircleItem">
                <ProgressCircle
                  percent={34}
                  style={{
                    "--size": "52px",
                    "--track-width": "4px",
                    "--fill-color": "url(#gradientColor)",
                    "--track-color": "#284647",
                  }}
                >
                  <div className="progressCircleNumber">50%</div>
                </ProgressCircle>
              </div>
            </div>
            <div className="rightOption">
              <div className="rightItem">
                <div className="txt">预计总收益</div>
                <div className="txt2">2,000.00 VIPL</div>
              </div>
              <div className="rightItem rightItemLeft">
                <div className="txt">参与金额</div>
                <div className="txt2">1,000.00 USDT</div>
              </div>
            </div>
          </div>
          <div className="endBox">
            <div className="leftOption">
              <span className="spn1">已收益:</span>
              <span className="spn2">12000VIPL</span>
            </div>
            <div className="rightOption">
              <span className="spn1">收益记录</span>
                  <img src={rightIcon} className="rightIcon"></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DonateStartListPage;
