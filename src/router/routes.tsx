import { lazy } from "react";
import { Navigate } from "react-router-dom";
const Node = lazy(() => import("@/pages/Node/index"));
const MyTeam = lazy(() => import("@/pages/MyTeam"));
const TeamReward = lazy(() => import("@/pages/TeamReward"));
const TeamClaim = lazy(() => import("@/pages/TeamClaim"));
const RewardList = lazy(() => import("@/pages/RewardList"));
const Home = lazy(() => import("@/pages/Tabbar/Home/index"));
const Donate = lazy(() => import("@/pages/Tabbar/Donate"));
const My = lazy(() => import("@/pages/Tabbar/My/index"));
const About = lazy(() => import("@/pages/Tabbar/My/About"));
const NodeDetail = lazy(() => import("@/pages/Tabbar/My/NodeDetail"));
const OutputList = lazy(() => import("@/pages/OutputList"));

const DonateStartList = lazy(
  () => import("@/pages/Tabbar/Donate/DonateStartList")
);
export const routes = [
  { path: "/", element: <Navigate to="/Home" replace /> },
  { path: "/Home", element: <Home /> },
  { path: "/Donate", element: <Donate /> },
  { path: "/My", element: <My /> },
  { path: "/Node", element: <Node /> },
  { path: "/MyTeam", element: <MyTeam /> },
  { path: "/TeamReward", element: <TeamReward /> },
  { path: "/TeamClaim", element: <TeamClaim /> },
  { path: "/OutputList", element: <OutputList /> },
  { path: "/About", element: <About /> },
  { path: "/NodeDetail", element: <NodeDetail /> },
  { path: "/DonateStartList", element: <DonateStartList /> },
];
