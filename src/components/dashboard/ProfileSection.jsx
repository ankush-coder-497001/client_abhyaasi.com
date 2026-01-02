import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const ProfileSection = () => {
  const { user } = useApp();
  const [days, setDays] = useState(0);

  const userData = {
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || "User",
    bio: user?.profile?.bio || "Learning enthusiast",
    avatar: user?.profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || 'user'}`,
    streak: user?.activityHistory.length || 0,
    totalPoints: user?.points || 0,
    rank: user?.rank || "Beginner",
  };


  useEffect(() => {
    // lest filter activityHistory to count unique days
    if (user && user.activityHistory) {
      const uniqueDays = new Set(
        user.activityHistory.map((activity) =>
          new Date(activity.date).toDateString()
        )
      );
      setDays(uniqueDays.size);
    } else {
      setDays(0);
    }
  }, [user])


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5 h-full flex flex-col">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-1.5 mb-2.5 pb-2.5 border-b border-gray-200">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {!userData.avatar && (
              <div className="text-base font-bold text-blue-500">
                {userData.name[0]}
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h3 className="text-xs font-bold text-gray-900">{userData.name}</h3>
          <p className="text-xs text-gray-600">{userData.bio}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-2.5 pb-2.5 border-b border-gray-200">
        {/* Streak */}
        <div className="text-center p-1 bg-blue-50 rounded">
          <div className="text-sm mb-0.5">🔥</div>
          <div className="text-xs font-bold text-blue-600">{days}</div>
          <div className="text-xs text-gray-600">Days</div>
        </div>

        {/* Rank */}
        <div className="text-center p-1 bg-yellow-50 rounded">
          <div className="text-sm mb-0.5">👑</div>
          <div className="text-xs font-bold text-yellow-600">{userData.rank}</div>
          <div className="text-xs text-gray-600">Rank</div>
        </div>

        {/* Points */}
        <div className="text-center p-1 bg-green-50 rounded">
          <div className="text-sm mb-0.5">⭐</div>
          <div className="text-xs font-bold text-green-600">{userData.totalPoints}</div>
          <div className="text-xs text-gray-600">Pts</div>
        </div>
      </div>

      {/* View Profile Button */}
      <Link to="/profile">
        <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-1 rounded text-xs transition-colors">
          View Profile
        </button>
      </Link>
    </div>
  );
};

export default ProfileSection;
