import ProtectedRoute from "@/components/ProtectedRoute";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
