import "./index.scss";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import lan from "@/assets/basic/lan.png";
import back from "@/assets/basic/back.png";
import { userAddress } from "@/Store/Store.ts";
import { formatAddress } from "@/Hooks/Utils";
import { Picker } from "antd-mobile";
import i18n, { t } from "i18next";
import { DownOutline } from "antd-mobile-icons";
import walletsIcon from '@/assets/basic/wallet.png'
const Header: React.FC<{
  title: string;
  isHome?: boolean;
  rightText?: string;
  rightUrl?: string;
  rightIcon?: string;
}> = ({ title, isHome, rightText, rightIcon, rightUrl }) => {
  const navigate = useNavigate();
  const walletAddress = userAddress().address;
  const basicColumns = [
    [
      { label: "中文繁体", value: "1" },
      { label: "English", value: "2" },
      { label: "Indonesian", value: "3" },
      { label: "Thai", value: "4" },
      { label: "Japanese", value: "5" },
      { label: "Korean", value: "6" },
      { label: "Vietnamese", value: "7" },
    ],
  ];

  const [langTxt, setLangTxt] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("1");
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const langClick = () => {
    setVisible(true);
  };
  // 获取当前语言
  const getCurrLang = () => {
    const localLang: string = window.localStorage.getItem("lang") ?? "zhHant";
    i18n.changeLanguage(localLang);
    console.log("localLang==", localLang);
    if (localLang == "zhHant") {
      setValue("1");
      setLangTxt("繁体中文");
    }
    if (localLang == "en") {
      setValue("2");
      setLangTxt("English");
    }
    if (localLang == "indonesian") {
      setValue("3");
      setLangTxt("Indonesian");
    }
    if (localLang == "thai") {
      setValue("4");
      setLangTxt("Thai");
    }
    if (localLang == "japanese") {
      setValue("5");
      setLangTxt("Japanese");
    }
    if (localLang == "korean") {
      setValue("6");
      setLangTxt("Korean");
    }
    if (localLang == "vietnamese") {
      setValue("7");
      setLangTxt("Vietnamese");
    }
  };
  // 获取当前语言
  const changeLanguage = (v: string) => {
    const val = v[0];
    let name = "";
    setValue(val);
    if (val == "1") {
      name = "zhHant";
    }
    if (val == "2") {
      name = "en";
    }
    if (val == "3") {
      name = "indonesian";
    }
    if (val == "4") {
      name = "thai";
    }
    if (val == "5") {
      name = "japanese";
    }
    if (val == "6") {
      name = "korean";
    }
    if (val == "7") {
      name = "vietnamese";
    }
    i18n.changeLanguage(name);
    window.localStorage.setItem("lang", name);
    window.location.reload();
  };
  useEffect(() => {
    getCurrLang();
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
    <div
      className={`back-header ${scrolled ? "scrolled" : ""}`}
      ref={headerRef}
    >
      <div className="back-left">
        {langTxt && (
            <img src={back} className="lan-icon" onClick={()=>navigate(-1)}></img>
        )}
      </div>
      {
        title&&<span className="back-header-title">{title}</span>
      }
      <span
        onClick={() => rightUrl && navigate(rightUrl)}
        className="right-text"
      >
        {isHome ? (
          <div className="back-left">
           
            <span className="walletAddressSpan">
               <img src={walletsIcon} className="walletsIcon"></img>
              {formatAddress(walletAddress)}
            </span>
          </div>
        ) : (
          <div className="back-left">
            <img
              onClick={() => navigate(-1)}
              src={back}
              className="back-img"
              alt=""
            />
          </div>
        )}
      </span>
      <Picker
        cancelText={t("取消")}
        confirmText={t("确认")}
        columns={basicColumns}
        visible={visible}
        popupStyle={{
          background: "#fff",
        }}
        onClose={() => {
          setVisible(false);
        }}
        value={value}
        onConfirm={(v) => {
          changeLanguage(v);
        }}
      />
    </div>
  );
};

export default Header;
