import React, { useState } from 'react';
import { X, MapPin, Calendar, Tag, AlertTriangle, Eye, EyeOff, Clock, CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import toast from 'react-hot-toast';

const ComplaintDetailModal = ({ complaint, onClose, onUpdateStatus }) => {
    const [status, setStatus] = useState(complaint.status);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = () => {
        setIsUpdating(true);
        // Simulate API call
        setTimeout(() => {
            onUpdateStatus(complaint.id, status);
            setIsUpdating(false);
            onClose();
        }, 800);
    };

    if (!complaint) return null;

    const StatusIcon = {
        'Pending': Clock,
        'In Progress': Circle,
        'Resolved': CheckCircle,
        'Rejected': AlertCircle
    }[status] || Circle;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-left">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-slate-900">Complaint #{complaint.id}</h2>
                            {complaint.priority === 'CRITICAL' && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1 border border-red-200">
                                    <AlertTriangle className="w-3 h-3" /> CRITICAL
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                            Submitted on {new Date(complaint.submittedAt).toLocaleString()}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Column: Details */}
                    <div className="space-y-6">
                        {/* Status Update */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Current Status</label>
                            <div className="flex gap-2">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                                <button
                                    onClick={handleUpdate}
                                    disabled={status === complaint.status || isUpdating}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isUpdating ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-slate-400" /> Description
                            </h3>
                            <div className="p-4 bg-white border border-slate-100 rounded-xl text-slate-700 leading-relaxed shadow-sm">
                                {complaint.description}
                            </div>
                            <div className="mt-2 flex gap-2">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                                    {complaint.category}
                                </span>
                            </div>
                        </div>

                        {/* Reporter Info */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <Eye className="w-4 h-4 text-slate-400" /> Reporter
                            </h3>
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${complaint.isAnonymous ? 'bg-slate-100' : 'bg-indigo-50 text-indigo-600'}`}>
                                    {complaint.isAnonymous ? <EyeOff className="w-5 h-5 text-slate-400" /> : <span className="font-bold">{(complaint.email || 'U')[0].toUpperCase()}</span>}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {complaint.isAnonymous ? 'Anonymous User' : complaint.email}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {complaint.isAnonymous ? 'Email hidden by user request' : 'Email visible to admins'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feedback (if resolved) */}
                        {complaint.feedback && (
                            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wide mb-2">User Feedback</h3>
                                <div className="flex gap-1 text-amber-400 mb-1">
                                    {'★'.repeat(complaint.feedback.rating)}{'☆'.repeat(5 - complaint.feedback.rating)}
                                </div>
                                <p className="text-emerald-800 text-sm italic">"{complaint.feedback.comment}"</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Media & Location */}
                    <div className="space-y-6">
                        {/* Location Map */}
                        <div className="rounded-xl overflow-hidden border border-slate-200 h-64 relative z-0">
                            {complaint.location ? (
                                <MapContainer
                                    center={[complaint.location.lat, complaint.location.lng]}
                                    zoom={15}
                                    style={{ height: '100%', width: '100%' }}
                                    dragging={false}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[complaint.location.lat, complaint.location.lng]} />
                                </MapContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400">
                                    <p className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4" /> No location data provided</p>
                                </div>
                            )}
                            {complaint.location && (
                                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs shadow-sm z-[400] text-slate-600">
                                    Approx: {complaint.location.lat.toFixed(3)}, {complaint.location.lng.toFixed(3)}
                                </div>
                            )}
                        </div>

                        {/* Image Attachment */}
                        {complaint.hasImage && (
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-slate-400" /> Attachment
                                </h3>
                                {/* Placeholder since we don't actually store the image file in this mock setup, usually URL */}
                                <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400">
                                    <p className="text-sm">Image Attachment Preview</p>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Timeline</h3>
                            <div className="space-y-4 pl-2 border-l-2 border-slate-100 ml-2">
                                {complaint.timeline.map((item, i) => (
                                    <div key={i} className="relative pl-6">
                                        <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                                        <p className="text-sm font-medium text-slate-900">{item.status}</p>
                                        <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</p>
                                        {item.note && <p className="text-xs text-slate-600 mt-0.5">{item.note}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailModal;
