export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center py-12 bg-background-landing relative overflow-hidden font-['Public_Sans']">
      <div className="absolute inset-0 tilfi-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-container/5 rounded-full -ml-48 -mt-48 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -mr-48 -mb-48 blur-3xl pointer-events-none"></div>
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </main>
  );
}
