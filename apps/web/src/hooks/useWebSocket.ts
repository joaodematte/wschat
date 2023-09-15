import { ChatContext } from '@/context/ChatContext';
import { useContext, useEffect, useState } from 'react';

interface UseWebSocketProps {
  url: string;
  onMessage: (event: MessageEvent) => any;
  connect: boolean;
}

export default function useWebSocket({ url, onMessage, connect }: UseWebSocketProps) {
  const [webSocket, setWebSocket] = useState<WebSocket>();

  useEffect(() => {
    if (!connect) return;

    const ws = new WebSocket(url);
    setWebSocket(ws);

    ws.addEventListener('message', onMessage);

    return () => {
      ws.removeEventListener('message', onMessage);
      ws.close();
    };
  }, [onMessage, url, connect]);

  return webSocket;
}
