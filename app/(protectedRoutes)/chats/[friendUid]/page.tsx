"use client";

import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import MessagesList from "@/components/MessagesList";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/firebase";
import { Friend } from "@/types/friend.types";
import { Message } from "@/types/messages.type";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

interface Props {
  params: { friendUid: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const Chat = ({ params: { friendUid } }: Props) => {
  const { userMetaData } = useAuth();
  const [messagesInput, setMessagesInput] = useState("");
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const [friendData, setFriendData] = useState<Friend | null>(null);
  const [isFetchingFriendData, setIsFetchingFriendData] = useState(true);
  const router = useRouter();

  console.log(newMessages);
  useEffect(() => {
    const fetchFriendData = async () => {
      if (userMetaData === null) return;
      const docRef = doc(db, "users", friendUid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFriendData({
            ...(docSnap.data() as Friend),
          });
        } else {
          setFriendData(null);
        }
      } catch (error) {
        throw new Error((error as Error).message);
      } finally {
        setIsFetchingFriendData(false);
      }
    };

    fetchFriendData();
  }, [userMetaData, friendUid]);

  if (
    (isFetchingFriendData === false && friendData === null) ||
    friendUid === userMetaData?.uid
  )
    return notFound();

  if (isFetchingFriendData) return <Loading />;

  const handleSubmit = async (
    event: MouseEvent<HTMLButtonElement> | FormEvent
  ) => {
    event.preventDefault();
    if (friendData === null || userMetaData === null || messagesInput === "")
      return;

    const combinedId =
      friendData.userUid > userMetaData.uid
        ? `${friendData.userUid}${userMetaData.uid}`
        : `${userMetaData.uid}${friendData.userUid}`;

    try {
      const newMessage = {
        from: userMetaData.uid,
        to: friendData.userUid,
        message: messagesInput,
        time: Date.now(),
        isRead: false,
      };
      const newDocRef = await addDoc(
        collection(db, `chats/${combinedId}/chat`),
        newMessage
      );
      setNewMessages((prevMessages) => [
        ...prevMessages,
        { ...newMessage, id: newDocRef.id },
      ]);

      setMessagesInput("");
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessagesInput(event.target.value);
  };
  const handleMobileBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push("/chats");
  };

  return (
    <form className="message-form sm:flex flex-col" onSubmit={handleSubmit}>
      <div className="top h-16 flex gap-x-2 items-center  bg-slate-300 px-3 rounded-sm  border-b-2 border-slate-400  justify-between">
        <figure className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={friendData?.profilePictureUrl}
            alt="profile"
            className="w-10 h-10 rounded-[50%] object-cover "
          />
          <figcaption>{`${friendData?.firstname} ${friendData?.lastname}`}</figcaption>
        </figure>

        <button
          className="px-3 py-1 bg-slate-400 text-white rounded sm:hidden"
          type="button"
          onClick={handleMobileBack}
        >
          back
        </button>
      </div>

      <MessagesList
        newMessages={newMessages}
        friendUid={friendUid}
        setNewMessages={setNewMessages}
      />

      <div className="bottom h-14 flex gap-x-2 p-2">
        <input
          type="text"
          placeholder="Message..."
          className="grow px-3 rounded outline-none"
          value={messagesInput}
          onChange={handleInputChange}
        />
        {messagesInput && (
          <button
            onClick={handleSubmit}
            type="submit"
            className="px-3 py-1 bg-slate-500 rounded text-white"
          >
            Send
          </button>
        )}
      </div>
    </form>
  );
};

export default Chat;
