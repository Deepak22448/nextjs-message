"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";
import FriendItem from "./FriendItem";
import { Friend } from "@/types/friend.types";
import Link from "next/link";
import Loading from "./Loading";
import { usePathname } from "next/navigation";

const FriendsList = () => {
  const pathname = usePathname();
  const { userMetaData } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isFetchingFriends, setIsFetchingFriends] = useState(true);
  const [isFriendSelected, setIsFriendSelected] = useState(false);

  useEffect(() => {
    if (pathname?.split("/").length === 3) {
      setIsFriendSelected(true);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (userMetaData === null) return;
      const usersRef = collection(db, "users");
      const getFriendsQuery = query(
        usersRef,
        where("userUid", "!=", userMetaData.uid)
      );
      try {
        const querySnapshot = await getDocs(getFriendsQuery);
        const temp: Friend[] = [];
        querySnapshot.forEach((doc) => {
          temp.push(doc.data() as Friend);
        });

        setFriends(temp);
      } catch (error) {
        throw new Error((error as Error).message);
      } finally {
        setIsFetchingFriends(false);
      }
    };

    fetchFriends();
  }, [userMetaData]);

  return (
    <div
      className={`friends-list md:w-2/5 last:1/4 sm:w-1/2 sm:block overflow-scroll  self-start bg-slate-300  rounded-lg relative ${
        isFriendSelected ? "hidden" : "block"
      }`}
    >
      {isFetchingFriends && <Loading />}
      {friends.map((friend) => (
        <Link key={friend.userUid} href={`/chats/${friend.userUid}`}>
          <FriendItem key={friend.userUid} friend={friend} />
        </Link>
      ))}
    </div>
  );
};

export default FriendsList;
