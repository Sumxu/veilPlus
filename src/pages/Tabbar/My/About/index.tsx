import "./index.scss";
import LeftBackHeader from "@/components/LeftBackHeader";
import { t } from "i18next";

const About: React.FC = () => {
  const hintList = [
    t("VEIL PLUS 代表了一种新的范式转变——从“生态锁定用户” 到 “用户选择生态”。"),
    t("在传统 Web3 中，用户在不同生态间切换时，其历史、信誉、关系均被重置。"),
    t(
      "而通过 VEIL PLUS，用户将拥有 真正可携带的链上身份资产，自由穿梭于 Veil Labs 全生态，并在每次迁移中 继承并增强其数字价值。"
    ),
    t("这不仅是技术创新，更是经济模型的革新。"),
    t(
      "用户不再是生态的“过客”，而是 跨生态共建者，其每一次参与都在为整个 Veil Labs 生态网络增添价值，并获得相应的长期回报。"
    ),
  ];
  return (
    <div className="aboutPage">
      <LeftBackHeader title={t("关于我们")}></LeftBackHeader>
      <div className="contentPage">
        <div className="title">VEIL PLUS</div>
        <div className="hintTxt">{t("让行为成为资产，身份自由流动")}</div>
        <div className="hintBoxTxt">{t("构建可移植的全链上身份协议")}</div>
        <div className="HintListBox">
          {hintList.map((item, index) => {
            return (
              <div className="txtOption" key={index}>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default About;
