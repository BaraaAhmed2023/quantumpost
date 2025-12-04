import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDownload,
  FiCopy,
  FiCode,
  FiEye,
  FiEyeOff,
  FiMaximize2,
  FiMinimize2,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle
} from 'react-icons/fi';
import { FaRegObjectGroup, FaRegObjectUngroup } from 'react-icons/fa';

const ResponseViewer = () => {
  const { tabs, activeTab } = useAppContext();
  const [viewMode, setViewMode] = useState('pretty');
  const [expandedSections, setExpandedSections] = useState(['body']);
  const [copied, setCopied] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [autoFormat, setAutoFormat] = useState(true);

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const { response } = activeTabData || {};

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJSON = (data) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const renderJSON = (data, depth = 0) => {
    if (data === null) return <span className="text-purple-500">null</span>;
    if (typeof data === 'boolean') return <span className="text-blue-500">{data.toString()}</span>;
    if (typeof data === 'number') return <span className="text-green-500">{data}</span>;
    if (typeof data === 'string') return <span className="text-red-500">"{data}"</span>;

    if (Array.isArray(data)) {
      return (
        <div className="ml-4">
          [
          <div className="ml-4">
            {data.slice(0, 5).map((item, index) => (
              <div key={index} className="flex">
                {renderJSON(item, depth + 1)}
                {index < Math.min(data.length - 1, 4) && ','}
              </div>
            ))}
            {data.length > 5 && (
              <div className="text-gray-500 italic">
                ... and {data.length - 5} more items
              </div>
            )}
          </div>
          ]
        </div>
      );
    }

    if (typeof data === 'object') {
      const entries = Object.entries(data);
      return (
        <div className="ml-4">
          {'{'}
          <div className="ml-4">
            {entries.slice(0, 5).map(([key, value], index) => (
              <div key={key} className="flex">
                <span className="text-purple-600 dark:text-purple-400 font-medium">"{key}"</span>
                <span className="mx-2">:</span>
                {renderJSON(value, depth + 1)}
                {index < Math.min(entries.length - 1, 4) && ','}
              </div>
            ))}
            {entries.length > 5 && (
              <div className="text-gray-500 italic">
                ... and {entries.length - 5} more properties
              </div>
            )}
          </div>
          {'}'}
        </div>
      );
    }

    return <span className="text-gray-500">{String(data)}</span>;
  };

  const StatusBadge = ({ status }) => {
    const isSuccess = status >= 200 && status < 300;
    const isError = status >= 400;

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`inline-flex items-center px-3 py-1 rounded-full font-bold ${
          isSuccess
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400'
            : isError
            ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-600 dark:text-red-400'
            : 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-600 dark:text-yellow-400'
        }`}
      >
        {isSuccess ? <FiCheckCircle className="mr-2" /> : <FiXCircle className="mr-2" />}
        {status} {response?.statusText || ''}
      </motion.div>
    );
  };

  if (!response) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center p-8"
      >
        <div className="text-center max-w-md">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center"
          >
            <FiCode className="w-12 h-12 text-primary-500/50" />
          </motion.div>
          <h3 className="text-xl font-bold gradient-text mb-2">Awaiting Response</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Send a request to see the response here. Results will appear with beautiful animations.
          </p>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="inline-flex items-center text-sm text-primary-500"
          >
            <FiRefreshCw className="mr-2 animate-spin" />
            Ready to receive
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const ResponseSection = ({ title, icon: Icon, children, defaultExpanded = true }) => {
    const isExpanded = expandedSections.includes(title);

    return (
      <motion.div
        layout
        className="glass rounded-xl overflow-hidden mb-4"
      >
        <motion.button
          layout
          onClick={() => toggleSection(title)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-primary-500" />
            <span className="font-semibold">{title}</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50"
    >
      {/* Header */}
      <div className="glass border-b border-gray-200/30 dark:border-gray-800/30 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <StatusBadge status={response.status} />

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <FiClock className="text-gray-500" />
                <span className="font-mono">{formatTime(response.time)}</span>
              </div>

              {response.size && (
                <div className="flex items-center space-x-2 text-sm">
                  <FiDownload className="text-gray-500" />
                  <span className="font-mono">{formatSize(response.size)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex glass rounded-lg p-1">
              {['pretty', 'raw', 'headers'].map((mode) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                    viewMode === mode
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {mode === 'pretty' ? <FaRegObjectGroup className="inline mr-1" /> :
                   mode === 'raw' ? <FaRegObjectUngroup className="inline mr-1" /> :
                   <FiEye className="inline mr-1" />}
                  {mode}
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => copyToClipboard(formatJSON(response.data))}
              className="glass p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/50"
              title="Copy response"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="copied"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-green-500"
                  >
                    <FiCheckCircle />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1 }}
                  >
                    <FiCopy />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFullScreen(!fullScreen)}
              className="glass p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/50"
              title={fullScreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullScreen ? <FiMinimize2 /> : <FiMaximize2 />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {response.error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="m-4"
        >
          <div className="glass bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-600 dark:text-red-400 mb-1">Request Failed</h4>
                <p className="text-red-500/80 dark:text-red-400/80 font-mono text-sm">
                  {response.error}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {viewMode === 'pretty' && (
            <motion.div
              key="pretty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <ResponseSection title="Response Body" icon={FiCode} defaultExpanded>
                <div className="font-mono text-sm bg-gray-900/5 dark:bg-gray-800/30 rounded-lg p-4 overflow-x-auto">
                  {renderJSON(response.data)}
                </div>
              </ResponseSection>

              {response.headers && Object.keys(response.headers).length > 0 && (
                <ResponseSection title="Response Headers" icon={FiEye}>
                  <div className="space-y-2">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col sm:flex-row sm:items-center p-3 rounded-lg hover:bg-white/5 dark:hover:bg-gray-800/30"
                      >
                        <div className="flex-1">
                          <span className="font-semibold text-primary-600 dark:text-primary-400">
                            {key}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-600 dark:text-gray-400 font-mono text-sm break-all">
                            {value}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ResponseSection>
              )}

              <ResponseSection title="Timing" icon={FiClock}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass p-4 rounded-xl text-center"
                  >
                    <div className="text-2xl font-bold gradient-text">
                      {formatTime(response.time)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Total Duration
                    </div>
                  </motion.div>

                  {response.size && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="glass p-4 rounded-xl text-center"
                    >
                      <div className="text-2xl font-bold gradient-text">
                        {formatSize(response.size)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Response Size
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass p-4 rounded-xl text-center"
                  >
                    <div className="text-2xl font-bold gradient-text">
                      {response.status}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Status Code
                    </div>
                  </motion.div>
                </div>
              </ResponseSection>
            </motion.div>
          )}

          {viewMode === 'raw' && (
            <motion.div
              key="raw"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Raw Response</h3>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={autoFormat}
                        onChange={(e) => setAutoFormat(e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span>Auto-format</span>
                    </label>
                  </div>
                </div>
                <pre className="font-mono text-sm bg-gray-900/5 dark:bg-gray-800/30 rounded-lg p-4 overflow-x-auto max-h-[60vh]">
                  {autoFormat ? formatJSON(response.data) : JSON.stringify(response.data)}
                </pre>
              </div>
            </motion.div>
          )}

          {viewMode === 'headers' && response.headers && (
            <motion.div
              key="headers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass rounded-xl p-4">
                <h3 className="font-semibold mb-4">Response Headers</h3>
                <div className="space-y-3">
                  {Object.entries(response.headers).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col md:flex-row p-4 rounded-lg hover:bg-white/5 dark:hover:bg-gray-800/30 group"
                    >
                      <div className="md:w-1/3 mb-2 md:mb-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-primary-600 dark:text-primary-400">
                            {key}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyToClipboard(value)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/20 dark:hover:bg-gray-800/50"
                          >
                            <FiCopy size={14} />
                          </motion.button>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <span className="text-gray-600 dark:text-gray-400 font-mono text-sm break-all">
                          {value}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200/30 dark:border-gray-800/30 p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                response.status >= 200 && response.status < 300
                  ? 'bg-green-500 animate-pulse'
                  : response.status >= 400
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-yellow-500 animate-pulse'
              }`} />
              <span>Status: {response.status}</span>
            </div>
            <div className="hidden md:block">
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span className="ml-2">Time: {formatTime(response.time)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(formatJSON(response.data))}
              className="text-xs px-3 py-1 rounded-lg glass hover:bg-white/20 dark:hover:bg-gray-800/50"
            >
              Copy JSON
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `response-${Date.now()}.json`;
                a.click();
              }}
              className="text-xs px-3 py-1 rounded-lg glass hover:bg-white/20 dark:hover:bg-gray-800/50"
            >
              Export
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResponseViewer;