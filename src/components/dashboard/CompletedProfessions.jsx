import React, { useState } from "react";
import { FaCheckCircle, FaTrophy } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import CompletedDetailsModal from "../modals/CompletedDetailsModal";

const CompletedProfessions = () => {
  const { getUserCompletedProfessions } = useApp();
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get completed professions from context helper
  const completedProfessions = getUserCompletedProfessions() || [];

  console.log("Completed Professions:", completedProfessions);

  const handleProfessionClick = (profession) => {
    setSelectedProfession(profession);
    setModalOpen(true);
  };

  return (
    <>
      <div className="premium-card p-xs">
        {/* Header */}
        <div className="mb-xs">
          <div className="flex items-center gap-xs mb-xs">
            <FaTrophy className="text-blue-600" size={12} />
            <h2 className="text-sm font-semibold text-slate-900">Completed Professions</h2>
          </div>
          <p className="text-xs text-slate-600">{completedProfessions.length} professions</p>
        </div>

        {/* Professions List */}
        <div className="space-y-xs overflow-y-auto max-h-52 premium-scrollbar">
          {completedProfessions && completedProfessions.length > 0 ? (
            completedProfessions.map((profession, index) => (
              <div
                key={profession._id || profession.id}
                onClick={() => handleProfessionClick(profession)}
                className="premium-card-compact p-xs hover:bg-blue-50 transition-colors cursor-pointer hover:shadow-md border border-slate-200 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50"
              >
                <div className="flex items-start gap-xs">
                  {/* Icon */}
                  <div className="shrink-0 mt-0.5">
                    <FaCheckCircle className="text-green-500" size={12} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-xs">
                      <div className="flex-1">
                        <h3 className="premium-heading-sm text-slate-900 mb-xs text-xs">
                          {profession.title || profession.name || "Profession"}
                        </h3>
                        <div className="flex flex-wrap gap-xs items-center">
                          <span className="premium-text-sm text-slate-600 text-xs">
                            {profession.completionMetadata?.completedDate
                              ? new Date(profession.completionMetadata.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                              : "Recently completed"}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="premium-text-sm text-slate-600 text-xs">
                            {profession.estimatedDuration || ""}
                          </span>
                        </div>
                      </div>

                      {/* Points and Certificate */}
                      <div className="flex flex-col items-end gap-xs shrink-0">
                        {profession.completionMetadata?.points && (
                          <div className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold text-xs">
                            +{profession.completionMetadata.points}
                          </div>
                        )}
                        {profession.completionMetadata?.certificate && (
                          <div className="px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold text-xs">
                            ✓ Certificate
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-slate-600">No professions completed yet</p>
              <p className="text-xs text-slate-500 mt-1">Complete all courses in a profession to earn the badge!</p>
            </div>
          )}
        </div>

        {/* Total Points */}
        <div className="premium-divider mt-sm"></div>
        <div className="flex items-center justify-between pt-sm">
          <span className="premium-heading-sm text-slate-600 text-xs">Total Points</span>
          <span className="premium-heading-sm text-blue-600 font-bold">
            {completedProfessions.reduce((sum, profession) => sum + (profession.completionMetadata?.points || 0), 0)}
          </span>
        </div>
      </div>

      {/* Details Modal */}
      <CompletedDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedProfession}
        type="profession"
      />
    </>
  );
};

export default CompletedProfessions;
