import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Loader2, MessageSquare, ChevronDown, ChevronUp, Lock } from "lucide-react";

function StarRow({ rating, onRate, size = "w-5 h-5" }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onRate?.(n)}
          disabled={!onRate}
          className={`${onRate ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star
            className={`${size} ${n <= rating ? "fill-[#00A0E3] text-[#00A0E3]" : "text-[#1A1612]/20"}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ product }) {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: "", reviewer_name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((p) => ({ ...p, reviewer_name: user.full_name || user.email?.split("@")[0] || "" }));
    }
  }, [isAuthenticated, user]);

  const loadReviews = async () => {
    try {
      const all = await base44.entities.Review.filter({ product_id: product.id });
      setReviews(all);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [product.id]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.comment.trim() || !form.reviewer_name.trim()) {
      setError("Please enter your name and a comment.");
      return;
    }
    setSubmitting(true);
    try {
      await base44.entities.Review.create({
        product_id: product.id,
        product_name: product.name,
        rating: form.rating,
        comment: form.comment,
        reviewer_name: form.reviewer_name,
      });
      setSuccess(true);
      setForm({ rating: 5, comment: "", reviewer_name: "" });
      setShowForm(false);
      await loadReviews();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-[#E8E2D5]">
      {/* Summary row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-medium text-[#1A1612]/70 hover:text-[#00A0E3]"
        >
          <StarRow rating={Math.round(avgRating)} size="w-3.5 h-3.5" />
          <span>{reviews.length > 0 ? `${avgRating.toFixed(1)} (${reviews.length})` : "No reviews yet"}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-medium text-[#00A0E3] hover:underline"
        >
          Write a Review
        </button>
      </div>

      {/* Review form */}
      {showForm && !isAuthenticated && (
        <div className="mt-3 p-3 bg-[#F0EBE0] rounded-md text-center">
          <Lock className="w-4 h-4 text-[#1A1612]/50 mx-auto mb-1" />
          <p className="text-xs text-[#1A1612]/70 mb-2">Please log in to write a review.</p>
          <Link to="/login" className="text-xs font-medium text-[#00A0E3] hover:underline">Login</Link>
        </div>
      )}

      {showForm && isAuthenticated && (
        <form onSubmit={handleSubmit} className="mt-3 p-3 bg-[#F0EBE0] rounded-md space-y-2">
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div>
            <Label className="text-xs text-[#1A1612]">Rating</Label>
            <StarRow rating={form.rating} onRate={(n) => setForm((p) => ({ ...p, rating: n }))} />
          </div>
          <div>
            <Label className="text-xs text-[#1A1612]">Your Name</Label>
            <Input
              value={form.reviewer_name}
              onChange={(e) => setForm((p) => ({ ...p, reviewer_name: e.target.value }))}
              className="h-9 text-xs border-[#E8E2D5]"
              placeholder="Your name"
            />
          </div>
          <div>
            <Label className="text-xs text-[#1A1612]">Comment</Label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
              rows={2}
              placeholder="Share your experience..."
              className="w-full px-3 py-2 rounded-md border border-[#E8E2D5] bg-white text-xs text-[#1A1612] focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/30 resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" className="h-8 bg-[#00A0E3] hover:bg-[#0086C0] text-xs" disabled={submitting}>
              {submitting ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
              Submit Review
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Success message */}
      {success && (
        <p className="mt-2 text-xs text-green-700 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" /> Review submitted! Thank you.
        </p>
      )}

      {/* Reviews list */}
      {expanded && (
        <div className="mt-3 space-y-3">
          {loading ? (
            <p className="text-xs text-[#1A1612]/50">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="pb-3 border-b border-[#E8E2D5] last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#1A1612]">{review.reviewer_name || "Anonymous"}</span>
                  <StarRow rating={review.rating || 0} size="w-3 h-3" />
                </div>
                <p className="text-xs text-[#1A1612]/70 leading-relaxed">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#1A1612]/50 text-center py-2">
              No reviews yet. Be the first to share your experience!
            </p>
          )}
        </div>
      )}
    </div>
  );
}