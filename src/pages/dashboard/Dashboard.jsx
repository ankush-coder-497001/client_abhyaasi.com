import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
          className="text-xl md:text-2xl font-bold mb-4"
          style={{ color: "black" }}
        >
          Ongoing Learning
        </h1>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-2 min-w-min md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
            {/* Ongoing Course */}
            <OngoingLearning type="course" />
            <OngoingLearning type="profession" />
            <OngoingLearning type="course" />

            {/* Ongoing Profession */}
            <OngoingLearning type="profession" />
          </div>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="mb-8">
        <h1
          className="text-xl md:text-2xl font-bold mb-4"
          style={{ color: "black" }}
        >
          Attendance
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max lg:auto-rows-fr">
          {/* Calendar */}
          <div className="lg:col-span-1 h-fit lg:h-full">
            <AttendanceCalendar />
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 h-96 sm:h-full">
            <AttendanceChart />
          </div>
        </div>
      </div>

      {/* Learner History */}
      <div>
        <LearnerHistory />
      </div>
    </div>
  );
};

export default Dashboard;
