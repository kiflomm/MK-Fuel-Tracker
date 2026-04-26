import Link from "next/link";

export function LandingPage() {
  return (
    <>
      <main>
        <section
          id="home"
          className="relative min-h-screen flex items-center pt-20 overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <img
              alt="Mekelle Modern Infrastructure"
              className="w-full h-full object-cover grayscale-[20%] brightness-50"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX7K_aHw88mmyvZyHTwDZx-tbfvtp0DRzT66dF8GGGHNl_pTk7AY4dKBSeogmIuAq7RgB18LYtdPNCn-ZStpYmLOBO8W8zrUI0KmXHP7ZRudAZ3ql7BcUN6DwEcF9Obn07XJBk-Wu_mNRphFckXTCf-Vla82pkSY1Oeo0GDeFEwi1EZ4iCVfMTod7dN3UaZ6IAPJYd4yUY7FkMjv1vEs7Gxm9z9Nb0qDx4bRghgyHR77eVVXnNWwPsvIT6xUeW3BgdkFAnYh-tE18"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-on-surface/90 to-transparent"></div>
            <div className="absolute inset-0 tilfi-pattern opacity-10"></div>
          </div>
          <div className="container mx-auto px-lg relative z-10 grid lg:grid-cols-2 gap-xl items-center">
            <div className="max-w-2xl">
              <span className="inline-block bg-primary-container/20 text-primary-container px-4 py-1 font-label-caps text-xs border border-primary-container/30 mb-6">
                REGIONAL ENERGY OVERSIGHT
              </span>
              <h1 className="font-display-lg text-display-lg text-white mb-6 leading-tight">
                Modernizing Fuel Distribution for{" "}
                <span className="text-primary-container">Mekelle</span>
              </h1>
              <p className="text-surface-variant text-lg mb-8 max-w-lg">
                An authoritative digital framework ensuring equitable, transparent, and efficient
                energy resource management for the Tigray regional administration.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/sign-in">
                  <button className="bg-primary-container text-on-primary-container px-8 py-4 font-label-caps text-sm uppercase rounded-none hover:bg-surface-tint hover:text-white transition-all shadow-lg">
                    Official Login
                  </button>
                </Link>
                <button className="bg-transparent border border-white text-white px-8 py-4 font-label-caps text-sm uppercase rounded-none hover:bg-white/10 transition-all">
                  Learn More
                </button>
                <Link
                  href="/forgot-password"
                  className="text-white/70 hover:text-white text-xs font-label-caps uppercase transition-colors"
                >
                  Recover Account
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="glass-card p-sm rounded-none border-l-4 border-primary-container shadow-2xl transform rotate-1">
                <img
                  alt="Energy Dashboard"
                  className="w-full h-auto"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA-FTijoubNE8LHC7EZ6jESpchwVcpk_ZhE_g9rGtQwz0x6lgS70m0wiks28RTZyVPQ7a3otQ-DpEaGAqnzqo5fTm8_eg9QhLObSIB4FwbeqkSDb_ENpdbal-u-i4Pl5wH58HPDxg7cxGeMz6dcyqK2WR8zH8wBruQDcCIYRrMxK1BmPJXszaEQg6zUzinH8RJAetcEH0g5pSQzM4DBLUu2GpJa8lNwVgqmegwyuj4hEmsJ3N80FmteSswNlepkAMBepWVtocOfmQ"
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container via-surface-tint to-primary-container"></div>
        </section>

        <section
          id="impact"
          className="min-h-screen flex items-center py-12 bg-surface-container-lowest relative scroll-mt-20"
        >
          <div className="container mx-auto px-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 border border-outline/10 bg-white shadow-sm flex flex-col items-center text-center group hover:border-primary-container transition-colors">
                <div className="mb-4 text-primary font-display-lg text-4xl">1.2M+</div>
                <div className="font-label-caps text-xs text-outline tracking-widest uppercase mb-2">
                  Liters Distributed
                </div>
                <div className="w-12 h-[2px] bg-primary-container transform group-hover:scale-x-150 transition-transform"></div>
              </div>
              <div className="p-8 border border-outline/10 bg-white shadow-sm flex flex-col items-center text-center group hover:border-primary-container transition-colors">
                <div className="mb-4 text-primary font-display-lg text-4xl">142</div>
                <div className="font-label-caps text-xs text-outline tracking-widest uppercase mb-2">
                  Active Stations
                </div>
                <div className="w-12 h-[2px] bg-primary-container transform group-hover:scale-x-150 transition-transform"></div>
              </div>
              <div className="p-8 border border-outline/10 bg-white shadow-sm flex flex-col items-center text-center group hover:border-primary-container transition-colors">
                <div className="mb-4 text-primary font-display-lg text-4xl">50k+</div>
                <div className="font-label-caps text-xs text-outline tracking-widest uppercase mb-2">
                  Registered Citizens
                </div>
                <div className="w-12 h-[2px] bg-primary-container transform group-hover:scale-x-150 transition-transform"></div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="min-h-screen flex items-center py-12 bg-surface relative overflow-hidden scroll-mt-20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 tilfi-pattern opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="container mx-auto px-lg relative z-10">
            <div className="mb-8 max-w-2xl">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                Strategic Operational Verticals
              </h2>
              <p className="text-on-surface-variant">
                Three integrated pillars designed to streamline regional energy logistics through
                technology.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-outline/10 overflow-hidden group">
                <div className="h-2 bg-primary-container"></div>
                <div className="p-8">
                  <span className="material-symbols-outlined text-4xl text-primary mb-4">
                    account_balance
                  </span>
                  <h3 className="font-title-sm text-title-sm mb-2">Government</h3>
                  <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                    Centralized command and control with real-time data-driven oversight of regional
                    reserves and strategic distribution channels.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-xs font-semibold text-outline">
                      <span className="material-symbols-outlined text-primary text-sm mr-2">
                        check_circle
                      </span>{" "}
                      RESERVE ANALYTICS
                    </li>
                    <li className="flex items-center text-xs font-semibold text-outline">
                      <span className="material-symbols-outlined text-primary text-sm mr-2">
                        check_circle
                      </span>{" "}
                      CRISIS MANAGEMENT
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white border border-outline/10 overflow-hidden group">
                <div className="h-2 bg-secondary"></div>
                <div className="p-8">
                  <span className="material-symbols-outlined text-4xl text-secondary mb-4">
                    local_gas_station
                  </span>
                  <h3 className="font-title-sm text-title-sm mb-2">Fuel Stations</h3>
                  <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                    Optimization of retail logistics through advanced queue management and
                    transparent quota verification systems.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-xs font-semibold text-outline">
                      <span className="material-symbols-outlined text-secondary text-sm mr-2">
                        check_circle
                      </span>{" "}
                      QUEUE OPTIMIZATION
                    </li>
                    <li className="flex items-center text-xs font-semibold text-outline">
                      <span className="material-symbols-outlined text-secondary text-sm mr-2">
                        check_circle
                      </span>{" "}
                      STOCK VERIFICATION
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white border border-outline/10 overflow-hidden group">
                <div className="h-2 bg-tertiary"></div>
                <div className="p-8">
                  <span className="material-symbols-outlined text-4xl text-tertiary mb-4">
                    person_pin_circle
                  </span>
                  <h3 className="font-title-sm text-title-sm mb-2">Citizens</h3>
                  <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                    Empowering the public with live availability mapping and transparent personal
                    quota tracking for essential needs.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-xs font-semibold text-outline">
                      <span className="material-symbols-outlined text-tertiary text-sm mr-2">
                        check_circle
                      </span>{" "}
                      LIVE MAP ACCESS
                    </li>
                    <li className="flex items-center text-xs font-semibold text-outline">
                      <span className="material-symbols-outlined text-tertiary text-sm mr-2">
                        check_circle
                      </span>{" "}
                      SMART QUOTAS
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full py-8 flex items-center justify-center bg-surface-container overflow-hidden">
          <div className="flex items-center gap-4 text-primary-container/40">
            <div className="h-[1px] w-32 bg-current"></div>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              diamond
            </span>
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              diamond
            </span>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              diamond
            </span>
            <div className="h-[1px] w-32 bg-current"></div>
          </div>
        </div>

        <section
          id="authorities"
          className="min-h-screen flex flex-col justify-center py-12 bg-surface-container-low border-y border-outline/5 scroll-mt-20"
        >
          <div className="container mx-auto px-lg">
            <div className="text-center mb-8">
              <p className="font-label-caps text-xs text-outline tracking-[0.2em] uppercase">
                Authorized Governing Bodies
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-neutral-500">gavel</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-600">
                  Regional Bureau of Energy
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-neutral-500">policy</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-600">Transport Authority</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-neutral-500">
                    shield_with_heart
                  </span>
                </div>
                <span className="text-[10px] font-bold text-neutral-600">
                  Regional Security Bureau
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-neutral-500">
                    location_city
                  </span>
                </div>
                <span className="text-[10px] font-bold text-neutral-600">Mekelle City Admin</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
