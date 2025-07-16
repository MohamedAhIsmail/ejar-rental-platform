import React from 'react';
import ProfileDetails from '../ProfileDetails/ProfileDetails';
import Listings from '../Listings/Listings';
import EditProdileModal from '../EditProdileModal/EditProdileModal';
import { useParams } from 'react-router-dom';
import useAuthStore from '../../Store/Auth';
import useProfileStore from '../../Store/profile';
import { useEffect } from 'react';
import { MoonLoader } from 'react-spinners';
import { jwtDecode } from 'jwt-decode';

export default function ProfilePage() {
  const { id: userId } = useParams();
  const { token } = useAuthStore();
  const { id: loggedInUserId } = jwtDecode(token);
  const { profile, loading, errorStatus, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (profile && profile._id !== loggedInUserId) {
      document.title = `${profile.userName} | EJAR`;
    } else if (profile) {
      document.title = 'Your Profile | EJAR';
    }
  }, [profile, loggedInUserId]);

  useEffect(() => {
    fetchProfile(userId, token);
  }, [userId, fetchProfile, token]);

  if (loading)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '70vh' }}
      >
        <MoonLoader color="#b72a67" size={80} />
        <p className="mt-3 text-muted fs-5">
          Loading user profile, please wait...
        </p>
      </div>
    );

  if (errorStatus === 'Network Error')
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '70vh', color: '#777' }}
      >
        <i
          className="bi bi-exclamation-triangle-fill"
          style={{ fontSize: '60px', color: '#b72a67', marginBottom: '20px' }}
        ></i>
        <h2 className="mt-3">Oops! Something went wrong</h2>
        <p>Sorry, check your internet connection or try again later.</p>
      </div>
    );
  if (errorStatus === 500)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '70vh', color: '#777' }}
      >
        <i
          className="bi bi-person-x"
          style={{ fontSize: '60px', color: '#b72a67', marginBottom: '20px' }}
        ></i>
        <h2 className="mt-3">Invalid User ID</h2>
        <p>Sorry, we couldn't find the user you were looking for.</p>
        <p>Please enter a valid ID.</p>
      </div>
    );

  if (errorStatus === 404)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '70vh', color: '#777' }}
      >
        <i
          className="bi bi-person-x"
          style={{ fontSize: '60px', color: '#b72a67', marginBottom: '20px' }}
        ></i>
        <h2 className="mt-3">User Not Found</h2>
        <p>Sorry, we couldn't find the user you were looking for.</p>
        <p>Please check the URL.</p>
      </div>
    );

  if (profile)
    return (
      <>
        <ProfileDetails profile={profile} token={token} />
        <Listings />
        <EditProdileModal profile={profile} />
      </>
    );
}
