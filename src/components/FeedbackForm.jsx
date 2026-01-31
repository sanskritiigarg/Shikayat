
import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const FeedbackForm = ({ complaintId, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            onSubmit({ rating, comment, timestamp: new Date().toISOString() });
            toast.success('Thank you for your feedback!');
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Rate your experience</h3>
            <p className="text-sm text-slate-500 mb-6">
                Your complaint has been resolved. How satisfied are you with the resolution process?
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="transition-transform hover:scale-110 focus:outline-none"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Any additional comments? (Optional)"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : <>Submit Feedback <Send className="w-4 h-4" /></>}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
