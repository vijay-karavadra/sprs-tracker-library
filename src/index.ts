/**
 * Comprehensive User Tracking System
 * 
 * A complete tracking solution for web applications that captures user behavior,
 * affiliate codes, UTM parameters, session data, IP address, and geolocation for CRM integration.
 * 
 * Features:
 * - Visitor and session tracking with UUIDs
 * - IP address and geolocation capture
 * - Automatic affiliate code detection from URLs and storage
 * - UTM parameter parsing (both hyphenated and underscore formats)
 * - Batch processing with configurable intervals
 * - Browser fingerprinting and geolocation
 * - Legacy compatibility functions
 * - Debug utilities for troubleshooting
 * 
 * Usage:
 * ```javascript
 * import { initializeTracking } from './userTracking';
 * 
 * const tracker = initializeTracking('your-site-id', 'https://your-api.com/tracking');
 * // Tracking starts automatically
 * ```
 * 
 * @version 2.2.0
 * @author CRM Tracking System
 */

import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TrackingInfo {
  referrerUrl: string;
  refererDomain: string;
  entryUrl: string;
  userAgent: string;
  siteUrl: string;
  sourceCode: string;
  channelCode: string;
  campaignCode: string;
  affiliateCode: string;
  clientIp: string;
  comments: string;
  customField1: string;
  customField2: string;
  customField3: string;
  customField4: string;
  customField5: string;
  // Enhanced location fields
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
  connectionType?: string;
}

export interface UTMParameters {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  keyword: string;
  adGroup: string;
  name: string;
}

export interface VisitData {
  pageUrl: string;
  timestamp: number;
  screenSize: string;
  language: string;
  timezone: string;
}

export interface BatchPayload {
  siteId: string;
  visitorUUID: string;
  sessionId: string;
  timezone: string;
  trackingInfo: TrackingInfo;
  utmParameter: UTMParameters;
  visits: VisitData[];
  geolocation?: GeolocationData;
}

export interface ParsedUserAgent {
  browser: string;
  browserVersion?: string;
  device: 'Mobile' | 'Desktop' | 'Tablet' | 'Unknown';
  os: string;
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

export interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
  connection?: string;
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
  clientIp?: string;
  locationData?: LocationData;
}

export interface VisitorData {
  sessionId: string;
  visits: UserTrackingData[];
  lastBatchSent: number;
  totalVisits: number;
  pagesVisited: string[];
  pageCount: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const VISITOR_COOKIE = 'trk_visitor_uuid';
export const SESSION_COOKIE = 'trk_session_id';
export const AFFILIATE_COOKIE = 'affiliateRefCode';
export const BATCH_STORAGE_KEY = 'trk_tracking_batch';
export const ENTRY_URL_KEY = 'trk_entry_url';
export const REFERRER_KEY = 'trk_original_referrer';
export const REFERRER_DOMAIN_KEY = 'trk_original_referrer_domain';
export const FIRST_VISIT_KEY = 'trk_first_visit';
export const BATCH_INTERVAL = 60000; // 1 minute
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Global variables for captured data
let capturedIP: string = '';
let capturedLocation: LocationData | null = null;
let capturedGeolocation: GeolocationData | null = null;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Fetch user's real IP address
 */
export const fetchUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    capturedIP = data.ip;
    console.log('User IP captured:', capturedIP);
    return capturedIP;
  } catch (error) {
    console.error('Failed to fetch user IP:', error);
    capturedIP = 'Unknown';
    return capturedIP;
  }
};

/**
 * Fetch location data from IP address
 */
export const fetchLocationFromIP = async (ip: string): Promise<LocationData | null> => {
  if (!ip || ip === 'Unknown') return null;
  
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) throw new Error('Failed to fetch location data');
    
    const data = await response.json();
    capturedLocation = {
      city: data.city || '',
      region: data.region || '',
      country: data.country_name || '',
      isp: data.org || '',
      connection: data.connection_type || 'Unknown'
    };
    console.log('Location data captured:', capturedLocation);
    return capturedLocation;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};

