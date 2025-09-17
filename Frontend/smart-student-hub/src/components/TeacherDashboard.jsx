import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const TeacherDashboard = ({ teacherData, onLogout }) => {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState("Connecting...");
  const [showNotification, setShowNotification] = useState(false);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("students");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMarksForm, setShowMarksForm] = useState(false);
  const [marksForm, setMarksForm] = useState({
    semester: "",
    year: "",
    sgpa: "",
    subjects: [{ name: "", marks: "", grade: "" }],
  });
  const [showBulkMarks, setShowBulkMarks] = useState(false);
  const [bulkMarksData, setBulkMarksData] = useState({
    semester: "",
    year: "",
    students: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMark, setEditingMark] = useState(null);
  const [editForm, setEditForm] = useState({
    semester: "",
    year: "",
    sgpa: "",
  });
  const [pendingCertificates, setPendingCertificates] = useState([]);
  const [reviewingCert, setReviewingCert] = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: '', feedback: '' });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/test");
        setBackendStatus(response.data.message);

        const groupsRes = await api.get(
          `/api/teacher/groups/${teacherData.teacherId}`
        );
        setGroups(groupsRes.data);

        const studentsRes = await api.get("/api/admin/students");
        const allStudents = studentsRes.data;

        const teacherStudents = [];
        for (const group of groupsRes.data) {
          for (const studentId of group.students) {
            const student = allStudents.find((s) => s.studentId === studentId);
            if (student) {
              // Fetch complete student data including marks
              try {
                const [certsRes, projectsRes, studentRes] = await Promise.all([
                  api.get(`/api/certificates/${studentId}`),
                  api.get(`/api/projects/${studentId}`),
                  api.get(`/api/students/${studentId}`),
                ]);
                const completeStudent = studentRes.data;
                completeStudent.personalCertificates = certsRes.data;
                completeStudent.projects = projectsRes.data;

                // Ensure marks data is properly set
                if (!completeStudent.semesterMarks) {
                  completeStudent.semesterMarks = [];
                }
                if (!completeStudent.cgpa) {
                  completeStudent.cgpa = 0;
                }

                console.log(
                  `Student ${studentId} marks:`,
                  completeStudent.semesterMarks?.length || 0,
                  "CGPA:",
                  completeStudent.cgpa
                );
                teacherStudents.push({
                  ...completeStudent,
                  groupName: group.name,
                });
              } catch (error) {
                console.error("Error fetching student data:", error);
                student.personalCertificates = [];
                student.projects = [];
                student.semesterMarks = [];
                student.cgpa = 0;
                teacherStudents.push({ ...student, groupName: group.name });
              }
            }
          }
        }

        setStudents(teacherStudents);
        
        // Fetch pending academic certificates
        const certsRes = await api.get('/api/teacher/academic-certificates/pending');
        setPendingCertificates(certsRes.data);
      } catch (error) {
        setBackendStatus("Backend connection failed");
      }
    };
    fetchData();
  }, [teacherData]);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <nav className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
            Teacher Dashboard
          </h1>
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
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {teacherData?.name?.charAt(0) || "T"}
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  Welcome, {teacherData?.name || "Teacher"}!
                </h2>
                <p className="text-gray-600 text-lg">
                  Teacher ID: {teacherData?.teacherId}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('profile')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              My Groups
            </h3>
            <p className="text-gray-600">Assigned student groups</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {groups.length}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Total Students
            </h3>
            <p className="text-gray-600">Students under supervision</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {students.length}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Reports
            </h3>
            <p className="text-gray-600">Generate reports</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Settings
            </h3>
            <p className="text-gray-600">Manage preferences</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex gap-4 mb-6 flex-wrap">


              <button
                onClick={() => setActiveTab("groups")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "groups"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                My Groups
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "students"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Student Management
              </button>
              <button
                onClick={() => setActiveTab("marks")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "marks"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Student Marks
              </button>
              <button
                onClick={() => setActiveTab("certificates")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "certificates"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Certificate Review
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === "profile"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Profile
              </button>
            </div>



            {activeTab === "groups" && (
              <div>
                <h3 className="text-xl font-bold mb-4">My Groups</h3>
                {groups.length === 0 ? (
                  <p className="text-gray-600">No groups assigned yet.</p>
                ) : (
                  <div className="space-y-4">
                    {groups.map((group) => (
                      <div
                        key={group._id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{group.name}</h4>
                            <p className="text-gray-600">
                              Students: {group.students.length}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedGroup(group);
                              setShowMessageForm(true);
                            }}
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <span>Send Message</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "students" && (
              <div>
                {viewMode === "list" ? (
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Student Management
                    </h3>
                    {students.length === 0 ? (
                      <p className="text-gray-600">No students assigned yet.</p>
                    ) : (
                      <div className="grid gap-6">
                        {students.map((student) => (
                          <div
                            key={student.studentId}
                            className="bg-gray-50 p-6 rounded-lg border"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-800">
                                  {student.name}
                                </h4>
                                <p className="text-gray-600">
                                  ID: {student.studentId}
                                </p>
                              </div>
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                {student.groupName}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Email
                                </label>
                                <p className="text-gray-900">{student.email}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Department
                                </label>
                                <p className="text-gray-900">
                                  {student.department}
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  College
                                </label>
                                <p className="text-gray-900">
                                  {student.college}
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Year
                                </label>
                                <p className="text-gray-900">
                                  {student.year || "N/A"}
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Semester
                                </label>
                                <p className="text-gray-900">
                                  {student.semester || "N/A"}
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Roll Number
                                </label>
                                <p className="text-gray-900">
                                  {student.rollNumber || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Certificates
                                </label>
                                <p className="text-gray-900">
                                  {student.personalCertificates?.length || 0}{" "}
                                  certificates
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Projects
                                </label>
                                <p className="text-gray-900">
                                  {student.projects?.length || 0} projects
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  CGPA
                                </label>
                                <p className="text-gray-900 font-semibold text-green-600">
                                  {student.cgpa || "N/A"}
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Semester Records
                                </label>
                                <p className="text-gray-900">
                                  {student.semesterMarks?.length || 0} semesters
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex gap-2 flex-wrap">
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setViewMode("profile");
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setViewMode("certificates");
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                              >
                                View Certificates
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setViewMode("projects");
                                }}
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
                              >
                                View Projects
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setViewMode("marks");
                                }}
                                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
                              >
                                View Marks
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-4">
                      <button
                        onClick={() => setViewMode("list")}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm mr-4"
                      >
                        ← Back to List
                      </button>
                      <h3 className="text-xl font-bold">
                        {viewMode === "profile"
                          ? "Student Profile"
                          : viewMode === "certificates"
                          ? "Student Certificates"
                          : viewMode === "projects"
                          ? "Student Projects"
                          : viewMode === "editMarks"
                          ? "Edit Student Marks"
                          : "Student Marks"}
                      </h3>
                      {viewMode === "editMarks" && (
                        <span className="text-sm text-blue-600 font-medium">
                          Editing marks for {selectedStudent?.name}
                        </span>
                      )}
                    </div>

                    {viewMode === "profile" && selectedStudent && (
                      <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl shadow-xl border border-green-100">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                            {selectedStudent.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-gray-800">
                              {selectedStudent.name}
                            </h4>
                            <p className="text-green-600 font-medium">
                              {selectedStudent.groupName}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg
                                  className="w-4 h-4 text-blue-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-500">
                                Student ID
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                              {selectedStudent.studentId}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                <svg
                                  className="w-4 h-4 text-purple-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-500">
                                Email
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                              {selectedStudent.email}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg
                                  className="w-4 h-4 text-green-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-500">
                                Department
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                              {selectedStudent.department}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                                <svg
                                  className="w-4 h-4 text-yellow-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-500">
                                College
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                              {selectedStudent.college}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                <svg
                                  className="w-4 h-4 text-red-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-500">
                                Year & Semester
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                              Year {selectedStudent.year || "N/A"}, Sem{" "}
                              {selectedStudent.semester || "N/A"}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                <svg
                                  className="w-4 h-4 text-indigo-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-500">
                                Roll Number
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                              {selectedStudent.rollNumber || "N/A"}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                                <svg
                                  className="w-4 h-4 text-emerald-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-500">
                                Verified Skills
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                              {selectedStudent.skills ? Object.keys(selectedStudent.skills).length : 0} Skills
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <h5 className="text-xl font-bold text-gray-800 mb-4">Verified Skills</h5>
                          {selectedStudent.skills && Object.keys(selectedStudent.skills).length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {Object.entries(selectedStudent.skills).map(([skill, count]) => (
                                <div key={skill} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
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
                            <div className="text-center py-6">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                              </div>
                              <p className="text-sm font-medium text-gray-600">No verified skills yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {viewMode === "certificates" && selectedStudent && (
                      <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-gray-800">
                              {selectedStudent.name}'s Certificates
                            </h4>
                            <p className="text-blue-600 font-medium">
                              {selectedStudent.personalCertificates?.length ||
                                0}{" "}
                              certificates earned
                            </p>
                          </div>
                        </div>
                        {selectedStudent.personalCertificates?.length > 0 ? (
                          <div className="grid gap-6">
                            {selectedStudent.personalCertificates.map(
                              (cert, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                                >
                                  <div className="flex gap-6">
                                    {cert.image && cert.image !== "" && (
                                      <div className="flex-shrink-0">
                                        <div className="relative group">
                                          <img
                                            src={cert.image}
                                            alt={cert.name}
                                            className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 cursor-pointer group-hover:border-blue-400 transition-all duration-300"
                                            onClick={() => {
                                              setSelectedImage(cert.image);
                                              setShowImagePopup(true);
                                            }}
                                            onError={(e) => {
                                              console.log(
                                                "Image failed to load:",
                                                cert.image
                                              );
                                              e.target.style.display = "none";
                                            }}
                                            onLoad={(e) => {
                                              console.log(
                                                "Image loaded successfully"
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <h5 className="text-xl font-bold text-gray-800 mb-3">
                                        {cert.name}
                                      </h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg
                                              className="w-4 h-4 text-green-600"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">
                                              Issuer
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                              {cert.issuer}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center">
                                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg
                                              className="w-4 h-4 text-blue-600"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">
                                              Date
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                              {cert.date}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center">
                                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg
                                              className="w-4 h-4 text-purple-600"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-500">
                                              Category
                                            </p>
                                            <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                              {cert.category}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg
                                className="w-12 h-12 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <p className="text-xl font-semibold text-gray-600 mb-2">
                              No certificates found
                            </p>
                            <p className="text-gray-500">
                              This student hasn't uploaded any certificates yet.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {viewMode === "projects" && selectedStudent && (
                      <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-xl border border-purple-100">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-gray-800">
                              {selectedStudent.name}'s Projects
                            </h4>
                            <p className="text-purple-600 font-medium">
                              {selectedStudent.projects?.length || 0} projects
                              completed
                            </p>
                          </div>
                        </div>
                        {selectedStudent.projects?.length > 0 ? (
                          <div className="grid gap-6">
                            {selectedStudent.projects.map((project, index) => (
                              <div
                                key={index}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex-1">
                                    <h5 className="text-xl font-bold text-gray-800 mb-2">
                                      {project.title}
                                    </h5>
                                    <p className="text-gray-600 leading-relaxed">
                                      {project.description}
                                    </p>
                                  </div>
                                  <div className="ml-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                      <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                  {project.githubLink && (
                                    <a
                                      href={project.githubLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                    >
                                      <svg
                                        className="w-4 h-4 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      GitHub
                                    </a>
                                  )}
                                  {project.deployLink && (
                                    <a
                                      href={project.deployLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                                    >
                                      <svg
                                        className="w-4 h-4 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                      </svg>
                                      Live Demo
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg
                                className="w-12 h-12 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <p className="text-xl font-semibold text-gray-600 mb-2">
                              No projects found
                            </p>
                            <p className="text-gray-500">
                              This student hasn't added any projects yet.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {viewMode === "marks" && selectedStudent && (
                      <div className="bg-gradient-to-br from-white to-orange-50 p-8 rounded-2xl shadow-xl border border-orange-100">
                        <div className="flex items-center mb-6">
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
                            <h4 className="text-2xl font-bold text-gray-800">
                              {selectedStudent.name}'s Academic Records
                            </h4>
                            <p className="text-orange-600 font-medium">
                              CGPA: {selectedStudent.cgpa || "N/A"}
                            </p>
                          </div>
                        </div>
                        {selectedStudent.semesterMarks?.length > 0 ? (
                          <div className="grid gap-6">
                            {selectedStudent.semesterMarks.map(
                              (record, index) => (
                                <div
                                  key={index}
                                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                                >
                                  <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-xl font-bold text-gray-800">
                                      Sem {record.semester} - Year {record.year}
                                    </h5>
                                    <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-lg font-bold">
                                      SGPA: {record.sgpa}
                                    </span>
                                  </div>
                                  {record.subjects?.length > 0 && (
                                    <div className="grid gap-3">
                                      <h6 className="font-semibold text-gray-700 mb-2">
                                        Subject Details:
                                      </h6>
                                      {record.subjects.map(
                                        (subject, subIndex) => (
                                          <div
                                            key={subIndex}
                                            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                                          >
                                            <span className="font-medium text-gray-800">
                                              {subject.name}
                                            </span>
                                            <div className="flex gap-4">
                                              <span className="text-gray-600">
                                                Marks: {subject.marks}
                                              </span>
                                              <span className="font-semibold text-blue-600">
                                                Grade: {subject.grade}
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg
                                className="w-12 h-12 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-xl font-semibold text-gray-600 mb-2">
                              No academic records found
                            </p>
                            <p className="text-gray-500">
                              This student's semester marks haven't been added
                              yet.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "marks" && (
              <div>
                {viewMode === "list" ? (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">
                        Student Marks Management
                      </h3>
                      <button
                        onClick={() => {
                          setBulkMarksData({
                            semester: "",
                            year: "",
                            students: students.map((s) => ({
                              studentId: s.studentId,
                              name: s.name,
                              rollNumber: s.rollNumber || "N/A",
                              sgpa: "",
                            })),
                          });
                          setShowBulkMarks(true);
                        }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                      >
                        Add Semester Marks
                      </button>
                    </div>

                    {students.length === 0 ? (
                      <p className="text-gray-600">No students assigned yet.</p>
                    ) : (
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h4 className="text-xl font-bold">Student List</h4>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                  className="h-5 w-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              </div>
                              <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 w-80 rounded-xl border-0 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:bg-white transition-all duration-200 shadow-lg"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {students
                            .filter(
                              (student) =>
                                student.name
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                (student.rollNumber &&
                                  student.rollNumber
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())) ||
                                student.studentId
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                            )
                            .map((student) => (
                              <div
                                key={student.studentId}
                                className="p-4 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                                      {student.name.charAt(0)}
                                    </div>
                                    <div>
                                      <h5 className="font-semibold text-gray-800">
                                        {student.name}
                                      </h5>
                                      <p className="text-sm text-gray-600">
                                        Roll: {student.rollNumber || "N/A"} |
                                        ID: {student.studentId}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                      <p className="text-sm text-gray-600">
                                        CGPA:{" "}
                                        <span className="font-semibold text-green-600">
                                          {student.cgpa || "N/A"}
                                        </span>
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Semesters:{" "}
                                        {student.semesterMarks?.length || 0}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        console.log(
                                          "Edit marks clicked for:",
                                          student.name
                                        );
                                        setSelectedStudent(student);
                                        setViewMode("editMarks");
                                      }}
                                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                    >
                                      📝 Edit Marks
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-4">
                      <button
                        onClick={() => setViewMode("list")}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm mr-4"
                      >
                        ← Back to List
                      </button>
                      <h3 className="text-xl font-bold">Edit Student Marks</h3>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                      <div className="flex items-center mb-8">
                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mr-4">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900">
                            Edit {selectedStudent?.name}'s Marks
                          </h4>
                          <p className="text-blue-600 font-medium text-lg">
                            Current CGPA: {selectedStudent?.cgpa || "N/A"}
                          </p>
                        </div>
                      </div>
                      {selectedStudent?.semesterMarks?.length > 0 ? (
                        <div className="space-y-4">
                          {selectedStudent.semesterMarks.map(
                            (record, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                      <span className="text-xl font-bold text-gray-700">
                                        {record.semester}
                                      </span>
                                    </div>
                                    <div>
                                      <h5 className="text-xl font-bold text-gray-900">
                                        Semester {record.semester} - Year{" "}
                                        {record.year}
                                      </h5>
                                      <p className="text-blue-600 font-semibold text-lg">
                                        SGPA: {record.sgpa}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setEditingMark(index);
                                      setEditForm({
                                        semester: record.semester,
                                        year: record.year,
                                        sgpa: record.sgpa,
                                      });
                                    }}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                                  >
                                    <span>✏️</span>
                                    <span>Edit SGPA</span>
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-xl font-semibold text-gray-600 mb-2">
                            No marks found
                          </p>
                          <p className="text-gray-500">
                            This student doesn't have any semester marks yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "certificates" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Academic Certificate Review</h3>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-xl">
                    <span className="text-sm font-medium text-yellow-700">{pendingCertificates.length} Pending Reviews</span>
                  </div>
                </div>
                
                {pendingCertificates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 713.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 713.138-3.138z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No pending certificates</h3>
                    <p className="text-gray-500">All academic certificates have been reviewed.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pendingCertificates.map((cert) => (
                      <div key={cert._id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{cert.certificateName}</h4>
                            <p className="text-sm text-gray-600">{cert.studentName} ({cert.studentId})</p>
                            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium capitalize">
                              {cert.domain}
                            </span>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                            Pending
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-xs">
                          <div>
                            <span className="text-gray-500">Issued By:</span>
                            <p className="font-medium text-gray-800">{cert.issuedBy}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p className="font-medium text-gray-800">{new Date(cert.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <p className="font-medium text-gray-800">{cert.duration || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <p className="font-medium text-gray-800">{cert.location || 'N/A'}</p>
                          </div>
                        </div>
                        
                        {cert.skills && cert.skills.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs text-gray-500">Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cert.skills.map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {cert.description && (
                          <div className="mb-3">
                            <span className="text-xs text-gray-500">Description:</span>
                            <p className="text-sm text-gray-800 mt-1">{cert.description}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mb-3">
                          {cert.certificateUrl && (
                            <a
                              href={cert.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                              </svg>
                              View URL
                            </a>
                          )}
                          {cert.image && (
                            <button
                              onClick={() => {
                                setSelectedImage(cert.image);
                                setShowImagePopup(true);
                              }}
                              className="inline-flex items-center bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                              </svg>
                              View Image
                            </button>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setReviewingCert(cert);
                              setReviewForm({ status: 'approved', feedback: '' });
                            }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => {
                              setReviewingCert(cert);
                              setReviewForm({ status: 'rejected', feedback: '' });
                            }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "profile" && (
              <div>
                <h3 className="text-xl font-bold mb-4">Teacher Profile</h3>
                <div className="bg-white p-6 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" defaultValue={teacherData?.name} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                      <input type="text" defaultValue={teacherData?.teacherId} className="w-full p-3 border rounded-lg" disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" defaultValue={teacherData?.email} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input type="text" defaultValue={teacherData?.department} className="w-full p-3 border rounded-lg" />
                    </div>
                  </div>
                  <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showImagePopup && selectedImage && (
        <div
          className="fixed inset-0 backdrop-blur-lg bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setShowImagePopup(false)}
        >
          <div
            className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-6xl w-full mx-4 p-8 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Certificate Image
              </h2>
              <button
                onClick={() => setShowImagePopup(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl transition-colors duration-200 hover:rotate-90 transform transition-transform"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={selectedImage}
                alt="Certificate"
                className="max-w-full max-h-96 object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {showBulkMarks && (
        <div className="fixed inset-0 backdrop-blur-lg bg-gradient-to-br from-green-100/30 via-emerald-100/20 to-teal-100/30 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-6xl w-full mx-4 my-8 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Bulk Marks Entry - Semester {bulkMarksData.semester} Year{" "}
                {bulkMarksData.year}
              </h2>
              <button
                onClick={() => setShowBulkMarks(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Semester"
                value={bulkMarksData.semester}
                onChange={(e) =>
                  setBulkMarksData({
                    ...bulkMarksData,
                    semester: e.target.value,
                  })
                }
                className="p-3 border rounded-lg font-medium"
                required
              />
              <input
                type="number"
                placeholder="Year"
                value={bulkMarksData.year}
                onChange={(e) =>
                  setBulkMarksData({ ...bulkMarksData, year: e.target.value })
                }
                className="p-3 border rounded-lg font-medium"
                required
              />
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-xl">
              <h3 className="text-lg font-semibold">Student Marks Entry</h3>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-b-xl">
              {bulkMarksData.students.map((student, studentIndex) => (
                <div
                  key={student.studentId}
                  className="border-b border-gray-200 p-4 bg-white hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {student.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Roll: {student.rollNumber}
                        </p>
                      </div>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="SGPA"
                      value={student.sgpa || ""}
                      onChange={(e) => {
                        const newStudents = [...bulkMarksData.students];
                        newStudents[studentIndex].sgpa = e.target.value;
                        setBulkMarksData({
                          ...bulkMarksData,
                          students: newStudents,
                        });
                      }}
                      className="w-24 p-2 border rounded text-center font-semibold"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={async () => {
                  try {
                    if (!bulkMarksData.semester || !bulkMarksData.year) {
                      alert("Please enter semester and year");
                      return;
                    }

                    let savedCount = 0;
                    let errors = [];

                    for (const student of bulkMarksData.students) {
                      if (student.sgpa && parseFloat(student.sgpa) > 0) {
                        const marksData = {
                          semester: parseInt(bulkMarksData.semester),
                          year: parseInt(bulkMarksData.year),
                          sgpa: parseFloat(student.sgpa),
                        };

                        try {
                          const response = await api.post(
                            `/api/teacher/marks/${student.studentId}`,
                            marksData
                          );
                          savedCount++;
                        } catch (error) {
                          errors.push(
                            `${student.name}: ${
                              error.response?.data?.error || error.message
                            }`
                          );
                        }
                      }
                    }

                    if (savedCount > 0) {
                      alert(
                        `Marks saved successfully for ${savedCount} students!`
                      );
                      setShowBulkMarks(false);
                      window.location.reload();
                    } else {
                      alert("No marks were saved. Please check SGPA values.");
                    }

                    if (errors.length > 0) {
                      console.error("Errors:", errors);
                    }
                  } catch (error) {
                    alert("Error saving marks: " + error.message);
                  }
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-medium flex-1 hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
              >
                Save All Marks
              </button>
              <button
                onClick={() => setShowBulkMarks(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingMark !== null && (
        <div className="fixed inset-0 backdrop-blur-lg bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit SGPA</h3>
              <button
                onClick={() => setEditingMark(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <input
                  type="number"
                  value={editForm.semester}
                  onChange={(e) =>
                    setEditForm({ ...editForm, semester: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={editForm.year}
                  onChange={(e) =>
                    setEditForm({ ...editForm, year: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.sgpa}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sgpa: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={async () => {
                  try {
                    const response = await api.put(
                      `/api/teacher/marks/${selectedStudent.studentId}`,
                      {
                        semester: parseInt(editForm.semester),
                        year: parseInt(editForm.year),
                        sgpa: parseFloat(editForm.sgpa),
                      }
                    );
                    alert("SGPA updated successfully!");
                    setEditingMark(null);
                    window.location.reload();
                  } catch (error) {
                    alert(
                      "Error updating SGPA: " +
                        (error.response?.data?.error || error.message)
                    );
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex-1 hover:bg-blue-700"
              >
                Update SGPA
              </button>
              <button
                onClick={() => setEditingMark(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {reviewingCert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {reviewForm.status === 'approved' ? 'Approve' : 'Reject'} Certificate
                </h3>
                <button
                  onClick={() => setReviewingCert(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">{reviewingCert.certificateName}</h4>
                <p className="text-sm text-gray-600">Student: {reviewingCert.studentName}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {reviewForm.status === 'approved' ? 'Approval Comments (Optional)' : 'Rejection Reason'}
                </label>
                <textarea
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm({...reviewForm, feedback: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder={reviewForm.status === 'approved' ? 'Add any comments...' : 'Please provide reason for rejection...'}
                  required={reviewForm.status === 'rejected'}
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={async () => {
                    try {
                      if (reviewForm.status === 'rejected' && !reviewForm.feedback.trim()) {
                        alert('Please provide a reason for rejection');
                        return;
                      }
                      
                      await api.put(`/api/teacher/academic-certificates/${reviewingCert.studentId}/${reviewingCert._id}/review`, {
                        status: reviewForm.status,
                        feedback: reviewForm.feedback
                      });
                      
                      alert(`Certificate ${reviewForm.status} successfully!`);
                      setReviewingCert(null);
                      
                      // Refresh pending certificates
                      const certsRes = await api.get('/api/teacher/academic-certificates/pending');
                      setPendingCertificates(certsRes.data);
                    } catch (error) {
                      alert('Error reviewing certificate: ' + (error.response?.data?.error || error.message));
                    }
                  }}
                  className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    reviewForm.status === 'approved' 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                      : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                  }`}
                >
                  {reviewForm.status === 'approved' ? 'Approve Certificate' : 'Reject Certificate'}
                </button>
                <button
                  onClick={() => setReviewingCert(null)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showMessageForm && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Send Message to {selectedGroup.name}
                </h3>
                <button
                  onClick={() => {
                    setShowMessageForm(false);
                    setMessageForm({ subject: '', message: '' });
                  }}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                This message will be sent to all {selectedGroup.students.length} students in the group
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={messageForm.subject}
                    onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter message subject..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="4"
                    placeholder="Type your message here..."
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={async () => {
                    try {
                      if (!messageForm.subject.trim() || !messageForm.message.trim()) {
                        alert('Please fill in both subject and message');
                        return;
                      }
                      
                      await api.post('/api/messages/send', {
                        senderId: teacherData.teacherId,
                        senderName: teacherData.name,
                        senderType: 'teacher',
                        groupId: selectedGroup._id,
                        subject: messageForm.subject,
                        message: messageForm.message
                      });
                      
                      alert(`Message sent successfully to ${selectedGroup.students.length} students!`);
                      setShowMessageForm(false);
                      setMessageForm({ subject: '', message: '' });
                    } catch (error) {
                      alert('Error sending message: ' + (error.response?.data?.error || error.message));
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Send Message
                </button>
                <button
                  onClick={() => {
                    setShowMessageForm(false);
                    setMessageForm({ subject: '', message: '' });
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
