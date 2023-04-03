import { db } from "@/firebase";
import { Friend } from "@/types/friend.types";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import React, { MouseEvent, useEffect, useState } from "react";
import { useAuth } from "./providers/AuthProvider";

interface Props {
  friend: Friend;
}

const FriendItem = ({ friend }: Props) => {
  const { profilePictureUrl, firstname, lastname } = friend;
  const [unReadMessagesCount, setUnReadMessagesCount] = useState(0);
  const { userMetaData } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUnReadMessages = async () => {
      if (userMetaData === null || friend === null) return;
      const chatId =
        friend.userUid > userMetaData.uid
          ? `${friend.userUid}${userMetaData.uid}`
          : `${userMetaData.uid}${friend.userUid}`;

      try {
        const coll = collection(db, "chats", chatId, "chat");
        const query_ = query(
          coll,
          where("from", "!=", userMetaData.uid),
          where("isRead", "==", false)
        );
        const snapshot = await getCountFromServer(query_);
        setUnReadMessagesCount(snapshot.data().count);
      } catch (error) {
        throw new Error((error as Error).message);
      }
    };
    fetchUnReadMessages();
  }, [friend, userMetaData]);

  const handleClick = (_event: MouseEvent<HTMLDivElement>) => {
    if (pathname?.split("/").length === 3) {
      router.back();
    }
    setUnReadMessagesCount(0);
  };
  return (
    <div
      className={`flex gap-2 items-center border-b border-gray-500 p-2  w-full relative ${
        pathname?.split("/")[2] === friend.userUid
          ? "bg-slate-500 text-white cursor-default"
          : "cursor-pointer hover:bg-gray-400"
      }`}
      onClick={handleClick}
    >
      <figure className="self-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profilePictureUrl}
          alt="profilePicture"
          className="w-12 h-12 object-cover rounded-[50%] self-start"
        />
      </figure>

      <h3 className="inline-block text-ellipsis w-52  overflow-hidden whitespace-nowrap">{`${firstname} ${lastname}`}</h3>
      {unReadMessagesCount > 0 && (
        <span className="absolute flex bg-slate-500  rounded-[50%] right-3 bottom-2 text-sm p-2 w-5 h-5 items-center justify-center text-white">
          {unReadMessagesCount}
        </span>
      )}
    </div>
  );
};

export default FriendItem;
