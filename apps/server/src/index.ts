import { Data, Message } from './types';
import { TOKENS, groupMessagesByUser } from './utils';

let users: string[] = [];
let messages: Message[] = [];
let messageIdCount = 0;

Bun.serve<Data>({
  port: 4000,
  fetch(req, server) {
    const { searchParams } = new URL(req.url);

    if (server.upgrade(req, { data: { username: searchParams.get('username') } })) return;

    return new Response('Upgrade failed', { status: 500 });
  },
  websocket: {
    publishToSelf: true,
    open: (ws) => {
      users.push(ws.data.username);

      ws.subscribe(TOKENS.chat);

      ws.publish(TOKENS.chat, JSON.stringify({ type: TOKENS.user.set, data: users }));
      ws.publish(TOKENS.chat, JSON.stringify({ type: TOKENS.message.set, data: messages }));
    },
    message: (ws, data) => {
      const message = JSON.parse(Buffer.from(data).toString());

      switch (message.type) {
        case TOKENS.message.add:
          message.id = messageIdCount;
          message.username = ws.data.username;
          message.date = Date.now();

          messages.push(message);
          messageIdCount += 1;

          ws.publish(
            TOKENS.chat,
            JSON.stringify({
              type: TOKENS.message.add,
              data: message
            })
          );
          break;
        case TOKENS.message.reset:
          messages = [];

          ws.publish(
            TOKENS.chat,
            JSON.stringify({
              type: TOKENS.message.set,
              data: messages
            })
          );
          break;
        default:
          break;
      }
    },
    close: (ws) => {
      ws.unsubscribe(TOKENS.chat);

      users = users.filter((user) => user !== ws.data.username);

      ws.publish(TOKENS.chat, JSON.stringify({ type: TOKENS.user.remove, data: ws.data.username }));
    }
  }
});