/**
 * Get browser geolocation with reverse geocoding
 */
export const getBrowserGeolocation = (): Promise<GeolocationData | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const geolocationData: GeolocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };

        // Try to get city/region from coordinates using reverse geocoding
        try {
          const reverseGeocodingData = await reverseGeocode(geolocationData.latitude, geolocationData.longitude);
          if (reverseGeocodingData) {
            geolocationData.city = reverseGeocodingData.city;
            geolocationData.region = reverseGeocodingData.region;
            geolocationData.country = reverseGeocodingData.country;
          }
        } catch (error) {
          console.error('Error with reverse geocoding:', error);
        }

        capturedGeolocation = geolocationData;
        console.log('Browser geolocation obtained:', geolocationData);
        resolve(geolocationData);
      },
      (error) => {
        console.log('Geolocation permission denied or error:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  });
};

/**
 * Cookie utility functions for managing tracking cookies
 */
export const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return '';
};

const getCookieInternal = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || '';
  }
  
  return '';
};

const setCookieInternal = (name: string, value: string, days: number): void => {
  let expires = '';
  
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
};

/**
 * Parse user agent string to extract browser, device, and OS information
 */
export const parseUserAgent = (userAgent: string): ParsedUserAgent => {
  // Browser detection
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
  
  // Device detection
  let device: 'Mobile' | 'Desktop' | 'Tablet' | 'Unknown' = 'Desktop';
  
  if (/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent)) {
    device = 'Mobile';
  } else if (/iPad|Tablet/i.test(userAgent)) {
    device = 'Tablet';
  }
  
  // OS detection
  let os = 'Unknown';
  
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac OS')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  }
  
  return {
    browser,
    browserVersion,
    device,
    os
  };
};

/**
 * Parse affiliate code from URL using various parameter formats
 */
