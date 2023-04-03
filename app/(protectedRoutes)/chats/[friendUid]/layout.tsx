export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`sm:w-1/2 md:w-3/5 lg:1/4  relative bg-slate-300 rounded chat-form-container`}
    >
      {children}
    </div>
  );
}
