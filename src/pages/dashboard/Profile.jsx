'use client';

import { useState, useRef } from 'react';
import { Camera, Edit2, Check, X, Mail, MapPin, BookOpen, Award, Trophy, Calendar } from 'lucide-react';
import '../../styles/profile.css';

const Profile = () => {
  // Mock user data - replace with Redux state later
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profile: {
      bio: 'Passionate learner and developer',
      college: 'XYZ University',
      year: 3,
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    points: 2450,
    rank: 'Silver',
    badges: [
      { id: 1, name: 'Code Master', icon: '⚡' },
      { id: 2, name: 'Problem Solver', icon: '🧩' },
      { id: 3, name: 'Consistent Learner', icon: '🔥' },
    ],
    completedCourses: [
      { id: 1, title: 'React Fundamentals', progress: 100, certificate: true },
      { id: 2, title: 'Advanced JavaScript', progress: 100, certificate: true },
      { id: 3, title: 'Web Design Basics', progress: 100, certificate: true },
    ],
    enrolledProfessions: [
      { id: 1, title: 'Full Stack Developer', progress: 65, status: 'In Progress' },
      { id: 2, title: 'Frontend Engineer', progress: 100, status: 'Completed' },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user.profile);
  const [editName, setEditName] = useState(user.name);
  const [activeTab, setActiveTab] = useState('courses');
  const fileInputRef = useRef(null);

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUser({ ...user, profile: { ...user.profile, profilePic: event.target?.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setUser({ ...user, name: editName, profile: editData });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData(user.profile);
    setEditName(user.name);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      {/* Minimal Header with Stats */}
      <div className="profile-header">
        <div className="header-stats">
          <div className="stat">
            <p className="stat-value">{user.rank}</p>
            <p className="stat-label">Rank</p>
          </div>
          <div className="stat">
            <p className="stat-value">{user.points}</p>
            <p className="stat-label">Points</p>
          </div>
          <div className="stat">
            <p className="stat-value">{user.completedCourses.length}</p>
            <p className="stat-label">Completed</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Card - Minimal Premium */}
        <div className="profile-card">
          <div className="card-inner">
            {/* Left: Profile Picture */}
            <div className="pic-section">
              <div className="profile-pic-container">
                <img src={user.profile.profilePic} alt={user.name} className="profile-pic" />
                <button
                  className="pic-edit-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change profile picture"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden-input"
                />
              </div>
            </div>

            {/* Right: Profile Info */}
            <div className="info-section">
              {!isEditing ? (
                <>
                  <div className="profile-header-info">
                    <h1 className="name">{user.name}</h1>
                    <p className="email">{user.email}</p>
                  </div>

                  <div className="profile-meta">
                    <div className="meta-item">
                      <span className="label">Bio</span>
                      <p className="value">{user.profile.bio || '—'}</p>
                    </div>
                    <div className="meta-item">
                      <span className="label">College</span>
                      <p className="value">{user.profile.college || '—'}</p>
                    </div>
                    <div className="meta-item">
                      <span className="label">Year</span>
                      <p className="value">{user.profile.year ? `Year ${user.profile.year}` : '—'}</p>
                    </div>
                  </div>

                  <button
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                </>
              ) : (
                <>
                  <div className="edit-group">
                    <label className="edit-label">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="edit-input"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="edit-group">
                    <label className="edit-label">Bio</label>
                    <input
                      type="text"
                      value={editData.bio || ''}
                      onChange={(e) => handleEditChange('bio', e.target.value)}
                      className="edit-input"
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div className="edit-group">
                    <label className="edit-label">College</label>
                    <input
                      type="text"
                      value={editData.college || ''}
                      onChange={(e) => handleEditChange('college', e.target.value)}
                      className="edit-input"
                      placeholder="Your college"
                    />
                  </div>

                  <div className="edit-group">
                    <label className="edit-label">Year</label>
                    <select
                      value={editData.year || ''}
                      onChange={(e) => handleEditChange('year', parseInt(e.target.value))}
                      className="edit-input"
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                  </div>

                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleSaveProfile}>
                      <Check size={14} /> Save
                    </button>
                    <button className="btn-cancel" onClick={handleCancelEdit}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Badges - Minimal */}
        {user.badges.length > 0 && (
          <div className="section">
            <h2 className="section-title">Achievements</h2>
            <div className="badges-grid">
              {user.badges.map((badge) => (
                <div key={badge.id} className="badge">
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Progress */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Learning</h2>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                Courses
              </button>
              <button
                className={`tab ${activeTab === 'professions' ? 'active' : ''}`}
                onClick={() => setActiveTab('professions')}
              >
                Professions
              </button>
            </div>
          </div>

          {activeTab === 'courses' && (
            <div className="items-grid">
              {user.completedCourses.length > 0 ? (
                user.completedCourses.map((course) => (
                  <div key={course.id} className="item">
                    <div className="item-header">
                      <h3 className="item-title">{course.title}</h3>
                      <span className={`badge-status ${course.progress === 100 ? 'done' : 'progress'}`}>
                        {course.progress === 100 ? 'Done' : `${course.progress}%`}
                      </span>
                    </div>
                    <div className="progress">
                      <div className="bar" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    {course.certificate && (
                      <button className="action-btn">View Certificate</button>
                    )}
                  </div>
                ))
              ) : (
                <p className="empty">No courses yet</p>
              )}
            </div>
          )}

          {activeTab === 'professions' && (
            <div className="items-grid">
              {user.enrolledProfessions.length > 0 ? (
                user.enrolledProfessions.map((profession) => (
                  <div key={profession.id} className="item">
                    <div className="item-header">
                      <h3 className="item-title">{profession.title}</h3>
                      <span className={`badge-status ${profession.status === 'Completed' ? 'done' : 'progress'}`}>
                        {profession.status}
                      </span>
                    </div>
                    <div className="progress">
                      <div className="bar" style={{ width: `${profession.progress}%` }}></div>
                    </div>
                    <button className="action-btn">
                      {profession.status === 'Completed' ? 'Review' : 'Continue'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="empty">No professions yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;