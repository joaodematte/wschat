'use client';

import dynamic from 'next/dynamic';

interface Props {
  children: React.ReactNode;
}

const DyamicChatContextProvider = dynamic(
  () => import('../context/ChatContext').then((mod) => mod.ChatContextProvider),
  {
    ssr: false
  }
);

export default function ChatContextWrapper({ children }: Props) {
  return <DyamicChatContextProvider>{children}</DyamicChatContextProvider>;
}
