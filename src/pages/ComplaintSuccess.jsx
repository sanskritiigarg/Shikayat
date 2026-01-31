import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const ComplaintSuccess = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        // Fire confetti on load
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(id);
        toast.success('Complaint ID copied!');
    };

    if (!id) return <p className="text-center p-10">Invalid Request</p>;

    return (
        <div className="max-w-xl mx-auto text-center pt-10">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="w-20 h-20 text-emerald-500" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900">Complaint Submitted!</h1>
                <p className="text-slate-600">
                    Your complaint has been securely recorded. Please save your Complaint ID to track its status.
                </p>

                <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-semibold">Your Complaint ID</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl font-mono font-bold text-indigo-700 tracking-wider">
                            {id}
                        </span>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 hover:text-indigo-600"
                            title="Copy ID"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="pt-4 space-y-3">
                    <Link
                        to={`/track?id=${id}`}
                        className="block w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        Track Status <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        to="/"
                        className="block w-full py-3 px-6 text-slate-600 hover:bg-slate-50 font-medium rounded-lg transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ComplaintSuccess;
