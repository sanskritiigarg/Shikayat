import React, { useState, useMemo } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, MoreHorizontal, X, MapPin, Eye, EyeOff, Flag } from 'lucide-react';
import toast from 'react-hot-toast';
import ComplaintDetailModal from '../components/ComplaintDetailModal';

const AdminDashboard = () => {
    const { complaints, updateStatus } = useComplaints();
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null); // For modal

    const handleStatusUpdate = (id, newStatus) => {
        updateStatus(id, newStatus);
        toast.success(`Status updated to ${newStatus}`);

        // Update local modal state if open
        if (selectedComplaint && selectedComplaint.id === id) {
            setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
        }
    };

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
                                    <tr
                                        key={complaint.id}
                                        onClick={() => setSelectedComplaint(complaint)}
                                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${complaint.priority === 'CRITICAL' ? 'bg-red-50 hover:bg-red-100' : ''}`}
                                    >
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedComplaint(complaint);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedComplaint && (
                <ComplaintDetailModal
                    complaint={selectedComplaint}
                    onClose={() => setSelectedComplaint(null)}
                    onUpdateStatus={handleStatusUpdate}
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



export default AdminDashboard;
