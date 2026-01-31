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

    const checkPriorityEscalation = (newLocation, currentComplaints) => {
        if (!newLocation) return [];

        const TWO_DAYS_MS = 48 * 60 * 60 * 1000;
        const now = Date.now();

        // Find recent complaints
        const recentComplaints = currentComplaints.filter(c => {
            const timeDiff = now - new Date(c.submittedAt).getTime();
            return timeDiff < TWO_DAYS_MS && c.location;
        });

        // Find complaints near the new location (using exact match of rounded coordinates)
        const nearbyComplaints = recentComplaints.filter(c =>
            Math.abs(c.location.lat - newLocation.lat) < 0.0001 &&
            Math.abs(c.location.lng - newLocation.lng) < 0.0001
        );

        return nearbyComplaints;
    };

    const addFeedback = useCallback((id, feedback) => {
        setComplaints(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, feedback };
            }
            return c;
        }));
    }, []);

    const addComplaint = useCallback((complaintData) => {
        const { location, ...rest } = complaintData;

        // Round location for privacy if provided
        const roundedLocation = location ? {
            lat: Math.round(location.lat * 1000) / 1000,
            lng: Math.round(location.lng * 1000) / 1000,
            source: location.source
        } : null;

        let priority = 'Normal';
        let escalationReason = null;
        let relatedComplaintIds = [];

        // Check for escalation
        if (roundedLocation) {
            const nearby = checkPriorityEscalation(roundedLocation, complaints);
            if (nearby.length >= 2) { // 2 existing + 1 new = 3
                priority = 'CRITICAL';
                escalationReason = 'Cluster detected: 3+ complaints in close proximity within 48h';
                relatedComplaintIds = nearby.map(c => c.id);
            }
        }

        const newComplaint = {
            id: "CMP-" + Date.now().toString().slice(-6),
            ...rest,
            location: roundedLocation,
            priority,
            escalationReason,
            status: 'Pending',
            submittedAt: new Date().toISOString(),
            timeline: [
                { status: 'Pending', timestamp: new Date().toISOString(), note: 'Complaint received' }
            ]
        };

        setComplaints(prev => {
            let updatedComplaints = [newComplaint, ...prev];

            // If escalated, update related complaints too
            if (priority === 'CRITICAL' && relatedComplaintIds.length > 0) {
                updatedComplaints = updatedComplaints.map(c => {
                    if (relatedComplaintIds.includes(c.id) && c.priority !== 'CRITICAL') {
                        return {
                            ...c,
                            priority: 'CRITICAL',
                            escalationReason: 'Escalated due to new nearby complaint (Cluster detected)',
                            timeline: [
                                { status: c.status, timestamp: new Date().toISOString(), note: 'Priority escalated to CRITICAL due to clustering' },
                                ...c.timeline
                            ]
                        };
                    }
                    return c;
                });
                toast.error('High complaint volume detected in this area. Priority escalated to CRITICAL.', { duration: 5000 });
            }

            return updatedComplaints;
        });
        return newComplaint.id;
    }, [complaints]);

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
        complaints, addComplaint, getComplaint, updateStatus, addFeedback
    }), [complaints, addComplaint, getComplaint, updateStatus, addFeedback]);

    return (
        <ComplaintContext.Provider value={value}>
            {children}
        </ComplaintContext.Provider>
    );
};
