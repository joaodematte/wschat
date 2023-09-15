'use client';

import { ChatContext, Message } from '@/context/ChatContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { RandomAvatar } from 'react-random-avatars';
import { Button } from '../ui/Button';

interface Props {
  handleReset: () => void;
}

export interface GroupedMessage {
  id: number;
  username: string;
  messages: Message[];
  lastMessageDate: number;
}

function groupMessagesByUser(messages: Message[]): GroupedMessage[] {
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
        lastMessageDate: lastMessageDate as number
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
      lastMessageDate: lastMessageDate as number
    });
  }

  return groupedMessages;
}

export default function MessageList({ handleReset }: Props) {
  const { messages } = useContext(ChatContext);

  const groupedMessages = groupMessagesByUser(messages);

  const [isScrollAtBottom, setIsScrollAtBottom] = useState<boolean>(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScrollAtBottom) return;

    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current?.scrollHeight
    });
  }, [messages, isScrollAtBottom]);

  useEffect(() => {
    const handleScroll = () => {
      const div = messagesContainerRef.current;

      if (div) {
        setIsScrollAtBottom(div.scrollTop + div.clientHeight >= div.scrollHeight - 0.5);
      }
    };

    const div = messagesContainerRef.current;

    if (div) {
      div.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div ref={messagesContainerRef} className="custom-scrollbar relative flex flex-1 flex-col gap-4 overflow-y-scroll">
      {/* <Button className="absolute right-0 top-0" variant="outline" size="sm" onClick={() => handleReset()}>
        Reset
      </Button> */}
      {groupedMessages.map((groupedMessage) => {
        const date = new Date(groupedMessage.lastMessageDate);

        return (
          <div key={groupedMessage.username} className="flex gap-2.5">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-500">
              <RandomAvatar name={groupedMessage.username} size={40} square />
            </div>
            <div className="block">
              <div className="flex items-center gap-1 text-sm">
                <p className="font-bold">{groupedMessage.username}</p>{' '}
                <span className="text-[12px] text-zinc-500">
                  {`${date.toLocaleTimeString('pt-BR')} - ${date.toLocaleDateString('pt-BR')}`}
                </span>
              </div>
              {groupedMessage.messages.map((message) => (
                <p key={message.id} className="text-sm">
                  {message.data}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
