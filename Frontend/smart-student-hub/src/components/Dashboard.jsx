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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Smart Student Hub</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotification(!showNotification)}
                className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded flex items-center"
              >
                🔔
              </button>
              {showNotification && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg p-3 z-10">
                  <p className="text-sm font-medium">Backend Status:</p>
                  <p className="text-sm text-gray-600">{backendStatus}</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Welcome, {studentData?.name || 'Student'}!</h2>
              <p className="text-gray-600">Student ID: {studentData?.studentId}</p>
            </div>
            <button 
              onClick={() => navigate('/personal-achievements')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Personal Achievements
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Academic Records</h3>
            <p className="text-gray-600">View your academic performance</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Activities</h3>
            <p className="text-gray-600">Track your extracurricular activities</p>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50"
            onClick={() => navigate('/personal-achievements')}
          >
            <h3 className="text-lg font-semibold mb-2">Personal Achievements</h3>
            <p className="text-gray-600">Manage your certificates and achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;