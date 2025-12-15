// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./Lang/zh.json";
import en from "./Lang/en.json";
import zhHant from "./Lang/zhHant.json";
i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
    zhHant: { translation: zhHant },
  },
  lng: window.localStorage.getItem("lang") ?? "zh", // 设置默认语言
  fallbackLng: "zh", // 找不到语言时回退用中文
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
