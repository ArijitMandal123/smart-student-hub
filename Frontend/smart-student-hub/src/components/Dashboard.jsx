import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = ({ studentData, onLogout }) => {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState('Connecting...');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/api/test');
        setBackendStatus(response.data.message);
      } catch (error) {
        setBackendStatus('Backend connection failed');
      }
    };
    testConnection();
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Smart Student Hub</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotification(!showNotification)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-3 py-2 rounded-lg flex items-center transition-all duration-200"
              >
                🔔
              </button>
              {showNotification && (
                <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl text-black rounded-xl shadow-2xl p-4 z-10 border border-white/20">
                  <p className="text-sm font-medium">Backend Status:</p>
                  <p className="text-sm text-gray-600">{backendStatus}</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {studentData?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Welcome, {studentData?.name || 'Student'}!</h2>
                <p className="text-gray-600 text-lg">Student ID: {studentData?.studentId}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => navigate('/view-profile')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Academic Records</h3>
            <p className="text-gray-600">View your academic performance</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Activities</h3>
            <p className="text-gray-600">Track your extracurricular activities</p>
          </div>
          
          <div 
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/90"
            onClick={() => navigate('/personal-achievements')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Personal Achievements</h3>
            <p className="text-gray-600">Manage your certificates and achievements</p>
          </div>
          
          <div 
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/90"
            onClick={() => navigate('/profile')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Profile Management</h3>
            <p className="text-gray-600">Update your personal details and documents</p>
          </div>
          
          <div 
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/90"
            onClick={() => navigate('/projects')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Add Your Project</h3>
            <p className="text-gray-600">Showcase your projects and work</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;