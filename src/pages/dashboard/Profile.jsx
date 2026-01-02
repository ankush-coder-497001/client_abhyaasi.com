
import { useState, useRef, useEffect } from 'react';
import { Camera, Edit2, Check, X, Mail, MapPin, BookOpen, Award, Trophy, Calendar, Loader, Settings, BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/profile.css';
import { addOrUpdateProfile, uploadImage } from '../../api_services/users.api';
import { useApp } from '../../context/AppContext';
import MinimalProgressBar from '../../components/dashboard/MinimalProgressBar';
import CertificateModal from '../../components/dashboard/CertificateModal';
import PremiumCalendar from '../../components/dashboard/PremiumCalendar';

const Profile = () => {
  const navigate = useNavigate();
  const { user, userLoading, refetchUser, getUserCompletedCourses, getUserCompletedProfessions } = useApp();
  const [saveLoading, setSaveLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [editName, setEditName] = useState('');
  const [activeTab, setActiveTab] = useState('courses');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [certificateModal, setCertificateModal] = useState({ isOpen: false, certificate: null, title: '' });
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef(null);

  // Update edit form when user data changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || 'User');
      setEditData({
        bio: user.profile?.bio || '',
        college: user.profile?.college || '',
        year: user.profile?.year || null,
      });
    }
  }, [user]);

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadingImage(true);

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file');
          return;
        }

        // Upload to server
        const formData = new FormData();
        formData.append('image', file);

        const response = await uploadImage(formData);
        const imageUrl = response.url || response.data.url;

        // lets call update profile api to update profile pic
        await addOrUpdateProfile({ profilePic: imageUrl });

        // Refetch user data to get updated profile
        await refetchUser();
        toast.success('Profile picture updated successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(error.message || 'Failed to upload image');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);

      const profileData = {
        name: editName,
        bio: editData.bio,
        college: editData.college,
        year: editData.year,
      };

      await addOrUpdateProfile(profileData);

      // Refetch user data to get updated profile
      await refetchUser();

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditData({
        bio: user.profile?.bio || '',
        college: user.profile?.college || '',
        year: user.profile?.year || null,
      });
      setEditName(user.name || 'User');
    }
    setIsEditing(false);
  };

  const handleViewCertificate = (certificate, title) => {
    setCertificateModal({
      isOpen: true,
      certificate: {
        pdfUrl: certificate.certificatePdfUrl || certificate.certificateUrl,
        imageUrl: certificate.certificateImageUrl
      },
      title
    });
  };

  const handleCloseCertificateModal = () => {
    setCertificateModal({ isOpen: false, certificate: null, title: '' });
  };

  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  // Show loading state
  if (userLoading) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <Loader size={40} className="animate-spin" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <p>Unable to load profile. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Top Action Bar */}
      <div className="profile-top-bar">
        <div className="top-bar-left">
          <h1 className="page-title">My Profile</h1>
        </div>
        <div className="top-bar-actions">
          <button
            className="browse-courses-btn"
            onClick={handleBrowseCourses}
            title="Browse more courses"
          >
            <BookMarked size={16} />
            Browse Courses
          </button>
          <button
            className="settings-btn"
            onClick={() => navigate('/setting')}
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Header with Stats */}
      <div className="profile-header">
        <div className="header-stats">
          <div className="stat">
            <p className="stat-value">{user.rank || 'Beginner'}</p>
            <p className="stat-label">Rank</p>
          </div>
          <div className="stat">
            <p className="stat-value">{user.points || 0}</p>
            <p className="stat-label">Points</p>
          </div>
          <div className="stat">
            <p className="stat-value">{user.completedCourses?.length || 0}</p>
            <p className="stat-label">Completed</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          {/* Profile Card - Minimal Premium */}
          <div className="profile-card">
            <div className="card-inner">
              {/* Left: Profile Picture */}
              <div className="pic-section">
                <div className="profile-pic-container">
                  <img src={user.profile?.profilePic || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} alt={user.name} className="profile-pic" />
                  <button
                    className="pic-edit-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change profile picture"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? <Loader size={16} className="animate-spin" /> : <Camera size={16} />}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden-input"
                    disabled={uploadingImage}
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
                        <p className="value">{user.profile?.bio || '—'}</p>
                      </div>
                      <div className="meta-item">
                        <span className="label">College</span>
                        <p className="value">{user.profile?.college || '—'}</p>
                      </div>
                      <div className="meta-item">
                        <span className="label">Year</span>
                        <p className="value">{user.profile?.year ? `Year ${user.profile.year}` : '—'}</p>
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
                        onChange={(e) => handleEditChange('year', parseInt(e.target.value) || null)}
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
                      <button
                        className="btn-save"
                        onClick={handleSaveProfile}
                        disabled={saveLoading}
                      >
                        {saveLoading ? <Loader size={14} className="animate-spin" /> : <Check size={14} />} Save
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={handleCancelEdit}
                        disabled={saveLoading}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          {user.currentCourse && (
            <div className="section">
              <MinimalProgressBar />
            </div>
          )}

          {/* Badges - Minimal */}
          {user.badges && user.badges.length > 0 && (
            <div className="section">
              <h2 className="section-title">Achievements</h2>
              <div className="badges-grid">
                {user.badges.map((badge) => (
                  <div key={badge._id || badge.id} className="badge">
                    <span className="badge-icon">{badge.icon || '🏆'}</span>
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
                {getUserCompletedCourses() && getUserCompletedCourses().length > 0 ? (
                  getUserCompletedCourses().map((course) => (
                    <div key={course._id || course.id} className="item">
                      <div className="item-header">
                        <div className="flex items-start justify-between w-full gap-2">
                          <h3 className="item-title">{course.title || "Course"}</h3>
                          {course.completionMetadata?.points && (
                            <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
                              +{course.completionMetadata.points} pts
                            </span>
                          )}
                        </div>
                        {course.completionMetadata?.completedDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Completed: {new Date(course.completionMetadata.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <div className="progress">
                        <div className="bar" style={{ width: `${course.progress || 0}%` }}></div>
                      </div>
                      {course.completionMetadata?.certificate && (
                        <button
                          onClick={() => handleViewCertificate(course.completionMetadata, course.title || 'Course')}
                          className="action-btn"
                        >
                          View Certificate
                        </button>
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
                {getUserCompletedProfessions() && getUserCompletedProfessions().length > 0 ? (
                  getUserCompletedProfessions().map((profession) => (
                    <div key={profession._id || profession.id} className="item">
                      <div className="item-header">
                        <div className="flex items-start justify-between w-full gap-2">
                          <h3 className="item-title">{profession.title || profession.name || "Profession"}</h3>
                          {profession.completionMetadata?.points && (
                            <span className="text-xs font-semibold text-purple-600 whitespace-nowrap">
                              +{profession.completionMetadata.points} pts
                            </span>
                          )}
                        </div>
                        {profession.completionMetadata?.completedDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Completed: {new Date(profession.completionMetadata.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <div className="progress">
                        <div className="bar" style={{ width: `${profession.progress || 0}%` }}></div>
                      </div>
                      {profession.completionMetadata?.certificate && (
                        <button
                          onClick={() => handleViewCertificate(profession.completionMetadata, profession.title || profession.name || 'Profession')}
                          className="action-btn"
                        >
                          View Certificate
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="empty">No professions yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Calendar and Stats */}
        <aside className="profile-sidebar">
          {/* Premium Calendar Widget */}
          <PremiumCalendar />


          {/* Quick Stats */}
          <div className="quick-stats">
            <h3 className="stats-title">Your Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Total Points</span>
              <span className="stat-value">{user.points || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Courses Done</span>
              <span className="stat-value">{user.completedCourses?.length || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Professions Done</span>
              <span className="stat-value">{user.completedProfessions?.length || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Current Rank</span>
              <span className="stat-value">{user.rank || 'Beginner'}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certificateModal.isOpen}
        certificate={certificateModal.certificate}
        certificateTitle={certificateModal.title}
        onClose={handleCloseCertificateModal}
      />
    </div>
  );
};

export default Profile;