import { createContext, useMemo, useState } from 'react';
import { generateUsername as generateUsernameUnique } from 'unique-username-generator';

export interface Message {
  id: number;
  date: number;
  username: string;
  data: string;
}

export interface User {
  username: string;
  avatar: string;
  description: string;
}

export interface ChatContextProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  users: string[];
  setUsers: React.Dispatch<React.SetStateAction<string[]>>;
  username: string;
}

export interface ChatContextProviderProps {
  children: React.ReactNode;
}

export const ChatContext = createContext<ChatContextProps>({} as ChatContextProps);

export function ChatContextProvider({ children }: ChatContextProviderProps) {
  const generateUsername = () => {
    const storedUsername = localStorage.getItem('chat-username');

    if (storedUsername) {
      return storedUsername;
    } else {
      const generatedUsername = generateUsernameUnique();

      localStorage.setItem('chat-username', generatedUsername);
      return generatedUsername;
    }
  };

  const [username, _] = useState<string>(generateUsername() as string);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  const memoizedValues = useMemo(
    () => ({
      messages,
      setMessages,
      users,
      setUsers,
      username
    }),
    [messages, users, username]
  );

  return <ChatContext.Provider value={memoizedValues}>{children}</ChatContext.Provider>;
}
