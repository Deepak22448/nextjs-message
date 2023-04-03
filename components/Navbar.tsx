import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import React from "react";
import { useAuth } from "./providers/AuthProvider";

const Navbar = () => {
  const { userMetaData } = useAuth();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  return (
    <header className="py-1 border-b-2 border-slate-400 w-full h-12 flex items-center">
      <nav className="flex justify-between container mx-auto items-center">
        <h1 className="font-bold text-xl sm:text-3xl cursor-pointer">VChat</h1>

        <ul className="flex gap-5 ">
          <li className="cursor-pointer hover:text-slate-400">
            <Link href="/chats">Chats</Link>
          </li>
          {userMetaData ? (
            <li
              className="cursor-pointer hover:text-slate-400"
              onClick={handleLogOut}
            >
              Logout
            </li>
          ) : (
            <>
              <li className="cursor-pointer hover:text-slate-400">
                <Link href="/signup">Signup</Link>
              </li>
              <li className="cursor-pointer hover:text-slate-400">
                <Link href="/signin">Signin</Link>
              </li>
            </>
          )}
          <li className="cursor-pointer hover:text-slate-400">
            <Link href="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
