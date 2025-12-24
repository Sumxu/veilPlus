import { lazy } from "react";
import { Navigate } from "react-router-dom";
const Node = lazy(() => import("@/pages/Node"));
const OutputList = lazy(() => import("@/pages/OutputList"));
const MyTeam = lazy(() => import("@/pages/MyTeam"));
const Home = lazy(() => import("@/pages/Tabbar/Home/index"));
const Donate = lazy(() => import("@/pages/Tabbar/Donate/index"));
const My = lazy(() => import("@/pages/Tabbar/My/index"));
export const routes = [
  { path: "/", element: <Navigate to="/Home" replace /> },
   { path: "/Home", element: <Home /> },
   { path: "/Donate", element: <Donate /> },
   { path: "/My", element: <My /> },
  { path: "/Node", element: <Node /> },
  { path: "/OutputList", element: <OutputList /> },
  { path: "/MyTeam", element: <MyTeam /> },
];
