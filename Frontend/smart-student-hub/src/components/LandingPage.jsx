import React from 'react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Smart Student Hub</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search student details..."
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Login Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onNavigate('student-login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Student
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                Teacher
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Centralized Digital Platform for
              <span className="text-indigo-600"> Student Excellence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track, manage, and showcase student achievements, activities, and portfolios in one comprehensive platform designed for Higher Education Institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => onNavigate('student-login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-300 shadow-lg"
                >
                  Student Login
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-300 shadow-lg">
                  Teacher Login
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition duration-300 shadow-lg">
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Solutions for Everyone
            </h2>
            <p className="text-xl text-gray-600">
              Tailored features for students, faculty, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Students */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Dynamic Dashboard</li>
                <li>• Achievement Tracker</li>
                <li>• Digital Portfolio</li>
                <li>• Activity Management</li>
                <li>• Progress Monitoring</li>
              </ul>
            </div>

            {/* Faculty */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">For Faculty</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Approval Panel</li>
                <li>• Student Oversight</li>
                <li>• Bulk Operations</li>
                <li>• Verification System</li>
                <li>• Reporting Tools</li>
              </ul>
            </div>

            {/* Administrators */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">For Administrators</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• System Analytics</li>
                <li>• User Management</li>
                <li>• NAAC Compliance</li>
                <li>• Institutional Reports</li>
                <li>• Dashboard Overview</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-indigo-200">Digital Records</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-indigo-200">Access</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Secure</div>
              <div className="text-indigo-200">Data Storage</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">NAAC</div>
              <div className="text-indigo-200">Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Smart Student Hub</h3>
            <p className="text-gray-400 mb-6">
              Smart India Hackathon 2025 - Problem Statement #25093
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;