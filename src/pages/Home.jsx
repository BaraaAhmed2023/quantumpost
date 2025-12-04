import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import Sidebar from '../components/Sidebar';
import RequestEditor from '../components/RequestEditor';
import ResponseViewer from '../components/ResponseViewer';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [responseFullscreen, setResponseFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/10"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300/10 dark:bg-primary-700/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-purple-300/10 dark:bg-purple-700/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-pink-300/10 dark:bg-pink-700/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Mobile sidebar toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 glass p-3 rounded-xl shadow-lg"
      >
        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </motion.button>

      {/* Fullscreen toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setResponseFullscreen(!responseFullscreen)}
        className="fixed top-4 right-4 z-50 glass p-3 rounded-xl shadow-lg"
      >
        {responseFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
      </motion.button>

      <div className="relative z-10">
        <Header />
        <TabBar />

        <div className="flex h-[calc(100vh-136px)]">
          {/* Sidebar with animation */}
          <AnimatePresence>
            {(sidebarOpen || !isMobile) && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`absolute md:relative z-40 h-full ${isMobile ? 'w-72' : 'w-80'}`}
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <motion.div
            layout
            className={`flex-1 flex transition-all duration-500 ${
              responseFullscreen ? 'flex-col' : 'flex-row'
            }`}
          >
            {/* Request Editor */}
            <motion.div
              layout
              className={`${responseFullscreen ? 'h-1/2' : 'flex-1'} overflow-hidden`}
            >
              <RequestEditor />
            </motion.div>

            {/* Response Viewer */}
            <motion.div
              layout
              className={`${responseFullscreen ? 'h-1/2' : 'flex-1'} overflow-hidden border-l border-gray-200/30 dark:border-gray-800/30`}
            >
              <ResponseViewer />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile notification */}
      <AnimatePresence>
        {isMobile && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 glass p-4 rounded-xl text-sm text-center"
          >
            <p className="gradient-text font-semibold">✨ Swipe gestures supported!</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Swipe left/right to navigate tabs</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;