export const parseAffiliateCode = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    // Check query parameters - expanded list
    const affiliateParams = ['ref', 'a', 'aff', 'affiliate', 'via', 'partner'];
    for (const param of affiliateParams) {
      const value = params.get(param);
      if (value) return value;
    }
    
    // Check path segments
    const pathname = urlObj.pathname;
    const pathMatches = [
      /\/ref\/([^\/]+)/,
      /\/a\/([^\/]+)/,
      /\/aff\/([^\/]+)/,
      /\/via\/([^\/]+)/,
      /\/affiliate\/([^\/]+)/
    ];
    
    for (const regex of pathMatches) {
      const match = pathname.match(regex);
      if (match && match[1]) return match[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing affiliate code:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to city/region
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<{ city?: string; region?: string; country?: string } | null> => {
  try {
    // Using a free reverse geocoding service
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    if (!response.ok) throw new Error('Failed to reverse geocoding');
    
    const data = await response.json();
    return {
      city: data.city || data.locality,
      region: data.principalSubdivision,
      country: data.countryName
    };
  } catch (error) {
    console.error('Error with reverse geocoding:', error);
    return null;
  }
};

/**
 * Fetch location data from IP address
 */
export const fetchLocationData = async (ip: string): Promise<LocationData | null> => {
  try {
    // Using ipapi.co for location data
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) throw new Error('Failed to fetch location data');
    
    const data = await response.json();
    return {
      city: data.city,
      region: data.region,
      country: data.country_name,
      isp: data.org,
      connection: data.connection_type || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};

// ============================================================================
// ENHANCED REFERRER AND UTM DETECTION
// ============================================================================

/**
 * Enhanced referrer detection with multiple fallback methods
 */
const detectReferrerData = () => {
  console.log('=== Enhanced Referrer Detection ===');
  console.log('document.referrer:', document.referrer);
  console.log('window.location.href:', window.location.href);
  
  // Check if this is the very first visit
  const isFirstVisit = !localStorage.getItem(FIRST_VISIT_KEY);
  console.log('Is first visit:', isFirstVisit);
  
  let referrerUrl = '';
  let referrerDomain = '';
  
  if (isFirstVisit) {
    // On first visit, capture the referrer from document.referrer
    const docReferrer = document.referrer || '';
    console.log('First visit - document.referrer:', docReferrer);
    
    if (docReferrer && docReferrer.trim() !== '') {
      referrerUrl = docReferrer;
      referrerDomain = extractDomainFromUrl(docReferrer);
      
      // Store for future visits
      try {
        localStorage.setItem(REFERRER_KEY, referrerUrl);
        localStorage.setItem(REFERRER_DOMAIN_KEY, referrerDomain);
        localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
        console.log('Stored referrer data:', { referrerUrl, referrerDomain });
      } catch (e) {
        console.warn('Could not store referrer data in localStorage');
      }
    } else {
      // Try alternative detection methods for first visit
      referrerUrl = detectReferrerFromBrowser() || 'Direct';
      referrerDomain = referrerUrl === 'Direct' ? 'Direct' : extractDomainFromUrl(referrerUrl);
      
      try {
        localStorage.setItem(REFERRER_KEY, referrerUrl);
        localStorage.setItem(REFERRER_DOMAIN_KEY, referrerDomain);
        localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
      } catch (e) {
        console.warn('Could not store referrer data in localStorage');
      }
    }
  } else {
    // For subsequent visits, use stored data
    try {
      referrerUrl = localStorage.getItem(REFERRER_KEY) || 'Direct';
      referrerDomain = localStorage.getItem(REFERRER_DOMAIN_KEY) || 'Direct';
      console.log('Retrieved stored referrer data:', { referrerUrl, referrerDomain });
    } catch (e) {
      console.warn('Could not retrieve referrer data from localStorage');
      referrerUrl = 'Direct';
      referrerDomain = 'Direct';
    }
  }
  
  console.log('Final referrer data:', { referrerUrl, referrerDomain });
  console.log('=== End Enhanced Referrer Detection ===');
  
  return {
    url: referrerUrl,
    domain: referrerDomain
  };
};

/**
 * Alternative referrer detection methods
 */
const detectReferrerFromBrowser = () => {
  // Method 1: Check for search engine parameters that might indicate source
  const urlParams = new URLSearchParams(window.location.search);
  const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo'];
  
  for (const engine of searchEngines) {
    if (urlParams.get('utm_source') === engine || urlParams.get('source') === engine) {
      return 'https://www.' + engine + '.com';
    }
  }
  
  // Method 2: Check if there are UTM parameters indicating external source
  const utmSource = urlParams.get('utm_source') || urlParams.get('utm-source');
  if (utmSource && utmSource !== 'direct') {
    return 'https://' + utmSource + '.com';
  }
  
  // Method 3: Check for affiliate parameters
  const affiliateParams = ['ref', 'a', 'aff', 'affiliate', 'via', 'partner'];
  for (const param of affiliateParams) {
    const value = urlParams.get(param);
    if (value) {
      return 'Affiliate: ' + value;
    }
  }
  
  return null;
};

/**
 * Extract domain from URL with improved error handling
 */
const extractDomainFromUrl = (url: string) => {
  if (!url || url === 'Direct' || url.trim() === '') {
    return 'Direct';
  }
  
  try {
    // Handle special cases
    if (url.startsWith('Affiliate:')) {
      return 'Affiliate';
    }
    
    // Ensure URL has protocol
    if (!url.match(/^https?:\/\//)) {
      url = 'https://' + url;
    }
    
    const urlObj = new URL(url);
    let domain = urlObj.hostname;
    
    // Remove www. prefix if present
    if (domain.startsWith('www.')) {
      domain = domain.substring(4);
    }
    
    return domain;
  } catch (error) {
    console.error('Error extracting domain from URL:', url, error);
    return 'Unknown';
  }
};

/**
 * Parse UTM parameters from current URL
 */
const parseUTMFromCurrentUrl = (): UTMParameters => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Helper function to get parameter value or "Not set"
  const getParamValue = (...paramNames: string[]): string => {
    for (const paramName of paramNames) {
      const value = urlParams.get(paramName);
      if (value && value.trim() !== '') {
        return value.trim();
      }
    }
    return 'Not set';
  };
  
  // Handle both hyphenated and underscored UTM parameters
  const utmParams = {
    source: getParamValue('utm_source', 'utm-source'),
    medium: getParamValue('utm_medium', 'utm-medium'),
    campaign: getParamValue('utm_campaign', 'utm-campaign'),
    term: getParamValue('utm_term', 'utm-term'),
    content: getParamValue('utm_content', 'utm-content'),
    keyword: getParamValue('utm_keyword', 'utm-keyword', 'keyword'),
    adGroup: getParamValue('utm_adgroup', 'utm-adgroup', 'utm_adGroup', 'utm-adGroup', 'adgroup'),
    name: getParamValue('utm_name', 'utm-name', 'name')
  };

  console.log('Parsed UTM parameters from current URL:', utmParams);
  return utmParams;
};

/**
 * Parse affiliate code from current URL
 */
const parseAffiliateFromCurrentUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  const affiliateParams = ['ref', 'a', 'aff', 'affiliate', 'via', 'partner'];
  
  for (const param of affiliateParams) {
    const value = urlParams.get(param);
    if (value) {
      console.log('Affiliate code found in current URL:', value);
      setCookieInternal(AFFILIATE_COOKIE, value, 30); // Save for 30 days
      localStorage.setItem('affiliateRefCode', value);
      return value;
    }
  }
  
  // Return previously stored affiliate code if none found in current URL
  return getCookieInternal(AFFILIATE_COOKIE) || '';
};

// ============================================================================
// MAIN VISITOR TRACKER CLASS
// ============================================================================

/**
 * Main VisitorTracker class that handles all tracking functionality including IP and geolocation
 */
export class VisitorTracker {
  private siteId: string;
  private apiEndpoint: string;
  private batchTimer: NodeJS.Timeout | null = null;
  private visitorUUID: string;
  private sessionId: string;
  private dataReady: boolean = false;

  constructor(siteId: string, apiEndpoint: string) {
    this.siteId = siteId;
    this.apiEndpoint = apiEndpoint;
    this.visitorUUID = this.getOrCreateVisitorUUID();
    this.sessionId = this.getOrCreateSessionId();
    
    // Store initial entry URL to handle browser referrer inconsistencies
    this.storeInitialEntryUrl();
    
    // Initialize data capture first, then start tracking
    this.initializeDataCapture();
  }

  /**
   * Initialize data capture for IP and geolocation
   */
  private async initializeDataCapture(): Promise<void> {
    try {
      console.log('Starting data capture initialization...');
      
      // Capture IP and location data in parallel
      const results = await Promise.allSettled([
        fetchUserIP(),
        getBrowserGeolocation()
      ]);

      const ipResult = results[0];
      const geolocationResult = results[1];

      console.log('IP fetch result:', ipResult);
      console.log('Geolocation result:', geolocationResult);

      // Fetch location data from IP if we have it
      if (ipResult.status === 'fulfilled' && ipResult.value && ipResult.value !== 'Unknown') {
        await fetchLocationFromIP(ipResult.value);
      }

      this.dataReady = true;
      console.log('All tracking data captured successfully');
      console.log('Captured data:', { ip: capturedIP, location: capturedLocation, geolocation: capturedGeolocation });
      
      // Store enhanced tracking data
      this.storeEnhancedTrackingData();
      
      // Initialize tracking now that data is ready
      this.initialize();
    } catch (error) {
      console.error('Error capturing tracking data:', error);
      this.dataReady = true; // Continue even if some data capture fails
      this.initialize();
    }
  }

  /**
   * Store enhanced tracking data with IP and geolocation
   */
  private storeEnhancedTrackingData(): void {
    const trackingData: UserTrackingData = {
      ...this.getBrowserInfo(),
      entryUrl: this.getTrueEntryUrl(),
      referrer: document.referrer || 'Direct',
      affiliateRefCode: getCookieInternal(AFFILIATE_COOKIE) || undefined,
      clientIp: capturedIP,
      locationData: capturedLocation || undefined,
      geolocation: capturedGeolocation || undefined,
      parsedUserAgent: parseUserAgent(navigator.userAgent)
    };

    try {
      localStorage.setItem('userTrackingData', JSON.stringify(trackingData));
      console.log('Enhanced tracking data stored:', trackingData);
    } catch (error) {
      console.error('Error storing enhanced tracking data:', error);
    }
  }

  /**
   * Store the initial entry URL on first visit to handle browser referrer inconsistencies
   */
  private storeInitialEntryUrl(): string {
    const storedEntryUrl = localStorage.getItem(ENTRY_URL_KEY);
    
    if (!storedEntryUrl) {
      const currentUrl = window.location.href;
      localStorage.setItem(ENTRY_URL_KEY, currentUrl);
      console.log('Initial entry URL stored:', currentUrl);
      return currentUrl;
    }
    
    return storedEntryUrl;
  }

  /**
   * Get the true entry URL (handles browser referrer suppression)
   */
  private getTrueEntryUrl(): string {
    return localStorage.getItem(ENTRY_URL_KEY) || window.location.href;
  }

  /**
   * Get browser information
   */
  private getBrowserInfo(): Pick<UserTrackingData, 'userAgent' | 'platform' | 'screenResolution' | 'language' | 'timezone' | 'timestamp'> {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: Date.now()
    };
  }

  /**
   * Initialize tracking system
   */
  private initialize(): void {
    // Track page view on initialization
    this.trackPageView();
    
    // Set up batch processing
    this.startBatchTimer();
    
    // Send any pending data on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.sendBatch();
      });
    }
  }

  /**
   * Get or create visitor UUID with persistent cookie storage
   */
  private getOrCreateVisitorUUID(): string {
    let visitorUUID = getCookieInternal(VISITOR_COOKIE);
    
    if (!visitorUUID) {
      visitorUUID = uuidv4();
      setCookieInternal(VISITOR_COOKIE, visitorUUID, 365); // 1 year
    }
    
    return visitorUUID;
  }

  /**
   * Get or create session ID with expiration handling
   */
  private getOrCreateSessionId(): string {
    let sessionId = getCookieInternal(SESSION_COOKIE);
    const now = Date.now();
    
    if (!sessionId || this.isSessionExpired()) {
      sessionId = `${this.visitorUUID}_${now}`;
      setCookieInternal(SESSION_COOKIE, sessionId, 0); // Session cookie
      setCookieInternal('trk_session_timestamp', now.toString(), 0);
    }
    
    return sessionId;
  }

  /**
   * Check if current session has expired
   */
  private isSessionExpired(): boolean {
    const timestamp = getCookieInternal('trk_session_timestamp');
    if (!timestamp) return true;
    
    return Date.now() - parseInt(timestamp) > SESSION_TIMEOUT;
  }

  /**
   * Track a page view and add to batch
   */
  public trackPageView(): void {
    const visit: VisitData = {
      pageUrl: window.location.href,
      timestamp: Date.now(),
      screenSize: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    this.addToBatch(visit);
    
    // Also maintain legacy page tracking for backward compatibility
    this.trackPageVisitLegacy(window.location.pathname);
  }

  /**
   * Add visit data to current batch
   */
  private addToBatch(visit: VisitData): void {
    const batch = this.getBatch();
    batch.visits.push(visit);
    this.saveBatch(batch);
  }

  /**
   * Get current batch or create new one with updated tracking info
   */
  private getBatch(): BatchPayload {
    const stored = localStorage.getItem(BATCH_STORAGE_KEY);
    if (stored) {
      const batch = JSON.parse(stored);
      // Update tracking info with current page data
      batch.trackingInfo = this.getTrackingInfo();
      batch.utmParameter = parseUTMFromCurrentUrl();
      return batch;
    }

    return {
      siteId: this.siteId,
      visitorUUID: this.visitorUUID,
      sessionId: this.sessionId,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      trackingInfo: this.getTrackingInfo(),
      utmParameter: parseUTMFromCurrentUrl(),
      visits: []
    };
  }

  /**
   * Save batch to localStorage
   */
  private saveBatch(batch: BatchPayload): void {
    localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(batch));
  }

  /**
   * Generate comprehensive tracking information with IP and location data
   */
  private getTrackingInfo(): TrackingInfo {
    // Get referrer data using enhanced detection
    const referrerData = detectReferrerData();
    
    // Get affiliate code from current URL or cookie
    const affiliateCode = parseAffiliateFromCurrentUrl();
    
    // Parse UTM parameters from current URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Helper function to get UTM parameters with both formats
    const getUtmParam = (hyphenated: string, underscored: string) => {
      return urlParams.get(hyphenated) || urlParams.get(underscored) || '';
    };
    
    // Get true entry URL (handles browser referrer suppression)
    const trueEntryUrl = this.getTrueEntryUrl();
    
    const trackingInfo: TrackingInfo = {
      referrerUrl: referrerData.url,
      refererDomain: referrerData.domain,
      entryUrl: trueEntryUrl, // Use stored entry URL instead of current URL
      userAgent: navigator.userAgent,
      siteUrl: window.location.href, // Current page URL
      sourceCode: getUtmParam('utm-source', 'utm_source') || urlParams.get('source') || 'organic',
      channelCode: urlParams.get('channel') || this.detectChannel(),
      campaignCode: getUtmParam('utm-campaign', 'utm_campaign') || urlParams.get('campaign') || '',
      affiliateCode: affiliateCode,
      clientIp: capturedIP, // Include captured IP
      comments: '',
      customField1: urlParams.get('c1') || '',
      customField2: urlParams.get('c2') || '',
      customField3: urlParams.get('c3') || '',
      customField4: urlParams.get('c4') || '',
      customField5: urlParams.get('c5') || ''
    };

    // Add location data if available
    if (capturedLocation) {
      trackingInfo.city = capturedLocation.city;
      trackingInfo.region = capturedLocation.region;
      trackingInfo.country = capturedLocation.country;
      trackingInfo.isp = capturedLocation.isp;
      trackingInfo.connectionType = capturedLocation.connection;
    }

    console.log('Generated enhanced tracking info:', trackingInfo);
    return trackingInfo;
  }

  /**
   * Detect traffic channel based on referrer
   */
  private detectChannel(): string {
    const referrer = document.referrer.toLowerCase();
    
    if (!referrer) return 'direct';
    if (referrer.includes('google.')) return 'google';
    if (referrer.includes('facebook.') || referrer.includes('fb.')) return 'facebook';
    if (referrer.includes('twitter.') || referrer.includes('t.co')) return 'twitter';
    if (referrer.includes('linkedin.')) return 'linkedin';
    if (referrer.includes('instagram.')) return 'instagram';
    if (referrer.includes('youtube.')) return 'youtube';
    
    return 'referral';
  }

  /**
   * Start batch processing timer
   */
  private startBatchTimer(): void {
    this.batchTimer = setInterval(() => {
      this.sendBatch();
    }, BATCH_INTERVAL);
  }

  /**
   * Send current batch to API endpoint with enhanced data
   */
  public async sendBatch(): Promise<void> {
    const batch = this.getBatch();
    
    if (batch.visits.length === 0) return;

    // Add geolocation data if available
    if (capturedGeolocation) {
      batch.geolocation = capturedGeolocation;
    }

    try {
      console.log('Sending enhanced tracking batch:', batch);
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch)
      });

      if (response.ok) {
        console.log('Batch sent successfully');
        // Clear the batch
        localStorage.removeItem(BATCH_STORAGE_KEY);
      } else {
        console.error('Failed to send batch:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to send tracking batch:', error);
    }
  }

  /**
   * Legacy page tracking for backward compatibility
   */
  private trackPageVisitLegacy(url: string): void {
    let visitorData = this.getVisitorData();
    
    if (!visitorData) {
      visitorData = {
        sessionId: this.sessionId,
        visits: [],
        lastBatchSent: Date.now(),
        totalVisits: 0,
        pagesVisited: [],
        pageCount: 0
      };
    }
    
    // Ensure pagesVisited is always an array
    if (!Array.isArray(visitorData.pagesVisited)) {
      visitorData.pagesVisited = [];
    }
    
    // Clean URL (remove query params and hash for better tracking)
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // Only add if not already visited in this session
    if (!visitorData.pagesVisited.includes(cleanUrl)) {
      visitorData.pagesVisited.push(cleanUrl);
      visitorData.pageCount = visitorData.pagesVisited.length;
      
      // Save updated visitor data
      this.saveVisitorData(visitorData);
      
      console.log(`Page tracked: ${cleanUrl}. Total pages in session: ${visitorData.pageCount}`);
    }
  }

  /**
   * Get visitor data
   */
  private getVisitorData(): VisitorData | null {
    try {
      const data = localStorage.getItem('visitorData');
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error getting visitor data:', error);
    }
    return null;
  }

  /**
   * Save visitor data
   */
  private saveVisitorData(visitorData: VisitorData): void {
    try {
      localStorage.setItem('visitorData', JSON.stringify(visitorData));
    } catch (error) {
      console.error('Error saving visitor data:', error);
    }
  }

  /**
   * Clean up tracker and send final batch
   */
  public destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    this.sendBatch();
  }

  // Public getters for debugging and external access
  public getVisitorUUID(): string {
    return this.visitorUUID;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getCurrentBatch(): BatchPayload {
    return this.getBatch();
  }

  public getCapturedData() {
    return {
      ip: capturedIP,
      location: capturedLocation,
      geolocation: capturedGeolocation
    };
  }
}

