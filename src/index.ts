import { v4 as uuidv4 } from 'uuid';

// Configuration constants with defaults
const DEFAULT_COOKIE_EXPIRE_DAYS = 30;
const DEFAULT_SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
const DEFAULT_BATCH_SEND_INTERVAL = 30 * 1000; // 30 seconds
const DEFAULT_ATTRIBUTION_MODE: AffiliateAttributionMode = 'first-visit';
const FIRST_VISIT_KEY = 'trk_first_visit';
const SESSION_START_KEY = 'trk_session_start';

// Attribution mode configuration
export type AffiliateAttributionMode = 'first-visit' | 'most-recent';

// Configuration interface
export interface TrackingConfig {
  affiliateAttributionMode?: AffiliateAttributionMode;
  cookieExpireDays?: number;
  sessionTimeout?: number;
  batchSendInterval?: number;
  enableGeolocation?: boolean;
}

// Global variables for tracking data
let globalClientIp = '';
let globalGeolocation: GeolocationData | null = null;
let globalLocationData: LocationData | null = null;
let dataSources: string[] = [];
let currentConfig: Required<TrackingConfig> = {
  affiliateAttributionMode: DEFAULT_ATTRIBUTION_MODE,
  cookieExpireDays: DEFAULT_COOKIE_EXPIRE_DAYS,
  sessionTimeout: DEFAULT_SESSION_TIMEOUT,
  batchSendInterval: DEFAULT_BATCH_SEND_INTERVAL,
  enableGeolocation: true
};

// Type definitions
export interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
  connectionType?: string;
  connection?: string; // Added for compatibility
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  city?: string; // Added for compatibility
  region?: string; // Added for compatibility  
  country?: string; // Added for compatibility
}

export interface ParsedUserAgent {
  browser: string;
  browserVersion: string;
  device: 'Mobile' | 'Desktop' | 'Tablet' | 'Unknown'; // Fixed to use union type
  os: string;
}

export interface TrackingInfo {
  referrerUrl: string;
  refererDomain: string;
  entryUrl: string;
  siteUrl: string;
  userAgent: string;
  browser: string;
  browserVersion: string;
  deviceType: string;
  operatingSystem: string;
  platform: string;
  screenSize: string;
  language: string;
  timezone: string;
  sourceCode: string;
  channelCode: string;
  campaignCode: string;
  affiliateCode: string;
  clientIp: string;
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
  connectionType?: string;
  comments: string;
  customField1: string;
  customField2: string;
  customField3: string;
  customField4: string;
  customField5: string;
}

export interface VisitData {
  pageUrl: string;
  timestamp: number;
  screenSize: string;
  language: string;
  timezone: string;
  pageTitle?: string;
  duration?: number;
  scrollDepth?: number;
}

export interface UtmParameters {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  keyword: string;
  adGroup: string;
  name: string;
}

export interface BatchPayload {
  siteId: string;
  visitorUUID: string;
  sessionId: string;
  timezone: string;
  trackingInfo: TrackingInfo;
  utmParameter: UtmParameters;
  visits: VisitData[];
  geolocation?: GeolocationData;
}

export interface UserTrackingData {
  ip: string;
  location: LocationData;
  geolocation: GeolocationData;
  sources: string[];
  userAgent?: string;
  clientIp?: string;
  platform?: string;
  language?: string;
  timezone?: string;
  screenResolution?: string;
  referrer?: string;
  entryUrl?: string;
  locationData?: LocationData;
  affiliateRefCode?: string; // Added for compatibility
}

// Cookie management functions
export const setCookie = (name: string, value: string, days?: number): void => {
  const cookieExpireDays = days || currentConfig.cookieExpireDays;
  const expires = new Date();
  expires.setTime(expires.getTime() + (cookieExpireDays * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || '';
  }
  return '';
};

// Fetch user IP function
export const fetchUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to fetch user IP:', error);
    return 'Unknown';
  }
};

