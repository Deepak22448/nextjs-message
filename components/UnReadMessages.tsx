import React, { useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import NewMessageHR from "./NewMessageHR";
import { Message } from "@/types/messages.type";
import { useAuth } from "./providers/AuthProvider";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";

interface Props {
  friendUid: string;
  setIsUnReadRendered: React.Dispatch<React.SetStateAction<boolean>>;
}
const UnReadMessages = ({ friendUid, setIsUnReadRendered }: Props) => {
  const [unReadMessages, setUnReadMessages] = useState<Message[]>([]);
  const { userMetaData } = useAuth();

  useEffect(() => {
    const fetchUnReadMessages = async () => {
      if (userMetaData === null || friendUid === null) return;
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
        const filteredMessages = messages.filter((message) => {
          return message.from !== userMetaData.uid && message.isRead === false;
        });

        setUnReadMessages(filteredMessages);
        if (filteredMessages.length === 0) setIsUnReadRendered(true);
      } catch (error) {
        throw new Error((error as Error).message);
      }
    };
    fetchUnReadMessages();
  }, [friendUid, userMetaData]);

  return (
    <>
      {unReadMessages.length > 0 && <NewMessageHR />}
      {unReadMessages.map((message, i) => {
        return (
          <MessageItem
            key={message.id}
            messageInfo={message}
            total={unReadMessages.length}
            index={i}
            setIsUnReadRendered={setIsUnReadRendered}
          />
        );
      })}
    </>
  );
};

export default React.memo(UnReadMessages);
