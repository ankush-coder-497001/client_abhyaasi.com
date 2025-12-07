import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser, trackActivity } from '../api_services/users.api';
import { getAllCourses, enrollInCourse, unenrollFromCourse } from '../api_services/courses.api';
import { getAllProfessions, enrollInProfession, unenrollFromProfession } from '../api_services/professions.api';

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

  // Track user activity on app load if token exists
  useEffect(() => {
    const token = localStorage.getItem('abhyaasi_authToken');
    const isTracked = sessionStorage.getItem('abhyaasi_trackactivity') === 'true';



    if (token && !isTracked) {
      // Track activity immediately when token exists
      trackActivity().catch((error) => {
        console.error('Failed to track activity:', error);
      });

      sessionStorage.setItem('abhyaasi_trackactivity', 'true');

    }
  }, []);

  // Fetch user data
  const { data: userData, isLoading: userLoading, error: userError, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await getUser();
        const data = response.profile || response;
        return data;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });

  // Fetch all courses
  const { data: coursesData, isLoading: coursesLoading, error: coursesError, refetch: refetchCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const response = await getAllCourses();
        const data = Array.isArray(response.data) ? response : Array.isArray(response) ? response : [];
        return data;
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });

  // Fetch all professions
  const { data: professionsData, isLoading: professionsLoading, error: professionsError, refetch: refetchProfessions } = useQuery({
    queryKey: ['professions'],
    queryFn: async () => {
      try {
        const response = await getAllProfessions();
        console.log("AppContext - fetched professions:", response);
        const data = Array.isArray(response.professions) ? response.professions : [];
        console.log("AppContext - professions data:", data);
        return data;
      } catch (error) {
        console.error('Error fetching professions:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });

  console.log("AppContext - userData:", userData);

  // Extract enrolled course and profession IDs from user data
  const enrolledCourseId = userData?.currentCourse;
  const enrolledProfessionIds = userData?.enrolledProfessions || [];



  const enrolledProfessionsSet = new Set(
    enrolledProfessionIds.map((item) => (typeof item === 'object' ? item._id : item))
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

    // Helper methods
    isCoursEnrolled: (courseId) => enrolledCourseId === courseId,
    isProfessionEnrolled: (professionId) => enrolledProfessionsSet.has(professionId),

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
