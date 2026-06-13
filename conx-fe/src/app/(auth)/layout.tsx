export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center pt-40">
      <div className="w-114.5">{children}</div>
    </main>
  );
}
