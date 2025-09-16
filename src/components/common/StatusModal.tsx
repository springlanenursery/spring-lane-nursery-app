// components/modals/StatusModal.tsx
'use client'
import React from 'react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  details?: string[];
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  details = [],
  actionButton
}) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const iconColor = isSuccess ? '#10B981' : '#EF4444';
  const titleColor = isSuccess ? '#059669' : '#DC2626';
  const buttonColor = isSuccess ? '#10B981' : '#EF4444';
  const buttonHoverColor = isSuccess ? '#059669' : '#DC2626';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[12px] w-full max-w-md mx-auto relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            {isSuccess ? (
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${iconColor}15` }}
              >
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={iconColor} 
                  strokeWidth="2"
                >
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              </div>
            ) : (
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${iconColor}15` }}
              >
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={iconColor} 
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 
            className="text-2xl font-bold mb-4"
            style={{ color: titleColor }}
          >
            {title}
          </h3>

          {/* Message */}
          <p className="text-[#515151] text-base mb-4 leading-relaxed">
            {message}
          </p>

          {/* Details/Errors */}
          {details.length > 0 && (
            <div className="mb-6">
              <ul className="text-sm text-left space-y-1">
                {details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-gray-600">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className="w-full cursor-pointer font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-white"
                style={{ 
                  backgroundColor: buttonColor,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonColor}
              >
                {actionButton.text}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="w-full cursor-pointer border-2 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;

// Hook for easy modal management
export const useStatusModal = () => {
  const [modal, setModal] = React.useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    details?: string[];
    actionButton?: {
      text: string;
      onClick: () => void;
    };
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    details: []
  });

  const showSuccess = (
    title: string, 
    message: string, 
    details?: string[],
    actionButton?: { text: string; onClick: () => void }
  ) => {
    setModal({
      isOpen: true,
      type: 'success',
      title,
      message,
      details,
      actionButton
    });
  };

  const showError = (
    title: string, 
    message: string, 
    details?: string[],
    actionButton?: { text: string; onClick: () => void }
  ) => {
    setModal({
      isOpen: true,
      type: 'error',
      title,
      message,
      details,
      actionButton
    });
  };

  const hideModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const StatusModalComponent = () => (
    <StatusModal
      isOpen={modal.isOpen}
      onClose={hideModal}
      type={modal.type}
      title={modal.title}
      message={modal.message}
      details={modal.details}
      actionButton={modal.actionButton}
    />
  );

  return {
    showSuccess,
    showError,
    hideModal,
    StatusModalComponent
  };
};