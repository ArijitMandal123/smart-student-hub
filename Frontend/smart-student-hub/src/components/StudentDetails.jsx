import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/api/students/${studentId}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          </div>
        </div>
      </div>

      {/* Student Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {student.profile?.profileImage ? (
                  <img 
                    src={student.profile.profileImage} 
                    alt={student.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-indigo-600 font-bold text-2xl">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{student.name}</h2>
                <p className="text-indigo-100">Student ID: {student.studentId}</p>
                <p className="text-indigo-100">Roll Number: {student.rollNumber}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Academic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">College:</span> {student.college}</p>
                  <p><span className="font-medium">Department:</span> {student.department}</p>
                  <p><span className="font-medium">Year:</span> {student.year}</p>
                  <p><span className="font-medium">Semester:</span> {student.semester}</p>
                  <p><span className="font-medium">CGPA:</span> {student.cgpa || 'N/A'}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Email:</span> {student.email}</p>
                  <p><span className="font-medium">Mobile:</span> {student.profile?.mobileNumber || 'N/A'}</p>
                  <p><span className="font-medium">College Email:</span> {student.profile?.collegeEmail || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{student.personalCertificates?.length || 0}</div>
                <div className="text-sm text-blue-800">Personal Certificates</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{student.academicCertificates?.filter(cert => cert.status !== 'rejected').length || 0}</div>
                <div className="text-sm text-green-800">Academic Certificates</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{student.projects?.length || 0}</div>
                <div className="text-sm text-purple-800">Projects</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{Object.keys(student.skills || {}).length}</div>
                <div className="text-sm text-orange-800">Skills</div>
              </div>
            </div>

            {/* Skills */}
            {student.skills && Object.keys(student.skills).length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(student.skills).map(([skill, count]) => (
                    <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {skill} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Certificates */}
            {student.personalCertificates && student.personalCertificates.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-blue-500 rounded mr-3"></span>
                  Personal Certificates
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {student.personalCertificates.map((cert, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1" 
                         onClick={() => { setSelectedCertificate({...cert, type: 'personal'}); setShowModal(true); }}>
                      <div className="relative overflow-hidden rounded-t-xl">
                        {cert.image ? (
                          <img src={cert.image} alt={cert.name} className="w-full h-48 object-cover" />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">{cert.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">Personal</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-2 truncate">{cert.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">By: {cert.issuer}</p>
                        <p className="text-xs text-gray-500">{new Date(cert.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Academic Certificates */}
            {student.academicCertificates && student.academicCertificates.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-green-500 rounded mr-3"></span>
                  Academic Certificates
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {student.academicCertificates.filter(cert => cert.status !== 'rejected').map((cert, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1" 
                         onClick={() => { setSelectedCertificate({...cert, type: 'academic'}); setShowModal(true); }}>
                      <div className="relative overflow-hidden rounded-t-xl">
                        {cert.image ? (
                          <img src={cert.image} alt={cert.certificateName} className="w-full h-48 object-cover" />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">{cert.certificateName.charAt(0)}</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cert.status === 'approved' ? 'bg-green-500 text-white' :
                            'bg-yellow-500 text-white'
                          }`}>
                            {cert.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-2 truncate">{cert.certificateName}</h4>
                        <p className="text-sm text-gray-600 mb-1">By: {cert.issuedBy}</p>
                        <p className="text-xs text-gray-500">{new Date(cert.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {student.projects && student.projects.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {student.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex space-x-2">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" 
                             className="inline-flex items-center px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700">
                            GitHub
                          </a>
                        )}
                        {project.deployLink && (
                          <a href={project.deployLink} target="_blank" rel="noopener noreferrer" 
                             className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                            Live Demo
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showModal && selectedCertificate && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-full">
              {/* Left Panel - Details */}
              <div className="w-1/2 p-8 overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-3xl font-bold text-indigo-600">
                    {selectedCertificate.name || selectedCertificate.certificateName}
                  </h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Category:</h3>
                    <p className="text-lg font-semibold text-indigo-600">
                      {selectedCertificate.category || selectedCertificate.domain || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Issued by:</h3>
                    <p className="text-lg font-semibold text-green-600">
                      {selectedCertificate.issuer || selectedCertificate.issuedBy}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Date:</h3>
                    <p className="text-lg font-semibold text-purple-600">
                      {new Date(selectedCertificate.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {selectedCertificate.duration && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Duration:</h3>
                      <p className="text-lg font-semibold text-blue-600">{selectedCertificate.duration}</p>
                    </div>
                  )}
                  
                  {selectedCertificate.location && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Location:</h3>
                      <p className="text-lg font-semibold text-orange-600">{selectedCertificate.location}</p>
                    </div>
                  )}
                  
                  {selectedCertificate.organizationType && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Organization Type:</h3>
                      <p className="text-lg font-semibold text-teal-600">{selectedCertificate.organizationType}</p>
                    </div>
                  )}
                  
                  {selectedCertificate.description && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Description:</h3>
                      <p className="text-gray-700">{selectedCertificate.description}</p>
                    </div>
                  )}
                  
                  {selectedCertificate.skills && selectedCertificate.skills.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Skills:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCertificate.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedCertificate.feedback && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Feedback:</h3>
                      <p className="text-gray-700">{selectedCertificate.feedback}</p>
                    </div>
                  )}
                  
                  {(selectedCertificate.url || selectedCertificate.certificateUrl) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Certificate URL:</h3>
                      <a href={selectedCertificate.url || selectedCertificate.certificateUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800 underline break-all">
                        {selectedCertificate.url || selectedCertificate.certificateUrl}
                      </a>
                    </div>
                  )}
                </div>
                
                {(selectedCertificate.url || selectedCertificate.certificateUrl) && (
                  <a href={selectedCertificate.url || selectedCertificate.certificateUrl} target="_blank" rel="noopener noreferrer" 
                     className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>View Certificate</span>
                  </a>
                )}
              </div>
              
              {/* Right Panel - Certificate Image */}
              <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                {selectedCertificate.image ? (
                  <img 
                    src={selectedCertificate.image} 
                    alt={selectedCertificate.name || selectedCertificate.certificateName}
                    className="max-w-full max-h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                    </svg>
                    <p>No certificate image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;