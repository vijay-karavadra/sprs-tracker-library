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