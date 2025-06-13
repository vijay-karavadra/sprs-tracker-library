import { TrackingConfig } from './types/TrackingConfig';
export interface LocationData {
    city?: string;
    region?: string;
    country?: string;
    isp?: string;
    connectionType?: string;
    connection?: string;
}
export interface GeolocationData {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
    city?: string;
    region?: string;
    country?: string;
}
export interface ParsedUserAgent {
    browser: string;
    browserVersion: string;
    device: 'Mobile' | 'Desktop' | 'Tablet' | 'Unknown';
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
    affiliateRefCode?: string;
}
export declare const setCookie: (name: string, value: string, days?: number) => void;
export declare const getCookie: (name: string) => string;
export declare const fetchUserIP: () => Promise<string>;
export declare const parseUserAgent: (userAgent: string) => ParsedUserAgent;
export declare class VisitorTracker {
    private siteId;
    private apiEndpoint;
    private visitorUUID;
    private sessionId;
    private batchTimer;
    private config;
    constructor(siteId: string, apiEndpoint: string, config?: TrackingConfig);
    private initializeTracking;
    trackPageView(): Promise<void>;
    getCurrentBatch(): Promise<BatchPayload>;
    sendBatch(): Promise<void>;
    private startBatchTimer;
    getVisitorUUID(): string;
    getSessionId(): string;
    destroy(): void;
    getConfig(): Required<TrackingConfig>;
    updateConfig(newConfig: Partial<TrackingConfig>): void;
}
export declare const initializeTracking: (siteId: string, apiEndpoint: string, config?: TrackingConfig) => VisitorTracker;
export declare const getUserTrackingData: () => UserTrackingData;
export declare const fetchLocationData: (ip?: string) => Promise<LocationData>;
export declare const getPagesVisited: () => string[];
export declare const getPageCount: () => number;
declare global {
    interface Window {
        VisitorTracker: typeof VisitorTracker;
        initializeTracking: typeof initializeTracking;
        fetchUserIP: typeof fetchUserIP;
        getUserTrackingData: typeof getUserTrackingData;
        fetchLocationData: typeof fetchLocationData;
        getPagesVisited: typeof getPagesVisited;
        getPageCount: typeof getPageCount;
    }
}
export { useTracker } from './hooks/useTracker';
