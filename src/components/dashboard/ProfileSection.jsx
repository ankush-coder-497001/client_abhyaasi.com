import React from "react";

const ProfileSection = () => {
  // Mock data - replace with actual user data
  const user = {
    name: "Aatosh Kumar",
    bio: "Full Stack Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aatosh",
    streak: 15,
    totalPoints: 2500,
    rank: "Gold",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5 h-full flex flex-col">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-1.5 mb-2.5 pb-2.5 border-b border-gray-200">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {!user.avatar && (
              <div className="text-base font-bold text-blue-500">
                {user.name[0]}
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h3 className="text-xs font-bold text-gray-900">{user.name}</h3>
          <p className="text-xs text-gray-600">{user.bio}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-2.5 pb-2.5 border-b border-gray-200">
        {/* Streak */}
        <div className="text-center p-1 bg-blue-50 rounded">
          <div className="text-sm mb-0.5">🔥</div>
          <div className="text-xs font-bold text-blue-600">{user.streak}</div>
          <div className="text-xs text-gray-600">Days</div>
        </div>

        {/* Rank */}
        <div className="text-center p-1 bg-yellow-50 rounded">
          <div className="text-sm mb-0.5">👑</div>
          <div className="text-xs font-bold text-yellow-600">{user.rank}</div>
          <div className="text-xs text-gray-600">Rank</div>
        </div>

        {/* Points */}
        <div className="text-center p-1 bg-green-50 rounded">
          <div className="text-sm mb-0.5">⭐</div>
          <div className="text-xs font-bold text-green-600">{(user.totalPoints / 100).toFixed(0)}K</div>
          <div className="text-xs text-gray-600">Pts</div>
        </div>
      </div>

      {/* View Profile Button */}
      <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-1 rounded text-xs transition-colors">
        View Profile
      </button>
    </div>
  );
};

export default ProfileSection;
