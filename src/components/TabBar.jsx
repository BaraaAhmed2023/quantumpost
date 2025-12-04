import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiChevronRight } from 'react-icons/fi';
import NewTabButton from './NewTabButton';

const TabBar = () => {
  const { tabs, activeTab, setActiveTab, removeTab, updateTab } = useAppContext();

  const getMethodColor = (method) => {
    const colors = {
      'GET': 'badge-get',
      'POST': 'badge-post',
      'PUT': 'badge-put',
      'DELETE': 'badge-delete',
      'PATCH': 'badge-put',
      'HEAD': 'bg-gray-800 text-white', // SIMPLE color for HEAD
      'OPTIONS': 'bg-indigo-800 text-white' // SIMPLE color for OPTIONS
    };
    return colors[method.toUpperCase()] || 'bg-gradient-to-r from-gray-400 to-gray-500';
  };

  const handleDragEnd = (event, info, tabId) => {
    if (Math.abs(info.offset.x) > 100) {
      removeTab(tabId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center border-b border-gray-200/30 dark:border-gray-800/30 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm"
    >
      {/* Scrollable tabs container */}
      <div className="flex flex-1 overflow-x-auto scrollbar-hide">
        <AnimatePresence initial={false}>
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(e, info) => handleDragEnd(e, info, tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center min-w-[180px] max-w-[280px] px-4 py-3 border-r border-gray-200/30 dark:border-gray-800/30 cursor-pointer transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 shadow-lg border-b-2 border-primary-500'
                  : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {/* Method badge with animation */}
              <motion.span
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`${getMethodColor(tab.method)} text-white px-2 py-1 rounded-lg text-xs font-bold mr-2 shadow-md`}
              >
                {tab.method}
              </motion.span>

              {/* Tab name input */}
              <motion.input
              type="text"
              value={tab.name}
              onChange={(e) => updateTab(tab.id, { name: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-[60px] bg-transparent border-none focus:outline-none text-sm font-medium truncate text-gray-900 dark:text-gray-100"
            />
              {/* Close button with animation */}
              {tabs.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FiX size={14} />
                </motion.button>
              )}

              {/* Active indicator */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500"
                  transition={{ type: "spring", damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Tab Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <NewTabButton />
      </motion.div>
    </motion.div>
  );
};

export default TabBar;