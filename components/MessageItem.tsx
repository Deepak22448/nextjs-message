"use client";
import { db } from "@/firebase";
import { Message } from "@/types/messages.type";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useAuth } from "./providers/AuthProvider";

interface Props {
  messageInfo: Message;
  total: number;
  setIsUnReadRendered: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
}
const MessageItem = ({
  messageInfo: { to, from, message, id, isRead },
  total,
  index,
  setIsUnReadRendered,
}: Props) => {
  const { userMetaData } = useAuth();

  useEffect(() => {
    const updateMessage = async () => {
      if (userMetaData === null || from === userMetaData.uid || isRead) return;

      const selectedFriendUid = userMetaData.uid === from ? to : from;
      const chatId =
        selectedFriendUid > userMetaData.uid
          ? `${selectedFriendUid}${userMetaData.uid}`
          : `${userMetaData.uid}${selectedFriendUid}`;

      const messagesRef = doc(db, `chats/${chatId}/chat/${id}`);
      try {
        await updateDoc(messagesRef, {
          isRead: true,
        });

        if (index === total - 1) setIsUnReadRendered(true);
      } catch (error) {
        throw new Error((error as Error).message);
      }
    };

    updateMessage();
  }, []);

  return (
    <div
      className={`${
        from === userMetaData?.uid ? "self-end" : "self-start"
      } p-3 rounded-lg bg-slate-500 max-w-[75%] text-white relative `}
    >
      {message}
    </div>
  );
};

export default MessageItem;
