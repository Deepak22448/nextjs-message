import AuthProvider from "./AuthProvider";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default RootProvider;
