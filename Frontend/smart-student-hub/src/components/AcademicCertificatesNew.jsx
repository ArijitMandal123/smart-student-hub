import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AcademicCertificatesNew = ({ studentData }) => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    domain: '',
    certificateName: '',
    image: null,
    certificateUrl: '',
    date: '',
    issuedBy: '',
    description: '',
    skills: [],
    duration: '',
    location: '',
    organizationType: ''
  });
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const availableSkills = [
    'Java', 'Python', 'C', 'C++', 'C#', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Swift',
    'Kotlin', 'PHP', 'Ruby', 'Scala', 'R', 'MATLAB', 'SQL', 'NoSQL', 'MongoDB', 'MySQL',
    'PostgreSQL', 'Oracle', 'Redis', 'Node.js', 'React', 'Angular', 'Vue.js', 'Express.js',
    'Spring Boot', 'Django', 'Flask', 'Laravel', 'ASP.NET', 'Ruby on Rails', 'HTML', 'CSS',
    'Bootstrap', 'Tailwind CSS', 'SASS', 'LESS', 'jQuery', 'Git', 'GitHub', 'GitLab',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Firebase', 'Heroku', 'Netlify',
    'Linux', 'Ubuntu', 'Windows Server', 'MacOS', 'Bash', 'PowerShell', 'Vim', 'VS Code',
    'IntelliJ IDEA', 'Eclipse', 'Xcode', 'Android Studio', 'Unity', 'Unreal Engine',
    'Blender', 'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'AutoCAD', 'SolidWorks',
    'CATIA', 'Fusion 360', 'SketchUp', 'Revit', 'ArchiCAD', 'ANSYS', 'MATLAB Simulink',
    'LabVIEW', 'PLC Programming', 'SCADA', 'Embedded Systems', 'Arduino', 'Raspberry Pi',
    'IoT', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras',
    'Scikit-learn', 'OpenCV', 'Natural Language Processing', 'Computer Vision', 'Data Science',
    'Data Analysis', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Tableau', 'Power BI',
    'Excel', 'Google Analytics', 'SEO', 'Digital Marketing', 'Content Writing', 'Copywriting',
    'Project Management', 'Agile', 'Scrum', 'Kanban', 'JIRA', 'Trello', 'Slack', 'Microsoft Teams',
    'Communication Skills', 'Leadership', 'Team Management', 'Problem Solving', 'Critical Thinking',
    'Time Management', 'Presentation Skills', 'Public Speaking', 'Negotiation', 'Sales'
  ];

  const domainFields = {
    internship: ['certificateName', 'image', 'certificateUrl', 'date', 'issuedBy', 'description', 'duration', 'location'],
    skill: ['certificateName', 'image', 'certificateUrl', 'date', 'issuedBy', 'skills'],
    event: ['certificateName', 'image', 'certificateUrl', 'date', 'issuedBy', 'description', 'location'],
    workshop: ['certificateName', 'image', 'certificateUrl', 'date', 'issuedBy', 'description', 'duration', 'organizationType']
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.skills-dropdown')) {
        setShowSkillDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await api.get(`/api/academic-certificates/${studentData.studentId}`);
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          if (key === 'skills') {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });
      formDataToSend.append('studentId', studentData.studentId);
      formDataToSend.append('status', 'pending');

      const response = await api.post('/api/academic-certificates', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Certificate submitted successfully for faculty review!');
      setShowAddForm(false);
      setFormData({
        domain: '',
        certificateName: '',
        image: null,
        certificateUrl: '',
        date: '',
        issuedBy: '',
        description: '',
        skills: [],
        duration: '',
        location: '',
        organizationType: ''
      });
      setSkillSearch('');
      setShowSkillDropdown(false);
      fetchCertificates();
    } catch (error) {
      console.error('Error adding certificate:', error);
      alert('Error submitting certificate: ' + (error.response?.data?.error || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleDeleteCertificate = async (certificateId) => {
    try {
      await api.delete(`/api/academic-certificates/${studentData.studentId}/${certificateId}`);
      alert('Certificate deleted successfully!');
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Error deleting certificate: ' + (error.response?.data?.error || error.message));
    }
  };

  const renderFormField = (field) => {
    switch (field) {
      case 'certificateName':
        return (
          <input
            type="text"
            placeholder="Certificate Name"
            value={formData.certificateName}
            onChange={(e) => setFormData({...formData, certificateName: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          />
        );
      case 'image':
        return (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          />
        );
      case 'certificateUrl':
        return (
          <input
            type="url"
            placeholder="Certificate URL"
            value={formData.certificateUrl}
            onChange={(e) => setFormData({...formData, certificateUrl: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          />
        );
      case 'issuedBy':
        return (
          <input
            type="text"
            placeholder="Issued By"
            value={formData.issuedBy}
            onChange={(e) => setFormData({...formData, issuedBy: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          />
        );
      case 'description':
        return (
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows="3"
          />
        );
      case 'skills':
        const filteredSkills = availableSkills.filter(skill => 
          skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
          !formData.skills.includes(skill)
        );
        
        return (
          <div className="relative skills-dropdown">
            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-h-[48px] flex flex-wrap gap-2 items-center">
              {formData.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = formData.skills.filter((_, i) => i !== index);
                      setFormData({...formData, skills: newSkills});
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={formData.skills.length === 0 ? "Search and select skills..." : "Add more skills..."}
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                onFocus={() => setShowSkillDropdown(true)}
                className="flex-1 min-w-[200px] outline-none bg-transparent"
              />
            </div>
            
            {showSkillDropdown && skillSearch && filteredSkills.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10 mt-1">
                {filteredSkills.slice(0, 10).map((skill, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData({...formData, skills: [...formData.skills, skill]});
                      setSkillSearch('');
                      setShowSkillDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 'duration':
        return (
          <input
            type="text"
            placeholder="Duration"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        );
      case 'location':
        return (
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        );
      case 'organizationType':
        return (
          <select
            value={formData.organizationType}
            onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Select Organization Type</option>
            <option value="corporate">Corporate</option>
            <option value="educational">Educational Institution</option>
            <option value="government">Government</option>
            <option value="ngo">NGO</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <nav className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Academic Certificates</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              My Academic Certificates
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Add Certificate
            </button>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by certificate name, domain, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.filter(cert => 
              cert.certificateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cert.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (cert.skills && cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
            ).map((cert) => (
              <div 
                key={cert._id} 
                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                onClick={() => setSelectedCertificate(cert)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cert.status)}`}>
                    {cert.status}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-xs font-medium">
                    {cert.domain}
                  </span>
                </div>
                
                {cert.image && (
                  <img 
                    src={cert.image} 
                    alt={cert.certificateName}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">{cert.certificateName}</h3>
                <p className="text-sm text-gray-600 mb-2">Issued by: {cert.issuedBy}</p>
                <p className="text-sm text-gray-600 mb-2">Date: {new Date(cert.date).toLocaleDateString()}</p>
                
                {cert.feedback && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Faculty Feedback:</p>
                    <p className="text-sm text-gray-600">{cert.feedback}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this certificate?')) {
                        handleDeleteCertificate(cert._id);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {certificates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 713.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 713.138-3.138z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No certificates added yet</h3>
              <p className="text-gray-500">Add your first academic certificate to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Details Popup */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex">
              {/* Left side - Certificate details */}
              <div className="w-1/2 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedCertificate.certificateName}</h3>
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Category:</span>
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {selectedCertificate.domain}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Issued by:</span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {selectedCertificate.issuedBy}
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Date:</span>
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {new Date(selectedCertificate.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCertificate.status)}`}>
                        {selectedCertificate.status}
                      </span>
                    </div>
                  </div>

                  {selectedCertificate.description && (
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <span className="text-gray-700 font-medium block mb-2">Description:</span>
                      <p className="text-gray-600 text-sm">{selectedCertificate.description}</p>
                    </div>
                  )}

                  {selectedCertificate.feedback && (
                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <span className="text-gray-700 font-medium block mb-2">Faculty Feedback:</span>
                      <p className="text-gray-600 text-sm">{selectedCertificate.feedback}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  {selectedCertificate.certificateUrl ? (
                    <a
                      href={selectedCertificate.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      Download Certificate
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 font-semibold py-4 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      Certificate URL Not Available
                    </button>
                  )}
                </div>
              </div>

              {/* Right side - Certificate image */}
              <div className="w-1/2 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-8">
                {selectedCertificate.image ? (
                  <img 
                    src={selectedCertificate.image} 
                    alt={selectedCertificate.certificateName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 713.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 713.138-3.138z"/>
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No certificate image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Certificate Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Add Academic Certificate</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Domain</label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Domain</option>
                  <option value="internship">Internship</option>
                  <option value="skill">Skill Development</option>
                  <option value="event">Event Participation</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              {formData.domain && domainFields[formData.domain]?.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {renderFormField(field)}
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Submit for Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicCertificatesNew;