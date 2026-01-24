import "./index.scss";
import type { FC } from "react";
import HeaderTop from "./Components/HeaderTop";
import Card from "./Components/Card";
import List from "./Components/List";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const Donate: FC = () => {
  const navigate=useNavigate()
  return (
    <div className="donatePage">
      <HeaderTop></HeaderTop>
      <Card></Card>
      <List></List>
      <div className="btnList">
        <div className="btn bgTwo" onClick={() => navigate("/Node")}>
          {t("节点购买")}
        </div>
      </div>
    </div>
  );
};
export default Donate;
