import { Message } from "@/types/messages.type";
import React from "react";
import { useAuth } from "./providers/AuthProvider";

const ReadMessagesItem = ({ id, from, message }: Message) => {
  const { userMetaData } = useAuth();

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
};

export default ReadMessagesItem;
