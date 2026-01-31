import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-700 transition">
                                    <ShieldAlert className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
                                    Shikayat
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link
                                to="/"
                                className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/submit"
                                className={`text-sm font-medium transition-colors ${isActive('/submit') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
                            >
                                Submit Complaint
                            </Link>
                            <Link
                                to="/track"
                                className={`text-sm font-medium transition-colors ${isActive('/track') ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
                            >
                                Track Status
                            </Link>
                            <Link
                                to="/admin"
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/admin')
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                Admin
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-slate-100 bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Home</Link>
                            <Link to="/submit" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Submit Complaint</Link>
                            <Link to="/track" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Track Status</Link>
                            <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} Shikayat. Anonymous Complaint Management System.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
