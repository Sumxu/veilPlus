import { lazy } from "react";
import { Navigate } from "react-router-dom";
const Home = lazy(() => import("@/pages/Home"));
const Classify = lazy(() => import("@/pages/Classify"));
const My = lazy(() => import("@/pages/My"));
const Order = lazy(() => import("@/pages/My/MyTools/Order"));
const OrderDetail = lazy(() => import("@/pages/My/MyTools/OrderDetail"));
const AssetDetails = lazy(() => import("@/pages/My/MyTools/AssetDetails"));
const TaxPledge = lazy(() => import("@/pages/My/MyTools/TaxPledge"));
const TaxList = lazy(() => import("@/pages/My/MyTools/TaxList"));
const Address = lazy(() => import("@/pages/My/MyTools/Address"));
const EditAddress = lazy(() => import("@/pages/My/MyTools/EditAddress"));
const LangPage = lazy(() => import("@/pages/My/MyTools/lang"));
const MyTeam = lazy(() => import("@/pages/My/MyTools/MyTeam"));
const MerchantCenter = lazy(() => import("@/pages/My/MyTools/MerchantCenter"));
const GoodsDetail = lazy(() => import("@/pages/GoodsDetail"));
const CreatOrder = lazy(() => import("@/pages/CreatOrder"));
const Login = lazy(() => import("@/pages/Login"));
const Nft = lazy(() => import("@/pages/Nft"));
const OutputList = lazy(() => import("@/pages/OutputList"));
const PayResult = lazy(() => import("@/pages/PayResult"));
const ShopApplication = lazy(() => import("@/pages/My/MyTools/ShopApplication"));
const Search = lazy(() => import("@/pages/Search"));

export const routes = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/home", element: <Home /> },
  { path: "/classify", element: <Classify /> },
  { path: "/my", element: <My /> },
  { path: "/order", element: <Order /> },
  { path: "/orderDetail", element: <OrderDetail /> },
  { path: "/assetDetails", element: <AssetDetails /> },
  { path: "/taxPledge", element: <TaxPledge /> },
  { path: "/taxList", element: <TaxList /> },
  { path: "/address", element: <Address /> },
  { path: "/editAddress", element: <EditAddress /> },
  { path: "/langPage", element: <LangPage /> },
  { path: "/myTeam", element: <MyTeam /> },
  { path: "/merchantCenter", element: <MerchantCenter /> },
  { path: "/goodsDetail", element: <GoodsDetail /> },
  { path: "/outputList", element: <OutputList /> },
  { path: "/creatOrder", element: <CreatOrder /> },
  { path: "/payResult", element: <PayResult /> },
  { path: "/login", element: <Login /> },
  { path: "/nft", element: <Nft /> },
  { path: "/shopApplication", element: <ShopApplication /> },
  { path: "/search", element: <Search /> },
];