// ============================================================================
// LEGACY COMPATIBILITY FUNCTIONS
// ============================================================================

// Global tracker instance for legacy support
let globalTracker: VisitorTracker | null = null;

/**
 * Legacy storage functions for backward compatibility
 */
export const getVisitorData = (): VisitorData | null => {
  try {
    const data = localStorage.getItem('visitorData');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error getting visitor data:', error);
  }
  return null;
};

export const saveVisitorData = (visitorData: VisitorData): void => {
  try {
    localStorage.setItem('visitorData', JSON.stringify(visitorData));
  } catch (error) {
    console.error('Error saving visitor data:', error);
  }
};

/**
 * Get current tracking data with fresh affiliate code from cookie and enhanced data
 */
export const getUserTrackingData = (): UserTrackingData | null => {
  try {
    const data = localStorage.getItem('userTrackingData');
    if (data) {
      const parsed = JSON.parse(data) as UserTrackingData;
      
      // Always get fresh affiliate code from cookie
      const affiliateCode = getCookie('affiliateRefCode');
      if (affiliateCode) {
        parsed.affiliateRefCode = affiliateCode;
      }

      // Add captured data if available
      if (capturedIP) {
        parsed.clientIp = capturedIP;
      }
      if (capturedLocation) {
        parsed.locationData = capturedLocation;
      }
      if (capturedGeolocation) {
        parsed.geolocation = capturedGeolocation;
      }

      return parsed;
    }
  } catch (error) {
    console.error('Error getting tracking data:', error);
  }
  return null;
};

