import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { addReview, updateReview } from '@/lib/store/features/product/productSlice';

function ReviewForm({ productId, userId, userName, onReviewSubmitted, existingReview = null }) {
  const dispatch = useDispatch();
  const [reviewValue, setReviewValue] = useState(existingReview ? existingReview.reviewValue : 0);
  const [reviewMessage, setReviewMessage] = useState(existingReview ? existingReview.reviewMessage : '');

  useEffect(() => {
    if (existingReview) {
      setReviewValue(existingReview.reviewValue);
      setReviewMessage(existingReview.reviewMessage);
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewValue) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewMessage.trim()) {
      toast.error("Please write a review message");
      return;
    }

    const reviewData = {
      userId,
      name: userName,
      reviewMessage,
      reviewValue
    };

    try {
      let result;
      if (existingReview) {
        result = await dispatch(updateReview({
          productId,
          reviewId: existingReview._id,
          formdata: reviewData
        })).unwrap();
      } else {
        result = await dispatch(addReview({
          productId,
          formdata: reviewData
        })).unwrap();
      }

      if (result.success) {
        toast.success(existingReview ? "Review updated successfully" : "Review added successfully");
        if (!existingReview) {
          setReviewValue(0);
          setReviewMessage('');
        }
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }      } else {
        toast.error(result.data || result.message || `Failed to ${existingReview ? 'update' : 'add'} review`);
      }
    } catch (error) {
      toast.error(error.data || error.message || `Error ${existingReview ? 'updating' : 'adding'} review`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setReviewValue(star)}
              className={`w-8 h-8 ${reviewValue >= star ? "text-amber-500" : "text-gray-300"} hover:text-amber-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Review</label>
        <textarea
          value={reviewMessage}
          onChange={(e) => setReviewMessage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          rows={4}
          placeholder="Write your review here..."
        />
      </div>
      <button
        type="submit"
        className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
      >
        {existingReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;