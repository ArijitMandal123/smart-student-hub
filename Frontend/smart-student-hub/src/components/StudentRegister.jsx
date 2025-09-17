import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const StudentRegister = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    year: '',
    semester: '',
    rollNumber: ''
  });
  const [message, setMessage] = useState('');
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await api.get('/api/colleges');
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleCollegeChange = (e) => {
    const collegeId = e.target.value;
    const selectedCollege = colleges.find(c => c._id === collegeId);
    setFormData({ ...formData, college: selectedCollege?.name || '', department: '' });
    setDepartments(selectedCollege?.departments || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'year' || name === 'semester' ? parseInt(value) || '' : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Error: Passwords do not match');
      return;
    }
    
    try {
      const response = await api.post('/api/register', formData);
      setMessage(`Success: ${response.data.message}. Student ID: ${response.data.studentId}`);
      onRegister({ name: formData.name, studentId: response.data.studentId });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Registration failed';
      setMessage(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 animate-slideUp">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Student Registration</h2>
            <p className="text-gray-600">Join the smart student community</p>
          </div>
          
          {message && (
            <div className={`mb-6 p-4 rounded-xl border-l-4 ${
              message.includes('Success') 
                ? 'bg-green-50 border-green-400 text-green-700' 
                : 'bg-red-50 border-red-400 text-red-700'
            } animate-fadeIn`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <input 
                  name="name" 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                />
              </div>
              
              <div className="relative">
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  minLength="6"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                />
                <input 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select 
                  onChange={handleCollegeChange}
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                >
                  <option value="" className="text-gray-400">Select College</option>
                  {colleges.map((college) => (
                    <option key={college._id} value={college._id}>{college.name}</option>
                  ))}
                </select>
                
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                >
                  <option value="" className="text-gray-400">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  name="year" 
                  type="number" 
                  placeholder="Year (1-4)" 
                  value={formData.year} 
                  onChange={handleChange} 
                  required 
                  min="1" 
                  max="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                />
                <input 
                  name="semester" 
                  type="number" 
                  placeholder="Semester (1-8)" 
                  value={formData.semester} 
                  onChange={handleChange} 
                  required 
                  min="1" 
                  max="8"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                />
                <input 
                  name="rollNumber" 
                  placeholder="Roll Number" 
                  value={formData.rollNumber} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>
          </form>
          
          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-500 text-sm">Already registered?</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
            >
              Sign in to your account
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;