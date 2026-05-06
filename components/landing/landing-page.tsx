"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Activity, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export function LandingPage() {
  const { t } = useLanguage();

  return (
    <>
      <main className="bg-neutral-950 font-['Public_Sans'] overflow-x-hidden selection:bg-yellow-500/30">
        
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative h-[100dvh] min-h-[600px] flex items-center pt-16 overflow-hidden"
        >
          {/* Background Ambient Layers */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[150px] -ml-64 -mb-64 pointer-events-none"></div>
          </div>

          <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-yellow-500/50"></div>
                <span className="font-label-caps text-[10px] uppercase font-black tracking-[0.3em] text-yellow-500">
                  {t("hero_eyebrow")}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[1.1] mb-6">
                {t("hero_title_line1")}<br />{t("hero_title_line2")}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                  {t("hero_city")}
                </span>
              </h1>
              
              <p className="text-neutral-400 text-base lg:text-lg font-medium leading-relaxed mb-8 max-w-md">
                {t("hero_subtitle")}
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
                <Link href="/sign-in" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-yellow-500 text-black px-8 py-3.5 font-label-caps text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-yellow-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_-10px_rgba(234,179,8,0.4)] flex items-center justify-center gap-3">
                    {t("hero_cta_login")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button className="w-full sm:w-auto bg-transparent border border-neutral-700 text-white px-8 py-3.5 font-label-caps text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/5 hover:border-neutral-500 transition-all">
                  {t("hero_cta_docs")}
                </button>
              </div>
              <div className="mt-6 flex items-center justify-center sm:justify-start gap-4 text-neutral-500">
                <Link
                  href="/forgot-password"
                  className="hover:text-yellow-500 text-[10px] font-label-caps font-bold uppercase tracking-widest transition-colors"
                >
                  {t("hero_recover")}
                </Link>
              </div>
            </div>

            {/* Right Visual Floating Element */}
            <div className="hidden lg:flex justify-end relative">
              <div className="relative z-10 w-full max-w-md bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl transform hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">{t("live_metrics")}</div>
                      <div className="text-white font-bold">{t("network_status")}</div>
                    </div>
                  </div>
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-black/50 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                    <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">{t("stations_online")}</span>
                    <span className="text-white font-black text-xl tracking-tight">142</span>
                  </div>
                  <div className="bg-black/50 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                    <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">{t("liters_distributed")}</span>
                    <span className="text-yellow-400 font-black text-xl tracking-tight">1.2M+</span>
                  </div>
                  <div className="bg-black/50 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                    <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider">{t("active_vehicles")}</span>
                    <span className="text-white font-black text-xl tracking-tight">50,491</span>
                  </div>
                </div>
              </div>

              {/* Decorative rings behind card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full aspect-square pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-white/5 rounded-full aspect-square pointer-events-none"></div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent"></div>
        </section>

        {/* SERVICES / PILLARS SECTION */}
        <section
          id="services"
          className="py-24 bg-neutral-950 relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-6">
                {t("services_title")}
              </h2>
              <p className="text-neutral-400 font-medium text-lg">
                {t("services_subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Pillar 1: Government */}
              <div className="group relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-yellow-500/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-colors"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/10 border border-yellow-500/20 flex items-center justify-center mb-8">
                    <ShieldCheck className="w-7 h-7 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{t("pillar1_title")}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                    {t("pillar1_desc")}
                  </p>
                  <ul className="space-y-3">
                    {([t("pillar1_item1"), t("pillar1_item2"), t("pillar1_item3")] as string[]).map((item) => (
                      <li key={item} className="flex items-center text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pillar 2: Stations */}
              <div className="group relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-emerald-500/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border border-emerald-500/20 flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-3xl text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>local_gas_station</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{t("pillar2_title")}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                    {t("pillar2_desc")}
                  </p>
                  <ul className="space-y-3">
                    {([t("pillar2_item1"), t("pillar2_item2"), t("pillar2_item3")] as string[]).map((item) => (
                      <li key={item} className="flex items-center text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pillar 3: Citizens */}
              <div className="group relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-blue-500/50 rounded-3xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/10 border border-blue-500/20 flex items-center justify-center mb-8">
                    <Users className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{t("pillar3_title")}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                    {t("pillar3_desc")}
                  </p>
                  <ul className="space-y-3">
                    {([t("pillar3_item1"), t("pillar3_item2"), t("pillar3_item3")] as string[]).map((item) => (
                      <li key={item} className="flex items-center text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* AUTHORIZED BODIES BANNER */}
        <section
          id="authorities"
          className="border-t border-neutral-800 bg-neutral-950 py-16 lg:py-20"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-10">
              <p className="font-label-caps text-[10px] text-neutral-600 font-bold tracking-[0.3em] uppercase">
                {t("authorities_label")}
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {[
                { icon: "gavel", key: "auth1" as const },
                { icon: "policy", key: "auth2" as const },
                { icon: "shield_with_heart", key: "auth3" as const },
                { icon: "location_city", key: "auth4" as const },
              ].map((authority) => (
                <div key={authority.key} className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-600 transition-colors">
                    <span className="material-symbols-outlined text-3xl text-neutral-500 group-hover:text-white transition-colors">{authority.icon}</span>
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase group-hover:text-white transition-colors text-center max-w-[120px]">
                    {t(authority.key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
      </main>
    </>
  );
}
