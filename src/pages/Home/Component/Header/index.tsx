import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./index.scss";
import logo from "@/assets/login/logo.png";
import { SearchOutline } from "antd-mobile-icons";
import { t } from "i18next";
interface HeaderProps {
  isIconShow?: boolean;
}

const Header: React.FC<HeaderProps> = ({isIconShow=true}) => {
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const navigate=useNavigate()
  useEffect(() => {
    const scrollContainer = document.querySelector(".home-page-box");
    const handleScroll = () => {
      const scrollTop = scrollContainer?.scrollTop || 0;
      setIsFixed(scrollTop > 10);
    };
    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className={`header-search-option ${isFixed ? "fixed-header" : ""}`}>
      {
        isIconShow&&(<img src={logo} className="logo-icon" />)
      }
      <div className="input-option" onClick={()=>navigate('/search')}>
        <SearchOutline fontSize={16} color="#A8AAA9" />
        <span className="spn-1">{t('搜索您想要的商品')}</span>
      </div>
    </div>
  );
};

export default Header;
