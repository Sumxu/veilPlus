import "./index.scss";
import Tools from "./Components/Tools";
import Info from "./Components/Info";
import WalletHeader from "./Components/WalletHeader";
const My: React.FC = () => {
  return (
    <div className="myPage">
      <WalletHeader></WalletHeader>
      <Tools></Tools>
    </div>
  );
};
export default My;
