'use client';

import { useState } from 'react';

interface RatingModalProps {
    isOpen: boolean;
    resourceTitle: string;
    onClose: () => void;
    onRate: (rating: number, comment: string) => void;
}

export default function RatingModal({ isOpen, resourceTitle, onClose, onRate }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            await onRate(rating, comment);
            setRating(0);
            setComment('');
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <div className="text-4xl mb-3">⭐</div>
                    <h2 className="text-xl font-bold text-gray-900">Rate this Resource</h2>
                    <p className="text-sm text-gray-500 mt-1">{resourceTitle}</p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => setRating(star)}
                            className="text-4xl transition-transform hover:scale-125"
                        >
                            {star <= (hoveredStar || rating) ? '★' : '☆'}
                        </button>
                    ))}
                </div>

                <div className="mb-4">
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Optional: Leave a comment..."
                        rows={3}
                        className="modal-input"
                    />
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="btn btn-secondary flex-1">Skip</button>
                    <button
                        onClick={handleSubmit}
                        className="btn btn-primary flex-1"
                        disabled={rating === 0 || submitting}
                    >
                        {submitting ? 'Submitting...' : `Rate ${rating} Star${rating !== 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
