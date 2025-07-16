import axios from 'axios';
import React, { useState } from 'react';
import useAuthStore from '../../Store/Auth';
import { toast } from 'react-toastify';

export default function ReviewModl({ selected }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuthStore();

  console.log(selected);

  const productId = selected?.selectedProcess?.productId?._id;
  console.log(productId);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const res = await axios.post(
        'http://localhost:3000/api/review',
        {
          rating,
          comment,
          prodid: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Close the modal using DOM manipulation
      const modalElement = document.getElementById('rentModal');
      if (modalElement) {
        // Remove modal-specific classes and styles
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';

        // Remove the backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.parentNode.removeChild(backdrop);
        }

        setMessage(' Your review was submitted!');

        console.log(message);
        setError('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching reviews');
      setError(err.response?.data?.message || 'Something went wrong ');
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="rentModal"
        tabIndex={-1}
        aria-labelledby="rentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="rentModalLabel">
                Give an honest review
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="startDate" className="form-label">
                    your Rating (1 to 5)
                  </label>
                  <br />
                  <input
                    type="number"
                    min={1}
                    max={5}
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label">
                    your comment
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-control w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Write your review here..."
                    required
                  ></textarea>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
