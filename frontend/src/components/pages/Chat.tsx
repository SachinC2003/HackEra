import React, { useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../Providers/UserProvider';

const ChatComponent: React.FC = () => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const { boardId } = useParams<{ boardId: string }>();
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('UserProvider error');
  }

  const { user } = context;

  useEffect(() => {
    const initChat = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Initialize chat
        const initResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/initialize`, {
          boardId 
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setChannelId(initResponse.data.channelId);

        // Get chat token
        const tokenResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userToken = tokenResponse.data.token;

        // Sanitize user ID
        const sanitizedUserId = user.email.replace(/\./g, '_').replace(/@/g, '_'); // Ensure this matches backend sanitization

        const chatClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
        
        await chatClient.connectUser(
          {
            id: sanitizedUserId, // Using sanitized user Id
          },
          userToken
        );

        setClient(chatClient);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [boardId]);

  if (!client || !channelId) return <div>Loading...</div>;

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={client.channel('messaging', channelId)}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default ChatComponent;
