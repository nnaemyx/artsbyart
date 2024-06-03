import React, { useEffect, useState } from "react";
import { db } from "@/utils/appwrite";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/utils/AuthContent";

const ICReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_REVIEWS_COLLECTION_ID
        );

        const userReviews = response.documents.filter(
          (review) => review.integratedID === user.$id
        );
        setReviews(userReviews);
      } catch (error) {
        toast.error(`Error fetching reviews: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (user?.$id) {
      fetchReviews();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
      {loading ? (
        <p>Loading...</p>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.$id} className="border p-4 rounded">
              <p>{review.reviewtext}</p>
              <small className="text-gray-500">By: {review.createdBy}</small>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
};

export default ICReviews;
