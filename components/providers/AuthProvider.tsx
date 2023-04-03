"use client";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

interface Props {
  userMetaData: {
    uid: string;
  } | null;
  isLoading: boolean;
}
const AUTH_CONTEXT = createContext<Props>({} as Props);

export const useAuth = () => {
  return useContext(AUTH_CONTEXT);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userMetaData, setUserMetaData] = useState<{ uid: string } | null>(
    () => {
      if (localStorage.getItem("userMetaData")) {
        return JSON.parse(localStorage.getItem("userMetaData")!);
      } else {
        return null;
      }
    }
  );

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (userData) => {
      if (userData) {
        setUserMetaData({
          uid: userData.uid,
        });
        localStorage.setItem(
          "userMetaData",
          JSON.stringify({
            uid: userData.uid,
          })
        );
      } else {
        setUserMetaData(null);
        localStorage.removeItem("userMetaData");
      }
      setIsLoading(false);
    });
    return () => {
      unSub();
    };
  }, []);

  return (
    <AUTH_CONTEXT.Provider
      value={{
        userMetaData,
        isLoading,
      }}
    >
      {children}
    </AUTH_CONTEXT.Provider>
  );
};

export default AuthProvider;
