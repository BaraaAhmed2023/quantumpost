import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiMoon, FiSun, FiSearch, FiSettings, FiZap } from 'react-icons/fi';
import { FaBolt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

const Header = () => {
  const { theme, toggleTheme, baseUrl, setBaseUrl } = useAppContext();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="glass border-b border-gray-200/30 dark:border-gray-800/30 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg">
              <FaBolt className="w-6 h-6 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 border-2 border-primary-300/30 dark:border-primary-700/30 rounded-xl"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              QuantumPost
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Lightning Fast API Client</p>
          </div>
        </motion.div>

        {/* Base URL Search */}
        <motion.div
          animate={searchFocused ? { scale: 1.02 } : { scale: 1 }}
          className="relative w-96 hidden lg:block"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiGlobe className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Enter Base URL (e.g., https://api.example.com)"
            className="input-modern pl-12 w-full"
          />
          <AnimatePresence>
            {baseUrl && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => setBaseUrl('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <div className="p-1 rounded-full bg-gray-200/50 dark:bg-gray-700/50">
                  <FiX className="w-4 h-4" />
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <button className="glass p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/50">
              <FiZap className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Settings */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <button className="glass p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/50">
              <FiSettings className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="glass p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/50"
          >
            {theme === 'dark' ? (
              <FiSun className="w-5 h-5 text-yellow-500" />
            ) : (
              <FiMoon className="w-5 h-5 text-indigo-500" />
            )}
          </motion.button>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold cursor-pointer shadow-lg">
              U
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
          </motion.div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mt-4 lg:hidden">
        <div className="relative">
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="Base URL"
            className="input-modern w-full pl-10"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;