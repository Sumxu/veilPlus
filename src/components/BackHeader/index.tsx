import "./index.scss";
import { useEffect, useRef,useState } from "react";
import { useNavigate } from "react-router-dom";

import back from "@/assets/img/back.png";

const Header: React.FC<{
  title: string;
  rightText?: string;
  rightUrl?: string;
  rightIcon?: string;
}> = ({ title, rightText, rightIcon, rightUrl }) => {
  const navigate = useNavigate();
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
        <div className="back-left">
          <img
            onClick={() => navigate(-1)}
            src={back}
            className="back-img"
            alt=""
          />
        </div>
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
