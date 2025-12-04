import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolderPlus, FiFolder, FiGlobe, FiDatabase, FiChevronRight, FiTrash2, FiCopy, FiEdit2 } from 'react-icons/fi';

const Sidebar = ({ onClose }) => {
  const { collections, environments, activeEnvironment, setActiveEnvironment, tabs, activeTab, updateTab, setCollections } = useAppContext();
  const [activeSection, setActiveSection] = useState('collections');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);

  const CollectionItem = ({ collection }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ x: 5 }}
      className="group relative"
    >
      <div className="glass p-4 rounded-xl mb-3 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <FiFolder className="w-5 h-5 text-primary-500" />
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
              {collection.name}
            </h4>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FiEdit2 size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setCollections(prev => prev.filter(c => c.id !== collection.id));
              }}
              className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40"
            >
              <FiTrash2 size={14} />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {collection.requests.length > 0 ? (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                {collection.requests.map((request, idx) => (
                  <motion.button
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const activeTabData = tabs.find(t => t.id === activeTab);
                      if (activeTabData) {
                        updateTab(activeTab, {
                          name: request.name,
                          method: request.method,
                          url: request.url,
                          headers: request.headers,
                          body: request.body,
                          params: request.params
                        });
                      }
                    }}
                    className="w-full text-left p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 flex items-center space-x-3"
                  >
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      request.method === 'GET' ? 'badge-get' :
                      request.method === 'POST' ? 'badge-post' :
                      request.method === 'PUT' ? 'badge-put' :
                      request.method === 'DELETE' ? 'badge-delete' :
                      'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {request.method}
                    </span>
                    <span className="flex-1 truncate text-sm font-medium">
                      {request.name}
                    </span>
                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400 py-4"
            >
              No requests yet
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {collection.requests.length} request{collection.requests.length !== 1 ? 's' : ''}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-lg transition-colors"
            onClick={() => {
              const activeTabData = tabs.find(t => t.id === activeTab);
              if (activeTabData) {
                const newRequest = {
                  id: `req-${Date.now()}`,
                  name: activeTabData.name,
                  method: activeTabData.method,
                  url: activeTabData.url,
                  headers: activeTabData.headers,
                  body: activeTabData.body,
                  params: activeTabData.params,
                  createdAt: new Date().toISOString()
                };

                setCollections(prev =>
                  prev.map(c =>
                    c.id === collection.id
                      ? { ...c, requests: [...c.requests, newRequest] }
                      : c
                  )
                );
              }
            }}
          >
            Save Current
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full glass border-r border-gray-200/30 dark:border-gray-800/30"
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200/30 dark:border-gray-800/30">
        <h2 className="text-xl font-bold gradient-text mb-4">Workspace</h2>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection('collections')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
              activeSection === 'collections'
                ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            }`}
          >
            <FiFolder />
            <span>Collections</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection('environments')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
              activeSection === 'environments'
                ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
            }`}
          >
            <FiGlobe />
            <span>Environments</span>
          </motion.button>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="p-6 overflow-y-auto h-[calc(100%-160px)]">
        <AnimatePresence mode="wait">
          {activeSection === 'collections' ? (
            <motion.div
              key="collections"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Your Collections</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNewCollection(true)}
                  className="glass p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/50"
                >
                  <FiFolderPlus size={20} />
                </motion.button>
              </div>

              {/* New Collection Form */}
              <AnimatePresence>
                {showNewCollection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="glass p-4 rounded-xl mb-4">
                      <input
                        type="text"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        placeholder="Collection name"
                        className="input-modern w-full mb-3"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newCollectionName.trim()) {
                            setCollections(prev => [...prev, {
                              id: `collection-${Date.now()}`,
                              name: newCollectionName.trim(),
                              requests: []
                            }]);
                            setNewCollectionName('');
                            setShowNewCollection(false);
                          }
                          if (e.key === 'Escape') {
                            setShowNewCollection(false);
                          }
                        }}
                      />
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (newCollectionName.trim()) {
                              setCollections(prev => [...prev, {
                                id: `collection-${Date.now()}`,
                                name: newCollectionName.trim(),
                                requests: []
                              }]);
                              setNewCollectionName('');
                              setShowNewCollection(false);
                            }
                          }}
                          className="btn-primary-modern flex-1"
                        >
                          Create
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowNewCollection(false)}
                          className="btn-secondary-modern"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collections List */}
              <AnimatePresence>
                {collections.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <FiDatabase className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No collections yet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNewCollection(true)}
                      className="btn-primary-modern"
                    >
                      Create Your First Collection
                    </motion.button>
                  </motion.div>
                ) : (
                  collections.map(collection => (
                    <CollectionItem key={collection.id} collection={collection} />
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="environments"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-6">Environments</h3>

              {environments.map((env, idx) => (
                <motion.button
                  key={env.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveEnvironment(env.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    activeEnvironment === env.id
                      ? 'bg-gradient-to-r from-primary-500/20 to-purple-500/20 border-2 border-primary-500/30 shadow-lg'
                      : 'glass hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        env.id === 'env1' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <span className="font-semibold">{env.name}</span>
                    </div>
                    {activeEnvironment === env.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-primary-500 rounded-full"
                      />
                    )}
                  </div>
                  {env.variables && env.variables.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {env.variables.length} variable{env.variables.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full btn-secondary-modern mt-6"
              >
                + Add New Environment
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;