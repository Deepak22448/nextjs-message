"use client";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "@/firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAuth } from "@/components/providers/AuthProvider";

import type { SignUpData } from "@/types/signup.types";

const SignUp = () => {
  const DEFAULT_PROFILE_URL =
    "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg";
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    profile: null,
  });
  const [profilePreView, setProfilePreView] =
    useState<string>(DEFAULT_PROFILE_URL);
  const [error, setError] = useState<Error>();
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const router = useRouter();
  const { userMetaData } = useAuth();

  useEffect(() => {
    if (userMetaData !== null) router.push("/");
  }, []);

  const handleFileChage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const value = event.target.files[0];

      setSignUpData((previousData) => ({
        ...previousData,
        profile: value,
      }));
      setProfilePreView(URL.createObjectURL(value));
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignUpData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSignUp = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { email, password } = signUpData;

    setIsCreatingUser(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const profilePictureRef = ref(
        storage,
        `profile_picture/${userCredentials.user.uid}_profile.jpg`
      );

      let profileUrl = "";
      if (signUpData.profile !== null) {
        await uploadBytes(profilePictureRef, signUpData.profile);
        profileUrl = await getDownloadURL(profilePictureRef);
      }

      await setDoc(doc(db, "users", userCredentials.user.uid), {
        userUid: userCredentials.user.uid,
        email,
        firstname: signUpData.firstname,
        lastname: signUpData.lastname,
        createdAt: Timestamp.fromDate(new Date()),
        profilePictureUrl:
          signUpData.profile !== null ? profileUrl : DEFAULT_PROFILE_URL,
      });
      router.push("/");
    } catch (err) {
      setError(err as Error);
      throw new Error("something went wrong while signin");
    } finally {
      setIsCreatingUser(false);
    }
  };

  if (userMetaData === null)
    return (
      <section className="signup-container flex justify-center items-center w-full">
        <form className="flex flex-col gap-4">
          <figure className="relative h-20 w-20 mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profilePreView}
              alt="profile picture"
              className="rounded-[50%] object-cover h-full w-full"
            />
            <input
              type="file"
              className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer"
              onChange={handleFileChage}
            />
          </figure>

          <div className="sm:flex sm:gap-2">
            <div>
              <label htmlFor="firstname" className="font-bold text-slate-600">
                Firstname :
              </label>
              <input
                onChange={handleInputChange}
                value={signUpData.firstname}
                id="firstname"
                type="text"
                name="firstname"
                className="block outline-none rounded px-4 py-2 text-slate-500 accent-pink-400 mb-4 sm:mb-0"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="font-bold text-slate-600">
                Lastname :
              </label>
              <input
                onChange={handleInputChange}
                value={signUpData.lastname}
                id="lastname"
                type="text"
                name="lastname"
                className="block outline-none rounded px-4 py-2 text-slate-500 accent-pink-400"
                autoComplete="off"
              />
            </div>
          </div>

          <label htmlFor="email" className="font-bold text-slate-600">
            Email :
          </label>
          <input
            onChange={handleInputChange}
            value={signUpData.email}
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
            value={signUpData.password}
            id="password"
            type="password"
            name="password"
            className="block outline-none rounded px-4 py-2 text-slate-500"
          />
          {error && <h4 className="font-bold text-red-400">{error.message}</h4>}
          <button
            type="submit"
            disabled={isCreatingUser}
            onClick={handleSignUp}
            className="bg-slate-600 px-5 py-2 self-start rounded text-white mx-auto"
          >
            Signup
          </button>
        </form>
      </section>
    );

  return <Loading />;
};

export default SignUp;
