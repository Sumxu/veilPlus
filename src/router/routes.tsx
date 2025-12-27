import { lazy } from "react";
import { Navigate } from "react-router-dom";
const Node = lazy(() => import("@/pages/Node/index"));
const OutputList = lazy(() => import("@/pages/OutputList"));
const MyTeam = lazy(() => import("@/pages/MyTeam"));
const Home = lazy(() => import("@/pages/Tabbar/Home/index"));
const Donate = lazy(() => import("@/pages/Tabbar/Donate"));
const My = lazy(() => import("@/pages/Tabbar/My/index"));
const About = lazy(() => import("@/pages/Tabbar/My/About"));
const NodeDetail = lazy(() => import("@/pages/Tabbar/My/NodeDetail"));
const DonateStartList=lazy(() => import("@/pages/Tabbar/Donate/DonateStartList"));
export const routes = [
  { path: "/", element: <Navigate to="/Home" replace /> },
  { path: "/Home", element: <Home /> },
  { path: "/Donate", element: <Donate /> },
  { path: "/My", element: <My /> },
  { path: "/Node", element: <Node /> },
  { path: "/OutputList", element: <OutputList /> },
  { path: "/MyTeam", element: <MyTeam /> },
  { path: "/About", element: <About /> },
  { path: "/NodeDetail", element: <NodeDetail /> },
  { path: "/DonateStartList", element: <DonateStartList /> },
];
