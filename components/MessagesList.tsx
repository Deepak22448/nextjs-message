import { Message } from "@/types/messages.type";
import React, { useState } from "react";
import Loading from "./Loading";
import NewMessages from "./NewMessages";
import ReadMessages from "./ReadMessages";
import UnReadMessages from "./UnReadMessages";

interface Props {
  newMessages: Message[];
  friendUid: string;
  setNewMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const MessagesList = ({ newMessages, friendUid, setNewMessages }: Props) => {
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isUnReadRenderd, setIsUnReadRendered] = useState(false);

  return (
    <div className="middle overflow-scroll px-3 flex flex-col gap-2">
      {isLoadingMessages && <Loading />}
      <ReadMessages
        setIsLoadingMessages={setIsLoadingMessages}
        friendUid={friendUid}
      />
      <UnReadMessages
        friendUid={friendUid}
        setIsUnReadRendered={setIsUnReadRendered}
      />
      <NewMessages
        newMessages={newMessages}
        setNewMessages={setNewMessages}
        friendUid={friendUid}
        isUnReadRenderd={isUnReadRenderd}
      />
    </div>
  );
};

export default MessagesList;
