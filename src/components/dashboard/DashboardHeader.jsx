import TextFliping from "../../components/ui/TextFliping";

const DashboardHeader = () => {
  const user = {
    name: "Aatosh Kumar",
    points: 2500,
    rank: "Gold",
    badges: ["AI Master"],
  };
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
      <div className="flex-1">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold break-words"
          style={{ color: "black" }}
        >
          <span className="text-blue-600">Welcome back,</span> {user.name} 👋
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Keep learning, keep growing.
        </p>
      </div>

      {/* User Info Card */}
      <div className="w-full sm:w-auto bg-white rounded-2xl shadow-md px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 sm:gap-6 hover:shadow-lg transition-all ease-in">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0">
          {user.name[0]}
        </div>

        {/* Points */}
        <div className="min-w-fit">
          <p className="text-xs sm:text-sm text-gray-600">Points</p>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {user.points}
          </h3>
        </div>

        {/* Rank */}
        <div className="min-w-fit">
          <p className="text-xs sm:text-sm text-gray-600">Rank</p>
          <h3 className="text-base sm:text-lg font-semibold text-yellow-600">
            {user.rank}
          </h3>
        </div>

        {/* Badges */}
        <div className="min-w-fit">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Badges</p>
          <div className="flex justify-center items-center px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm">
            <TextFliping words={["AI Master", "Frontend Developer"]} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
