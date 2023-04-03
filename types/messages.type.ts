import { Timestamp } from "firebase/firestore";

export interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
  time: number;
  isRead: boolean;
}
