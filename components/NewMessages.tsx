import { db } from "@/firebase";
import { Message } from "@/types/messages.type";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { useAuth } from "./providers/AuthProvider";

import MessageItem from "./MessageItem";

interface Props {
  setNewMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  newMessages: Message[];
  friendUid: string;
  isUnReadRenderd: boolean;
}
const NewMessages = ({
  newMessages,
  friendUid,
  setNewMessages,
  isUnReadRenderd,
}: Props) => {
  const msgRef = useRef<HTMLDivElement | null>(null);
  const { userMetaData } = useAuth();

  useEffect(() => {
    if (userMetaData != null && friendUid != null && isUnReadRenderd != false) {
      const chatId =
        friendUid > userMetaData.uid
          ? `${friendUid}${userMetaData.uid}`
          : `${userMetaData.uid}${friendUid}`;
      const q = query(
        collection(db, `chats/${chatId}/chat`),
        orderBy("time", "asc"),
        where("from", "==", friendUid),
        where("isRead", "==", false),
        limit(1)
      );

      onSnapshot(q, (querySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id } as Message);
        });
        console.log(messages);

        setNewMessages((prevMessages) => [...prevMessages, ...messages]);
      });
    }
  }, [isUnReadRenderd, friendUid, userMetaData]);

  useEffect(() => {
    msgRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  }, [newMessages]);

  return (
    <>
      {newMessages.map(({ from, message, id, isRead, to }) => {
        const updateMessage = async () => {
          if (
            userMetaData === null ||
            from === userMetaData.uid ||
            isRead ||
            !id
          )
            return;

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
          } catch (error) {
            throw new Error((error as Error).message);
          }
        };

        updateMessage();
        return (
          <div
            key={id}
            className={`${
              from === userMetaData?.uid ? "self-end" : "self-start"
            } p-3 rounded-lg bg-slate-500 max-w-[75%] text-white relative `}
          >
            {message}
          </div>
        );
      })}
      {newMessages.length > 0 && <div ref={msgRef} />}
    </>
  );
};

export default React.memo(NewMessages);
