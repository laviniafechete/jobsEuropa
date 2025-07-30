import React, { useEffect } from 'react';
import { useSnackbarStore, SnackbarType } from '../stores/snackbarStore';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const getIcon = (type: SnackbarType) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case 'error':
      return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    case 'info':
      return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    default:
      return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
  }
};

const getBackgroundColor = (type: SnackbarType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'info':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-blue-50 border-blue-200';
  }
};

const getTextColor = (type: SnackbarType) => {
  switch (type) {
    case 'success':
      return 'text-green-800';
    case 'error':
      return 'text-red-800';
    case 'warning':
      return 'text-yellow-800';
    case 'info':
      return 'text-blue-800';
    default:
      return 'text-blue-800';
  }
};

const Snackbar: React.FC = () => {
  const { messages, removeMessage } = useSnackbarStore();

  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`
            ${getBackgroundColor(message.type)}
            ${getTextColor(message.type)}
            border rounded-lg shadow-lg p-4 min-w-80 max-w-md
            transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right-full
          `}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getIcon(message.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {message.message}
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => removeMessage(message.id)}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Snackbar; 