"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import { useAuth } from "./providers/AuthProvider";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { userMetaData } = useAuth();
  useEffect(() => {
    if (userMetaData === null) router.push("/signin");
  }, [userMetaData, router]);

  if (userMetaData !== null) return <div>{children}</div>;
  return <Loading />;
};

export default ProtectedRoute;
