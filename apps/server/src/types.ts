export interface Data {
  username: string;
}

export interface Message {
  id: number;
  date: number;
  username: string;
  data: string;
}

export interface GroupedMessage {
  id: number;
  username: string;
  messages: Message[];
  lastMessageDate: number;
}
