"use client";

import { useLanguage } from "@/lib/i18n/language-context";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ti" : "en")}
      className="relative flex items-center gap-0 rounded-full border border-yellow-600/30 bg-yellow-500/10 overflow-hidden transition-all hover:border-yellow-500/60 hover:bg-yellow-500/20 active:scale-95"
      title={lang === "en" ? "Switch to Tigrinya" : "ወደ እንግሊዝኛ ቀይር"}
    >
      {/* EN pill */}
      <span
        className={`px-3 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all duration-200 ${
          lang === "en"
            ? "bg-yellow-500 text-black rounded-full"
            : "text-neutral-400 hover:text-yellow-500"
        }`}
      >
        EN
      </span>
      {/* Divider */}
      <span className="h-3 w-px bg-yellow-600/30" />
      {/* Tigrinya pill */}
      <span
        className={`px-3 py-1.5 text-[10px] font-black tracking-widest transition-all duration-200 ${
          lang === "ti"
            ? "bg-yellow-500 text-black rounded-full"
            : "text-neutral-400 hover:text-yellow-500"
        }`}
      >
        ትግ
      </span>
    </button>
  );
}
