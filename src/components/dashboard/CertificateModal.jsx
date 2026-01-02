import { X, Download } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { downloadCertificate as downloadCertificateAPI } from '../../api_services/users.api';

const CertificateModal = ({ isOpen, certificate, certificateTitle, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !certificate) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1BBDC6] to-[#09232F] text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Certificate</h2>
            <p className="text-sm opacity-90">{certificateTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Certificate Preview */}
          {certificate.imageUrl && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Preview</h3>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                <img
                  src={certificate.imageUrl}
                  alt="Certificate Preview"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>
          )}

          {/* Certificate Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Certificate Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-semibold text-gray-900">Course Completion</p>
              </div>
              <div>
                <p className="text-gray-600">Format</p>
                <p className="font-semibold text-gray-900">PDF + Image</p>
              </div>
              <div>
                <p className="text-gray-600">Issue Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-semibold text-green-600">✓ Verified</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {certificate.pdfUrl && (
              <button
                onClick={() => downloadCertificate(certificate.pdfUrl, `${certificateTitle}-certificate.pdf`)}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
              >
                <Download size={18} />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </button>
            )}
            {certificate.imageUrl && !certificate.pdfUrl && (
              <button
                onClick={() => downloadCertificate(certificate.imageUrl, `${certificateTitle}-certificate.png`, true)}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
              >
                <Download size={18} />
                {isDownloading ? 'Downloading...' : 'Download Image'}
              </button>
            )}
          </div>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            This certificate verifies your successful completion of this course.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
