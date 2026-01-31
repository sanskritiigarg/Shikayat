import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { Upload, Send, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SubmitComplaint = () => {
    const navigate = useNavigate();
    const { addComplaint } = useComplaints();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        category: '',
        description: '',
        email: '',
        image: null
    });

    const categories = [
        'Infrastructure',
        'Academic',
        'Administration',
        'Hostel/Accommodation',
        'Harassment/Ragging',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            const id = addComplaint({
                category: formData.category,
                description: formData.description,
                email: formData.email,
                hasImage: !!formData.image, // In a real app we'd upload the image
            });
            setLoading(false);
            navigate(`/success?id=${id}`);
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">File a Complaint</h2>
                    <p className="text-slate-500 mt-2">
                        Your identity will remain anonymous unless you choose to provide your email.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Category *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the issue in detail..."
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                            required
                        />
                    </div>

                    {/* Image Upload (Visual only) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Attachment (Optional)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer relative">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                accept="image/*"
                            />
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                                <Upload className="w-8 h-8" />
                                <span className="text-sm">
                                    {formData.image ? formData.image.name : 'Click to upload or drag and drop'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Email (Optional) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                            Email (Optional)
                            <span className="ml-2 text-xs font-normal text-slate-400">
                                Only if you want updates via email.
                            </span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {/* Warning */}
                    <div className="flex gap-3 p-4 bg-amber-50 text-amber-800 rounded-lg text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>
                            Please ensure your description does not inadvertently reveal your identity if you wish to remain 100% anonymous.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all ${loading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-1'
                            }`}
                    >
                        {loading ? 'Submitting...' : (
                            <>
                                Submit Complaint <Send className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubmitComplaint;
