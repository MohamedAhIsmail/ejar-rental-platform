import React, { useEffect, useState } from 'react';
import ChatSidebar from '../ChatSidebar/ChatSidebar';
import Messages from '../Messages/Messages';
import { useParams } from 'react-router-dom';
import useAuthStore from '../../Store/Auth';
import { jwtDecode } from 'jwt-decode';

export default function ChatPage() {
  const { token } = useAuthStore();
  const userId = jwtDecode(token).id;
  const { chatId } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 993);

  useEffect(() => {
    document.title = 'Your Chats | EJAR';

    const handleResize = () => {
      setIsMobile(window.innerWidth < 993);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container">
      <h2 className="w-100 p-4">Your messages</h2>
      <div className="d-flex flex-row" style={{ height: '80vh' }}>
        {(!isMobile || !chatId) && (
          <ChatSidebar chatId={chatId} token={token} userId={userId} />
        )}
        {chatId ? (
          <Messages chatId={chatId} token={token} userId={userId} />
        ) : (
          <div className="w-75 h-100 me-3 d-none d-lg-flex flex-column">
            <div className="d-flex flex-column" style={{ overflowY: 'scroll' }}>
              <h2 className="text-center">Select a chat to start messaging</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
