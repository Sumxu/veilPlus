import { lazy } from "react";
import { Navigate } from "react-router-dom";
const Home = lazy(() => import("@/pages/Home"));
const OutputList = lazy(() => import("@/pages/OutputList"));
const MyTeam = lazy(() => import("@/pages/MyTeam"));
 
export const routes = [
  { path: "/", element: <Navigate to="/home" replace /> },
  { path: "/home", element: <Home /> },
  { path: "/outputList", element: <OutputList /> },
  { path: "/MyTeam", element: <MyTeam /> },
];
