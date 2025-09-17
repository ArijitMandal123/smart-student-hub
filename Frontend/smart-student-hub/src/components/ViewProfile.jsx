import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ViewProfile = ({ studentData }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [fullStudentData, setFullStudentData] = useState(studentData);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchFullStudentData();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/api/profile/${studentData.studentId}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchFullStudentData = async () => {
    try {
      const response = await api.get(`/api/students/${studentData.studentId}`);
      console.log("Full student data from DB:", response.data);
      console.log("Skills data:", response.data.skills);
      setFullStudentData(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Profile</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate("/profile")}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg border-4 border-white"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
                {fullStudentData?.name?.charAt(0) || "S"}
              </div>
            )}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {fullStudentData.name}
            </h2>
            <p className="text-gray-600 text-lg">{fullStudentData.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">Student ID</h3>
              <p className="text-indigo-600 font-medium">
                {fullStudentData.studentId}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">College</h3>
              <p className="text-emerald-600 font-medium">
                {fullStudentData.college}
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">Department</h3>
              <p className="text-purple-600 font-medium">
                {fullStudentData.department}
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">
                Year & Semester
              </h3>
              <p className="text-orange-600 font-medium">
                Year {fullStudentData.year}, Semester {fullStudentData.semester}
              </p>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">Roll Number</h3>
              <p className="text-cyan-600 font-medium">
                {fullStudentData.rollNumber}
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">
                Aadhar Number
              </h3>
              <p className="text-yellow-600 font-medium">
                {profile.aadharNumber || "Not provided"}
              </p>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">
                Mobile Number
              </h3>
              <p className="text-pink-600 font-medium">
                {profile.mobileNumber || "Not provided"}
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">
                College Email
              </h3>
              <p className="text-indigo-600 font-medium">
                {profile.collegeEmail || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Educational Certificates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {profile.class10Certificate && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    10th Certificate
                  </h4>
                  <img
                    src={profile.class10Certificate}
                    alt="10th Certificate"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      setSelectedImage({
                        src: profile.class10Certificate,
                        title: "10th Certificate",
                      })
                    }
                  />
                </div>
              )}

              {profile.class12Certificate && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    12th Certificate
                  </h4>
                  <img
                    src={profile.class12Certificate}
                    alt="12th Certificate"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      setSelectedImage({
                        src: profile.class12Certificate,
                        title: "12th Certificate",
                      })
                    }
                  />
                </div>
              )}

              {profile.diplomaCertificate && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Diploma Certificate
                  </h4>
                  <img
                    src={profile.diplomaCertificate}
                    alt="Diploma Certificate"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      setSelectedImage({
                        src: profile.diplomaCertificate,
                        title: "Diploma Certificate",
                      })
                    }
                  />
                </div>
              )}

              {profile.bachelorDegree && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Bachelor Degree
                  </h4>
                  <img
                    src={profile.bachelorDegree}
                    alt="Bachelor Degree"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      setSelectedImage({
                        src: profile.bachelorDegree,
                        title: "Bachelor Degree",
                      })
                    }
                  />
                </div>
              )}

              {profile.masterDegree && (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Master Degree
                  </h4>
                  <img
                    src={profile.masterDegree}
                    alt="Master Degree"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      setSelectedImage({
                        src: profile.masterDegree,
                        title: "Master Degree",
                      })
                    }
                  />
                </div>
              )}

              {profile.doctorDegree && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Doctor Degree
                  </h4>
                  <img
                    src={profile.doctorDegree}
                    alt="Doctor Degree"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      setSelectedImage({
                        src: profile.doctorDegree,
                        title: "Doctor Degree",
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Academic Records
            </h3>
            <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl shadow-lg border border-orange-100 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Academic Performance</h4>
                  <p className="text-orange-600 font-medium">CGPA: {fullStudentData.cgpa || 'N/A'}</p>
                </div>
              </div>
              {fullStudentData.semesterMarks?.length > 0 ? (
                <div className="grid gap-4">
                  {fullStudentData.semesterMarks.map((record, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center">
                        <h5 className="text-lg font-bold text-gray-800">
                          Sem {record.semester} - Year {record.year}
                        </h5>
                        <span className="bg-orange-100 text-orange-800 px-3 py-2 rounded-full font-bold">
                          SGPA: {record.sgpa}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg font-semibold text-gray-600 mb-2">No academic records found</p>
                  <p className="text-gray-500">Your semester marks will appear here once added by your teacher.</p>
                </div>
              )}
            </div>
          </div> */}

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Academic Records
            </h3>
            <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl shadow-lg border border-orange-100 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    Academic Performance
                  </h4>
                  <p className="text-orange-600 font-medium">
                    CGPA: {fullStudentData.cgpa || "N/A"}
                  </p>
                </div>
              </div>
              {fullStudentData.semesterMarks?.length > 0 ? (
                <div className="grid gap-4">
                  {fullStudentData.semesterMarks.map((record, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="text-lg font-bold text-gray-800">
                          Sem {record.semester} - Year {record.year}
                        </h5>
                        <span className="bg-orange-100 text-orange-800 px-3 py-2 rounded-full font-bold">
                          SGPA: {record.sgpa}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg font-semibold text-gray-600 mb-2">
                    No academic records found
                  </p>
                  <p className="text-gray-500">
                    Your semester marks will appear here once added by your
                    teacher.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Skills & Certifications
            </h3>
            <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow-lg border border-green-100 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">Verified Skills</h4>
                  <p className="text-green-600 font-medium">Skills earned through certified achievements</p>
                </div>
              </div>
              {fullStudentData.skills && typeof fullStudentData.skills === 'object' && Object.keys(fullStudentData.skills).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(fullStudentData.skills).map(([skill, count]) => (
                    <div key={skill} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-800 font-medium text-sm">{skill}</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No verified skills yet</h3>
                  <p className="text-gray-500">Complete skill-based certificates to showcase your expertise here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Social Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-700 mb-2">LinkedIn</h4>
                {profile.linkedinProfile ? (
                  <a
                    href={profile.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    View LinkedIn Profile
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-700 mb-2">GitHub</h4>
                {profile.githubProfile ? (
                  <a
                    href={profile.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                  >
                    View GitHub Profile
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 backdrop-blur-lg bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30 flex items-center justify-center z-50 animate-fadeIn"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-4xl w-full mx-4 p-6 animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedImage.title}
                </h2>
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

export default ViewProfile;
