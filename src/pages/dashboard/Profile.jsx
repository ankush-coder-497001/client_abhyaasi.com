"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Edit2, Check, X, BookMarked, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { addOrUpdateProfile, uploadImage } from "../../api_services/users.api"
import { useApp } from "../../context/AppContext"
import MinimalProgressBar from "../../components/dashboard/MinimalProgressBar"
import CertificateModal from "../../components/dashboard/CertificateModal"
import PremiumCalendar from "../../components/dashboard/PremiumCalendar"

const Profile = () => {
  const navigate = useNavigate()
  const { user, userLoading, refetchUser, getUserCompletedCourses, getUserCompletedProfessions } = useApp()
  const [saveLoading, setSaveLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [editName, setEditName] = useState("")
  const [activeTab, setActiveTab] = useState("courses")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [certificateModal, setCertificateModal] = useState({ isOpen: false, certificate: null, title: "" })
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setEditName(user.name || "User")
      setEditData({
        bio: user.profile?.bio || "",
        college: user.profile?.college || "",
        year: user.profile?.year || null,
      })
    }
  }, [user])

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value })
  }

  const handleProfilePicChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setUploadingImage(true)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size must be less than 5MB")
          return
        }
        if (!file.type.startsWith("image/")) {
          toast.error("Please select a valid image file")
          return
        }
        const formData = new FormData()
        formData.append("image", file)
        const response = await uploadImage(formData)
        const imageUrl = response.url || response.data.url
        await addOrUpdateProfile({ profilePic: imageUrl })
        await refetchUser()
        toast.success("Profile picture updated successfully")
      } catch (error) {
        console.error("Error uploading image:", error)
        toast.error(error.message || "Failed to upload image")
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true)
      const profileData = {
        name: editName,
        bio: editData.bio,
        college: editData.college,
        year: editData.year,
      }
      await addOrUpdateProfile(profileData)
      await refetchUser()
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Failed to update profile")
    } finally {
      setSaveLoading(false)
    }
  }

  const handleCancelEdit = () => {
    if (user) {
      setEditData({
        bio: user.profile?.bio || "",
        college: user.profile?.college || "",
        year: user.profile?.year || null,
      })
      setEditName(user.name || "User")
    }
    setIsEditing(false)
  }

  const handleViewCertificate = (certificate, title) => {
    setCertificateModal({
      isOpen: true,
      certificate: {
        pdfUrl: certificate.certificatePdfUrl || certificate.certificateUrl,
        imageUrl: certificate.certificateImageUrl,
      },
      title,
    })
  }

  const handleCloseCertificateModal = () => {
    setCertificateModal({ isOpen: false, certificate: null, title: "" })
  }

  const handleBrowseCourses = () => {
    navigate("/courses")
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">⚙️</div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile. Please refresh the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-base font-semibold text-slate-900">Profile</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBrowseCourses}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200"
                title="Browse more courses"
              >
                <BookMarked size={16} />
                <span>Courses</span>
              </button>
              <button
                onClick={() => navigate("/setting")}
                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200"
                title="Settings"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Header */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-300">
            <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-wide">Rank</p>
            <p className="text-2xl font-bold text-slate-900">{user.rank || "Beginner"}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300">
            <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-wide">Points</p>
            <p className="text-2xl font-bold text-blue-600">{user.points || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-300">
            <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-wide">Completed</p>
            <p className="text-2xl font-bold text-slate-900">{user.completedCourses?.length || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Profile Card */}
          <div className="lg:col-span-2 space-y-5">
            {/* Profile Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Profile Picture */}
                <div className="shrink-0">
                  <div className="relative inline-block">
                    <img
                      src={
                        user.profile?.profilePic ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" ||
                        "/placeholder.svg"
                      }
                      alt={user.name}
                      className="w-28 h-28 rounded-lg object-cover border border-slate-300 shadow-sm"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      title="Change profile picture"
                    >
                      {uploadingImage ? <span className="animate-spin text-xs">●</span> : <Camera size={14} />}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  {!isEditing ? (
                    <>
                      <div className="mb-5">
                        <h2 className="text-2xl font-bold text-slate-900 mb-0.5">{user.name}</h2>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>

                      <div className="space-y-3 mb-5">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bio</p>
                          <p className="text-sm text-slate-700">{user.profile?.bio || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">College</p>
                          <p className="text-sm text-slate-700">{user.profile?.college || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Year</p>
                          <p className="text-sm text-slate-700">
                            {user.profile?.year ? `Year ${user.profile.year}` : "—"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-3 mb-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                            Bio
                          </label>
                          <input
                            type="text"
                            value={editData.bio || ""}
                            onChange={(e) => handleEditChange("bio", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Tell us about yourself"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                            College
                          </label>
                          <input
                            type="text"
                            value={editData.college || ""}
                            onChange={(e) => handleEditChange("college", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Your college"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                            Year
                          </label>
                          <select
                            value={editData.year || ""}
                            onChange={(e) => handleEditChange("year", Number.parseInt(e.target.value) || null)}
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                            <option value="5">5th Year</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saveLoading}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                        >
                          {saveLoading ? <span className="animate-spin text-xs">●</span> : <Check size={14} />} Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={saveLoading}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300 transition-all duration-200"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar Section */}
            {user.currentCourse && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                <MinimalProgressBar />
              </div>
            )}

            {/* Achievements Section */}
            {user.badges && user.badges.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Achievements</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {user.badges.map((badge) => (
                    <div
                      key={badge._id || badge.id}
                      className="flex flex-col items-center p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm transition-all duration-300"
                    >
                      <span className="text-2xl mb-2">{badge.icon || "🏆"}</span>
                      <span className="text-xs font-semibold text-slate-700 text-center">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Learning</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("courses")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${activeTab === "courses"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                  >
                    Courses
                  </button>
                  <button
                    onClick={() => setActiveTab("professions")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${activeTab === "professions"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                  >
                    Professions
                  </button>
                </div>
              </div>

              {/* Courses Tab */}
              {activeTab === "courses" && (
                <div className="space-y-3">
                  {getUserCompletedCourses() && getUserCompletedCourses().length > 0 ? (
                    getUserCompletedCourses().map((course) => (
                      <div
                        key={course._id || course.id}
                        className="p-3.5 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md hover:bg-blue-50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm text-slate-900">{course.title || "Course"}</h3>
                          {course.completionMetadata?.points && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                              +{course.completionMetadata.points} pts
                            </span>
                          )}
                        </div>
                        {course.completionMetadata?.completedDate && (
                          <p className="text-xs text-slate-500 mb-2">
                            Completed:{" "}
                            {new Date(course.completionMetadata.completedDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress || 100}%` }}
                          ></div>
                        </div>
                        {course.completionMetadata?.certificate && (
                          <button
                            onClick={() => handleViewCertificate(course.completionMetadata, course.title || "Course")}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            View Certificate →
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-6 text-sm">No courses completed yet</p>
                  )}
                </div>
              )}

              {/* Professions Tab */}
              {activeTab === "professions" && (
                <div className="space-y-3">
                  {getUserCompletedProfessions() && getUserCompletedProfessions().length > 0 ? (
                    getUserCompletedProfessions().map((profession) => (
                      <div
                        key={profession._id || profession.id}
                        className="p-3.5 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md hover:bg-blue-50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm text-slate-900">
                            {profession.title || profession.name || "Profession"}
                          </h3>
                          {profession.completionMetadata?.points && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                              +{profession.completionMetadata.points} pts
                            </span>
                          )}
                        </div>
                        {profession.completionMetadata?.completedDate && (
                          <p className="text-xs text-slate-500 mb-2">
                            Completed:{" "}
                            {new Date(profession.completionMetadata.completedDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${profession.progress || 100}%` }}
                          ></div>
                        </div>
                        {profession.completionMetadata?.certificate && (
                          <button
                            onClick={() =>
                              handleViewCertificate(
                                profession.completionMetadata,
                                profession.title || profession.name || "Profession",
                              )
                            }
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            View Certificate →
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-6 text-sm">No professions completed yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Calendar Widget */}
            <div className="bg-white rounded-xl  shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <PremiumCalendar />
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Your Stats</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md border border-slate-200 hover:border-slate-300 transition-all">
                  <span className="text-xs font-semibold text-slate-600 uppercase">Points</span>
                  <span className="text-sm font-bold text-blue-600">{user.points || 0}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md border border-slate-200 hover:border-slate-300 transition-all">
                  <span className="text-xs font-semibold text-slate-600 uppercase">Courses</span>
                  <span className="text-sm font-bold text-slate-900">{user.completedCourses?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md border border-slate-200 hover:border-slate-300 transition-all">
                  <span className="text-xs font-semibold text-slate-600 uppercase">Professions</span>
                  <span className="text-sm font-bold text-slate-900">{user.completedProfessions?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md border border-slate-200 hover:border-slate-300 transition-all">
                  <span className="text-xs font-semibold text-slate-600 uppercase">Rank</span>
                  <span className="text-sm font-bold text-slate-900">{user.rank || "Beginner"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certificateModal.isOpen}
        certificate={certificateModal.certificate}
        certificateTitle={certificateModal.title}
        onClose={handleCloseCertificateModal}
      />
    </div>
  )
}

export default Profile
