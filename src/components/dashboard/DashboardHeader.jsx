import { FaCompass } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  // Custom messages based on time/progress
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getMessage = () => {
    const messages = [
      "Keep up the great work! 🚀",
      "You're on fire today! 🔥",
      "Stay focused! 💪",
      "Learning never stops! 📚",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const firstName = user?.firstName || user?.name?.split(' ')[0] || "User";

  return (
    <div className="flex items-center justify-between gap-6 mb-8 px-1 py-3">
      {/* Left: Greeting and Name */}
      <div className="flex items-baseline gap-3">
        <div>
          <p className="text-xs text-gray-600">{getGreeting()}</p>
          <h2 className="text-lg font-bold text-gray-900">{firstName} 👋</h2>
        </div>
      </div>

      {/* Middle: Custom Message */}
      <div className="text-xs text-gray-700 font-medium px-3 py-1.5 bg-blue-50 rounded-lg flex-1 text-center">
        {getMessage()}
      </div>

      {/* Right: Browse Courses Button */}
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors transform hover:scale-105 whitespace-nowrap"
      >
        <FaCompass size={12} />
        <span>Browse</span>
      </button>
    </div>
  );
};

export default DashboardHeader;
