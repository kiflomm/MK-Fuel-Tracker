export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 container mx-auto px-lg max-w-4xl">
      <div className="mb-12 border-l-4 border-secondary pl-6">
        <span className="font-label-caps text-xs text-secondary uppercase tracking-widest mb-2 block">
          Governance & Standards
        </span>
        <h1 className="font-display-lg text-4xl text-on-surface mb-4">Terms of Service</h1>
        <p className="text-on-surface-variant italic">
          Effective Date: April 26, 2024
        </p>
      </div>

      <div className="prose prose-neutral max-w-none space-y-8 text-on-surface-variant font-['Public_Sans']">
        <section>
          <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">gavel</span>
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing the Mekelle Fuel Tracker, you agree to comply with all regional energy
            regulations and the terms outlined herein. These terms govern the use of fuel quotas,
            station management, and official oversight tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">verified_user</span>
            2. User Responsibility
          </h2>
          <p>
            Users are responsible for the accuracy of information provided during registration.
            Misuse of fuel quotas or fraudulent reporting is subject to regional legal penalties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">monitor_heart</span>
            3. System Availability
          </h2>
          <p>
            While we strive for 99.9% uptime, the Regional Bureau of Energy reserves the right to
            perform maintenance or restrict access during regional energy emergencies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">copyright</span>
            4. Intellectual Property
          </h2>
          <p>
            The software, data visualizations, and "Tilfi" design patterns used on this platform are
            property of the Mekelle City Administration and protected by regional laws.
          </p>
        </section>

        <section className="bg-surface-container p-6 border border-outline/10 rounded-sm">
          <h2 className="text-lg font-bold text-on-surface mb-2">Regulatory Compliance</h2>
          <p className="text-sm">
            This platform operates under the Energy Distribution Act of 2024 (Regional Decree No. 12).
          </p>
        </section>
      </div>
    </div>
  );
}
