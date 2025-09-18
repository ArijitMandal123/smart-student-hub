import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = ({ studentData, onLogout }) => {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState("Connecting...");
  const [showNotification, setShowNotification] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessages, setShowMessages] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [studentFullData, setStudentFullData] = useState({});

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get("/api/test");
        setBackendStatus(response.data.message);
      } catch (error) {
        setBackendStatus("Backend connection failed");
      }
    };

    const fetchMessages = async () => {
      if (studentData?.studentId) {
        try {
          const [messagesRes, unreadRes] = await Promise.all([
            api.get(`/api/messages/student/${studentData.studentId}`),
            api.get(`/api/messages/unread-count/${studentData.studentId}`),
          ]);
          setMessages(messagesRes.data);
          setUnreadCount(unreadRes.data.unreadCount);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    const fetchProfile = async () => {
      if (studentData?.studentId) {
        try {
          const [profileRes, studentRes, projectsRes, certsRes, marksRes] =
            await Promise.all([
              api.get(`/api/profile/${studentData.studentId}`),
              api.get(`/api/students/${studentData.studentId}`),
              api.get(`/api/projects/${studentData.studentId}`),
              api.get(`/api/certificates/${studentData.studentId}`),
              api.get(`/api/students/${studentData.studentId}/marks`),
            ]);
          setProfileData(profileRes.data);
          setStudentFullData({
            ...studentRes.data,
            profile: profileRes.data,
            projects: projectsRes.data,
            certificates: certsRes.data,
            semesterMarks: marksRes.data.semesterMarks,
            cgpa: marksRes.data.cgpa,
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    testConnection();
    fetchMessages();
    fetchProfile();
  }, [studentData]);

  const handleLogout = () => {
    onLogout();
  };

  const generateResume = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Colors
      const darkGray = [80, 80, 80];
      const lightGray = [240, 240, 240];
      const black = [0, 0, 0];
      const white = [255, 255, 255];

      // Left Sidebar (Dark)
      doc.setFillColor(...darkGray);
      doc.rect(0, 0, 80, 297, "F");

      // Profile Image
      if (profileData?.profileImage) {
        try {
          doc.addImage(
            profileData.profileImage,
            "JPEG",
            15,
            15,
            50,
            50,
            undefined,
            "FAST"
          );
        } catch (error) {
          // Fallback circle with initials
          doc.setFillColor(200, 200, 200);
          doc.circle(40, 40, 25, "F");
          doc.setTextColor(...black);
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          doc.text(studentData?.name?.charAt(0) || "S", 35, 45);
        }
      }

      let leftY = 80;

      // About Me Section
      doc.setTextColor(...white);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("ABOUT ME", 10, leftY);

      leftY += 10;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const aboutText = `Dedicated student with strong academic performance and commitment to learning. Proven ability to apply critical thinking skills in academic and project environments.`;
      const aboutLines = doc.splitTextToSize(aboutText, 60);
      doc.text(aboutLines, 10, leftY);
      leftY += aboutLines.length * 4 + 15;

      // Links Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("LINKS", 10, leftY);
      leftY += 10;

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      if (profileData?.linkedinProfile) {
        doc.text("LinkedIn:", 10, leftY);
        leftY += 4;
        doc.text(profileData.linkedinProfile, 10, leftY);
        leftY += 8;
      }
      if (profileData?.githubProfile) {
        doc.text("GitHub:", 10, leftY);
        leftY += 4;
        doc.text(profileData.githubProfile, 10, leftY);
        leftY += 8;
      }

      // Skills Section
      if (
        studentFullData?.skills &&
        Object.keys(studentFullData.skills).length > 0
      ) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("SKILLS", 10, leftY);
        leftY += 10;

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        Object.keys(studentFullData.skills)
          .slice(0, 6)
          .forEach((skill) => {
            doc.text(`• ${skill}`, 10, leftY);
            leftY += 5;
          });
        leftY += 10;
      }

      // // Contact Info at bottom
      // doc.setFontSize(8);
      // doc.setFont('helvetica', 'normal');
      // doc.text(`📧 ${studentData?.email || 'N/A'}`, 10, 260);
      // if (profileData?.mobileNumber) {
      //   doc.text(`📞 ${profileData.mobileNumber}`, 10, 268);
      // }
      // doc.text(`🆔 ${studentData?.studentId || 'N/A'}`, 10, 276);

      // Right Content Area
      let rightY = 20;

      // Name and Title
      doc.setTextColor(...black);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text((studentData?.name || "STUDENT NAME").toUpperCase(), 90, rightY);

      rightY += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("STUDENT", 90, rightY);

      // Contact icons on right
      // doc.setFontSize(8);
      // doc.text(`📍 ${studentData?.college || 'College'}`, 150, 15);
      // doc.text(`📞 ${profileData?.mobileNumber || 'Phone'}`, 150, 22);
      // doc.text(`📧 ${studentData?.email || 'Email'}`, 150, 29);

      rightY += 20;

      // Education Section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("EDUCATION", 90, rightY);
      doc.setLineWidth(0.5);
      doc.line(90, rightY + 2, 200, rightY + 2);

      rightY += 12;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(studentData?.college || "COLLEGE NAME", 90, rightY);

      rightY += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${studentData?.department || "Department"} | Year ${
          studentData?.year || "N/A"
        }`,
        90,
        rightY
      );

      if (studentFullData?.cgpa) {
        rightY += 5;
        doc.text(`• CGPA: ${studentFullData.cgpa}`, 95, rightY);
      }

      rightY += 15;

      // Projects Section
      if (studentFullData?.projects && studentFullData.projects.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("PROJECTS", 90, rightY);
        doc.line(90, rightY + 2, 200, rightY + 2);

        rightY += 12;

        studentFullData.projects.slice(0, 2).forEach((project) => {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(project.title.toUpperCase(), 90, rightY);

          rightY += 6;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const descLines = doc.splitTextToSize(project.description, 110);
          doc.text(descLines.slice(0, 2), 95, rightY);
          rightY += descLines.slice(0, 2).length * 4 + 8;
        });
      }

      // Certifications Section
      if (
        studentFullData?.certificates &&
        studentFullData.certificates.length > 0
      ) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("CERTIFICATIONS", 90, rightY);
        doc.line(90, rightY + 2, 200, rightY + 2);

        rightY += 12;

        studentFullData.certificates.slice(0, 3).forEach((cert) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(cert.name, 90, rightY);

          rightY += 5;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const certDate = cert.date
            ? new Date(cert.date).toLocaleDateString()
            : "N/A";
          doc.text(`${cert.issuer} | ${certDate}`, 95, rightY);

          rightY += 8;
        });
      }

      // Academic Performance
      if (
        studentFullData?.semesterMarks &&
        studentFullData.semesterMarks.length > 0
      ) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("ACADEMIC PERFORMANCE", 90, rightY);
        doc.line(90, rightY + 2, 200, rightY + 2);

        rightY += 12;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        studentFullData.semesterMarks.slice(-3).forEach((mark) => {
          doc.text(
            `• Semester ${mark.semester} (${mark.year}): SGPA ${mark.sgpa}`,
            95,
            rightY
          );
          rightY += 5;
        });
      }

      // Save the PDF
      doc.save(`${studentData?.name || "Student"}_Resume.pdf`);
    } catch (error) {
      console.error("Error generating resume:", error);
      alert("Error generating resume. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                Smart Student Hub
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowMessages(!showMessages);
                    setShowNotification(false);
                  }}
                  className="relative bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-xl transition-all duration-300 group border border-white/20"
                >
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowNotification(!showNotification);
                    setShowMessages(false);
                  }}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-xl transition-all duration-300 group border border-white/20"
                >
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                {showNotification && (
                  <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl text-black rounded-2xl shadow-2xl border border-white/20 z-50 animate-slideUp">
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        System Status
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            backendStatus.includes("success")
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <p className="text-sm text-gray-600">{backendStatus}</p>
                      </div>
                    </div>
                  </div>
                )}
                {showMessages && (
                  <div className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-xl text-black rounded-2xl shadow-2xl border border-white/20 z-50 max-h-96 overflow-hidden animate-slideUp">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-lg">
                          Messages
                        </h3>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {messages.length} total
                        </span>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {messages.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <p className="font-medium">No messages yet</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Messages from teachers will appear here
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message._id}
                            className={`p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-all duration-200 ${
                              !message.isRead
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500"
                                : ""
                            }`}
                            onClick={async () => {
                              if (!message.isRead) {
                                try {
                                  await api.put(
                                    `/api/messages/${message._id}/read/${studentData.studentId}`
                                  );
                                  setMessages((prev) =>
                                    prev.map((m) =>
                                      m._id === message._id
                                        ? {
                                            ...m,
                                            isRead: true,
                                            readAt: new Date(),
                                          }
                                        : m
                                    )
                                  );
                                  setUnreadCount((prev) =>
                                    Math.max(0, prev - 1)
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error marking message as read:",
                                    error
                                  );
                                }
                              }
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                                  {message.senderName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {message.senderName}
                                  </p>
                                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {message.groupName}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleDateString()}
                                </p>
                                {!message.isRead && (
                                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1 animate-pulse"></span>
                                )}
                              </div>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">
                              {message.subject}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {message.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 mb-10 border border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profileData?.profileImage ? (
                    <img
                      src={profileData.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 border-4 border-white"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                      {studentData?.name?.charAt(0) || "S"}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
                    Welcome back, {studentData?.name || "Student"}!
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 px-4 py-2 rounded-full">
                      <p className="text-blue-800 font-semibold text-sm">
                        ID: {studentData?.studentId}
                      </p>
                    </div>
                    <div className="bg-green-100 px-4 py-2 rounded-full">
                      <p className="text-green-800 font-semibold text-sm">
                        Active Student
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate("/profile")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => navigate("/view-profile")}
                  className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>View Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            className="group bg-white/60 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/30 cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/80 relative overflow-hidden"
            onClick={() => navigate("/academic-records")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-700 transition-colors">
                Academic Records
              </h3>
              <p className="text-gray-600 leading-relaxed">
                View your academic performance and track your progress
              </p>
              <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm">Explore →</span>
              </div>
            </div>
          </div>

          <div
            className="group bg-white/60 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/30 cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/80 relative overflow-hidden"
            onClick={() => navigate("/academic-certificates")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 713.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 713.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-green-700 transition-colors">
                Academic Certificates
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Manage and showcase your academic achievements
              </p>
              <div className="mt-4 flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm">Manage →</span>
              </div>
            </div>
          </div>

          <div
            className="group bg-white/60 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/30 cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/80 relative overflow-hidden"
            onClick={() => navigate("/personal-achievements")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 713.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 713.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-orange-700 transition-colors">
                Personal Achievements
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track your personal certificates and accomplishments
              </p>
              <div className="mt-4 flex items-center text-orange-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm">View →</span>
              </div>
            </div>
          </div>

          <div
            className="group bg-white/60 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/30 cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/80 relative overflow-hidden"
            onClick={() => navigate("/profile")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-purple-700 transition-colors">
                Profile Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Update your personal details and documents
              </p>
              <div className="mt-4 flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm">Edit →</span>
              </div>
            </div>
          </div>

          <div
            className="group bg-white/60 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/30 cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/80 relative overflow-hidden"
            onClick={() => navigate("/projects")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-indigo-700 transition-colors">
                Project Portfolio
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Showcase your projects and technical work
              </p>
              <div className="mt-4 flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm">Add →</span>
              </div>
            </div>
          </div>

          <div
            className="group bg-white/60 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border border-white/30 cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/80 relative overflow-hidden"
            onClick={generateResume}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-red-700 transition-colors">
                Generate Resume
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create a professional resume from your profile data
              </p>
              <div className="mt-4 flex items-center text-red-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm">Download →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
