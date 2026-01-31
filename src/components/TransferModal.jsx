import React, { useState, useEffect } from 'react';
// Mock admin data
const MOCK_ADMINS = [
    { user_id: 'admin-1', full_name: 'Aditi Sharma', email: 'aditi.sharma@college.edu', category: 'Infrastructure' },
    { user_id: 'admin-2', full_name: 'Prof. Rajesh Kumar', email: 'rajesh.k@college.edu', category: 'Academic' },
    { user_id: 'admin-3', full_name: 'Dr. Sarah Wilson', email: 'sarah.w@college.edu', category: 'Administration' },
    { user_id: 'admin-4', full_name: 'Warden Singh', email: 'w.singh@college.edu', category: 'Hostel/Accommodation' },
    { user_id: 'admin-5', full_name: 'Anti-Ragging Squad', email: 'alert@college.edu', category: 'Harassment/Ragging' },
    { user_id: 'admin-6', full_name: 'General Admin', email: 'admin@college.edu', category: 'Other' },
    { user_id: 'admin-7', full_name: 'Maintenance Lead', email: 'maint@college.edu', category: 'Infrastructure' }
];
import toast from 'react-hot-toast';
import { X, User, ArrowRight, Loader2 } from 'lucide-react';

const TransferModal = ({ complaint, currentAdminId, onClose, onTransferSuccess }) => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transferring, setTransferring] = useState(false);

    useEffect(() => {
        // Simulate fetching admins
        const timer = setTimeout(() => {
            const categoryAdmins = MOCK_ADMINS.filter(
                admin => admin.category === complaint.category && admin.user_id !== currentAdminId
            );

            // If no specific category admins found, show valid alternatives or general admins
            if (categoryAdmins.length === 0) {
                setAdmins(MOCK_ADMINS.filter(a => a.user_id !== currentAdminId).slice(0, 3));
            } else {
                setAdmins(categoryAdmins);
            }
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [complaint, currentAdminId]);

    const handleTransfer = async (targetAdminId) => {
        if (!confirm('Are you sure you want to transfer this complaint?')) return;

        setTransferring(true);

        // Simulate network request
        setTimeout(() => {
            toast.success('Complaint transferred successfully');
            onTransferSuccess(complaint.id);
            setTransferring(false);
            onClose();
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-slate-900">Transfer Complaint</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-sm text-slate-500 mb-1">Transferring Complaint ID:</p>
                        <p className="font-mono text-sm font-medium text-slate-900 bg-slate-100 inline-block px-2 py-1 rounded">{complaint.id}</p>
                    </div>

                    <h4 className="text-sm font-medium text-slate-700 mb-3">Available Admins ({complaint.category})</h4>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            No other admins found for this category.
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {admins.map((admin) => (
                                <div key={admin.user_id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xs">
                                            {admin.full_name?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{admin.full_name || 'Unknown Admin'}</p>
                                            <p className="text-xs text-slate-500">{admin.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleTransfer(admin.user_id)}
                                        disabled={transferring}
                                        className="text-xs bg-white border border-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-md hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm flex items-center gap-1"
                                    >
                                        Transfer <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransferModal;
