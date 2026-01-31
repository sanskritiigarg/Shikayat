import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { Upload, Send, AlertCircle, MapPin, Mic, MicOff, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import EXIF from 'exif-js';
import { getLocationFromImage } from '../utils/locationUtils';
import LocationPicker from '../components/LocationPicker';
import useSpeechToText from '../hooks/useSpeechToText';

const SubmitComplaint = () => {
    const navigate = useNavigate();
    const { addComplaint } = useComplaints();
    const [loading, setLoading] = useState(false);
    const [showMap, setShowMap] = useState(false);

    // Voice Input
    const { isListening, transcript, startListening, stopListening, resetTranscript, supported: voiceSupported } = useSpeechToText();

    const [formData, setFormData] = useState({
        category: '',
        description: '',
        email: '',
        image: null,
        location: null, // { lat, lng, source }
        isAnonymous: false
    });

    // Sync voice transcript
    React.useEffect(() => {
        if (transcript) {
            setFormData(prev => ({
                ...prev,
                description: (prev.description + ' ' + transcript).trim()
            }));
            resetTranscript();
        }
    }, [transcript, resetTranscript]);

    const categories = [
        'Infrastructure',
        'Academic',
        'Administration',
        'Hostel/Accommodation',
        'Harassment/Ragging',
        'Other'
    ];

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            let location = formData.location;

            // Try to extract EXIF location
            try {
                const exifLoc = await getLocationFromImage(file, EXIF);
                if (exifLoc) {
                    location = { ...exifLoc, source: 'exif' };
                    toast.success('Location extracted from image!');
                }
            } catch (error) {
                console.error("EXIF Error", error);
            }

            setFormData(prev => ({ ...prev, image: file, location }));
        }
    };

    const handleLocationSelect = (loc) => {
        setFormData(prev => ({ ...prev, location: { ...loc, source: 'manual' } }));
        setShowMap(false);
        toast.success('Location pinned!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.isAnonymous && formData.email) {
            // Logic handles this in backend/context usually, passing flag
        }

        // Use default mandatory email check logic if needed? 
        // "Make email mandatory"
        if (!formData.email) {
            toast.error('Email is required for complaint submission.');
            return;
        }

        setLoading(true);
        // Simulate network delay
        setTimeout(() => {
            const id = addComplaint({
                category: formData.category,
                description: formData.description,
                email: formData.email,
                hasImage: !!formData.image,
                location: formData.location,
                isAnonymous: formData.isAnonymous
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
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-slate-700">Description *</label>
                            {voiceSupported && (
                                <button
                                    type="button"
                                    onClick={isListening ? stopListening : startListening}
                                    className={`text-xs px-3 py-1 flex items-center gap-1.5 rounded-full transition-colors ${isListening
                                        ? 'bg-red-100 text-red-700 animate-pulse'
                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                        }`}
                                >
                                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                                    {isListening ? 'Stop Recording' : 'Voice Input'}
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the issue in detail..."
                                rows={5}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Image Upload (Visual only) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Attachment & Location</label>
                        <div className="flex gap-4 flex-col sm:flex-row">
                            <div className="flex-1 border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                    <Upload className="w-8 h-8" />
                                    <span className="text-sm">
                                        {formData.image ? formData.image.name : 'Upload Image'}
                                    </span>
                                </div>
                            </div>

                            {/* Location Display/Picker */}
                            <div className="flex-1 flex flex-col justify-center items-center border border-slate-200 rounded-lg p-4 bg-slate-50">
                                {formData.location ? (
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium mb-1">
                                            <MapPin className="w-5 h-5" />
                                            Location Detected
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2">
                                            {formData.location.source === 'exif' ? 'Extracted from image' : 'Manually pinned'}
                                            <br />
                                            {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(true)}
                                            className="text-indigo-600 text-sm hover:underline"
                                        >
                                            Change Location
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm text-slate-500 mb-3">No location added</p>
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(true)}
                                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 mx-auto"
                                        >
                                            <MapPin className="w-4 h-4" /> Add Location
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Email (Required) */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-700">
                            Email (Required)
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            required
                        />
                        <div className="flex items-start gap-3">
                            <div className="flex items-center h-5">
                                <input
                                    id="privacy"
                                    type="checkbox"
                                    checked={formData.isAnonymous}
                                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                            </div>
                            <div className="text-sm">
                                <label htmlFor="privacy" className="font-medium text-slate-700">
                                    Hide my email from admins
                                </label>
                                <p className="text-slate-500">
                                    Admins will see "Hidden" but you will still receive updates via email.
                                </p>
                            </div>
                        </div>
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

            {showMap && (
                <LocationPicker
                    onConfirm={handleLocationSelect}
                    onClose={() => setShowMap(false)}
                    initialLocation={formData.location}
                />
            )}
        </div>
    );
};

export default SubmitComplaint;
