import React, { useEffect, useState } from 'react';
import { db, ID } from '@/utils/appwrite';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/utils/AuthContent';

const AdminReviews = () => {
  const [ics, setIcs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedIcId, setSelectedIcId] = useState('');
  const [reviewtext, setReviewtext] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchIcs = async () => {
      try {
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID
        );
        setIcs(response.documents);
      } catch (error) {
        toast.error(`Error fetching ICs: ${error.message}`);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_REVIEWS_COLLECTION_ID
        );
        setReviews(response.documents);
      } catch (error) {
        toast.error(`Error fetching reviews: ${error.message}`);
      }
    };

    fetchIcs();
    fetchReviews();
  }, []);

  const handleAddReview = async () => {
    setLoading(true);
    try {
      const review = {
        integratedID: selectedIcId,
        reviewtext,
        createdBy: user.name,
        createdAt: new Date().toISOString(),
      };

      await db.createDocument(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_REVIEWS_COLLECTION_ID,
        ID.unique(),
        review
      );

      toast.success('Review added successfully!');
      setReviewtext('');
      setSelectedIcId('');
      setReviews([...reviews, review]);
    } catch (error) {
      toast.error(`Error adding review: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add Review</h2>
      <div className="mb-4">
        <select 
          className="border p-2 rounded w-full" 
          value={selectedIcId} 
          onChange={(e) => setSelectedIcId(e.target.value)}
        >
          <option value="">Select IC</option>
          {ics.map((ic) => (
            <option key={ic.$id} value={ic.$id}>
              {ic.bus_name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <textarea
          className="border p-2 rounded w-full"
          placeholder="Review Text"
          value={reviewtext}
          onChange={(e) => setReviewtext(e.target.value)}
        />
      </div>
      <button 
        className="bg-blue-500 text-white p-2 rounded" 
        onClick={handleAddReview} 
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Review'}
      </button>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Reviews</h2>
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr>
            <th className="border p-2">IC Name</th>
            <th className="border p-2">Review</th>
            <th className="border p-2">Created By</th>
            <th className="border p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => {
            const ic = ics.find((ic) => ic.$id === review.integratedID);
            return (
              <tr key={review.$id}>
                <td className="border p-2">{ic ? ic.bus_name : 'Unknown IC'}</td>
                <td className="border p-2">{review.reviewtext}</td>
                <td className="border p-2">{review.createdBy}</td>
                <td className="border p-2">{new Date(review.createdAt).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviews;
