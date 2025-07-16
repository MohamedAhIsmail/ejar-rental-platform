import React from 'react';
import './ProfileDetails.css';
import useProfileStore from '../../Store/profile';
import useChatStore from '../../Store/chatStore';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { useParams } from 'react-router-dom';

const ProfileDetails = ({ profile, token }) => {
  const { isEditable } = useProfileStore();
  const { createChat } = useChatStore();
  const navigate = useNavigate();
  const { id } = useParams(); // id comes from the URL /profile/:id

  const chatWithUser = async () => {
    console.log(token);
    const chat = await createChat(profile._id, token);
    console.log(chat);
    if (chat && chat._id) {
      navigate(`/chat/${chat._id}`);
    } else {
      console.error('Failed to create chat or chat ID is missing');
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
        <div className="d-flex flex-column flex-lg-row align-items-center flex-wrap">
          <div className="ms-3 me-lg-4" style={{ width: '150px' }}>
            <ProfilePicture userId={id} />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center align-items-lg-start mb-4 mb-lg-0">
            <h2 className="fw-bold">{profile.userName}</h2>
            {isEditable(token) ? <h5>{profile.email}</h5> : ''}
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center">
          {isEditable(token) ? (
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#profileModal"
              className="btn btn-primary btn-blue rounded-1 fw-bold py-2 px-4"
            >
              <i className="fa-solid fa-user-pen"></i> Edit
            </button>
          ) : (
            <button
              className="btn btn-primary btn-blue rounded-1 fw-bold py-2 px-4"
              onClick={chatWithUser}
            >
              <i className="fa-solid fa-comment"></i> Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
