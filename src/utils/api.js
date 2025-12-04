import axios from 'axios';

const executeRequest = async (tab, baseUrl, environmentVariables = {}) => {
  const startTime = Date.now();

  try {
    // Replace variables in URL and body
    let finalUrl = tab.url;
    let finalBody = tab.body;

    Object.entries(environmentVariables).forEach(([key, value]) => {
      const pattern = new RegExp(`{{${key}}}`, 'g');
      finalUrl = finalUrl.replace(pattern, value);
      finalBody = finalBody.replace(pattern, value);
    });

    // Add base URL
    const fullUrl = baseUrl ? baseUrl + finalUrl : finalUrl;

    // Prepare headers
    const headers = {};
    tab.headers
      .filter(h => h.enabled && h.key)
      .forEach(h => {
        headers[h.key] = h.value;
      });

    // Prepare query params
    const params = {};
    tab.params
      .filter(p => p.enabled && p.key)
      .forEach(p => {
        params[p.key] = p.value;
      });

    // Execute request
    const response = await axios({
      method: tab.method,
      url: fullUrl,
      headers,
      params,
      data: tab.method !== 'GET' && tab.method !== 'DELETE' ? JSON.parse(finalBody || '{}') : undefined,
      validateStatus: () => true // Don't throw on HTTP errors
    });

    const endTime = Date.now();

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      time: endTime - startTime,
      size: JSON.stringify(response.data).length
    };
  } catch (error) {
    const endTime = Date.now();

    return {
      error: error.message,
      time: endTime - startTime,
      status: 0,
      statusText: 'Error'
    };
  }
};

export { executeRequest };