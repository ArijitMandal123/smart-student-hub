import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const StudentProfile = ({ studentData }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    profileImage: null,
    aadharNumber: '',
    mobileNumber: '',
    collegeEmail: '',
    class10Certificate: null,
    class12Certificate: null,
    diplomaCertificate: null,
    bachelorDegree: null,
    masterDegree: null,
    doctorDegree: null,
    linkedinProfile: '',
    githubProfile: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for student:', studentData.studentId);
      const response = await api.get(`/api/profile/${studentData.studentId}`);
      console.log('Profile data received:', response.data);
      setProfile(response.data);
      setFormData({ ...formData, ...response.data });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        console.log('Profile not found, will create new one on first save');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Student Data:', studentData);
      console.log('API Base URL:', api.defaults.baseURL);
      console.log('Profile URL:', `/api/profile/${studentData.studentId}`);
      
      // Test backend connection first
      await api.get('/api/test');
      console.log('Backend connection successful');
      
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      console.log('Making request to:', `${api.defaults.baseURL}/api/profile/${studentData.studentId}`);
      const response = await api.put(`/api/profile/${studentData.studentId}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('Profile update response:', response.data);
      fetchProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 404) {
        alert('Backend server not running or endpoint not found. Please start the backend server.');
      } else {
        alert('Error updating profile: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Update Profile</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">Update Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter Aadhar Number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter Mobile Number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College Email</label>
                <input
                  type="email"
                  name="collegeEmail"
                  value={formData.collegeEmail}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter College Email"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Educational Certificates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">10th Certificate</label>
                  {profile.class10Certificate ? (
                    <div className="space-y-2">
                      <img 
                        src={profile.class10Certificate} 
                        alt="10th Certificate" 
                        className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => setSelectedImage({src: profile.class10Certificate, title: '10th Certificate'})}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('class10Certificate').click()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                      >
                        Replace Certificate
                      </button>
                      <input
                        id="class10Certificate"
                        type="file"
                        name="class10Certificate"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="class10Certificate"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">12th Certificate</label>
                  {profile.class12Certificate ? (
                    <div className="space-y-2">
                      <img 
                        src={profile.class12Certificate} 
                        alt="12th Certificate" 
                        className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => setSelectedImage({src: profile.class12Certificate, title: '12th Certificate'})}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('class12Certificate').click()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                      >
                        Replace Certificate
                      </button>
                      <input
                        id="class12Certificate"
                        type="file"
                        name="class12Certificate"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="class12Certificate"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diploma Certificate</label>
                  {profile.diplomaCertificate ? (
                    <div className="space-y-2">
                      <img 
                        src={profile.diplomaCertificate} 
                        alt="Diploma Certificate" 
                        className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => setSelectedImage({src: profile.diplomaCertificate, title: 'Diploma Certificate'})}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('diplomaCertificate').click()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                      >
                        Replace Certificate
                      </button>
                      <input
                        id="diplomaCertificate"
                        type="file"
                        name="diplomaCertificate"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="diplomaCertificate"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bachelor Degree</label>
                  {profile.bachelorDegree ? (
                    <div className="space-y-2">
                      <img 
                        src={profile.bachelorDegree} 
                        alt="Bachelor Degree" 
                        className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => setSelectedImage({src: profile.bachelorDegree, title: 'Bachelor Degree'})}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('bachelorDegree').click()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                      >
                        Replace Certificate
                      </button>
                      <input
                        id="bachelorDegree"
                        type="file"
                        name="bachelorDegree"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="bachelorDegree"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Master Degree</label>
                  {profile.masterDegree ? (
                    <div className="space-y-2">
                      <img 
                        src={profile.masterDegree} 
                        alt="Master Degree" 
                        className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => setSelectedImage({src: profile.masterDegree, title: 'Master Degree'})}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('masterDegree').click()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                      >
                        Replace Certificate
                      </button>
                      <input
                        id="masterDegree"
                        type="file"
                        name="masterDegree"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="masterDegree"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Degree</label>
                  {profile.doctorDegree ? (
                    <div className="space-y-2">
                      <img 
                        src={profile.doctorDegree} 
                        alt="Doctor Degree" 
                        className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => setSelectedImage({src: profile.doctorDegree, title: 'Doctor Degree'})}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('doctorDegree').click()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                      >
                        Replace Certificate
                      </button>
                      <input
                        id="doctorDegree"
                        type="file"
                        name="doctorDegree"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      name="doctorDegree"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Social Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                  <input
                    type="url"
                    name="githubProfile"
                    value={formData.githubProfile}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-medium text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Update Profile
            </button>
          </form>
        </div>

        {selectedImage && (
          <div className="fixed inset-0 backdrop-blur-lg bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30 flex items-center justify-center z-50 animate-fadeIn" onClick={() => setSelectedImage(null)}>
            <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-4xl w-full mx-4 p-6 animate-slideUp" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{selectedImage.title}</h2>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full max-h-96 object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;