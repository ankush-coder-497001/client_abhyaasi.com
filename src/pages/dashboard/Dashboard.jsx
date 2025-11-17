import DashboardHeader from "../../components/dashboard/DashboardHeader";
import OngoingLearning from "../../components/dashboard/OngoingLearning";
import AttendanceCalendar from "../../components/dashboard/AttendanceCalendar";
import AttendanceChart from "../../components/dashboard/AttendanceChart";
import LearnerHistory from "../../components/dashboard/LearnerHistory";

const chartData = [
  { name: "Mon", progress: 40 },
  { name: "Tue", progress: 65 },
  { name: "Wed", progress: 50 },
  { name: "Thu", progress: 80 },
  { name: "Fri", progress: 60 },
  { name: "Sat", progress: 90 },
  { name: "Sun", progress: 70 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 py-5 pb-12">
      {/* Header */}
      <DashboardHeader />

      {/* Ongoing Learning Section */}
      <div className="mb-8">
        <h1
          className="mb-4 font-bold"
          style={{ color: "black", fontSize: "15px" }}
        >
          Ongoing Learning
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Ongoing Course */}
          <OngoingLearning type="course" />

          {/* Ongoing Profession */}
          <OngoingLearning type="profession" />
        </div>
      </div>

      {/* Attendance Section */}
      <div className="mb-8">
        <h1
          className="font-bold mb-4"
          style={{ color: "black", fontSize: "15px" }}
        >
          Attendance
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Calendar */}

          <AttendanceCalendar />

          {/* Chart */}
          <AttendanceChart />
        </div>
      </div>

      {/* Learner History */}
      <div>
        <h1
          className="font-bold mb-4"
          style={{ color: "black", fontSize: "15px" }}
        >
          Learner History
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <LearnerHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
