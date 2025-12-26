import "./index.scss";
import type { FC } from "react";
import HeaderTop from "./Components/HeaderTop";
import Card from "./Components/Card";
import List from './Components/List';
const Donate: FC = () => {
  return <div className="donatePage">
      <HeaderTop></HeaderTop>
      <Card></Card>
      <List></List>
  </div>;
};
export default Donate;
