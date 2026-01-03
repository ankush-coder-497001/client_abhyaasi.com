import { X, Download, CheckCircle, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { downloadCertificate as downloadCertificateAPI } from '../../api_services/users.api';
import './certificate-modal.css';

const CertificateModal = ({ isOpen, certificate, certificateTitle, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const downloadCertificate = async (url, filename, isImage = false) => {
    if (!url) {
      toast.error('Certificate URL not available');
      return;
    }

    try {
      setIsDownloading(true);

      // Call API service to download certificate
      const blob = await downloadCertificateAPI(url, filename);

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate');
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <div className={`certificate-modal-backdrop ${isClosing ? 'closing' : ''}`} onClick={handleClose} />

      <div className="certificate-modal-container">
        <div className={`certificate-modal-content ${isClosing ? 'closing' : ''}`}>

          {/* Close Button */}
          <button className="certificate-close-button" onClick={handleClose}>
            <X size={20} />
          </button>

          {/* Split Layout */}
          <div className="certificate-layout">

            {/* Left Side - Certificate Preview */}
            <div className="certificate-preview-section">
              <div className="certificate-preview-wrapper">
                {certificate.imageUrl ? (
                  <div className="certificate-image-container">
                    <img
                      src={certificate.imageUrl}
                      alt="Certificate"
                      className="certificate-image"
                    />
                    <div className="certificate-badge">
                      <CheckCircle size={20} />
                      <span>Verified</span>
                    </div>
                  </div>
                ) : (
                  <div className="certificate-placeholder">
                    <div className="placeholder-content">
                      <div className="placeholder-icon">📜</div>
                      <p>Certificate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Details & Download */}
            <div className="certificate-details-section">

              {/* Header */}
              <div className="certificate-header">
                <div className="certificate-title-section">
                  <div className="certificate-icon-badge">
                    <span>🏆</span>
                  </div>
                  <div>
                    <h2 className="certificate-title">Achievement Unlocked</h2>
                    <p className="certificate-subtitle">{certificateTitle}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="certificate-details-grid">

                <div className="detail-item">
                  <div className="detail-label">Certificate Type</div>
                  <div className="detail-value">Course Completion</div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Issue Date</div>
                  <div className="detail-value-with-icon">
                    <Calendar size={16} />
                    {formattedDate}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Document Format</div>
                  <div className="detail-value">
                    {certificate.pdfUrl && certificate.imageUrl ? 'PDF + Image' : certificate.pdfUrl ? 'PDF' : 'Image'}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-label">Status</div>
                  <div className="detail-value-verified">
                    <CheckCircle size={16} />
                    Verified
                  </div>
                </div>

              </div>

              {/* Description */}
              <div className="certificate-description">
                <p>
                  This certificate verifies your successful completion and mastery of all course requirements. It represents your commitment to learning and professional development.
                </p>
              </div>

              {/* Download Buttons */}
              <div className="certificate-actions">
                {certificate.pdfUrl && (
                  <button
                    onClick={() => downloadCertificate(certificate.pdfUrl, `${certificateTitle}-certificate.pdf`)}
                    disabled={isDownloading}
                    className="download-btn download-btn-primary"
                  >
                    <Download size={18} />
                    <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                  </button>
                )}
                {certificate.imageUrl && (
                  <button
                    onClick={() => downloadCertificate(certificate.imageUrl, `${certificateTitle}-certificate.png`, true)}
                    disabled={isDownloading}
                    className="download-btn download-btn-secondary"
                  >
                    <Download size={18} />
                    <span>{isDownloading ? 'Downloading...' : 'Download Image'}</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default CertificateModal;
