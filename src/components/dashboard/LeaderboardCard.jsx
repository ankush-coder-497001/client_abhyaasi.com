import React, { useEffect, useState } from "react";
import { FaMedal, FaTrophy } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import { getLeaderboard } from "../../api_services/leaderboard.api";
import { Loader } from "lucide-react";

const LeaderboardCard = () => {
  const { user } = useApp();
  const [leaderboardData, setLeaderboardData] = useState({ currentUser: null, topUsers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();

        // Find current user in leaderboard
        const currentUserData = data?.leaderboard?.find(u => u.userId === user?._id);

        setLeaderboardData({
          currentUser: currentUserData || {
            name: user?.firstName || "User",
            rankPosition: 0,
            totalPoints: user?.points || 0,
            rank: "Beginner",
            userId: user?._id
          },
          topUsers: data?.leaderboard || [],
        });
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Fallback to user data if API fails
        setLeaderboardData({
          currentUser: {
            name: user?.firstName || "User",
            rankPosition: 0,
            totalPoints: user?.points || 0,
            rank: "Beginner",
            userId: user?._id
          },
          topUsers: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const { currentUser, topUsers } = leaderboardData;

  const getRankIcon = (rankPosition) => {
    if (rankPosition === 1) return <FaTrophy className="text-yellow-500" size={14} />;
    if (rankPosition === 2) return <FaMedal className="text-gray-400" size={14} />;
    if (rankPosition === 3) return <FaMedal className="text-orange-600" size={14} />;
    return <span className="text-xs font-bold text-gray-600">#{rankPosition}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-linear-to-r from-blue-50 to-white shrink-0">
        <h3 className="text-xs font-bold text-gray-900">🏆 Leaderboard</h3>
        <p className="text-xs text-gray-500 mt-0.5">Your Rank: <span className="font-bold text-blue-600">{currentUser?.rankPosition ? `#${currentUser.rankPosition}` : "Unranked"}</span></p>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center flex flex-col items-center justify-center h-full">
            <Loader className="animate-spin text-blue-600 mb-2" size={20} />
            <p className="text-xs text-gray-600">Loading leaderboard...</p>
          </div>
        ) : topUsers && topUsers.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {topUsers.slice(0, 5).map((leaderUser) => (
              <div
                key={leaderUser.userId}
                className={`flex items-center justify-between px-3 py-3 transition-all ${leaderUser.userId === user?._id
                  ? "bg-blue-50 border-l-2 border-l-blue-500"
                  : "hover:bg-gray-50"
                  }`}
              >
                {/* Rank and Name */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-5 h-5 shrink-0">
                    {getRankIcon(leaderUser.rankPosition)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-xs font-semibold truncate block ${leaderUser.userId === user?._id ? "text-blue-600" : "text-gray-700"
                        }`}
                    >
                      {leaderUser.name}
                      {leaderUser.userId === user?._id && <span className="ml-1">👤</span>}
                    </span>
                    <span className="text-xs text-gray-500">{leaderUser.rank}</span>
                  </div>
                </div>

                {/* Points */}
                <span className="text-xs font-bold text-gray-600 ml-2 shrink-0">
                  {leaderUser.totalPoints} pts
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center flex flex-col items-center justify-center h-full">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-xs text-gray-600 font-medium mb-1">No Leaderboard Data</p>
            <p className="text-xs text-gray-500">Complete courses to appear on the leaderboard</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2.5 bg-gray-50 text-center text-xs text-gray-600 font-medium border-t border-gray-200 shrink-0">
        <span className="text-blue-600 font-bold">{currentUser?.totalPoints || 0}</span> points • <span className="text-gray-700">{currentUser?.rank || "Beginner"}</span> • Keep Going! 🚀
      </div>
    </div>
  );
};

export default LeaderboardCard;
