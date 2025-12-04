import React, { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { executeRequest } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSave, FiPlus, FiTrash2, FiCode, FiChevronDown } from 'react-icons/fi';

const RequestEditor = () => {
  const { tabs, activeTab, updateTab, baseUrl } = useAppContext();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [activeSection, setActiveSection] = useState('headers');

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  if (!activeTabData) return null;

  // Get gradient colors for each method
  const getMethodGradient = (method) => {
    switch (method) {
      case 'GET': return ['#10b981', '#059669'];
      case 'POST': return ['#3b82f6', '#1d4ed8'];
      case 'PUT': return ['#f59e0b', '#d97706'];
      case 'DELETE': return ['#ef4444', '#dc2626'];
      case 'PATCH': return ['#8b5cf6', '#7c3aed'];
      case 'HEAD': return ['#6b7280', '#4b5563'];
      case 'OPTIONS': return ['#4f46e5', '#3730a3'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const [fromColor, toColor] = getMethodGradient(activeTabData.method);

  const handleSendRequest = async () => {
    updateTab(activeTab, { loading: true });
    const response = await executeRequest(activeTabData, baseUrl);
    updateTab(activeTab, {
      response,
      loading: false
    });
  };

  const handleBodyChange = (body) => {
    updateTab(activeTab, { body });
    try {
      JSON.parse(body || '{}');
      setIsJsonValid(true);
    } catch {
      setIsJsonValid(false);
    }
  };

  const addHeader = () => {
    updateTab(activeTab, {
      headers: [...activeTabData.headers, { key: '', value: '', enabled: true }]
    });
  };

  const removeHeader = (index) => {
    const newHeaders = activeTabData.headers.filter((_, i) => i !== index);
    updateTab(activeTab, { headers: newHeaders });
  };

  const methods = [
    { value: 'GET', color: 'from-green-400 to-emerald-500' },
    { value: 'POST', color: 'from-blue-400 to-cyan-500' },
    { value: 'PUT', color: 'from-yellow-400 to-amber-500' },
    { value: 'DELETE', color: 'from-red-400 to-rose-500' },
    { value: 'PATCH', color: 'from-purple-400 to-violet-500' },
    { value: 'HEAD', color: 'from-gray-400 to-gray-500' },
    { value: 'OPTIONS', color: 'from-indigo-400 to-indigo-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-6 space-y-6"
    >
      {/* Method & URL Section */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Method Selector - FIXED */}
          <motion.div className="relative min-w-[140px]">
            <select
              value={activeTabData.method}
              onChange={(e) => updateTab(activeTab, { method: e.target.value })}
              className="appearance-none glass px-6 py-4 pr-10 rounded-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/30 w-full"
              style={{
                background: `linear-gradient(135deg, ${fromColor}, ${toColor})`
              }}
            >
              {methods.map(method => (
                <option
                  key={method.value}
                  value={method.value}
                  style={{
                    backgroundColor: method.value === 'GET' ? '#059669' :
                                    method.value === 'POST' ? '#1d4ed8' :
                                    method.value === 'PUT' ? '#d97706' :
                                    method.value === 'DELETE' ? '#dc2626' :
                                    method.value === 'PATCH' ? '#7c3aed' :
                                    method.value === 'HEAD' ? '#4b5563' :
                                    method.value === 'OPTIONS' ? '#3730a3' : '#4b5563',
                    color: 'white'
                  }}
                >
                  {method.value}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 pointer-events-none" />
          </motion.div>

          {/* URL Input */}
          <motion.input
            type="text"
            value={activeTabData.url}
            onChange={(e) => updateTab(activeTab, { url: e.target.value })}
            placeholder="/api/endpoint"
            className="input-modern flex-1 text-lg"
            whileFocus={{ scale: 1.01 }}
          />

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendRequest}
              disabled={activeTabData.loading}
              className="btn-primary-modern flex items-center space-x-2 px-8"
            >
              {activeTabData.loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FiSend />
                  <span>Send</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSaveDialog(true)}
              className="btn-secondary-modern flex items-center space-x-2"
            >
              <FiSave />
              <span className="hidden sm:inline">Save</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tabs for Headers/Body/Params */}
      <div className="flex space-x-2 border-b border-gray-200/30 dark:border-gray-800/30">
        {['headers', 'body', 'params'].map((section) => (
          <motion.button
            key={section}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-3 rounded-t-lg font-medium capitalize transition-all duration-300 ${
              activeSection === section
                ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-t-2 border-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            }`}
          >
            {section}
          </motion.button>
        ))}
      </div>

      {/* Headers Section */}
      <AnimatePresence mode="wait">
        {activeSection === 'headers' && (
          <motion.div
            key="headers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 flex-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Request Headers</h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={addHeader}
                className="glass p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/50"
              >
                <FiPlus />
              </motion.button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {activeTabData.headers.map((header, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => {
                          const newHeaders = [...activeTabData.headers];
                          newHeaders[index].enabled = e.target.checked;
                          updateTab(activeTab, { headers: newHeaders });
                        }}
                        className="w-5 h-5 rounded-lg border-2 border-gray-300 dark:border-gray-600 checked:bg-primary-500"
                      />
                    </div>
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => {
                        const newHeaders = [...activeTabData.headers];
                        newHeaders[index].key = e.target.value;
                        updateTab(activeTab, { headers: newHeaders });
                      }}
                      placeholder="Header name"
                      className="input-modern flex-1"
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => {
                        const newHeaders = [...activeTabData.headers];
                        newHeaders[index].value = e.target.value;
                        updateTab(activeTab, { headers: newHeaders });
                      }}
                      placeholder="Header value"
                      className="input-modern flex-1"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeHeader(index)}
                      className="glass p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                    >
                      <FiTrash2 />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Body Section */}
        {activeSection === 'body' && ['POST', 'PUT', 'PATCH'].includes(activeTabData.method) && (
          <motion.div
            key="body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 flex-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Request Body</h3>
              <div className="flex items-center space-x-2">
                {!isJsonValid && (
                  <span className="text-sm text-red-500 animate-pulse">Invalid JSON</span>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  <FiCode className="inline mr-1" />
                  JSON
                </span>
              </div>
            </div>

            <motion.textarea
              value={activeTabData.body}
              onChange={(e) => handleBodyChange(e.target.value)}
              className={`w-full h-64 font-mono text-sm input-modern resize-none ${
                !isJsonValid ? 'border-red-500' : ''
              }`}
              spellCheck="false"
              whileFocus={{ scale: 1.005 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RequestEditor;