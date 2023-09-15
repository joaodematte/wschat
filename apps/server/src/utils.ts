import { GroupedMessage, Message } from "./types";

export const TOKENS = {
  chat: "CHAT",
  user: {
    set: "USER_SET",
    remove: "USER_REMOVE",
  },
  message: {
    add: "MESSAGE_ADD",
    set: "MESSAGE_SET",
    reset: "MESSAGE_RESET",
  },
};

export function groupMessagesByUser(messages: Message[]): GroupedMessage[] {
  const groupedMessages: GroupedMessage[] = [];
  let currentId = 1;
  let currentUser: string | null = null;
  let currentMessages: Message[] = [];
  let lastMessageDate: number | null = null;

  for (const message of messages) {
    if (currentUser === null || message.username === currentUser) {
      currentMessages.push(message);
      currentUser = message.username;
      lastMessageDate = message.date;
    } else {
      groupedMessages.push({
        id: currentId,
        username: currentUser,
        messages: currentMessages,
        lastMessageDate: lastMessageDate as number,
      });
      lastMessageDate = message.date;
      currentMessages = [message];
      currentUser = message.username;
      currentId++;
    }
  }

  if (currentMessages.length > 0) {
    groupedMessages.push({
      id: currentId,
      username: currentUser as string,
      messages: currentMessages,
      lastMessageDate: lastMessageDate as number,
    });
  }

  return groupedMessages;
}
