import "./index.scss";
import type { FC } from "react";
import HeaderFixedLogin from "@/components/HeaderFixedLogin";
import HomeTopBox from "@/pages/Tabbar/Home/Components/HomeTopBox";
import HomCenterBox from "@/pages/Tabbar/Home/Components/HomeCenterBox";
import HomeEndBox from "./Components/HomeEndBox";
const Home: FC = () => {
  return (
    <div className="homePageBox">
        <HeaderFixedLogin></HeaderFixedLogin>
        <HomeTopBox></HomeTopBox>
        <HomCenterBox></HomCenterBox>
        <HomeEndBox></HomeEndBox>
    </div>
  );
};
export default Home;
