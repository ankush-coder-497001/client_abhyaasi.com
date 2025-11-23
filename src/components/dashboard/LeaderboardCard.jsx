import React from "react";
import { FaMedal, FaTrophy } from "react-icons/fa";

const LeaderboardCard = () => {
  // Mock data - replace with actual data from API/context
  const currentUser = {
    name: "Aatosh",
    rank: 4,
    points: 2500,
  };

  const topUsers = [
    { id: 1, name: "Sarah", points: 3500, rank: 1 },
    { id: 2, name: "John", points: 3200, rank: 2 },
    { id: 3, name: "Emma", points: 2800, rank: 3 },
    { id: 4, name: "Aatosh", points: 2500, rank: 4, isCurrentUser: true },
    { id: 5, name: "Mike", points: 2300, rank: 5 },
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500" size={14} />;
    if (rank === 2) return <FaMedal className="text-gray-400" size={14} />;
    if (rank === 3) return <FaMedal className="text-orange-600" size={14} />;
    return <span className="text-xs font-bold text-gray-600">#{rank}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-2 border-b border-gray-200 bg-linear-to-r from-blue-50 to-white">
        <h3 className="text-xs font-bold text-gray-900">🏆 Leaderboard</h3>
        <p className="text-xs text-gray-500 mt-0.5">Your Rank: <span className="font-bold text-blue-600">#{currentUser.rank}</span></p>
      </div>

      {/* Leaderboard List */}
      <div className="divide-y divide-gray-200">
        {topUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-center justify-between px-2 py-3 transition-all ${user.isCurrentUser
              ? "bg-blue-50 border-l-2 border-l-blue-500"
              : "hover:bg-gray-50"
              }`}
          >
            {/* Rank and Name */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center justify-center w-5 h-5 shrink-0">
                {getRankIcon(user.rank)}
              </div>
              <span
                className={`text-xs font-semibold truncate ${user.isCurrentUser ? "text-blue-600" : "text-gray-700"
                  }`}
              >
                {user.name}
                {user.isCurrentUser && <span className="ml-1">👤</span>}
              </span>
            </div>

            {/* Points */}
            <span className="text-xs font-bold text-gray-600 ml-2 shrink-0">
              {(user.points / 100).toFixed(0)}K
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="px-2.5 py-2 bg-gray-50 text-center text-xs text-gray-600 font-medium">
        <span className="text-blue-600 font-bold">{currentUser.points}</span> points • Keep Going! 🚀
      </div>
    </div>
  );
};

export default LeaderboardCard;
