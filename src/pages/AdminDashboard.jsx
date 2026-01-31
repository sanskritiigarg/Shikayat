import React, { useState, useMemo } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, MoreHorizontal, X, MapPin, Eye, EyeOff, Flag } from 'lucide-react';

const AdminDashboard = () => {
    const { complaints, updateStatus } = useComplaints();
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null); // For modal

    const filteredComplaints = useMemo(() => {
        return complaints.filter(c => {
            const matchStatus = filterStatus === 'All' || c.status === filterStatus;
            const matchCategory = filterCategory === 'All' || c.category === filterCategory;
            const matchSearch = c.description.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchStatus && matchCategory && matchSearch;
        }).sort((a, b) => {
            // Priority sort (Critical first, then Pending)
            const priorityScore = (c) => {
                if (c.priority === 'CRITICAL') return -1;
                const statusOrder = { 'Pending': 0, 'In Progress': 1, 'Resolved': 2, 'Rejected': 3 };
                return statusOrder[c.status];
            };
            return priorityScore(a) - priorityScore(b) || new Date(b.submittedAt) - new Date(a.submittedAt);
        });
    }, [complaints, filterStatus, filterCategory, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500">Manage and resolve submitted complaints.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium">
                        Total: {complaints.length}
                    </div>
                    <div className="bg-amber-50 text-amber-700 px-3 py-2 border border-amber-100 rounded-lg text-sm font-medium">
                        Pending: {complaints.filter(c => c.status === 'Pending').length}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search ID or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                        <option value="All">All Categories</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Academic">Academic</option>
                        <option value="Administration">Administration</option>
                        <option value="Hostel/Accommodation">Hostel</option>
                        <option value="Harassment/Ragging">Harassment</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">ID & Priority</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase w-1/4">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Location</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        No complaints found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredComplaints.map(complaint => (
                                    <tr key={complaint.id} className={`hover:bg-slate-50 transition-colors ${complaint.priority === 'CRITICAL' ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-sm font-medium text-slate-600">{complaint.id}</div>
                                            {complaint.priority === 'CRITICAL' && (
                                                <div className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1" title={complaint.escalationReason}>
                                                    <Flag className="w-3 h-3" /> CRITICAL
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                {complaint.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 truncate max-w-xs" title={complaint.description}>
                                                {complaint.description}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {complaint.location ? (
                                                <div className="flex items-center gap-1 text-xs text-slate-500" title={`Lat: ${complaint.location.lat}, Lng: ${complaint.location.lng}`}>
                                                    <MapPin className="w-3 h-3" />
                                                    {complaint.location.source === 'exif' ? 'Image' : 'Pinned'}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {complaint.isAnonymous ? (
                                                <div className="flex items-center gap-1 text-xs text-slate-500 italic">
                                                    <EyeOff className="w-3 h-3" /> Hidden
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-sm text-slate-600">
                                                    <Eye className="w-3 h-3 text-slate-400" />
                                                    {complaint.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(complaint.submittedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={complaint.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedComplaint(complaint)}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Modal */}
            {selectedComplaint && (
                <UpdateStatusModal
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                    onUpdate={updateStatus}
                />
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        'Pending': 'bg-amber-100 text-amber-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Resolved': 'bg-emerald-100 text-emerald-800',
        'Rejected': 'bg-red-100 text-red-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
};

const UpdateStatusModal = ({ complaint, onClose, onUpdate }) => {
    const [status, setStatus] = useState(complaint.status);
    const [note, setNote] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(complaint.id, status, note);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Update Status</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Note (Required)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Explain the update..."
                            required
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
                        >
                            Update Status
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
