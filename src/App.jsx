import React, { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  useEffect(() => {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add inter font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    console.log('✨ Modern Postman loaded with animations!');
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <AppProvider>
          <Home />
        </AppProvider>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;