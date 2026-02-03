import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Dashboard from '../components/Analytics/Dashboard';

const AnalyticsPage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Analytics</h1>
                    <p className="text-slate-600">Track your productivity and progress</p>
                </div>

                <Dashboard />
            </div>
        </div>
    );
};

export default AnalyticsPage;
