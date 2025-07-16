import React from 'react';
import './StartRenting.css';
import useAuthStore from '../../Store/Auth';
import { Link } from 'react-router-dom';

function StartRenting() {
  const { token } = useAuthStore();

  return (
    <div className="start mt-5 d-flex justify-content-between mb-5 flex-wrap gap-4">
      <div className="text">
        <h2 className="rent-head">Turn Your Unused Items Into Earnings!</h2>
        <p className="rent-p mt-4 fs-5">
          Why let your items sit unused when you can make money renting them
          out?{' '}
        </p>
        <p className="fs-4 mb-0">Join Ejar today and start earning!</p>
      </div>

      <div className="bt d-flex">
        {token ? (
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#productModal"
            className="rent-btn mt-auto"
          >
            Start Renting Out
          </button>
        ) : (
          <Link className="mt-auto" to="/register">
            <button type="button" className="rent-btn">
              Join Us Now
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartRenting;
