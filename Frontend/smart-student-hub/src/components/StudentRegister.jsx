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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Student Registration</h2>
      {message && <div className="mb-4 p-2 bg-blue-100 rounded">{message}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          name="name" 
          placeholder="Full Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className="w-full p-2 border rounded" 
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          className="w-full p-2 border rounded" 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          minLength="6"
          className="w-full p-2 border rounded" 
        />
        <input 
          name="confirmPassword" 
          type="password" 
          placeholder="Confirm Password" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
          required 
          className="w-full p-2 border rounded" 
        />
        <select 
          onChange={handleCollegeChange}
          required 
          className="w-full p-2 border rounded"
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college._id} value={college._id}>{college.name}</option>
          ))}
        </select>
        <select 
          name="department" 
          value={formData.department} 
          onChange={handleChange} 
          required 
          className="w-full p-2 border rounded"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
        <input 
          name="year" 
          type="number" 
          placeholder="Year (1-4)" 
          value={formData.year} 
          onChange={handleChange} 
          required 
          min="1" 
          max="4"
          className="w-full p-2 border rounded" 
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
          className="w-full p-2 border rounded" 
        />
        <input 
          name="rollNumber" 
          placeholder="Roll Number" 
          value={formData.rollNumber} 
          onChange={handleChange} 
          required 
          className="w-full p-2 border rounded" 
        />
        
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Already have an account? Login here
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default StudentRegister;