/**
 * Get browser information for legacy compatibility
 */
export const getBrowserInfo = (): Pick<UserTrackingData, 'userAgent' | 'platform' | 'screenResolution' | 'language' | 'timezone' | 'timestamp'> => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: Date.now()
  };
};

/**
 * Legacy functions for backward compatibility
 */
export const trackPageVisit = (url: string): void => {
  if (globalTracker) {
    globalTracker.trackPageView();
  }
};

export const getPagesVisited = (): string[] => {
  const visitorData = getVisitorData();
  return Array.isArray(visitorData?.pagesVisited) ? visitorData.pagesVisited : [];
};

export const getPageCount = (): number => {
  const visitorData = getVisitorData();
  return visitorData?.pageCount || 0;
};

/**
 * Set global tracker reference for legacy functions
 */
export const setGlobalTracker = (tracker: VisitorTracker): void => {
  globalTracker = tracker;
};

// ============================================================================
// DEBUG UTILITIES
// ============================================================================

/**
 * Debug class for console debugging and troubleshooting
 */
export class TrackingDebugger {
  static checkSetup() {
    console.log('=== Enhanced CRM Tracking Debug ===');
    
    // Check cookies
    const visitorId = document.cookie.match(/trk_visitor_uuid=([^;]+)/)?.[1];
    const sessionId = document.cookie.match(/trk_session_id=([^;]+)/?.[1];
    
    console.log('Visitor UUID:', visitorId || 'NOT FOUND');
    console.log('Session ID:', sessionId || 'NOT FOUND');
    
    // Check localStorage
    const batch = localStorage.getItem('trk_tracking_batch');
    console.log('Batch data:', batch ? 'FOUND' : 'NOT FOUND');
    
    if (batch) {
      const data = JSON.parse(batch);
      console.log('Visits in batch:', data.visits.length);
      console.log('Site ID:', data.siteId);
      console.log('Current tracking info:', data.trackingInfo);
      console.log('Current UTM parameters:', data.utmParameter);
    }

    // Check captured data
    console.log('Captured IP:', capturedIP || 'NOT CAPTURED');
    console.log('Captured Location:', capturedLocation || 'NOT CAPTURED');
    console.log('Captured Geolocation:', capturedGeolocation || 'NOT CAPTURED');
    
    // Check for tracking script
    const hasTracker = typeof (window as any).crmTracker !== 'undefined';
    console.log('Tracker initialized:', hasTracker ? 'YES' : 'NO');
    
    console.log('=== End Enhanced Debug ===');
  }
  
  static forceSendBatch() {
    const tracker = (window as any).crmTracker;
    if (tracker) {
      tracker.sendBatch();
      console.log('Batch send triggered');
    } else {
      console.error('No tracker instance found');
    }
  }
  
  static clearData() {
    localStorage.removeItem('trk_tracking_batch');
    localStorage.removeItem('visitorData');
    localStorage.removeItem('userTrackingData');
    localStorage.removeItem(ENTRY_URL_KEY);
    localStorage.removeItem(REFERRER_KEY);
    localStorage.removeItem(REFERRER_DOMAIN_KEY);
    localStorage.removeItem(FIRST_VISIT_KEY);
    localStorage.removeItem('affiliateRefCode');
    document.cookie = 'trk_visitor_uuid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'trk_session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'affiliateRefCode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Reset captured data
    capturedIP = '';
    capturedLocation = null;
    capturedGeolocation = null;
    
    console.log('All tracking data cleared');
  }

  static getCapturedData() {
    return {
      ip: capturedIP,
      location: capturedLocation,
      geolocation: capturedGeolocation
    };
  }
}

// ============================================================================
// MAIN INITIALIZATION FUNCTION
// ============================================================================

/**
 * Initialize tracking system with site ID and API endpoint, including IP and geolocation capture
 */
export function initializeTracking(siteId: string, apiEndpoint: string): VisitorTracker {
  if (globalTracker) {
    globalTracker.destroy();
  }
  
  globalTracker = new VisitorTracker(siteId, apiEndpoint);
  
  // Set global tracker for legacy functions
  setGlobalTracker(globalTracker);
  
  // Make available globally for debugging
  if (typeof window !== 'undefined') {
    (window as any).crmTracker = globalTracker;
    (window as any).TrackingDebugger = TrackingDebugger;
  }
  
  return globalTracker;
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export everything for external usage
export default {
  initializeTracking,
  VisitorTracker,
  TrackingDebugger,
  parseUserAgent,
  parseAffiliateCode,
  getBrowserGeolocation,
  fetchLocationData,
  fetchUserIP,
  fetchLocationFromIP,
  setCookie,
  getCookie,
  getUserTrackingData,
  getBrowserInfo,
  trackPageVisit,
  getPagesVisited,
  getPageCount
};