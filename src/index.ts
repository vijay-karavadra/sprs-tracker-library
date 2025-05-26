// user-tracking.js

export interface ParsedUserAgent {
  browser: string;
  browserVersion?: string;
  device: 'Mobile' | 'Desktop' | 'Tablet' | 'Unknown';
  os: string;
}

export interface UserTrackingData {
  entryUrl: string;
  referrer: string;
  affiliateRefCode?: string;
  userAgent: string;
  platform: string;
  screenResolution: string;
  language: string;
  timezone: string;
  timestamp: number;
  geolocation?: GeolocationData;
  parsedUserAgent?: ParsedUserAgent;
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
  region?: string;
  country?: string;
  timestamp: number;
}

export interface VisitorData {
  sessionId: string;
  visits: UserTrackingData[];
  lastBatchSent: number;
  totalVisits: number;
  pagesVisited: string[];
  pageCount: number;
}

// User agent parsing
export const parseUserAgent = (userAgent: string): ParsedUserAgent => {
  let browser = 'Unknown';
  let browserVersion = '';

  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    browserVersion = match ? match[1] : '';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
    const match = userAgent.match(/Edge\/([0-9.]+)/);
    browserVersion = match ? match[1] : '';
  }

  let device: ParsedUserAgent['device'] = 'Desktop';
  if (/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent)) {
    device = 'Mobile';
  } else if (/iPad|Tablet/i.test(userAgent)) {
    device = 'Tablet';
  }

  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (/iOS|iPhone|iPad/.test(userAgent)) os = 'iOS';

  return { browser, browserVersion, device, os };
};

// Cookie helpers
export const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/`;
};

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

const generateSessionId = (): string => `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

// Core tracking
export const trackPageVisit = (url: string): void => {
  let data = getVisitorData() || createVisitorData();
  const cleanUrl = url.split('?')[0].split('#')[0];
  if (!data.pagesVisited.includes(cleanUrl)) {
    data.pagesVisited.push(cleanUrl);
    data.pageCount = data.pagesVisited.length;
    saveVisitorData(data);
    console.log(`Tracked: ${cleanUrl} (${data.pageCount} total)`);
  }
};

export const getPagesVisited = (): string[] => getVisitorData()?.pagesVisited || [];
export const getPageCount = (): number => getVisitorData()?.pageCount || 0;

export const parseAffiliateCode = (url: string): string | null => {
  try {
    const params = new URL(url).searchParams;
    for (const key of ['ref', 'a', 'aff', 'via']) {
      const val = params.get(key);
      if (val) return val;
    }
    const path = new URL(url).pathname;
    const patterns = [/\/ref\/([^\/]+)/, /\/a\/([^\/]+)/, /\/aff\/([^\/]+)/, /\/via\/([^\/]+)/];
    for (const regex of patterns) {
      const match = path.match(regex);
      if (match) return match[1];
    }
  } catch (e) {
    console.error('Affiliate code error:', e);
  }
  return null;
};

export const getBrowserGeolocation = (): Promise<GeolocationData | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const geo: GeolocationData = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: Date.now()
        };
        try {
          const loc = await reverseGeocode(geo.latitude, geo.longitude);
          if (loc) Object.assign(geo, loc);
        } catch (e) {
          console.error('Reverse geocode failed', e);
        }
        resolve(geo);
      },
      (err) => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });
};

export const reverseGeocode = async (lat: number, lng: number): Promise<{ city?: string; region?: string; country?: string } | null> => {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    return { city: data.city || data.locality, region: data.principalSubdivision, country: data.countryName };
  } catch (e) {
    console.error('Reverse geocoding error:', e);
    return null;
  }
};

export const getBrowserInfo = (): Pick<UserTrackingData, 'userAgent' | 'platform' | 'screenResolution' | 'language' | 'timezone' | 'timestamp'> => ({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  screenResolution: `${screen.width}x${screen.height}`,
  language: navigator.language,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  timestamp: Date.now()
});

export const getVisitorData = (): VisitorData | null => {
  try {
    const raw = localStorage.getItem('visitorData');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Visitor data load error:', e);
    return null;
  }
};

export const saveVisitorData = (data: VisitorData): void => {
  try {
    localStorage.setItem('visitorData', JSON.stringify(data));
  } catch (e) {
    console.error('Visitor data save error:', e);
  }
};

export const createVisitorData = (): VisitorData => {
  const data: VisitorData = {
    sessionId: generateSessionId(),
    visits: [],
    lastBatchSent: Date.now(),
    totalVisits: 0,
    pagesVisited: [],
    pageCount: 0
  };
  saveVisitorData(data);
  return data;
};

export const addVisitToTracker = (visit: UserTrackingData): void => {
  const data = getVisitorData() || createVisitorData();
  data.visits.push(visit);
  data.totalVisits++;
  saveVisitorData(data);
};
