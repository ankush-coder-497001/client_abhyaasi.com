import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser, trackActivity } from '../api_services/users.api';
import { getAllCourses, enrollInCourse, unenrollFromCourse } from '../api_services/courses.api';
import { getAllProfessions, enrollInProfession, unenrollFromProfession } from '../api_services/professions.api';
import { getModule } from '../api_services/modules.api';
import { retryFetch } from '../utils/retryFetch';

/**
 * AppContext - Manages user, courses, and professions data
 * Uses React Query for data fetching and caching
 */
const AppContext = createContext(null);

/**
 * AppProvider - Context provider component
 * Wraps the entire app with data fetching capabilities
 */
export const AppProvider = ({ children }) => {
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [moduleCache, setModuleCache] = useState({}); // Cache for fetched modules

  // Track user activity on app load if token exists
  useEffect(() => {
    // Track activity immediately when token exists
    trackActivity().catch((error) => {
      console.error('Failed to track activity:', error);
    });
  }, []);

  // Listen for token changes and refetch data
  const [lastToken, setLastToken] = useState(localStorage.getItem('abhyaasi_authToken'));

  // Fetch user data with frequent refetch and fallback retries
  const { data: userData, isLoading: userLoading, error: userError, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        // Use retryFetch for automatic fallback fetches (2 retries)
        const response = await retryFetch(
          () => getUser(),
          2, // maxRetries
          500 // delayMs
        );
        const data = response.profile || response;
        console.log('User data fetched successfully:', data);
        return data;
      } catch (error) {
        console.error('Failed to fetch user data after all retry attempts:', error);
        throw error;
      }
    },
    staleTime: 1000 * 30, // 30 seconds - frequent updates for real-time module tracking
    gcTime: 1000 * 60, // 1 minute garbage collection
    retry: 3, // React Query's built-in retry (additional layer)
    enabled: !!localStorage.getItem('abhyaasi_authToken'), // Only fetch if logged in
  });

  // Fetch all courses with fallback retries
  const { data: coursesData, isLoading: coursesLoading, error: coursesError, refetch: refetchCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const response = await retryFetch(
          () => getAllCourses(),
          2, // maxRetries
          500 // delayMs
        );
        const data = Array.isArray(response.data) ? response : Array.isArray(response) ? response : [];
        console.log('Courses data fetched successfully:', data);
        return data;
      } catch (error) {
        console.error('Failed to fetch courses after all retry attempts:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3, // React Query's built-in retry (additional layer)
    enabled: !!localStorage.getItem('abhyaasi_authToken'), // Only fetch if logged in
  });

  // Fetch all professions with fallback retries
  const { data: professionsData, isLoading: professionsLoading, error: professionsError, refetch: refetchProfessions } = useQuery({
    queryKey: ['professions'],
    queryFn: async () => {
      try {
        const response = await retryFetch(
          () => getAllProfessions(),
          2, // maxRetries
          500 // delayMs
        );
        console.log("AppContext - fetched professions:", response);
        const data = Array.isArray(response.professions) ? response.professions : [];
        console.log("AppContext - professions data:", data);
        return data;
      } catch (error) {
        console.error('Failed to fetch professions after all retry attempts:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3, // React Query's built-in retry (additional layer)
    enabled: !!localStorage.getItem('abhyaasi_authToken'), // Only fetch if logged in
  });

  // Listen for token changes and refetch data
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('abhyaasi_authToken');
      if (currentToken !== lastToken) {
        console.log('Token changed - refetching data');
        setLastToken(currentToken);
        // If token exists, refetch all data
        if (currentToken) {
          refetchUser();
          refetchCourses();
          refetchProfessions();
        }
      }
    };

    // Check token immediately
    checkToken();

    // Check token every 1 second to catch login changes
    const interval = setInterval(checkToken, 1000);

    return () => clearInterval(interval);
  }, [lastToken, refetchUser, refetchCourses, refetchProfessions]);

  // Extract enrolled course and profession IDs from user data
  const enrolledCourseId = userData?.currentCourse?._id;
  const enrolledProfessionIds = userData?.enrolledProfessions || [];

  const enrolledProfessionsSet = new Set(
    enrolledProfessionIds.map((item) => {
      // Handle new format: { professionId: ..., enrolledDate: ... }
      if (item?.professionId) {
        return typeof item.professionId === 'object' ? item.professionId._id : item.professionId;
      }
      // Handle old format: direct ID
      return typeof item === 'object' ? item._id : item;
    })
  );




  // Enroll in a course
  const enrollCourse = async (courseId) => {
    try {
      setEnrollmentLoading(true);
      await enrollInCourse(courseId);
      // Refetch user data to update enrolled courses
      await refetchUser();
      return { success: true, message: 'Successfully enrolled in course' };
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Unenroll from a course
  const unenrollCourse = async (courseId) => {
    try {
      setEnrollmentLoading(true);
      await unenrollFromCourse(courseId);
      // Refetch user data to update enrolled courses
      await refetchUser();
      return { success: true, message: 'Successfully unenrolled from course' };
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      throw error;
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Enroll in a profession
  const enrollProfession = async (professionId) => {
    try {
      setEnrollmentLoading(true);
      await enrollInProfession(professionId);
      // Refetch user data to update enrolled professions
      await refetchUser();
      return { success: true, message: 'Successfully enrolled in profession' };
    } catch (error) {
      console.error('Error enrolling in profession:', error);
      throw error;
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Unenroll from a profession
  const unenrollProfession = async (professionId) => {
    try {
      setEnrollmentLoading(true);
      await unenrollFromProfession(professionId);
      // Refetch user data to update enrolled professions
      await refetchUser();
      return { success: true, message: 'Successfully unenrolled from profession' };
    } catch (error) {
      console.error('Error unenrolling from profession:', error);
      throw error;
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const getUserCompletedCourses = () => {
    const completedCoursesData = userData?.completedCourses || [];
    // Map to return both course data and completion metadata
    return completedCoursesData.map(completedItem => {
      // courseId can be either a string ID or a populated course object
      let course = {};

      if (typeof completedItem.courseId === 'object' && completedItem.courseId?._id) {
        // Already populated from backend
        course = completedItem.courseId;
      } else {
        // It's just an ID, find it in coursesData
        const courseId = completedItem.courseId || completedItem;
        course = coursesData?.find(c => c._id === courseId) || {};
      }

      return {
        ...course,
        // Add completion metadata
        completionMetadata: {
          points: completedItem.points || 500,
          completedDate: completedItem.completedDate,
          certificate: completedItem.certificate || false,
          certificateUrl: completedItem.certificateUrl,
          certificatePdfUrl: completedItem.certificatePdfUrl,
          certificateImageUrl: completedItem.certificateImageUrl,
        }
      };
    }).filter(item => item._id);
  }

  const getUserCompletedProfessions = () => {
    const completedProfessionsData = userData?.completedProfessions || [];
    // Map to return both profession data and completion metadata
    return completedProfessionsData.map(completedItem => {
      // professionId can be either a string ID or a populated profession object
      let profession = {};

      if (typeof completedItem.professionId === 'object' && completedItem.professionId?._id) {
        // Already populated from backend
        profession = completedItem.professionId;
      } else {
        // It's just an ID, find it in professionsData
        const professionId = completedItem.professionId || completedItem;
        profession = professionsData?.find(p => p._id === professionId) || {};
      }

      return {
        ...profession,
        // Add completion metadata
        completionMetadata: {
          points: completedItem.points || 1000,
          completedDate: completedItem.completedDate,
          certificate: completedItem.certificate || false,
          certificateUrl: completedItem.certificateUrl,
          certificatePdfUrl: completedItem.certificatePdfUrl,
          certificateImageUrl: completedItem.certificateImageUrl,
        }
      };
    }).filter(item => item._id);
  }

  // Function to fetch and cache module details
  const fetchModuleDetails = async (moduleId) => {
    // Return from cache if available
    if (moduleCache[moduleId]) {
      return moduleCache[moduleId];
    }

    try {
      const moduleData = await getModule(moduleId);

      // Cache the module data
      setModuleCache(prev => ({
        ...prev,
        [moduleId]: moduleData.data
      }));
      return moduleData.data;
    } catch (error) {
      console.error(`Failed to fetch module ${moduleId}:`, error);
      return null;
    }
  }

  // Check if a course is already completed by the user
  const isCourseCompleted = (courseId) => {
    if (!userData?.completedCourses) return false;
    return userData.completedCourses.some(completed => {
      const id = typeof completed.courseId === 'object' ? completed.courseId?._id : completed.courseId;
      return id === courseId;
    });
  }

  // Check if a profession is already completed by the user
  const isProfessionCompleted = (professionId) => {
    if (!userData?.completedProfessions) return false;
    return userData.completedProfessions.some(completed => {
      const id = typeof completed.professionId === 'object' ? completed.professionId?._id : completed.professionId;
      return id === professionId;
    });
  }

  // Create context value
  const contextValue = {
    // User data
    user: userData || null,
    userLoading,
    userError,
    refetchUser,

    // Courses data
    courses: coursesData || [],
    coursesLoading,
    coursesError,
    refetchCourses,

    // Professions data
    professions: professionsData || [],
    professionsLoading,
    professionsError,
    refetchProfessions,

    // Enrollment tracking
    enrolledCourseId,
    enrolledProfessionIds,
    enrolledProfessionsSet,

    // Enrollment methods
    enrollCourse,
    unenrollCourse,
    enrollProfession,
    unenrollProfession,
    enrollmentLoading,

    // User completed courses and professions
    getUserCompletedCourses,
    getUserCompletedProfessions,

    // Module data and methods
    moduleCache,
    fetchModuleDetails,

    // Helper methods
    isCoursEnrolled: (courseId) => enrolledCourseId === courseId,
    isProfessionEnrolled: (professionId) => enrolledProfessionsSet.has(professionId),
    isCourseCompleted,
    isProfessionCompleted,

    // Loading states
    isLoading: userLoading || coursesLoading || professionsLoading || enrollmentLoading,
    hasError: !!userError || !!coursesError || !!professionsError,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

/**
 * useApp - Custom hook to use AppContext
 * Must be used inside AppProvider
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
};

export default AppContext;
