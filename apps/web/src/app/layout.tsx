import ChatContextWrapper from '@/components/ChatContextWrapper';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WebSocket chat app with Bun',
  description: 'WebSocket chat app with Bun'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChatContextWrapper>{children}</ChatContextWrapper>
      </body>
    </html>
  );
}
