import React from 'react';
import { useAppContext } from '../context/AppContext';

const NewTabButton = () => {
  const { addTab } = useAppContext();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('➕ New Tab button clicked');
    addTab();
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-3 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 border-l border-gray-200 dark:border-gray-800"
      title="New Tab (Ctrl+T)"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      <span className="ml-2 text-sm hidden lg:inline">New Tab</span>
    </button>
  );
};

export default NewTabButton;