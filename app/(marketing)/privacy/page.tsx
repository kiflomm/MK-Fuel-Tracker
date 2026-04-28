export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 container mx-auto px-lg max-w-4xl">
      <div className="mb-12 border-l-4 border-primary-container pl-6">
        <span className="font-label-caps text-xs text-primary-container uppercase tracking-widest mb-2 block">
          Legal & Compliance
        </span>
        <h1 className="font-display-lg text-4xl text-on-surface mb-4">Privacy Policy</h1>
        <p className="text-on-surface-variant italic">
          Last Updated: April 26, 2024
        </p>
      </div>

      <div className="prose prose-neutral max-w-none space-y-8 text-on-surface-variant font-['Public_Sans']">
        <section>
          <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">info</span>
            1. Overview
          </h2>
          <p>
            The Mekelle Fuel Tracker (the "Platform") is operated by the Regional Energy Oversight
            Bureau. We are committed to protecting the privacy and security of the personal and
            operational data handled by our systems. This policy outlines how we collect, use, and
            safeguard your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">database</span>
            2. Data Collection
          </h2>
          <p>
            We collect data essential for the equitable distribution of fuel resources, including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Citizens:</strong> Identification details, vehicle registration, and quota usage history.</li>
            <li><strong>Stations:</strong> Live inventory levels, transaction logs, and operational status.</li>
            <li><strong>Government Officials:</strong> Administrative logs and oversight activity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">shield</span>
            3. Data Security
          </h2>
          <p>
            All data is stored on secure government servers within the Tigray region. We employ
            military-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">share</span>
            4. Information Sharing
          </h2>
          <p>
            Energy distribution data is shared only between authorized regional bureaus. We do not
            sell or share personal data with third-party commercial entities.
          </p>
        </section>

        <section className="bg-surface-container p-6 border border-outline/10 rounded-sm">
          <h2 className="text-lg font-bold text-on-surface mb-2">Questions?</h2>
          <p className="text-sm">
            For privacy-related inquiries, please contact the Data Protection Officer at
            <a href="mailto:privacy@mekelle-energy.gov.et" className="text-primary-container ml-1 underline">
              privacy@mekelle-energy.gov.et
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
