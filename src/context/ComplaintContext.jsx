import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const ComplaintContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useComplaints = () => useContext(ComplaintContext);

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState(() => {
        const saved = localStorage.getItem('shikayat_complaints');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('shikayat_complaints', JSON.stringify(complaints));
    }, [complaints]);

    const addComplaint = useCallback((complaintData) => {
        const newComplaint = {
            id: "CMP-" + Date.now().toString().slice(-6),
            ...complaintData,
            status: 'Pending',
            submittedAt: new Date().toISOString(),
            timeline: [
                { status: 'Pending', timestamp: new Date().toISOString(), note: 'Complaint received' }
            ]
        };
        setComplaints(prev => [newComplaint, ...prev]);
        return newComplaint.id;
    }, []);

    const getComplaint = useCallback((id) => {
        return complaints.find(c => c.id === id);
    }, [complaints]);

    const updateStatus = useCallback((id, newStatus, note) => {
        setComplaints(prev => prev.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    status: newStatus,
                    timeline: [
                        { status: newStatus, timestamp: new Date().toISOString(), note },
                        ...c.timeline
                    ]
                };
            }
            return c;
        }));
        toast.success(`Complaint updated to ${newStatus}`);
    }, []);

    const value = useMemo(() => ({
        complaints, addComplaint, getComplaint, updateStatus
    }), [complaints, addComplaint, getComplaint, updateStatus]);

    return (
        <ComplaintContext.Provider value={value}>
            {children}
        </ComplaintContext.Provider>
    );
};
