import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zh from './locales/zh.json';
import en from './locales/en.json';

const resources = {
  zh: { translation: zh },
  en: { translation: en },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    // 关键：把浏览器/缓存里的 zh-CN、zh-TW、en-US 等
    // 一律归一化为 'zh' / 'en'，否则 toggle 时
    // i18n.language 可能是 'zh-CN'，判断为 !== 'zh' 而切错方向，
    // 表现为「要点好几次才切换」。
    load: 'languageOnly',
    supportedLngs: ['zh', 'en'],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      // 缓存时也写入规范值，避免 localStorage 里存 'zh-CN'
      convertDetectedLanguage: (lng) =>
        lng && lng.toLowerCase().startsWith('zh') ? 'zh' : 'en',
    },
  });

/** 当前语言的规范形式：'zh' | 'en'（兼容 zh-CN / en-US 等） */
export function currentLang() {
  return i18n.language && i18n.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export default i18n;