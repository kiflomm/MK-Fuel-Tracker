"use client";

export default function SupportPage() {
  return (
    <div className="pt-32 pb-20 container mx-auto px-lg">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <div className="mb-10 border-l-4 border-tertiary pl-6">
            <span className="font-label-caps text-xs text-tertiary uppercase tracking-widest mb-2 block">
              Direct Contact
            </span>
            <h1 className="font-display-lg text-4xl text-on-surface mb-4">Help & Support</h1>
            <p className="text-on-surface-variant">
              The Regional Bureau of Energy is here to assist citizens and station operators.
              Please use the form or the official contact details below.
            </p>
          </div>

          <div className="space-y-8 font-['Public_Sans']">
            <div className="flex gap-4 p-4 border border-outline/10 bg-white shadow-sm">
              <span className="material-symbols-outlined text-tertiary text-2xl">location_on</span>
              <div>
                <h3 className="font-bold text-sm mb-1 uppercase tracking-wider">Mekelle HQ</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Regional Bureau of Energy & Transport<br />
                  Main Building, Zone 1, Mekelle, Tigray
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 border border-outline/10 bg-white shadow-sm">
              <span className="material-symbols-outlined text-tertiary text-2xl">call</span>
              <div>
                <h3 className="font-bold text-sm mb-1 uppercase tracking-wider">Official Hotline</h3>
                <p className="text-sm text-on-surface-variant">
                  +251 34 440 XXXX (Citizen Support)<br />
                  +251 34 440 XXXX (Station Logistics)
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 border border-outline/10 bg-white shadow-sm">
              <span className="material-symbols-outlined text-tertiary text-2xl">mail</span>
              <div>
                <h3 className="font-bold text-sm mb-1 uppercase tracking-wider">Email Support</h3>
                <p className="text-sm text-on-surface-variant">
                  support@mekelle-energy.gov.et<br />
                  info.energy@tigray.gov.et
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 border border-outline/10 shadow-lg relative overflow-hidden text-neutral-900">
          <div className="absolute top-0 right-0 w-32 h-32 tilfi-pattern opacity-5 -mr-16 -mt-16 rounded-full"></div>
          <h2 className="font-title-sm text-xl mb-6 text-neutral-900">Submit Inquiry</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-neutral-50 border border-outline/20 focus:border-tertiary outline-none transition-colors text-sm text-neutral-900"
                  placeholder="Hagos Gebru"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Subject</label>
                <select className="w-full p-3 bg-neutral-50 border border-outline/20 focus:border-tertiary outline-none transition-colors text-sm text-neutral-900">
                  <option className="text-neutral-900">Quota Issue</option>
                  <option className="text-neutral-900">Station Problem</option>
                  <option className="text-neutral-900">Citizen Registration</option>
                  <option className="text-neutral-900">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
              <input 
                type="email" 
                className="w-full p-3 bg-neutral-50 border border-outline/20 focus:border-tertiary outline-none transition-colors text-sm text-neutral-900"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Message</label>
              <textarea 
                rows={4}
                className="w-full p-3 bg-neutral-50 border border-outline/20 focus:border-tertiary outline-none transition-colors text-sm text-neutral-900"
                placeholder="How can we assist you today?"
              />
            </div>

            <button className="w-full py-4 bg-tertiary text-white font-label-caps text-sm uppercase tracking-[0.2em] hover:bg-neutral-900 transition-all active:scale-[0.98]">
              Send Official Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
