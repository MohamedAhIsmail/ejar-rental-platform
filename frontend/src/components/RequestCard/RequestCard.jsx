import React from 'react';
import useProcessStore from '../../Store/process';
import { useProductStore } from '../../Store/Deatils';

export default function RequestCard({ process, token }) {
  const { acceptProcess, declineProcess, getProcesses } = useProcessStore();
  const { updateProduct } = useProductStore();

  const handleAccept = async () => {
    await acceptProcess(process._id, token);
    await getProcesses(token);
    await updateProduct({
      _id: process.productId._id,
      status: 'rented',
      confirmed: true,
    });

    //toster
  };

  const handleDecline = async () => {
    await declineProcess(process._id, token);
    await getProcesses(token);
  };

  if (!process) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="card" style={{ width: '18rem' }}>
        <div className="square-image">
          <img
            src={process?.productId?.images?.[0]}
            className="card-img-top"
            alt="..."
          />
        </div>
        <div className="card-body">
          <h5 className="card-title">{process?.productId?.name}</h5>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Renter: {process?.renterId?.userName}
          </li>
          <li className="list-group-item">
            From {new Date(process?.startDate).toLocaleDateString()} To{' '}
            {new Date(process?.endDate).toLocaleDateString()}
          </li>
          <li className="list-group-item">
            Duration:{' '}
            {Math.ceil(
              (new Date(process?.endDate) - new Date(process?.startDate)) /
                (1000 * 60 * 60 * 24)
            )}{' '}
            days
          </li>
          <li className="list-group-item">
            Total Price: {process?.price} EGP
            <div>- 20 EGP delivery fees</div>
          </li>
        </ul>
        <div className="card-body d-flex justify-content-end gap-2">
          <button className="btn btn-danger" onClick={handleDecline}>
            Decline
          </button>
          <button className="btn btn-secondary" onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
