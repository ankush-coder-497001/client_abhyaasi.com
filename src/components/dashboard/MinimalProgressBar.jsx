import React, { useEffect, useState } from "react";
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getCourseProgressReport } from "../../api_services/progress.api";

const MinimalProgressBar = () => {
  const navigate = useNavigate();
  const { user, courses, isCoursEnrolled, enrolledCourseId } = useApp();
  const [progressData, setProgressData] = useState({
    module: "",
    course: "",
    moduleProgress: 0,
    courseProgress: 0,
    points: 0,
  });
  const [loading, setLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Get current enrolled course
  const currentCourse = courses.find(c => user?.currentCourse === c._id);
  const isEnrolled = currentCourse && isCoursEnrolled(currentCourse._id);

  // Get all enrolled courses
  const enrolledCourses = courses.filter(c => isCoursEnrolled(c._id));

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isEnrolled || !currentCourse) return;

      try {
        setLoading(true);
        const report = await getCourseProgressReport(currentCourse._id);

        const courseProgressPercentage = report?.progress || report?.courseProgress || 0;
        const moduleProgressPercentage = report?.moduleProgress || 0;
        const currentModule = currentCourse?.modules?.find(m => m._id === user?.currentModule);

        console.log(currentModule)


        setProgressData({
          module: currentModule?.title || "Module",
          moduleId: currentModule?._id || "",
          course: currentCourse.title,
          moduleProgress: moduleProgressPercentage,
          courseProgress: courseProgressPercentage,
          points: user?.points || 0,
        });
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();

    console.log("Fetching progress for course:", currentCourse);
    console.log("progressData before fetch:", progressData);
  }, [isEnrolled, currentCourse, user?.points]);

  const handlePrevCourse = () => {
    setCarouselIndex((prev) => (prev === 0 ? enrolledCourses.length - 1 : prev - 1));
  };

  const handleNextCourse = () => {
    setCarouselIndex((prev) => (prev === enrolledCourses.length - 1 ? 0 : prev + 1));
  };

  // If user is not enrolled in any course, show carousel of available courses
  if (!isEnrolled || !currentCourse) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">Explore Courses</p>
          <p className="text-xs text-gray-600">Enroll in a course to start learning</p>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="relative">
            {/* Course Carousel */}
            <div className="flex gap-2">
              {enrolledCourses.length > 1 && (
                <button
                  onClick={handlePrevCourse}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors shrink-0"
                >
                  <FaChevronLeft size={12} />
                </button>
              )}

              <div className="flex-1 overflow-hidden">
                <div className="flex gap-2 transition-transform duration-300" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                  {enrolledCourses.map((course) => (
                    <div
                      key={course._id}
                      className="shrink-0 w-full p-3 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg cursor-pointer hover:shadow-md transition-all"
                      onClick={() => navigate(`/course-details/${course._id}`)}
                    >
                      <h3 className="text-xs font-semibold text-gray-900 truncate mb-2">{course.title}</h3>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-1.5 bg-blue-500 transition-all"
                          style={{ width: `${Math.random() * 80 + 10}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">{course.duration} • {course.moduleCount || 0} modules</p>
                    </div>
                  ))}
                </div>
              </div>

              {enrolledCourses.length > 1 && (
                <button
                  onClick={handleNextCourse}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors shrink-0"
                >
                  <FaChevronRight size={12} />
                </button>
              )}
            </div>

            {/* Carousel Indicators */}
            {enrolledCourses.length > 1 && (
              <div className="flex gap-1 justify-center mt-2">
                {enrolledCourses.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${idx === carouselIndex ? "w-6 bg-blue-600" : "w-1.5 bg-gray-300"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-xs text-gray-600 mb-2">No Enrolled Courses</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Course Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-700">Course Progress</span>
              <span className="text-xs text-gray-600">{progressData.courseProgress}%</span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">{currentCourse.title}</p>
          </div>
          <button onClick={() => navigate(`/module/${progressData.moduleId}`)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold transition-colors transform hover:scale-105">
            <FaPlayCircle size={9} />
            <span>Resume</span>
          </button>
        </div>

        {/* Course Progress bar */}
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all"
            style={{ width: `${progressData.courseProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Module Progress Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-700">Module Progress</span>
              <span className="text-xs text-gray-600">{progressData.moduleProgress}%</span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">{progressData.module}</p>
          </div>
        </div>

        {/* Module Progress bar */}
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="h-1.5 rounded-full bg-green-500 transition-all"
            style={{ width: `${progressData.moduleProgress}%` }}
          ></div>
        </div>

        {/* Points info */}
        <div className="text-xs text-gray-600">
          <span className="font-semibold">Points Earned:</span>
          <span className="text-blue-600 font-semibold ml-1">+{progressData.points} pts</span>
        </div>
      </div>
    </div>
  );
};

export default MinimalProgressBar;