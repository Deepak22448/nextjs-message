import { db } from "@/firebase";
import { Message } from "@/types/messages.type";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./providers/AuthProvider";
import ReadMessagesItem from "./ReadMessagesItem";

interface Props {
  setIsLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
  friendUid: string;
}
const ReadMessages = ({ setIsLoadingMessages, friendUid }: Props) => {
  const [readMessages, setReadMessages] = useState<Message[]>([]);
  const msgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    msgRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  }, [readMessages]);

  const { userMetaData } = useAuth();

  useEffect(() => {
    const fetchReadMesages = async () => {
      if (userMetaData === null || friendUid === "") return;
      const chatId =
        friendUid > userMetaData.uid
          ? `${friendUid}${userMetaData.uid}`
          : `${userMetaData.uid}${friendUid}`;
      const messagesRef = collection(db, `chats/${chatId}/chat`);
      const sortMessagesByTimeQuery = query(
        messagesRef,
        orderBy("time", "asc")
      );
      try {
        const querySnapshot = await getDocs(sortMessagesByTimeQuery);
        const messages: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = {
            ...doc.data(),
            id: doc.id,
          };
          messages.push(data as Message);
        });
        setReadMessages(messages);
        const filteredMessages = messages.filter((message) => {
          return message.from === userMetaData.uid || message.isRead;
        });
        setReadMessages(filteredMessages);
      } catch (error) {
        throw new Error((error as Error).message);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchReadMesages();
  }, [userMetaData, friendUid]);

  return (
    <>
      {readMessages.map((message) => (
        <ReadMessagesItem {...message} key={message.id} />
      ))}
      {readMessages.length > 0 && <div ref={msgRef}></div>}
    </>
  );
};

export default React.memo(ReadMessages);
