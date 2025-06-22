
// This icon can be similar to InfoIcon or specialized. Using InfoIcon's content if it's generic enough.
// For distinctness, let's use a slightly different one for loading messages.
// Re-using InfoIcon path as it's suitable.
// If a different "loading specific" icon was needed, its path would go here.
// For this example, we'll use the same visual as InfoIcon for InformationCircleIcon.
import React from 'react';

interface IconProps {
  className?: string;
}

// Re-using InfoIcon path as it's suitable.
// If a different "loading specific" icon was needed, its path would go here.
// For this example, we'll use the same visual as InfoIcon for InformationCircleIcon.
export const InformationCircleIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);