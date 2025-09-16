import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = ({ adminData, onLogout }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [groupForm, setGroupForm] = useState({ name: '', teacher: '', students: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, teachersRes, collegesRes] = await Promise.all([
        api.get('/api/admin/students'),
        api.get('/api/admin/teachers'),
        api.get('/api/colleges')
      ]);
      console.log('Admin data:', adminData);
      console.log('All students:', studentsRes.data);
      console.log('All teachers:', teachersRes.data);
      
      const filteredStudents = studentsRes.data.filter(student => {
        console.log('Student:', student.name, 'College:', student.college, 'Dept:', student.department);
        return student.college === adminData.institution && student.department === adminData.department;
      });
      const filteredTeachers = teachersRes.data.filter(teacher => {
        console.log('Teacher:', teacher.name, 'College:', teacher.college, 'Dept:', teacher.department);
        return teacher.college === adminData.institution && teacher.department === adminData.department;
      });
      
      console.log('Filtered students:', filteredStudents);
      console.log('Filtered teachers:', filteredTeachers);
      
      setStudents(studentsRes.data);
      setTeachers(teachersRes.data);
      setColleges(collegesRes.data);
      
      const groupsRes = await api.get(`/api/groups/${adminData.adminId}`);
      setGroups(groupsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/colleges', { ...collegeForm, createdBy: adminData.adminId });
      setCollegeForm({ name: '', code: '', address: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating college:', error);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/colleges/${departmentForm.collegeId}/departments`, {
        name: departmentForm.name,
        code: departmentForm.code
      });
      setDepartmentForm({ name: '', code: '', collegeId: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {adminData?.name}</span>
            <button onClick={onLogout} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            System Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Total Students</h3>
              <p className="text-3xl font-bold">{students.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Total Teachers</h3>
              <p className="text-3xl font-bold">{teachers.length}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Total Colleges</h3>
              <p className="text-3xl font-bold">{colleges.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">System Status</h3>
              <p className="text-lg font-semibold">Active</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {['overview', 'students', 'teachers', 'groups'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab === 'overview' ? 'See Personal Info' : 
                 tab === 'students' ? 'Student Details' :
                 tab === 'teachers' ? 'Faculty Details' : 'Created Groups'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="bg-white/60 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Admin Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700">Name</label><p className="text-lg">{adminData?.name}</p></div>
                <div><label className="block text-sm font-medium text-gray-700">Admin ID</label><p className="text-lg">{adminData?.adminId}</p></div>
              </div>
            </div>
          )}



          {activeTab === 'students' && (
            <div className="bg-white/60 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Student Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Student ID</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Department</th>
                      <th className="px-4 py-2 text-left">College</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id} className="border-b">
                        <td className="px-4 py-2">{student.studentId}</td>
                        <td className="px-4 py-2">{student.name}</td>
                        <td className="px-4 py-2">{student.email}</td>
                        <td className="px-4 py-2">{student.department}</td>
                        <td className="px-4 py-2">{student.college}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="bg-white/60 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Faculty Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Teacher ID</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Department</th>
                      <th className="px-4 py-2 text-left">Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher._id} className="border-b">
                        <td className="px-4 py-2">{teacher.teacherId}</td>
                        <td className="px-4 py-2">{teacher.name}</td>
                        <td className="px-4 py-2">{teacher.email}</td>
                        <td className="px-4 py-2">{teacher.department}</td>
                        <td className="px-4 py-2">{teacher.designation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="bg-white/60 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Group Management</h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Create New Group</h4>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    console.log('Admin data:', adminData);
                    const groupData = {
                      name: groupForm.name,
                      college: adminData.institution || 'Test College',
                      department: adminData.department || 'Test Department',
                      teacher: groupForm.teacher,
                      students: groupForm.students,
                      createdBy: adminData.adminId
                    };
                    console.log('Creating group:', groupData);
                    const response = await api.post('/api/groups', groupData);
                    console.log('Group created:', response.data);
                    setGroupForm({ name: '', teacher: '', students: [] });
                    fetchData();
                  } catch (error) {
                    console.error('Group creation error:', error);
                    alert('Error creating group: ' + (error.response?.data?.error || error.message));
                  }
                }} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Group Name"
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                  
                  <select
                    value={groupForm.teacher}
                    onChange={(e) => setGroupForm({...groupForm, teacher: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.teacherId} value={teacher.teacherId}>
                        {teacher.name} ({teacher.teacherId})
                      </option>
                    ))}
                  </select>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Students:</label>
                    <div className="max-h-40 overflow-y-auto border rounded p-2">
                      {students.map((student) => (
                        <label key={student.studentId} className="flex items-center space-x-2 p-1">
                          <input
                            type="checkbox"
                            checked={groupForm.students.includes(student.studentId)}
                            onChange={() => {
                              const studentId = student.studentId;
                              setGroupForm(prev => ({
                                ...prev,
                                students: prev.students.includes(studentId)
                                  ? prev.students.filter(id => id !== studentId)
                                  : [...prev.students, studentId]
                              }));
                            }}
                          />
                          <span>{student.name} ({student.studentId})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                    Create Group
                  </button>
                </form>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3">Existing Groups</h4>
                {groups.map((group) => (
                  <div key={group._id} className="bg-gray-100 p-4 rounded mb-3">
                    <h5 className="font-semibold">{group.name}</h5>
                    <p className="text-sm text-gray-600">Teacher: {group.teacher}</p>
                    <p className="text-sm text-gray-600">Students: {group.students.length}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;