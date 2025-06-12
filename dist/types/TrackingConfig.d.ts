export type AffiliateAttributionMode = 'first-visit' | 'most-recent';
export interface TrackingConfig {
    affiliateAttributionMode?: AffiliateAttributionMode;
    cookieExpireDays?: number;
    sessionTimeout?: number;
    batchSendInterval?: number;
    enableGeolocation?: boolean;
}
