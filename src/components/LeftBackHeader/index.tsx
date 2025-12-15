import "./index.scss";
import { useNavigate } from "react-router-dom";
import back from "@/assets/img/back.png";
const LeftBackHeader: React.FC<{
  title: string;
}> = ({ title }) => {
  const navigate = useNavigate();
  return (
      <div className="leftBackHeaderPage">
        <div className="back-left">
          <img
            onClick={() => navigate(-1)}
            src={back}
            className="back-img"
            alt=""
          />
        </div>
        <div className="back-header-title">{title}</div>
        <div className="back-right"></div>

      </div>
  );
};

export default LeftBackHeader;
