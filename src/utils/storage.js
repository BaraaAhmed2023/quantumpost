export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('modern-postman-state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('modern-postman-state', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

export const clearState = () => {
  try {
    localStorage.removeItem('modern-postman-state');
  } catch (err) {
    console.error('Error clearing state:', err);
  }
};