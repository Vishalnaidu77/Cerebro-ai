const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect local development environment
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' || 
                  window.location.hostname.startsWith('192.168.');
                  
  return isLocal ? 'http://localhost:8000' : 'https://cerebro-ai-h2cn.onrender.com';
};

export const BASE_URL = getBaseUrl();
export const AUTH_BASE_URL = `${BASE_URL}/api/auth`;
