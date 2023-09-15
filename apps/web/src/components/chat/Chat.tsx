'use client';

import { Textarea } from '../ui/Textarea';
import UserList from './UserList';
import MessageList from './MessageList';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ChatContext, Message } from '@/context/ChatContext';
import useWebSocket from '@/hooks/useWebSocket';

type Data =
  | {
      type: 'USER_SET';
      data: string[];
    }
  | {
      type: 'USER_REMOVE';
      data: string;
    }
  | {
      type: 'MESSAGE_ADD';
      data: Message;
    }
  | {
      type: 'MESSAGE_SET';
      data: Message[];
    };

export default function Chat() {
  const { username, setUsers, setMessages } = useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data) as Data;

      switch (data.type) {
        case 'USER_SET':
          setUsers(data.data);
          break;
        case 'MESSAGE_SET':
          setMessages(data.data);
          break;
        case 'MESSAGE_ADD':
          setMessages((prev) => [...prev, data.data]);
          break;
        case 'USER_REMOVE':
          setUsers((prev) => prev.filter((user) => user !== data.data));
          break;
        default:
          break;
      }
    },
    [setMessages, setUsers]
  );

  const webSocket = useWebSocket({
    url: `wss://wschat-server.fly.dev/?username=${username}`,
    onMessage,
    connect: !!username
  });

  const handleMessage = useCallback(() => {
    webSocket?.send(JSON.stringify({ type: 'MESSAGE_ADD', data: textareaRef.current?.value, username }));
    if (textareaRef.current) textareaRef.current.value = '';
  }, [username, webSocket]);

  const handleReset = useCallback(() => {
    webSocket?.send(JSON.stringify({ type: 'MESSAGE_RESET' }));
  }, [webSocket]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement !== textareaRef.current) return;

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleMessage();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [handleMessage]);

  return (
    <main className="h-screen w-full bg-zinc-50">
      <div className="flex h-5/6">
        <UserList />
        <div className="flex h-full w-4/5 flex-col gap-4 rounded-r-md border border-border bg-background p-4">
          <MessageList handleReset={handleReset} />
          <Textarea
            ref={textareaRef}
            className="resize-none self-end bg-background"
            rows={4}
            disabled={!username || !webSocket?.OPEN}
          />
        </div>
      </div>
    </main>
  );
}
