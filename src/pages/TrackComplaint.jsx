import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { Search, Circle, CheckCircle, Clock, AlertCircle, Star } from 'lucide-react';
import FeedbackForm from '../components/FeedbackForm';

const TrackComplaint = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlId = searchParams.get('id');
    const [searchId, setSearchId] = useState(urlId || '');
    const { getComplaint, addFeedback } = useComplaints();
    const [complaint, setComplaint] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        // Update URL
        setSearchParams({ id: searchId });

        const found = getComplaint(searchId.trim());
        if (found) {
            setComplaint(found);
            setError('');
        } else {
            setComplaint(null);
            setError('Complaint not found. Please check the ID.');
        }
    };

    // Auto-search on load if ID exists
    useEffect(() => {
        if (urlId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (searchId !== urlId) setSearchId(urlId);

            const found = getComplaint(urlId);
            if (found) {
                setComplaint(found);
            } else {
                setError('Complaint not found.');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlId, getComplaint]);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Track Complaint Status</h1>
                <p className="text-slate-600 mt-2">Enter your unique Complaint ID to check progress.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="e.g., CMP-123456"
                        className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Search className="w-5 h-5" /> Track
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>

            {complaint && (
                <div className="space-y-6 animate-fade-in-up">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <p className="text-sm text-slate-500 uppercase tracking-wide">Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <StatusBadge status={complaint.status} size="large" />
                                </div>
                            </div>
                            <div className="text-right md:text-right text-left">
                                <p className="text-sm text-slate-500">Submitted On</p>
                                <p className="font-medium text-slate-900">
                                    {new Date(complaint.submittedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50">
                            <h3 className="font-semibold text-slate-900 mb-2">Issue Details</h3>
                            <p className="text-slate-7000 mb-4">{complaint.description}</p>
                            <div className="flex gap-4 text-sm text-slate-500">
                                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full">
                                    Category: {complaint.category}
                                </span>
                                {complaint.hasImage && (
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full">
                                        Has Attachment
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">History</h3>
                        <div className="space-y-8 relative pl-4 border-l-2 border-slate-100 ml-4">
                            {complaint.timeline.map((item, index) => (
                                <div key={index} className="relative pl-8">
                                    {/* Dot */}
                                    <div className={`absolute -left-[37px] top-0 w-4 h-4 rounded-full border-4 border-white ${index === 0 ? 'bg-indigo-600 ring-4 ring-indigo-50' : 'bg-slate-300'
                                        }`} />

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                        <div>
                                            <p className={`font-semibold ${index === 0 ? 'text-indigo-700' : 'text-slate-900'}`}>
                                                {item.status}
                                            </p>
                                            <p className="text-slate-600 mt-1">{item.note}</p>
                                        </div>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Feedback Section */}
                    {
                        complaint.status === 'Resolved' && (
                            complaint.feedback ? (
                                <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6">
                                    <h3 className="text-lg font-bold text-emerald-900 mb-2">Feedback Submitted</h3>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${star <= complaint.feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-emerald-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-emerald-800 italic">"{complaint.feedback.comment}"</p>
                                    <p className="text-xs text-emerald-600 mt-2">Submitted on {new Date(complaint.feedback.timestamp).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                <FeedbackForm
                                    complaintId={complaint.id}
                                    onSubmit={(feedback) => {
                                        addFeedback(complaint.id, feedback);
                                        setComplaint(prev => ({ ...prev, feedback }));
                                    }}
                                />
                            )
                        )
                    }
                </div >
            )}
        </div >
    );
};

const StatusBadge = ({ status, size = 'normal' }) => {
    const styles = {
        'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
        'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
        'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Rejected': 'bg-red-100 text-red-800 border-red-200',
    };

    const icons = {
        'Pending': Clock,
        'In Progress': Circle, // Or a loader icon
        'Resolved': CheckCircle,
        'Rejected': AlertCircle
    };

    const Icon = icons[status] || Circle;
    const style = styles[status] || 'bg-slate-100 text-slate-800';

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border ${style} ${size === 'large' ? 'text-lg px-4 py-1.5' : 'text-sm'}`}>
            <Icon className={size === 'large' ? 'w-5 h-5' : 'w-4 h-4'} />
            {status}
        </span>
    );
};

export default TrackComplaint;
