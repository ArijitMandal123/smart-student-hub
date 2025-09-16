import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Projects = ({ studentData }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, projectId: null });
  const [deleteInput, setDeleteInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubLink: '',
    deployLink: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get(`/api/projects/${studentData.studentId}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/projects', {
        ...formData,
        studentId: studentData.studentId
      });
      setFormData({ title: '', description: '', githubLink: '', deployLink: '' });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (deleteInput === 'Delete') {
      try {
        await api.delete(`/api/projects/${studentData.studentId}/${deleteConfirm.projectId}`);
        setDeleteConfirm({ show: false, projectId: null });
        setDeleteInput('');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Projects</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Project Portfolio
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Add New Project
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Add New Project
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <textarea
                  placeholder="Project Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24"
                  required
                />
                <input
                  type="url"
                  placeholder="GitHub Link"
                  value={formData.githubLink}
                  onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <input
                  type="url"
                  placeholder="Deploy Link (Optional)"
                  value={formData.deployLink}
                  onChange={(e) => setFormData({...formData, deployLink: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                  >
                    Add Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 relative">
              <button
                onClick={() => setDeleteConfirm({ show: true, projectId: project._id })}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 text-xs z-10"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{project.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
              <div className="flex flex-col space-y-2 mb-4">
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                {project.deployLink && (
                  <a
                    href={project.deployLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {deleteConfirm.show && (
          <div className="fixed inset-0 backdrop-blur-lg bg-gradient-to-br from-red-100/30 via-pink-100/20 to-orange-100/30 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl p-6 rounded-2xl max-w-md w-full mx-4 animate-slideUp">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Delete Project</h3>
              <p className="mb-6 text-gray-600">Type "Delete" to confirm deletion:</p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                placeholder="Type Delete"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteInput !== 'Delete'}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-xl flex-1 font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm({ show: false, projectId: null });
                    setDeleteInput('');
                  }}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl flex-1 font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Yet</h3>
            <p className="text-gray-600 mb-4">Start building your portfolio by adding your first project!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Add Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;