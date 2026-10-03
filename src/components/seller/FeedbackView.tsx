import React, { useState, useEffect, useMemo } from 'react';
import type { SellerReview } from '../../types/seller';
import { toast } from 'react-toastify';
import { deleteShopReviewApi } from '../../redux/services/sellerService';

interface FeedbackViewProps {
  reviews?: SellerReview[];
  shopId?: string;
  onDeleteReview?: (reviewId: string) => Promise<void> | void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  reviews: propReviews,
  shopId,
  onDeleteReview,
}) => {
  const [selectedRating, setSelectedRating] = useState<number | 'All'>('All');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Use prop reviews when available (from API), otherwise empty
  const [reviewList, setReviewList] = useState<SellerReview[]>(propReviews || []);

  // Keep in sync when parent re-fetches data
  useEffect(() => {
    if (propReviews && propReviews.length > 0) {
      setReviewList(propReviews);
    }
  }, [propReviews]);

  const filteredReviews = useMemo(() => {
    return reviewList.filter((r) => {
      if (selectedRating === 'All') return true;
      return r.rating === selectedRating;
    });
  }, [reviewList, selectedRating]);

  // Calculate average rating
  const avgRating = (
    reviewList.reduce((acc, r) => acc + r.rating, 0) / (reviewList.length || 1)
  ).toFixed(1);

  // Calculate rating breakdown dynamically from actual data
  const ratingBreakdown = useMemo(() => {
    const total = reviewList.length || 1;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      pct: Math.round((reviewList.filter((r) => r.rating === star).length / total) * 100),
    }));
  }, [reviewList]);

  const handlePostReply = (reviewId: string) => {
    const text = replyTextMap[reviewId]?.trim();
    if (!text) {
      toast.warning('Please enter a reply message');
      return;
    }

    setReviewList((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, sellerReply: text } : r))
    );
    setReplyTextMap((prev) => ({ ...prev, [reviewId]: '' }));
    setActiveReplyId(null);
    toast.success('Your response has been published to the buyer!');
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to remove this review?')) return;
    setDeletingId(reviewId);
    try {
      if (onDeleteReview) {
        await onDeleteReview(reviewId);
      } else {
        await deleteShopReviewApi(reviewId, shopId);
      }
      setReviewList((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success('Review removed successfully');
    } catch {
      toast.error('Failed to remove review');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
          Customer Feedback & Reviews
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Monitor your customer ratings, satisfaction metrics, and reply to buyer experiences
        </p>
      </div>

      {/* Review Analytics Summary Card */}
      <div className="bg-white rounded-xl border border-gray-300/80 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Average Rating Big Display */}
          <div className="md:col-span-4 text-center md:text-left md:border-r border-gray-200 md:pr-6">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Store Rating Average
            </span>
            <div className="flex items-baseline justify-center md:justify-start gap-2 mt-2">
              <span className="text-4xl md:text-5xl font-black text-gray-900">{avgRating}</span>
              <span className="text-base text-gray-400 font-medium">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(Number(avgRating)) ? 'text-amber-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">Based on {reviewList.length} verified ratings</span>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="md:col-span-8 space-y-2">
            {ratingBreakdown.map((row) => (
              <div key={row.star} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-gray-700">{row.star} Stars</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    style={{ width: `${row.pct}%` }}
                    className="h-full bg-[#324035] rounded-full transition-all duration-500"
                  />
                </div>
                <span className="w-8 text-right text-gray-500">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs by Star Rating */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        <button
          onClick={() => setSelectedRating('All')}
          className={`px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
            selectedRating === 'All'
              ? 'bg-[#222529] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          }`}
        >
          All Reviews ({reviewList.length})
        </button>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = reviewList.filter((r) => r.rating === rating).length;
          const isActive = selectedRating === rating;
          return (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#222529] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <span>{rating} ★</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-300/80 p-8 text-center text-gray-500">
            No customer feedback in this rating tier.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-gray-300/80 p-5 shadow-sm space-y-3"
            >
              {/* Reviewer Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={rev.customerName}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{rev.customerName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">Product: {rev.productName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={s <= rev.rating ? 'text-amber-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{rev.date}</span>
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/60 p-3 rounded-lg border border-gray-100">
                "{rev.comment}"
              </p>

              {/* Seller Reply Box if exists */}
              {rev.sellerReply && (
                <div className="ml-4 pl-4 border-l-2 border-[#324035] bg-[#fafbfc] p-3 rounded-r-lg text-xs space-y-1">
                  <span className="font-bold text-[#324035] block">Store Response:</span>
                  <p className="text-gray-700">{rev.sellerReply}</p>
                </div>
              )}

              {/* Actions: Reply and Delete Review (DELETE /shop/{id}/reviews/{reviewId}) */}
              <div className="flex items-center justify-between pt-1">
                {!rev.sellerReply ? (
                  <div>
                    {activeReplyId === rev.id ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          rows={2}
                          value={replyTextMap[rev.id] || ''}
                          onChange={(e) =>
                            setReplyTextMap((prev) => ({ ...prev, [rev.id]: e.target.value }))
                          }
                          placeholder="Write a public reply to this review..."
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#324035]/40"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setActiveReplyId(null)}
                            className="rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handlePostReply(rev.id)}
                            className="rounded-lg bg-[#324035] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#222529]"
                          >
                            Post Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveReplyId(rev.id)}
                        className="text-xs font-bold text-[#324035] hover:underline flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Reply to Customer
                      </button>
                    )}
                  </div>
                ) : <div />}

                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  disabled={deletingId === rev.id}
                  className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                  title="Delete review from shop"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {deletingId === rev.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
