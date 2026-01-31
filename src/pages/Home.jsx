import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, Lock } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-16 py-10">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                    Speak Up, <span className="text-indigo-600">Fearlessly.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                    The secure, anonymous platform to report issues and track their resolution in real-time. Your voice matters, and your identity is safe.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Link
                        to="/submit"
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        <ShieldCheck className="w-5 h-5" />
                        File a Complaint
                    </Link>
                    <Link
                        to="/track"
                        className="px-8 py-4 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <Eye className="w-5 h-5" />
                        Track Status
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <FeatureCard
                    icon={<Lock className="w-8 h-8 text-emerald-500" />}
                    title="100% Anonymous"
                    description="We don't collect personal data unless you choose to provide it. You are fully protected."
                />
                <FeatureCard
                    icon={<ShieldCheck className="w-8 h-8 text-indigo-500" />}
                    title="Secure Submission"
                    description="Your complaints are encrypted and securely delivered to the relevant administrators."
                />
                <FeatureCard
                    icon={<Eye className="w-8 h-8 text-amber-500" />}
                    title="Real-time Tracking"
                    description="Get a unique ID to track the progress of your complaint without logging in."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="mb-4 bg-slate-50 w-14 h-14 rounded-full flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

export default Home;
