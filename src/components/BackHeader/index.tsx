import "./index.scss";
import { useEffect, useRef,useState } from "react";
import { useNavigate } from "react-router-dom";

import back from "@/assets/img/back.png";
import { userAddress } from "@/Store/Store.ts";
import { formatAddress } from "@/Hooks/Utils";

const Header: React.FC<{
  title: string;
  isHome?:boolean;
  rightText?: string;
  rightUrl?: string;
  rightIcon?: string;
}> = ({ title, isHome,rightText, rightIcon, rightUrl }) => {
  const navigate = useNavigate();
  const walletAddress = userAddress().address;

    const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setScrolled(window.scrollY > headerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={`back-header ${scrolled ? 'scrolled' :''}`}  ref={headerRef}>
        {isHome?
        <div className="back-left">
          <span className="walletAddressSpan"> {formatAddress(walletAddress)}</span>
        </div>
        :<div className="back-left">
          <img
            onClick={() => navigate(-1)}
            src={back}
            className="back-img"
            alt=""
          />
        </div>}
        <span className="back-header-title">{title}</span>
        <span
          onClick={() => rightUrl && navigate(rightUrl)}
          className="right-text"
        >
          {rightIcon && (
            <img src={rightIcon} className="right-header-icon"></img>
          )}
        </span>
      </div>
    </>
  );
};

export default Header;
