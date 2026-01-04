import React, { useState, useEffect } from "react";
import {
  X, ChevronDown, ChevronUp, Book, Lightbulb, Award, Calendar,
  Zap, Copy, Check, BookOpen
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./completed-details-modal.css";

const CompletedDetailsModal = ({ isOpen, onClose, item, type }) => {
  const { courses, fetchModuleDetails, moduleCache } = useApp();
  const [expandedItems, setExpandedItems] = useState({});
  const [moduleDetails, setModuleDetails] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Fetch module details when modal opens
  useEffect(() => {
    if (!isOpen || !item) return;

    const fetchModules = async () => {
      const details = {};
      let modulesToFetch = [];

      if (type === "course" && item?.modules) {
        modulesToFetch = item.modules;
      } else if (type === "profession" && item?.courses) {
        for (const courseRef of item.courses) {
          const courseId = courseRef.course || courseRef;
          const course = courses.find(c => c._id === courseId);
          if (course?.modules) {
            modulesToFetch = [...modulesToFetch, ...course.modules];
          }
        }
      }

      for (const moduleId of modulesToFetch) {
        const moduleIdStr = typeof moduleId === 'string' ? moduleId : (moduleId?._id || moduleId?.id);
        if (!moduleIdStr) continue;

        if (moduleCache[moduleIdStr]) {
          details[moduleIdStr] = moduleCache[moduleIdStr];
        } else {
          try {
            const moduleData = await fetchModuleDetails(moduleIdStr);
            if (moduleData) {
              details[moduleIdStr] = moduleData;
            }
          } catch (error) {
            console.error(`Error fetching module ${moduleIdStr}:`, error);
          }
        }
      }
      setModuleDetails(details);
    };

    fetchModules();
  }, [isOpen, type, item, courses, fetchModuleDetails, moduleCache]);

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getRelatedCourses = () => {
    if (type === "course") return [];
    if (type === "profession" && item && item.courses) {
      return item.courses
        .map(c => {
          const course = courses.find(co => co._id === (c.course || c));
          return course;
        })
        .filter(Boolean);
    }
    return [];
  };

  const handleCopyAnswer = (answer) => {
    navigator.clipboard.writeText(answer);
    setCopiedId(answer);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderQuestionCard = (question, idx, moduleTitle) => {
    const questionKey = `interview-${idx}-${moduleTitle}`;
    const isExpanded = expandedItems[questionKey];

    return (
      <div key={idx} className="question-card">
        <button
          onClick={() => toggleExpand(questionKey)}
          className="question-header"
        >
          <div className="question-meta">
            <span className="question-number">Q{idx + 1}</span>
            <span className="question-module">{moduleTitle}</span>
          </div>
          <div className="question-text">
            <p>{question.question || question}</p>
          </div>
          <div className="question-toggle">
            {isExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </button>

        {isExpanded && question.suggestedAnswer && (
          <div className="answer-container">
            <div className="answer-label">
              <Zap size={13} />
              <span>Answer</span>
            </div>
            <div className="answer-text">
              {question.suggestedAnswer}
            </div>
            <button
              onClick={() => handleCopyAnswer(question.suggestedAnswer)}
              className="copy-button"
            >
              {copiedId === question.suggestedAnswer ? (
                <>
                  <Check size={13} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  const getAllInterviewQuestions = () => {
    const allQuestions = [];

    if (type === "course" && item?.modules) {
      item.modules.forEach(moduleItem => {
        const moduleId = typeof moduleItem === 'string' ? moduleItem : (moduleItem?._id || moduleItem?.id);
        const module = moduleDetails[moduleId];
        if (module?.interviewQuestions && module.interviewQuestions.length > 0) {
          module.interviewQuestions.forEach((q, idx) => {
            allQuestions.push({
              question: q,
              moduleId,
              moduleTitle: module.title,
              idx
            });
          });
        }
      });
    } else if (type === "profession" && relatedCourses) {
      relatedCourses.forEach(course => {
        const courseModules = course.modules || [];
        courseModules.forEach(moduleItem => {
          const moduleId = typeof moduleItem === 'string' ? moduleItem : (moduleItem?._id || moduleItem?.id);
          const module = moduleDetails[moduleId];
          if (module?.interviewQuestions && module.interviewQuestions.length > 0) {
            module.interviewQuestions.forEach((q, idx) => {
              allQuestions.push({
                question: q,
                moduleId,
                moduleTitle: module.title,
                courseName: course.title,
                idx
              });
            });
          }
        });
      });
    }

    return allQuestions;
  };

  if (!isOpen || !item) return null;

  const relatedCourses = getRelatedCourses();

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="completed-modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="completed-modal-container">
        <div className="completed-modal-content">
          {/* Header */}
          <div className={`modal-header ${type === "profession" ? "profession-header" : ""}`}>
            <div className="header-top">
              <div className="header-title">
                <div className="header-badge">
                  {type === "course" ? (
                    <BookOpen size={20} />
                  ) : (
                    <Award size={20} />
                  )}
                </div>
                <div>
                  <span className="header-label">
                    {type === "course" ? "Course" : "Profession"} Details
                  </span>
                  <h2>{item.name || item.title}</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="close-button"
              >
                <X size={24} />
              </button>
            </div>

            {/* Header Stats */}
            <div className="header-stats">
              {item.completionMetadata?.completedDate && (
                <div className="stat-item">
                  <Calendar size={16} />
                  <span>Completed {new Date(item.completionMetadata.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {item.completionMetadata?.points && (
                <div className="stat-item points">
                  <Zap size={16} />
                  <span>+{item.completionMetadata.points} Points</span>
                </div>
              )}
              {item.completionMetadata?.certificate && (
                <div className="stat-item certificate">
                  <Award size={16} />
                  <span>Certificate Earned</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="modal-content">
            {/* Interview Questions - Main Focus */}
            <div className="interview-section">
              <div className="section-header">
                <Lightbulb size={18} />
                <h3>Interview Questions</h3>
                <span className="question-total">{getAllInterviewQuestions().length} Questions</span>
              </div>

              <div className="questions-list">
                {getAllInterviewQuestions().length > 0 ? (
                  getAllInterviewQuestions().map((item, idx) =>
                    renderQuestionCard(item.question, idx + 1, item.moduleTitle)
                  )
                ) : (
                  <div className="empty-state">
                    <Lightbulb size={32} />
                    <p>No interview questions available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompletedDetailsModal;
