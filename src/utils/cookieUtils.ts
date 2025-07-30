/**
 * Utility functions for cookie management
 */

export const clearAllCookies = () => {
  const cookies = document.cookie.split(";");
  const hostname = window.location.hostname;
  const domain = hostname.startsWith('www.') ? hostname.substring(4) : hostname;
  
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    
    if (name) {
      // Clear with different path and domain combinations to ensure complete removal
      const clearOptions = [
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${hostname}`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${hostname}`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=strict`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=lax`,
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=none`,
      ];
      
      clearOptions.forEach(option => {
        document.cookie = option;
      });
    }
  });
  
  console.log('🍪 All cookies cleared completely');
};

export const clearSpecificCookie = (name: string) => {
  const hostname = window.location.hostname;
  const domain = hostname.startsWith('www.') ? hostname.substring(4) : hostname;
  
  const clearOptions = [
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${hostname}`,
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${hostname}`,
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`,
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`,
  ];
  
  clearOptions.forEach(option => {
    document.cookie = option;
  });
  
  console.log(`🍪 Cookie "${name}" cleared`);
};

export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  
  return cookies;
};

export const getCookie = (name: string): string | null => {
  const cookies = getAllCookies();
  return cookies[name] || null;
};

export const setCookie = (name: string, value: string, days: number = 7, secure: boolean = true) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  const secureFlag = secure && window.location.protocol === 'https:' ? '; secure' : '';
  const sameSite = secure ? '; samesite=strict' : '; samesite=lax';
  
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/${secureFlag}${sameSite}`;
  
  console.log(`🍪 Cookie "${name}" set`);
}; 