'use client';

import { useState } from 'react';
import {
  ModuleCompletionModal,
  CourseCompletionModal,
  SubmissionResultModal,
  EnrollCourseModal,
  UnenrollCourseModal,
} from '@/components/modals/Modals';

/**
 * USAGE EXAMPLES FOR ALL MODALS
 * 
 * Import the modals into your pages/components and use them as shown below.
 * Each modal comes with customizable props for different use cases.
 */

export default function ModalsDemo() {
  const [modals, setModals] = useState({
    moduleCompletion: false,
    courseCompletion: false,
    submissionResultMCQ: false,
    submissionResultCoding: false,
    enrollCourse: false,
    unenrollCourse: false,
  });

  const openModal = (modalName) => {
    setModals({ ...modals, [modalName]: true });
  };

  const closeModal = (modalName) => {
    setModals({ ...modals, [modalName]: false });
  };

  return (
    <div style={{ padding: '40px 20px' }}>
      <h1>Modal Components Demo</h1>
      <p>Click the buttons below to open different modal types</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
        <button
          style={{
            padding: '12px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
          onClick={() => openModal('moduleCompletion')}
        >
          Module Completion
        </button>

        <button
          style={{
            padding: '12px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
          onClick={() => openModal('courseCompletion')}
        >
          Course Completion
        </button>

        <button
          style={{
            padding: '12px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
          onClick={() => openModal('submissionResultMCQ')}
        >
          MCQ Result (Passed)
        </button>

        <button
          style={{
            padding: '12px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
          onClick={() => openModal('submissionResultCoding')}
        >
          Coding Result (Failed)
        </button>

        <button
          style={{
            padding: '12px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
          onClick={() => openModal('enrollCourse')}
        >
          Enroll Course
        </button>

        <button
          style={{
            padding: '12px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
          onClick={() => openModal('unenrollCourse')}
        >
          Unenroll Course
        </button>
      </div>

      {/* Module Completion Modal */}
      <ModuleCompletionModal
        isOpen={modals.moduleCompletion}
        onClose={() => closeModal('moduleCompletion')}
        moduleName="React Fundamentals"
      />

      {/* Course Completion Modal */}
      <CourseCompletionModal
        isOpen={modals.courseCompletion}
        onClose={() => closeModal('courseCompletion')}
        courseName="Full Stack Development"
      />

      {/* MCQ Submission Result Modal - Passed */}
      <SubmissionResultModal
        isOpen={modals.submissionResultMCQ}
        onClose={() => closeModal('submissionResultMCQ')}
        type="mcq"
        passed={true}
        score={85}
        totalQuestions={10}
        details={{ timeTaken: '8:45' }}
      />

      {/* Coding Submission Result Modal - Failed */}
      <SubmissionResultModal
        isOpen={modals.submissionResultCoding}
        onClose={() => closeModal('submissionResultCoding')}
        type="coding"
        passed={false}
        score={45}
        details={{ testsPassed: 4, executionTime: '180ms', memory: '18.5 MB' }}
      />

      {/* Enroll Course Modal */}
      <EnrollCourseModal
        isOpen={modals.enrollCourse}
        onClose={() => closeModal('enrollCourse')}
        courseName="React Fundamentals"
        level="Beginner"
      />

      {/* Unenroll Course Modal */}
      <UnenrollCourseModal
        isOpen={modals.unenrollCourse}
        onClose={() => closeModal('unenrollCourse')}
        courseName="React Fundamentals"
        progress={65}
      />
    </div>
  );
}

/**
 * IMPLEMENTATION GUIDE:
 * 
 * 1. IMPORT THE MODAL IN YOUR COMPONENT:
 *    import { ModuleCompletionModal } from '@/components/modals/Modals';
 * 
 * 2. ADD STATE FOR MODAL:
 *    const [showModal, setShowModal] = useState(false);
 * 
 * 3. USE THE MODAL:
 *    <ModuleCompletionModal
 *      isOpen={showModal}
 *      onClose={() => setShowModal(false)}
 *      moduleName="Your Module Name"
 *    />
 * 
 * 4. TRIGGER IT:
 *    <button onClick={() => setShowModal(true)}>Complete Module</button>
 * 
 * =====================================================
 * MODAL PROPS REFERENCE:
 * =====================================================
 * 
 * ModuleCompletionModal:
 *   - isOpen (boolean): Controls visibility
 *   - onClose (function): Called when modal closes
 *   - moduleName (string): Name of completed module
 * 
 * CourseCompletionModal:
 *   - isOpen (boolean): Controls visibility
 *   - onClose (function): Called when modal closes
 *   - courseName (string): Name of completed course
 * 
 * SubmissionResultModal:
 *   - isOpen (boolean): Controls visibility
 *   - onClose (function): Called when modal closes
 *   - type (string): 'mcq' or 'coding'
 *   - passed (boolean): Whether submission passed
 *   - score (number): Score percentage (0-100)
 *   - totalQuestions (number): Total MCQ questions
 *   - details (object): Custom details
 *     For MCQ: { timeTaken: '5:30' }
 *     For Coding: { testsPassed: 8, executionTime: '245ms', memory: '12.5 MB' }
 * 
 * EnrollCourseModal:
 *   - isOpen (boolean): Controls visibility
 *   - onClose (function): Called when modal closes
 *   - courseName (string): Course name
 *   - level (string): 'Beginner', 'Intermediate', 'Advanced'
 * 
 * UnenrollCourseModal:
 *   - isOpen (boolean): Controls visibility
 *   - onClose (function): Called when modal closes
 *   - courseName (string): Course name
 *   - progress (number): Current progress percentage
 */
