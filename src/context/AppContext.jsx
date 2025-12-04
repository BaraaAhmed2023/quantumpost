import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadState, saveState } from '../utils/storage';

const AppContext = createContext();

const initialTab = {
  id: uuidv4(),
  name: 'New Request',
  method: 'GET',
  url: '',
  headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
  body: '{\n  \n}',
  params: [{ key: '', value: '', enabled: true }],
  response: null,
  loading: false,
  baseUrl: ''
};

export const AppProvider = ({ children }) => {
  const [tabs, setTabs] = useState([initialTab]);
  const [activeTab, setActiveTab] = useState(initialTab.id);
  const [collections, setCollections] = useState([]);
  const [environments, setEnvironments] = useState([
    { id: 'env1', name: 'Development', variables: [] },
    { id: 'env2', name: 'Production', variables: [] }
  ]);
  const [activeEnvironment, setActiveEnvironment] = useState('env1');
  const [baseUrl, setBaseUrl] = useState('');
  const [theme, setTheme] = useState('dark');

  // Load saved state
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setTabs(savedState.tabs || [initialTab]);
      setActiveTab(savedState.activeTab || initialTab.id);
      setCollections(savedState.collections || []);
      setEnvironments(savedState.environments || environments);
      setActiveEnvironment(savedState.activeEnvironment || 'env1');
      setBaseUrl(savedState.baseUrl || '');
      setTheme(savedState.theme || 'dark');
    }
  }, []);

  // Save state
  useEffect(() => {
    saveState({ tabs, activeTab, collections, environments, activeEnvironment, baseUrl, theme });
  }, [tabs, activeTab, collections, environments, activeEnvironment, baseUrl, theme]);

  // ADD TAB FUNCTION - Make sure this exists!
  const addTab = useCallback(() => {
    console.log('Adding new tab...');
    const newTab = {
      ...initialTab,
      id: uuidv4(),
      name: `Request ${tabs.length + 1}`,
      baseUrl
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
  }, [tabs.length, baseUrl]);

  // REMOVE TAB FUNCTION
  const removeTab = useCallback((tabId) => {
    console.log('Removing tab:', tabId);
    if (tabs.length <= 1) return;
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  // UPDATE TAB FUNCTION
  const updateTab = useCallback((tabId, updates) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  }, []);

  // SAVE TO COLLECTION
  const saveToCollection = useCallback((tabId, collectionName) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    const request = {
      id: uuidv4(),
      name: tab.name,
      method: tab.method,
      url: tab.url,
      headers: tab.headers,
      body: tab.body,
      params: tab.params,
      createdAt: new Date().toISOString()
    };

    setCollections(prev => {
      const existingCollection = prev.find(c => c.name === collectionName);
      if (existingCollection) {
        return prev.map(c =>
          c.name === collectionName
            ? { ...c, requests: [...c.requests, request] }
            : c
        );
      } else {
        return [...prev, {
          id: uuidv4(),
          name: collectionName,
          requests: [request]
        }];
      }
    });
  }, [tabs]);

  // TOGGLE THEME
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  }, []);

  const value = {
    tabs,
    activeTab,
    collections,
    environments,
    activeEnvironment,
    baseUrl,
    theme,
    addTab,
    removeTab,
    updateTab,
    setActiveTab,
    saveToCollection,
    setCollections,
    setBaseUrl,
    setActiveEnvironment,
    toggleTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};