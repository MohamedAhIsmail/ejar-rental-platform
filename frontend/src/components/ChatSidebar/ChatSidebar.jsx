import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useChatStore from '../../Store/chatStore';
import { MoonLoader } from 'react-spinners';
import './ChatSidebar.css';

export default function ChatSidebar({ chatId, token, userId }) {
  const { chatLoading, userChats, getUserChats } = useChatStore();

  useEffect(() => {
    getUserChats(token);
  }, [getUserChats, token]);

  if (chatLoading) {
    return (
      <div
        className="h-100"
        style={{
          width: '375px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <MoonLoader color="#b72a67" size={40} />
      </div>
    );
  }

  //  extra check to see if userChats is empty and show a message
  if (userChats.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '1rem',
          color: '#777',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <i
          className="bi bi-messenger"
          style={{ fontSize: '40px', marginBottom: '20px', color: '#b72a67' }}
        ></i>
        <h2>No chats yet</h2>
        <p>Start a conversation to see your messages here.</p>
      </div>
    );
  }
  //  extra check to see if userChats is empty and show a message

  return (
    <div className="h-100 chat-sidebar">
      {userChats.map((chat) => (
        <Link to={`/chat/${chat._id}`} key={chat._id} className="nav-link">
          <div
            className={`d-flex flex-row border-bottom align-items-center m-2 rounded ${
              chat._id === chatId ? 'bg-light' : ''
            }`}
          >
            {chat.members.map(
              (member) =>
                member._id !== userId && (
                  <Fragment key={member._id}>
                    <img
                      className="rounded-circle p-2"
                      src={member.profilePicture}
                      alt="User Picture"
                      width={80}
                      height={80}
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                    <h4 className="mt-2">{member.userName}</h4>
                  </Fragment>
                )
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
