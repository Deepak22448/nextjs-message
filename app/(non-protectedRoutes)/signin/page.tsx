"use client";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAuth } from "@/components/providers/AuthProvider";
import { SigninData } from "@/types/signin.types";

const SigIn = () => {
  const [signInData, setSignInData] = useState<SigninData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<Error>();
  const [isRequestingSignIn, setIsRequestingSignIn] = useState(false);
  const router = useRouter();

  const { userMetaData, isLoading } = useAuth();

  useEffect(() => {
    if (userMetaData !== null) router.push("/");
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignInData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSignIn = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { email, password } = signInData;
    setIsRequestingSignIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      setError(err as Error);
      throw new Error("something went wrong while signin");
    } finally {
      setIsRequestingSignIn(false);
    }
  };

  if (userMetaData !== null || isLoading) return <Loading />;
  return (
    <section className="signin-container flex justify-center items-center w-full">
      <form className="flex flex-col gap-4">
        <label htmlFor="email" className="font-bold text-slate-600">
          Email :
        </label>
        <input
          onChange={handleInputChange}
          value={signInData.email}
          id="email"
          type="text"
          name="email"
          className="block outline-none rounded px-4 py-2 text-slate-500 accent-pink-400"
          autoComplete="off"
        />
        <label htmlFor="password" className="font-bold text-slate-600">
          Password :
        </label>
        <input
          onChange={handleInputChange}
          value={signInData.password}
          id="password"
          type="password"
          name="password"
          className="block outline-none rounded px-4 py-2 text-slate-500"
        />
        {error && <h4 className="font-bold text-red-400">{error.message}</h4>}
        <button
          type="submit"
          onClick={handleSignIn}
          disabled={isRequestingSignIn}
          className="bg-slate-600 px-5 py-2 self-start rounded text-white mx-auto"
        >
          SignIn
        </button>
      </form>
    </section>
  );
};

export default SigIn;
