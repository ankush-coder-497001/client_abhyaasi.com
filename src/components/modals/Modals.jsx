'use client';

import { useState } from 'react';
import { X, CheckCircle, Award, AlertCircle, BookOpen, Trash2 } from 'lucide-react';
import './modals.css';

// Base Modal Wrapper
export const Modal = ({ isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content modal-${size}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

// 1. Module Completion Modal
export const ModuleCompletionModal = ({ isOpen, onClose, moduleName = 'React Fundamentals' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="modal-body text-center">
        <div className="success-icon">
          <CheckCircle size={56} />
        </div>
        <h2 className="modal-title">Module Completed!</h2>
        <p className="modal-subtitle">
          Great job! You've successfully completed <strong>{moduleName}</strong>
        </p>
        <div className="completion-stats">
          <div className="stat">
            <p className="stat-value">+50</p>
            <p className="stat-label">Points Earned</p>
          </div>
          <div className="stat">
            <p className="stat-value">100%</p>
            <p className="stat-label">Progress</p>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Continue to Next Module
          </button>
          <button className="btn-secondary" onClick={onClose}>
            View Certificate
          </button>
        </div>
      </div>
    </Modal>
  );
};

// 2. Course Completion Modal
export const CourseCompletionModal = ({ isOpen, onClose, courseName = 'Full Stack Development' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="modal-body text-center">
        <div className="success-icon large">
          <Award size={64} />
        </div>
        <h2 className="modal-title">Course Completed!</h2>
        <p className="modal-subtitle">
          Congratulations! You've successfully completed <strong>{courseName}</strong>
        </p>
        <div className="completion-badge">
          <p className="badge-text">Certificate of Completion</p>
        </div>
        <div className="completion-stats">
          <div className="stat">
            <p className="stat-value">+200</p>
            <p className="stat-label">Points Earned</p>
          </div>
          <div className="stat">
            <p className="stat-value">Gold</p>
            <p className="stat-label">Badge Unlocked</p>
          </div>
        </div>
        <div className="modal-actions stacked">
          <button className="btn-primary" onClick={onClose}>
            Download Certificate
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Share Achievement
          </button>
          <button className="btn-tertiary" onClick={onClose}>
            Explore More Courses
          </button>
        </div>
      </div>
    </Modal>
  );
};

// 3. Submission Result Modal (for Coding and MCQ)
export const SubmissionResultModal = ({ isOpen, onClose, type = 'mcq', passed = true, score = 85, totalQuestions = 10, details = {} }) => {
  const resultText = passed ? 'Excellent!' : 'Try Again';
  const resultType = passed ? 'success' : 'warning';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="modal-body text-center">
        <div className={`result-icon ${resultType}`}>
          {passed ? <CheckCircle size={56} /> : <AlertCircle size={56} />}
        </div>
        <h2 className="modal-title">{resultText}</h2>
        <p className="modal-subtitle">
          {type === 'mcq' ? 'Your MCQ submission has been evaluated' : 'Your code submission has been evaluated'}
        </p>

        <div className="result-score">
          <div className="score-circle">
            <p className="score-value">{score}%</p>
          </div>
          <p className="score-label">Score</p>
        </div>

        {type === 'mcq' && (
          <div className="result-details">
            <div className="detail-row">
              <span className="detail-label">Questions Correct:</span>
              <span className="detail-value">{Math.ceil(totalQuestions * (score / 100))}/{totalQuestions}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Time Taken:</span>
              <span className="detail-value">{details.timeTaken || '5:30'}</span>
            </div>
          </div>
        )}

        {type === 'coding' && (
          <div className="result-details">
            <div className="detail-row">
              <span className="detail-label">Test Cases Passed:</span>
              <span className="detail-value">{details.testsPassed || '8'}/10</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Execution Time:</span>
              <span className="detail-value">{details.executionTime || '245ms'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Memory Used:</span>
              <span className="detail-value">{details.memory || '12.5 MB'}</span>
            </div>
          </div>
        )}

        <div className="modal-actions">
          {passed ? (
            <>
              <button className="btn-primary" onClick={onClose}>
                Proceed to Next
              </button>
              <button className="btn-secondary" onClick={onClose}>
                View Solution
              </button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={onClose}>
                Try Again
              </button>
              <button className="btn-secondary" onClick={onClose}>
                View Hints
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

// 4. Enroll Course Modal
export const EnrollCourseModal = ({ isOpen, onClose, courseName = 'React Fundamentals', level = 'Beginner' }) => {
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="modal-body">
        <div className="course-enroll-header">
          <BookOpen size={40} className="course-icon" />
          <h2 className="modal-title">Enroll in Course</h2>
          <p className="modal-subtitle">Ready to start learning?</p>
        </div>

        <div className="course-info">
          <div className="info-row">
            <span className="label">Course:</span>
            <span className="value">{courseName}</span>
          </div>
          <div className="info-row">
            <span className="label">Level:</span>
            <span className="badge">{level}</span>
          </div>
          <div className="info-row">
            <span className="label">Duration:</span>
            <span className="value">4 weeks</span>
          </div>
          <div className="info-row">
            <span className="label">Difficulty:</span>
            <span className="value">Medium</span>
          </div>
        </div>

        <div className="agreement">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="checkbox"
          />
          <label htmlFor="terms" className="agreement-text">
            I agree to enroll and follow the course guidelines
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" disabled={!agreeTerms} onClick={onClose}>
            Confirm Enrollment
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

// 5. Unenroll Course Modal
export const UnenrollCourseModal = ({ isOpen, onClose, courseName = 'React Fundamentals', progress = 65 }) => {
  const [confirmUnenroll, setConfirmUnenroll] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="modal-body">
        <div className="unenroll-header">
          <Trash2 size={40} className="unenroll-icon" />
          <h2 className="modal-title">Unenroll from Course?</h2>
          <p className="modal-subtitle">This action cannot be undone</p>
        </div>

        <div className="unenroll-warning">
          <p>
            You are currently <strong>{progress}%</strong> through <strong>{courseName}</strong>.
            If you unenroll, your progress will be lost.
          </p>
        </div>

        <div className="confirm-input">
          <label className="confirm-label">Type "UNENROLL" to confirm</label>
          <input
            type="text"
            value={confirmUnenroll}
            onChange={(e) => setConfirmUnenroll(e.target.value)}
            placeholder="Type UNENROLL"
            className="form-input"
          />
        </div>

        <div className="modal-actions">
          <button
            className="btn-danger"
            disabled={confirmUnenroll !== 'UNENROLL'}
            onClick={onClose}
          >
            Confirm Unenroll
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Keep Learning
          </button>
        </div>
      </div>
    </Modal>
  );
};
