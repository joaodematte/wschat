'use client';

import { ChatContext } from '@/context/ChatContext';
import { useContext } from 'react';
import { RandomAvatar } from 'react-random-avatars';

export default function UserList() {
  const { users } = useContext(ChatContext);

  return (
    <div className="h-full w-1/5 shrink-0 rounded-l-md border border-border bg-zinc-100 p-4">
      <h1 className="text-lg font-bold">Users</h1>
      <div className="mt-4 flex flex-col gap-4">
        {users.map((user) => (
          <div key={user} className="flex gap-2.5">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-500">
              <RandomAvatar name={user} size={40} square />
            </div>
            <div className="block">
              <div className="flex items-center gap-1 text-sm">
                <p className="font-bold">{user}</p>{' '}
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