// Enhanced affiliate code extraction from URL parameters and path
const extractAffiliateCode = (): string | null => {
  console.log('=== Enhanced Affiliate Code Extraction ===');
  
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const affiliateParams = ['ref', 'a', 'aff', 'affiliate', 'via', 'partner'];
  
  for (const param of affiliateParams) {
    const value = urlParams.get(param);
    if (value && value.trim()) {
      console.log(`Found affiliate code in URL parameter ${param}:`, value.trim());
      return value.trim();
    }
  }
  
  // Check URL path patterns like /a/<value>, /ref/<value>, etc.
  const pathname = window.location.pathname;
  const pathPatterns = [
    /\/a\/([^\/\?#]+)/i,           // /a/partner123
    /\/ref\/([^\/\?#]+)/i,        // /ref/partner123
    /\/aff\/([^\/\?#]+)/i,        // /aff/partner123
    /\/affiliate\/([^\/\?#]+)/i,  // /affiliate/partner123
    /\/via\/([^\/\?#]+)/i,        // /via/partner123
    /\/partner\/([^\/\?#]+)/i     // /partner/partner123
  ];
  
  for (const pattern of pathPatterns) {
    const match = pathname.match(pattern);
    if (match && match[1]) {
      console.log(`Found affiliate code in URL path with pattern ${pattern.source}:`, match[1]);
      return match[1];
    }
  }
  
  console.log('No affiliate code found in URL parameters or path');
  return null;
};

// Parse user agent for browser and device information
export const parseUserAgent = (userAgent: string): ParsedUserAgent => {
  const browsers = [
    { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
    { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
    { name: 'Safari', regex: /Safari\/([0-9.]+)/ },
    { name: 'Edge', regex: /Edge\/([0-9.]+)/ },
    { name: 'Opera', regex: /Opera\/([0-9.]+)/ }
  ];
  
  let browser = 'Unknown';
  let browserVersion = '';
  
  for (const b of browsers) {
    const match = userAgent.match(b.regex);
    if (match) {
      browser = b.name;
      browserVersion = match[1];
      break;
    }
  }
  
  // Ensure device returns the correct union type
  let device: 'Mobile' | 'Desktop' | 'Tablet' | 'Unknown' = 'Unknown';
  if (/Mobile|Android|iPhone/.test(userAgent)) {
    device = 'Mobile';
  } else if (/iPad|Tablet/.test(userAgent)) {
    device = 'Tablet';
  } else if (!/Mobile|Android|iPhone|iPad|Tablet/.test(userAgent)) {
    device = 'Desktop';
  }
  
  let os = 'Unknown';
  if (/Windows/.test(userAgent)) os = 'Windows';
  else if (/Mac OS/.test(userAgent)) os = 'macOS';
  else if (/Linux/.test(userAgent)) os = 'Linux';
  else if (/Android/.test(userAgent)) os = 'Android';
  else if (/iOS/.test(userAgent)) os = 'iOS';
  
  return { browser, browserVersion, device, os };
};

// Affiliate code management with configurable attribution mode
const manageAffiliateCode = (newAffiliateCode: string | null): string => {
  console.log('=== Enhanced Affiliate Code Management ===');
  console.log('Affiliate Mode:', currentConfig.affiliateAttributionMode);
  console.log('New affiliate code from URL:', newAffiliateCode);
  
  const existingCookieAffiliate = getCookie('affiliateRefCode');
  const existingStorageAffiliate = localStorage.getItem('affiliateRefCode');
  
  console.log('Existing cookie affiliate:', existingCookieAffiliate);
  console.log('Existing storage affiliate:', existingStorageAffiliate);
  
  let finalAffiliateCode = '';
  
  if (currentConfig.affiliateAttributionMode === 'most-recent') {
    // Most recent mode: new affiliate code overwrites existing
    if (newAffiliateCode) {
      finalAffiliateCode = newAffiliateCode;
      setCookie('affiliateRefCode', newAffiliateCode);
      localStorage.setItem('affiliateRefCode', newAffiliateCode);
      console.log('Setting new affiliate code (most-recent mode):', newAffiliateCode);
    } else {
      // Use existing if no new one provided
      finalAffiliateCode = existingCookieAffiliate || existingStorageAffiliate || '';
      console.log('Using existing affiliate code (most-recent mode):', finalAffiliateCode);
    }
  } else {
    // First visit mode: existing affiliate code is preserved
    if (existingCookieAffiliate || existingStorageAffiliate) {
      finalAffiliateCode = existingCookieAffiliate || existingStorageAffiliate || '';
      console.log('Preserving existing affiliate code (first-visit mode):', finalAffiliateCode);
    } else if (newAffiliateCode) {
      finalAffiliateCode = newAffiliateCode;
      setCookie('affiliateRefCode', newAffiliateCode);
      localStorage.setItem('affiliateRefCode', newAffiliateCode);
      console.log('Setting first affiliate code (first-visit mode):', newAffiliateCode);
    }
  }
  
  console.log('Final affiliate code:', finalAffiliateCode);
  console.log('=== End Affiliate Code Management ===');
  
  return finalAffiliateCode;
};

// Automatic geolocation capture
const captureGeolocation = async (): Promise<GeolocationData | null> => {
  if (!currentConfig.enableGeolocation) {
    console.log('Geolocation capture disabled in configuration');
    return null;
  }

  try {
    // First get the IP-based location data
    const locationData = await fetchLocationData();
    
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('Geolocation API not supported');
        resolve({
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          timestamp: Date.now(),
          city: locationData?.city || 'Unknown',
          region: locationData?.region || 'Unknown',
          country: locationData?.country || 'Unknown'
        });
        return;
      }

      console.log('Requesting geolocation permission...');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geolocationData: GeolocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
            city: locationData?.city || 'Unknown',
            region: locationData?.region || 'Unknown',
            country: locationData?.country || 'Unknown'
          };
          
          console.log('Geolocation captured successfully:', geolocationData);
          globalGeolocation = geolocationData;
          resolve(geolocationData);
        },
        (error) => {
          console.log('Geolocation error:', error.code, error.message);
          resolve({
            latitude: 0,
            longitude: 0,
            accuracy: 0,
            timestamp: Date.now(),
            city: locationData?.city || 'Unknown',
            region: locationData?.region || 'Unknown',
            country: locationData?.country || 'Unknown'
          });
        }
      );
    });
  } catch (error) {
    console.error('Error in geolocation capture:', error);
    return {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      timestamp: Date.now(),
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown'
    };
  }
};

// Enhanced tracking info generation
const generateEnhancedTrackingInfo = async (): Promise<TrackingInfo> => {
  const referrer = document.referrer || 'Direct';
  const userAgent = navigator.userAgent;
  const parsed = parseUserAgent(userAgent);
  
  // Get location data if not already present
  if (!globalLocationData) {
    globalLocationData = await fetchLocationData();
  }
  
  const trackingInfo: TrackingInfo = {
    referrerUrl: referrer,
    refererDomain: referrer !== 'Direct' ? new URL(referrer).hostname : '',
    entryUrl: window.location.href,
    siteUrl: window.location.origin,
    userAgent,
    browser: parsed.browser,
    browserVersion: parsed.browserVersion,
    deviceType: parsed.device,
    operatingSystem: parsed.os,
    platform: navigator.platform,
    screenSize: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sourceCode: 'direct',
    channelCode: 'direct',
    campaignCode: '',
    affiliateCode: '',
    clientIp: globalClientIp,
    city: globalLocationData?.city || 'Unknown',
    region: globalLocationData?.region || 'Unknown',
    country: globalLocationData?.country || 'Unknown',
    isp: globalLocationData?.isp || 'Unknown',
    connectionType: globalLocationData?.connectionType || 'Unknown',
    comments: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    customField5: ''
  };
  
  console.log('Generated enhanced tracking info with proper affiliate code:', trackingInfo);
  
  return trackingInfo;
};

// Parse UTM parameters
const parseUtmParameters = (): UtmParameters => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const utmParams: UtmParameters = {
    source: urlParams.get('utm_source') || urlParams.get('utm-source') || 'Not set',
    medium: urlParams.get('utm_medium') || urlParams.get('utm-medium') || 'Not set',
    campaign: urlParams.get('utm_campaign') || urlParams.get('utm-campaign') || 'Not set',
    term: urlParams.get('utm_term') || urlParams.get('utm-term') || 'Not set',
    content: urlParams.get('utm_content') || urlParams.get('utm-content') || 'Not set',
    keyword: urlParams.get('utm_keyword') || urlParams.get('utm-keyword') || 'Not set',
    adGroup: urlParams.get('utm_adgroup') || urlParams.get('utm-adgroup') || 'Not set',
    name: urlParams.get('utm_name') || urlParams.get('utm-name') || 'Not set'
  };
  
  console.log('Parsed UTM parameters:', utmParams);
  return utmParams;
};

// Main VisitorTracker class with configurable options
export class VisitorTracker {
  private siteId: string;
  private apiEndpoint: string;
  private visitorUUID: string;
  private sessionId: string;
  private batchTimer: NodeJS.Timeout | null = null;
  private config: Required<TrackingConfig>;

  constructor(siteId: string, apiEndpoint: string, config?: TrackingConfig) {
    this.siteId = siteId;
    this.apiEndpoint = apiEndpoint;
    
    // Merge provided config with defaults
    this.config = {
      affiliateAttributionMode: config?.affiliateAttributionMode || DEFAULT_ATTRIBUTION_MODE,
      cookieExpireDays: config?.cookieExpireDays || DEFAULT_COOKIE_EXPIRE_DAYS,
      sessionTimeout: config?.sessionTimeout || DEFAULT_SESSION_TIMEOUT,
      batchSendInterval: config?.batchSendInterval || DEFAULT_BATCH_SEND_INTERVAL,
      enableGeolocation: config?.enableGeolocation !== undefined ? config.enableGeolocation : true
    };
    
    // Set global config for use by other functions
    currentConfig = this.config;
    
    console.log('VisitorTracker initialized with config:', this.config);
    
    // Initialize visitor UUID
    this.visitorUUID = getCookie('trk_visitor_uuid') || uuidv4();
    setCookie('trk_visitor_uuid', this.visitorUUID, 365);
    
    // Initialize session
    this.sessionId = getCookie('trk_session_id') || `${this.visitorUUID}_${Date.now()}`;
    setCookie('trk_session_id', this.sessionId);
    setCookie('trk_session_timestamp', Date.now().toString());
    
    // Track first visit
    if (!localStorage.getItem(FIRST_VISIT_KEY)) {
      localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
    }
    
    // Track session start
    localStorage.setItem(SESSION_START_KEY, Date.now().toString());
    
    // Initialize tracking and geolocation capture
    this.initializeTracking();
    
    // Setup global reference
    (window as any).crmTracker = this;
  }

  private async initializeTracking(): Promise<void> {
    // Capture geolocation if enabled
    if (this.config.enableGeolocation) {
      try {
        await captureGeolocation();
      } catch (error) {
        console.error('Failed to capture geolocation:', error);
      }
    }
    
    // Track initial page view
    this.trackPageView();
    
    // Start batch timer
    this.startBatchTimer();
  }

  public trackPageView(): void {
    const visit: VisitData = {
      pageUrl: window.location.href,
      timestamp: Date.now(),
      screenSize: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      pageTitle: document.title
    };

    // Get current batch and add visit
    const currentBatch = this.getCurrentBatch();
    currentBatch.visits.push(visit);
    
    // Save updated batch
    try {
      localStorage.setItem('trk_tracking_batch', JSON.stringify(currentBatch));
    } catch (error) {
      console.error('Error saving tracking batch:', error);
    }
  }

  public async getCurrentBatch(): Promise<BatchPayload> {
    try {
      const stored = localStorage.getItem('trk_tracking_batch');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Update tracking info if missing required fields
        if (!parsed.trackingInfo.isp || !parsed.trackingInfo.city) {
          parsed.trackingInfo = await generateEnhancedTrackingInfo();
        }
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing stored batch:', error);
    }

    // Create new batch
    const newBatch: BatchPayload = {
      siteId: this.siteId,
      visitorUUID: this.visitorUUID,
      sessionId: this.sessionId,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      trackingInfo: await generateEnhancedTrackingInfo(),
      utmParameter: parseUtmParameters(),
      visits: [],
      geolocation: globalGeolocation || {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        timestamp: Date.now(),
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown'
      }
    };

    return newBatch;
  }

  public async sendBatch(): Promise<void> {
    const batch = this.getCurrentBatch();
    
    if (!batch.visits.length) {
      console.log('No visits to send in batch');
      return;
    }

    console.log('Sending enhanced CRM-compatible batch:', batch);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch)
      });

      if (response.ok) {
        console.log('Tracking batch sent successfully');
        // Clear the batch after successful send
        localStorage.removeItem('trk_tracking_batch');
      } else {
        console.error('Failed to send tracking batch - HTTP status:', response.status);
      }
    } catch (error) {
      console.error('Failed to send tracking batch:', error);
    }
  }

  private startBatchTimer(): void {
    this.batchTimer = setInterval(() => {
      this.sendBatch();
    }, this.config.batchSendInterval);
  }

  public getVisitorUUID(): string {
    return this.visitorUUID;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }
  }

  // Get current configuration
  public getConfig(): Required<TrackingConfig> {
    return { ...this.config };
  }

  // Update configuration
  public updateConfig(newConfig: Partial<TrackingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    currentConfig = this.config;
    
    // Restart batch timer if interval changed
    if (newConfig.batchSendInterval && this.batchTimer) {
      clearInterval(this.batchTimer);
      this.startBatchTimer();
    }
    
    console.log('Configuration updated:', this.config);
  }
}

// Initialize tracking function with configurable options
export const initializeTracking = (
  siteId: string, 
  apiEndpoint: string, 
  config?: TrackingConfig
): VisitorTracker => {
  console.log('Initializing comprehensive tracking system with config:', config);
  return new VisitorTracker(siteId, apiEndpoint, config);
};

// Utility functions for getting tracking data
export const getUserTrackingData = (): UserTrackingData => {
  const affiliateCode = getCookie('affiliateRefCode') || localStorage.getItem('affiliateRefCode') || '';
  
  return {
    ip: globalClientIp,
    location: globalLocationData || {},
    geolocation: globalGeolocation || { latitude: 0, longitude: 0, accuracy: 0, timestamp: 0 },
    sources: dataSources,
    userAgent: navigator.userAgent,
    clientIp: globalClientIp,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    referrer: document.referrer,
    entryUrl: window.location.href,
    locationData: globalLocationData || {},
    affiliateRefCode: affiliateCode
  };
};

export const fetchLocationData = async (ip?: string): Promise<LocationData> => {
  if (!ip) {
    return globalLocationData || {};
  }
  
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    const locationData: LocationData = {
      city: data.city,
      region: data.region,
      country: data.country_name,
      isp: data.org,
      connectionType: data.connection_type || 'Unknown',
      connection: data.connection_type || 'Unknown'
    };
    
    globalLocationData = locationData;
    return locationData;
  } catch (error) {
    console.error('Failed to fetch location data:', error);
    return globalLocationData || {};
  }
};

export const getPagesVisited = (): string[] => {
  try {
    const batch = localStorage.getItem('trk_tracking_batch');
    if (batch) {
      const parsed = JSON.parse(batch);
      return parsed.visits?.map((visit: VisitData) => visit.pageUrl) || [];
    }
  } catch (error) {
    console.error('Error getting pages visited:', error);
  }
  return [];
};

export const getPageCount = (): number => {
  return getPagesVisited().length;
};