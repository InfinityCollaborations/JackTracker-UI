
import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';


interface StatusDisplayProps {
  statusMessage: string | null;
  errorMessage: string | null;
  isLoading: boolean;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ statusMessage, errorMessage, isLoading }) => {
  if (!statusMessage && !errorMessage && !isLoading) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      {isLoading && !statusMessage && (
         <div className="p-4 bg-blue-600 bg-opacity-30 border border-blue-500 rounded-md text-blue-300 flex items-center">
            <InformationCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm">Preparing simulation...</p>
        </div>
      )}
      {statusMessage && (
        <div className={`p-4 rounded-md flex items-start text-sm ${
            isLoading ? 'bg-blue-600 bg-opacity-30 border border-blue-500 text-blue-300' 
                      : 'bg-green-600 bg-opacity-30 border border-green-500 text-green-300'
        }`}>
          {isLoading ? <InformationCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" /> : <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" /> }
          <div>{statusMessage}</div>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-600 bg-opacity-30 border border-red-500 rounded-md text-red-300 flex items-start text-sm">
          <XCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
          <div>{errorMessage}</div>
        </div>
      )}
    </div>
  );
};