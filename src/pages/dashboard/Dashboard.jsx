import "../../styles/premium-dashboard.css";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import MinimalProgressBar from "../../components/dashboard/MinimalProgressBar";
import ProfileSection from "../../components/dashboard/ProfileSection";
import PremiumCalendar from "../../components/dashboard/PremiumCalendar";
import LeaderboardCard from "../../components/dashboard/LeaderboardCard";
import CourseHistory from "../../components/dashboard/CourseHistory";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header: Greeting, Name, Message, Browse Button */}
      <div className="px-4 md:px-6">
        <DashboardHeader />
      </div>

      {/* Main Content: Profile and Calendar */}
      <div className="px-4 md:px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Left: Profile and Progress Bar */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <MinimalProgressBar />
            <ProfileSection />
          </div>

          {/* Center: Calendar */}
          <div className="lg:col-span-2">
            <PremiumCalendar />
          </div>

          {/* Right: Leaderboard */}
          <div className="lg:col-span-2">
            <LeaderboardCard />
          </div>
        </div>
      </div>      {/* Bottom: Course History */}
      <div className="px-4 md:px-6 pb-6">
        <CourseHistory />
      </div>
    </div>
  );
};

export default Dashboard;
