import { v4 } from 'uuid';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

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
// ============================================================================
// CONSTANTS
// ============================================================================
var VISITOR_COOKIE = 'trk_visitor_uuid';
var SESSION_COOKIE = 'trk_session_id';
var AFFILIATE_COOKIE = 'affiliateRefCode';
var BATCH_STORAGE_KEY = 'trk_tracking_batch';
var ENTRY_URL_KEY = 'trk_entry_url';
var REFERRER_KEY = 'trk_original_referrer';
var REFERRER_DOMAIN_KEY = 'trk_original_referrer_domain';
var FIRST_VISIT_KEY = 'trk_first_visit';
var BATCH_INTERVAL = 60000; // 1 minute
var SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
// Global variables for captured data
var capturedIP = '';
var capturedLocation = null;
var capturedGeolocation = null;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Fetch user's real IP address
 */
var fetchUserIP = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch('https://api.ipify.org?format=json')];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                capturedIP = data.ip;
                console.log('User IP captured:', capturedIP);
                return [2 /*return*/, capturedIP];
            case 3:
                error_1 = _a.sent();
                console.error('Failed to fetch user IP:', error_1);
                capturedIP = 'Unknown';
                return [2 /*return*/, capturedIP];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Fetch location data from IP address
 */
var fetchLocationFromIP = function (ip) { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ip || ip === 'Unknown')
                    return [2 /*return*/, null];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch("https://ipapi.co/".concat(ip, "/json/"))];
            case 2:
                response = _a.sent();
                if (!response.ok)
                    throw new Error('Failed to fetch location data');
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                capturedLocation = {
                    city: data.city || '',
                    region: data.region || '',
                    country: data.country_name || '',
                    isp: data.org || '',
                    connection: data.connection_type || 'Unknown'
                };
                console.log('Location data captured:', capturedLocation);
                return [2 /*return*/, capturedLocation];
            case 4:
                error_2 = _a.sent();
                console.error('Error fetching location data:', error_2);
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); };
/**
 * Get browser geolocation with reverse geocoding
 */
var getBrowserGeolocation = function () {
    return new Promise(function (resolve) {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by this browser');
            resolve(null);
            return;
        }
        navigator.geolocation.getCurrentPosition(function (position) { return __awaiter(void 0, void 0, void 0, function () {
            var geolocationData, reverseGeocodingData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        geolocationData = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: Date.now()
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, reverseGeocode(geolocationData.latitude, geolocationData.longitude)];
                    case 2:
                        reverseGeocodingData = _a.sent();
                        if (reverseGeocodingData) {
                            geolocationData.city = reverseGeocodingData.city;
                            geolocationData.region = reverseGeocodingData.region;
                            geolocationData.country = reverseGeocodingData.country;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error with reverse geocoding:', error_3);
                        return [3 /*break*/, 4];
                    case 4:
                        capturedGeolocation = geolocationData;
                        console.log('Browser geolocation obtained:', geolocationData);
                        resolve(geolocationData);
                        return [2 /*return*/];
                }
            });
        }); }, function (error) {
            console.log('Geolocation permission denied or error:', error.message);
            resolve(null);
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // Cache for 5 minutes
        });
    });
};
/**
 * Cookie utility functions for managing tracking cookies
 */
var setCookie = function (name, value, days) {
    if (days === void 0) { days = 30; }
    var expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = "".concat(name, "=").concat(value, ";expires=").concat(expires.toUTCString(), ";path=/");
};
var getCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return '';
};
var getCookieInternal = function (name) {
    var _a;
    var value = "; ".concat(document.cookie);
    var parts = value.split("; ".concat(name, "="));
    if (parts.length === 2) {
        return ((_a = parts.pop()) === null || _a === void 0 ? void 0 : _a.split(';').shift()) || '';
    }
    return '';
};
var setCookieInternal = function (name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=".concat(date.toUTCString());
    }
    document.cookie = "".concat(name, "=").concat(value).concat(expires, "; path=/; SameSite=Lax");
};
/**
 * Parse user agent string to extract browser, device, and OS information
 */
var parseUserAgent = function (userAgent) {
    // Browser detection
    var browser = 'Unknown';
    var browserVersion = '';
    if (userAgent.includes('Chrome')) {
        browser = 'Chrome';
        var match = userAgent.match(/Chrome\/([0-9.]+)/);
        browserVersion = match ? match[1] : '';
    }
    else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
        var match = userAgent.match(/Firefox\/([0-9.]+)/);
        browserVersion = match ? match[1] : '';
    }
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browser = 'Safari';
        var match = userAgent.match(/Version\/([0-9.]+)/);
        browserVersion = match ? match[1] : '';
    }
    else if (userAgent.includes('Edge')) {
        browser = 'Edge';
        var match = userAgent.match(/Edge\/([0-9.]+)/);
        browserVersion = match ? match[1] : '';
    }
    // Device detection
    var device = 'Desktop';
    if (/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent)) {
        device = 'Mobile';
    }
    else if (/iPad|Tablet/i.test(userAgent)) {
        device = 'Tablet';
    }
    // OS detection
    var os = 'Unknown';
    if (userAgent.includes('Windows')) {
        os = 'Windows';
    }
    else if (userAgent.includes('Mac OS')) {
        os = 'macOS';
    }
    else if (userAgent.includes('Linux')) {
        os = 'Linux';
    }
    else if (userAgent.includes('Android')) {
        os = 'Android';
    }
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        os = 'iOS';
    }
    return {
        browser: browser,
        browserVersion: browserVersion,
        device: device,
        os: os
    };
};
/**
 * Parse affiliate code from URL using various parameter formats
 */
var parseAffiliateCode = function (url) {
    try {
        var urlObj = new URL(url);
        var params = urlObj.searchParams;
        // Check query parameters - expanded list
        var affiliateParams = ['ref', 'a', 'aff', 'affiliate', 'via', 'partner'];
        for (var _i = 0, affiliateParams_1 = affiliateParams; _i < affiliateParams_1.length; _i++) {
            var param = affiliateParams_1[_i];
            var value = params.get(param);
            if (value)
                return value;
        }
        // Check path segments
        var pathname = urlObj.pathname;
        var pathMatches = [
            /\/ref\/([^\/]+)/,
            /\/a\/([^\/]+)/,
            /\/aff\/([^\/]+)/,
            /\/via\/([^\/]+)/,
            /\/affiliate\/([^\/]+)/
        ];
        for (var _a = 0, pathMatches_1 = pathMatches; _a < pathMatches_1.length; _a++) {
            var regex = pathMatches_1[_a];
            var match = pathname.match(regex);
            if (match && match[1])
                return match[1];
        }
        return null;
    }
    catch (error) {
        console.error('Error parsing affiliate code:', error);
        return null;
    }
};
/**
 * Reverse geocode coordinates to city/region
 */
var reverseGeocode = function (latitude, longitude) { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=".concat(latitude, "&longitude=").concat(longitude, "&localityLanguage=en"))];
            case 1:
                response = _a.sent();
                if (!response.ok)
                    throw new Error('Failed to reverse geocoding');
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, {
                        city: data.city || data.locality,
                        region: data.principalSubdivision,
                        country: data.countryName
                    }];
            case 3:
                error_4 = _a.sent();
                console.error('Error with reverse geocoding:', error_4);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Fetch location data from IP address
 */
var fetchLocationData = function (ip) { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("https://ipapi.co/".concat(ip, "/json/"))];
            case 1:
                response = _a.sent();
                if (!response.ok)
                    throw new Error('Failed to fetch location data');
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, {
                        city: data.city,
                        region: data.region,
                        country: data.country_name,
                        isp: data.org,
                        connection: data.connection_type || 'Unknown'
                    }];
            case 3:
                error_5 = _a.sent();
                console.error('Error fetching location data:', error_5);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
// ============================================================================
// ENHANCED REFERRER AND UTM DETECTION
// ============================================================================
/**
 * Enhanced referrer detection with multiple fallback methods
 */
var detectReferrerData = function () {
    console.log('=== Enhanced Referrer Detection ===');
    console.log('document.referrer:', document.referrer);
    console.log('window.location.href:', window.location.href);
    // Check if this is the very first visit
    var isFirstVisit = !localStorage.getItem(FIRST_VISIT_KEY);
    console.log('Is first visit:', isFirstVisit);
    var referrerUrl = '';
    var referrerDomain = '';
    if (isFirstVisit) {
        // On first visit, capture the referrer from document.referrer
        var docReferrer = document.referrer || '';
        console.log('First visit - document.referrer:', docReferrer);
        if (docReferrer && docReferrer.trim() !== '') {
            referrerUrl = docReferrer;
            referrerDomain = extractDomainFromUrl(docReferrer);
            // Store for future visits
            try {
                localStorage.setItem(REFERRER_KEY, referrerUrl);
                localStorage.setItem(REFERRER_DOMAIN_KEY, referrerDomain);
                localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
                console.log('Stored referrer data:', { referrerUrl: referrerUrl, referrerDomain: referrerDomain });
            }
            catch (e) {
                console.warn('Could not store referrer data in localStorage');
            }
        }
        else {
            // Try alternative detection methods for first visit
            referrerUrl = detectReferrerFromBrowser() || 'Direct';
            referrerDomain = referrerUrl === 'Direct' ? 'Direct' : extractDomainFromUrl(referrerUrl);
            try {
                localStorage.setItem(REFERRER_KEY, referrerUrl);
                localStorage.setItem(REFERRER_DOMAIN_KEY, referrerDomain);
                localStorage.setItem(FIRST_VISIT_KEY, Date.now().toString());
            }
            catch (e) {
                console.warn('Could not store referrer data in localStorage');
            }
        }
    }
    else {
        // For subsequent visits, use stored data
        try {
            referrerUrl = localStorage.getItem(REFERRER_KEY) || 'Direct';
            referrerDomain = localStorage.getItem(REFERRER_DOMAIN_KEY) || 'Direct';
            console.log('Retrieved stored referrer data:', { referrerUrl: referrerUrl, referrerDomain: referrerDomain });
        }
        catch (e) {
            console.warn('Could not retrieve referrer data from localStorage');
            referrerUrl = 'Direct';
            referrerDomain = 'Direct';
        }
    }
    console.log('Final referrer data:', { referrerUrl: referrerUrl, referrerDomain: referrerDomain });
    console.log('=== End Enhanced Referrer Detection ===');
    return {
        url: referrerUrl,
        domain: referrerDomain
    };
};
/**
 * Alternative referrer detection methods
 */
var detectReferrerFromBrowser = function () {
    // Method 1: Check for search engine parameters that might indicate source
    var urlParams = new URLSearchParams(window.location.search);
    var searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo'];
    for (var _i = 0, searchEngines_1 = searchEngines; _i < searchEngines_1.length; _i++) {
        var engine = searchEngines_1[_i];
        if (urlParams.get('utm_source') === engine || urlParams.get('source') === engine) {
            return 'https://www.' + engine + '.com';
        }
    }
    // Method 2: Check if there are UTM parameters indicating external source
    var utmSource = urlParams.get('utm_source') || urlParams.get('utm-source');
    if (utmSource && utmSource !== 'direct') {
        return 'https://' + utmSource + '.com';
    }
    // Method 3: Check for affiliate parameters
    var affiliateParams = ['ref', 'a', 'aff', 'affiliate', 'via', 'partner'];
    for (var _a = 0, affiliateParams_2 = affiliateParams; _a < affiliateParams_2.length; _a++) {
        var param = affiliateParams_2[_a];
        var value = urlParams.get(param);
        if (value) {
            return 'Affiliate: ' + value;
        }
    }
    return null;
};
/**
 * Extract domain from URL with improved error handling
 */
var extractDomainFromUrl = function (url) {
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
        var urlObj = new URL(url);
        var domain = urlObj.hostname;
        // Remove www. prefix if present
        if (domain.startsWith('www.')) {
            domain = domain.substring(4);
        }
        return domain;
    }
    catch (error) {
        console.error('Error extracting domain from URL:', url, error);
        return 'Unknown';
    }
};
/**
 * Parse UTM parameters from current URL
 */
var parseUTMFromCurrentUrl = function () {
    var urlParams = new URLSearchParams(window.location.search);
    // Helper function to get parameter value or "Not set"
    var getParamValue = function () {
        var paramNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paramNames[_i] = arguments[_i];
        }
        for (var _a = 0, paramNames_1 = paramNames; _a < paramNames_1.length; _a++) {
            var paramName = paramNames_1[_a];
            var value = urlParams.get(paramName);
            if (value && value.trim() !== '') {
                return value.trim();
            }
        }
        return 'Not set';
    };
    // Handle both hyphenated and underscored UTM parameters
    var utmParams = {
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
var parseAffiliateFromCurrentUrl = function () {
    var urlParams = new URLSearchParams(window.location.search);
    var affiliateParams = ['ref', 'a', 'aff', 'affiliate', 'via', 'partner'];
    for (var _i = 0, affiliateParams_3 = affiliateParams; _i < affiliateParams_3.length; _i++) {
        var param = affiliateParams_3[_i];
        var value = urlParams.get(param);
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
var VisitorTracker = /** @class */ (function () {
    function VisitorTracker(siteId, apiEndpoint) {
        this.batchTimer = null;
        this.dataReady = false;
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
    VisitorTracker.prototype.initializeDataCapture = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, ipResult, geolocationResult, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        console.log('Starting data capture initialization...');
                        return [4 /*yield*/, Promise.allSettled([
                                fetchUserIP(),
                                getBrowserGeolocation()
                            ])];
                    case 1:
                        results = _a.sent();
                        ipResult = results[0];
                        geolocationResult = results[1];
                        console.log('IP fetch result:', ipResult);
                        console.log('Geolocation result:', geolocationResult);
                        if (!(ipResult.status === 'fulfilled' && ipResult.value && ipResult.value !== 'Unknown')) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetchLocationFromIP(ipResult.value)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.dataReady = true;
                        console.log('All tracking data captured successfully');
                        console.log('Captured data:', { ip: capturedIP, location: capturedLocation, geolocation: capturedGeolocation });
                        // Store enhanced tracking data
                        this.storeEnhancedTrackingData();
                        // Initialize tracking now that data is ready
                        this.initialize();
                        return [3 /*break*/, 5];
                    case 4:
                        error_6 = _a.sent();
                        console.error('Error capturing tracking data:', error_6);
                        this.dataReady = true; // Continue even if some data capture fails
                        this.initialize();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Store enhanced tracking data with IP and geolocation
     */
    VisitorTracker.prototype.storeEnhancedTrackingData = function () {
        var trackingData = __assign(__assign({}, this.getBrowserInfo()), { entryUrl: this.getTrueEntryUrl(), referrer: document.referrer || 'Direct', affiliateRefCode: getCookieInternal(AFFILIATE_COOKIE) || undefined, clientIp: capturedIP, locationData: capturedLocation || undefined, geolocation: capturedGeolocation || undefined, parsedUserAgent: parseUserAgent(navigator.userAgent) });
        try {
            localStorage.setItem('userTrackingData', JSON.stringify(trackingData));
            console.log('Enhanced tracking data stored:', trackingData);
        }
        catch (error) {
            console.error('Error storing enhanced tracking data:', error);
        }
    };
    /**
     * Store the initial entry URL on first visit to handle browser referrer inconsistencies
     */
    VisitorTracker.prototype.storeInitialEntryUrl = function () {
        var storedEntryUrl = localStorage.getItem(ENTRY_URL_KEY);
        if (!storedEntryUrl) {
            var currentUrl = window.location.href;
            localStorage.setItem(ENTRY_URL_KEY, currentUrl);
            console.log('Initial entry URL stored:', currentUrl);
            return currentUrl;
        }
        return storedEntryUrl;
    };
    /**
     * Get the true entry URL (handles browser referrer suppression)
     */
    VisitorTracker.prototype.getTrueEntryUrl = function () {
        return localStorage.getItem(ENTRY_URL_KEY) || window.location.href;
    };
    /**
     * Get browser information
     */
    VisitorTracker.prototype.getBrowserInfo = function () {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenResolution: "".concat(screen.width, "x").concat(screen.height),
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: Date.now()
        };
    };
    /**
     * Initialize tracking system
     */
    VisitorTracker.prototype.initialize = function () {
        var _this = this;
        // Track page view on initialization
        this.trackPageView();
        // Set up batch processing
        this.startBatchTimer();
        // Send any pending data on page unload
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', function () {
                _this.sendBatch();
            });
        }
    };
    /**
     * Get or create visitor UUID with persistent cookie storage
     */
    VisitorTracker.prototype.getOrCreateVisitorUUID = function () {
        var visitorUUID = getCookieInternal(VISITOR_COOKIE);
        if (!visitorUUID) {
            visitorUUID = v4();
            setCookieInternal(VISITOR_COOKIE, visitorUUID, 365); // 1 year
        }
        return visitorUUID;
    };
    /**
     * Get or create session ID with expiration handling
     */
    VisitorTracker.prototype.getOrCreateSessionId = function () {
        var sessionId = getCookieInternal(SESSION_COOKIE);
        var now = Date.now();
        if (!sessionId || this.isSessionExpired()) {
            sessionId = "".concat(this.visitorUUID, "_").concat(now);
            setCookieInternal(SESSION_COOKIE, sessionId, 0); // Session cookie
            setCookieInternal('trk_session_timestamp', now.toString(), 0);
        }
        return sessionId;
    };
    /**
     * Check if current session has expired
     */
    VisitorTracker.prototype.isSessionExpired = function () {
        var timestamp = getCookieInternal('trk_session_timestamp');
        if (!timestamp)
            return true;
        return Date.now() - parseInt(timestamp) > SESSION_TIMEOUT;
    };
    /**
     * Track a page view and add to batch
     */
    VisitorTracker.prototype.trackPageView = function () {
        var visit = {
            pageUrl: window.location.href,
            timestamp: Date.now(),
            screenSize: "".concat(window.screen.width, "x").concat(window.screen.height),
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        this.addToBatch(visit);
        // Also maintain legacy page tracking for backward compatibility
        this.trackPageVisitLegacy(window.location.pathname);
    };
    /**
     * Add visit data to current batch
     */
    VisitorTracker.prototype.addToBatch = function (visit) {
        var batch = this.getBatch();
        batch.visits.push(visit);
        this.saveBatch(batch);
    };
    /**
     * Get current batch or create new one with updated tracking info
     */
    VisitorTracker.prototype.getBatch = function () {
        var stored = localStorage.getItem(BATCH_STORAGE_KEY);
        if (stored) {
            var batch = JSON.parse(stored);
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
    };
    /**
     * Save batch to localStorage
     */
    VisitorTracker.prototype.saveBatch = function (batch) {
        localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(batch));
    };
    /**
     * Generate comprehensive tracking information with IP and location data
     */
    VisitorTracker.prototype.getTrackingInfo = function () {
        // Get referrer data using enhanced detection
        var referrerData = detectReferrerData();
        // Get affiliate code from current URL or cookie
        var affiliateCode = parseAffiliateFromCurrentUrl();
        // Parse UTM parameters from current URL
        var urlParams = new URLSearchParams(window.location.search);
        // Helper function to get UTM parameters with both formats
        var getUtmParam = function (hyphenated, underscored) {
            return urlParams.get(hyphenated) || urlParams.get(underscored) || '';
        };
        // Get true entry URL (handles browser referrer suppression)
        var trueEntryUrl = this.getTrueEntryUrl();
        var trackingInfo = {
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
    };
    /**
     * Detect traffic channel based on referrer
     */
    VisitorTracker.prototype.detectChannel = function () {
        var referrer = document.referrer.toLowerCase();
        if (!referrer)
            return 'direct';
        if (referrer.includes('google.'))
            return 'google';
        if (referrer.includes('facebook.') || referrer.includes('fb.'))
            return 'facebook';
        if (referrer.includes('twitter.') || referrer.includes('t.co'))
            return 'twitter';
        if (referrer.includes('linkedin.'))
            return 'linkedin';
        if (referrer.includes('instagram.'))
            return 'instagram';
        if (referrer.includes('youtube.'))
            return 'youtube';
        return 'referral';
    };
    /**
     * Start batch processing timer
     */
    VisitorTracker.prototype.startBatchTimer = function () {
        var _this = this;
        this.batchTimer = setInterval(function () {
            _this.sendBatch();
        }, BATCH_INTERVAL);
    };
    /**
     * Send current batch to API endpoint with enhanced data
     */
    VisitorTracker.prototype.sendBatch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var batch, response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        batch = this.getBatch();
                        if (batch.visits.length === 0)
                            return [2 /*return*/];
                        // Add geolocation data if available
                        if (capturedGeolocation) {
                            batch.geolocation = capturedGeolocation;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('Sending enhanced tracking batch:', batch);
                        return [4 /*yield*/, fetch(this.apiEndpoint, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(batch)
                            })];
                    case 2:
                        response = _a.sent();
                        if (response.ok) {
                            console.log('Batch sent successfully');
                            // Clear the batch
                            localStorage.removeItem(BATCH_STORAGE_KEY);
                        }
                        else {
                            console.error('Failed to send batch:', response.status, response.statusText);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        console.error('Failed to send tracking batch:', error_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Legacy page tracking for backward compatibility
     */
    VisitorTracker.prototype.trackPageVisitLegacy = function (url) {
        var visitorData = this.getVisitorData();
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
        var cleanUrl = url.split('?')[0].split('#')[0];
        // Only add if not already visited in this session
        if (!visitorData.pagesVisited.includes(cleanUrl)) {
            visitorData.pagesVisited.push(cleanUrl);
            visitorData.pageCount = visitorData.pagesVisited.length;
            // Save updated visitor data
            this.saveVisitorData(visitorData);
            console.log("Page tracked: ".concat(cleanUrl, ". Total pages in session: ").concat(visitorData.pageCount));
        }
    };
    /**
     * Get visitor data
     */
    VisitorTracker.prototype.getVisitorData = function () {
        try {
            var data = localStorage.getItem('visitorData');
            if (data) {
                return JSON.parse(data);
            }
        }
        catch (error) {
            console.error('Error getting visitor data:', error);
        }
        return null;
    };
    /**
     * Save visitor data
     */
    VisitorTracker.prototype.saveVisitorData = function (visitorData) {
        try {
            localStorage.setItem('visitorData', JSON.stringify(visitorData));
        }
        catch (error) {
            console.error('Error saving visitor data:', error);
        }
    };
    /**
     * Clean up tracker and send final batch
     */
    VisitorTracker.prototype.destroy = function () {
        if (this.batchTimer) {
            clearInterval(this.batchTimer);
        }
        this.sendBatch();
    };
    // Public getters for debugging and external access
    VisitorTracker.prototype.getVisitorUUID = function () {
        return this.visitorUUID;
    };
    VisitorTracker.prototype.getSessionId = function () {
        return this.sessionId;
    };
    VisitorTracker.prototype.getCurrentBatch = function () {
        return this.getBatch();
    };
    VisitorTracker.prototype.getCapturedData = function () {
        return {
            ip: capturedIP,
            location: capturedLocation,
            geolocation: capturedGeolocation
        };
    };
    return VisitorTracker;
}());
// ============================================================================
// LEGACY COMPATIBILITY FUNCTIONS
// ============================================================================
// Global tracker instance for legacy support
var globalTracker = null;
/**
 * Legacy storage functions for backward compatibility
 */
var getVisitorData = function () {
    try {
        var data = localStorage.getItem('visitorData');
        if (data) {
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('Error getting visitor data:', error);
    }
    return null;
};
var saveVisitorData = function (visitorData) {
    try {
        localStorage.setItem('visitorData', JSON.stringify(visitorData));
    }
    catch (error) {
        console.error('Error saving visitor data:', error);
    }
};
/**
 * Get current tracking data with fresh affiliate code from cookie and enhanced data
 */
var getUserTrackingData = function () {
    try {
        var data = localStorage.getItem('userTrackingData');
        if (data) {
            var parsed = JSON.parse(data);
            // Always get fresh affiliate code from cookie
            var affiliateCode = getCookie('affiliateRefCode');
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
    }
    catch (error) {
        console.error('Error getting tracking data:', error);
    }
    return null;
};
/**
 * Get browser information for legacy compatibility
 */
var getBrowserInfo = function () {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenResolution: "".concat(screen.width, "x").concat(screen.height),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: Date.now()
    };
};
/**
 * Legacy functions for backward compatibility
 */
var trackPageVisit = function (url) {
    if (globalTracker) {
        globalTracker.trackPageView();
    }
};
var getPagesVisited = function () {
    var visitorData = getVisitorData();
    return Array.isArray(visitorData === null || visitorData === void 0 ? void 0 : visitorData.pagesVisited) ? visitorData.pagesVisited : [];
};
var getPageCount = function () {
    var visitorData = getVisitorData();
    return (visitorData === null || visitorData === void 0 ? void 0 : visitorData.pageCount) || 0;
};
/**
 * Set global tracker reference for legacy functions
 */
var setGlobalTracker = function (tracker) {
    globalTracker = tracker;
};
// ============================================================================
// DEBUG UTILITIES
// ============================================================================
/**
 * Debug class for console debugging and troubleshooting
 */
var TrackingDebugger = /** @class */ (function () {
    function TrackingDebugger() {
    }
    TrackingDebugger.checkSetup = function () {
        var _a, _b;
        console.log('=== Enhanced CRM Tracking Debug ===');
        // Check cookies
        var visitorId = (_a = document.cookie.match(/trk_visitor_uuid=([^;]+)/)) === null || _a === void 0 ? void 0 : _a[1];
        var sessionId = document.cookie.match((_b = /trk_session_id=([^;]+)/) === null || _b === void 0 ? void 0 : _b[1]);
        console.log('Visitor UUID:', visitorId || 'NOT FOUND');
        console.log('Session ID:', sessionId || 'NOT FOUND');
        // Check localStorage
        var batch = localStorage.getItem('trk_tracking_batch');
        console.log('Batch data:', batch ? 'FOUND' : 'NOT FOUND');
        if (batch) {
            var data = JSON.parse(batch);
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
        var hasTracker = typeof window.crmTracker !== 'undefined';
        console.log('Tracker initialized:', hasTracker ? 'YES' : 'NO');
        console.log('=== End Enhanced Debug ===');
    };
    TrackingDebugger.forceSendBatch = function () {
        var tracker = window.crmTracker;
        if (tracker) {
            tracker.sendBatch();
            console.log('Batch send triggered');
        }
        else {
            console.error('No tracker instance found');
        }
    };
    TrackingDebugger.clearData = function () {
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
    };
    TrackingDebugger.getCapturedData = function () {
        return {
            ip: capturedIP,
            location: capturedLocation,
            geolocation: capturedGeolocation
        };
    };
    return TrackingDebugger;
}());
// ============================================================================
// MAIN INITIALIZATION FUNCTION
// ============================================================================
/**
 * Initialize tracking system with site ID and API endpoint, including IP and geolocation capture
 */
function initializeTracking(siteId, apiEndpoint) {
    if (globalTracker) {
        globalTracker.destroy();
    }
    globalTracker = new VisitorTracker(siteId, apiEndpoint);
    // Set global tracker for legacy functions
    setGlobalTracker(globalTracker);
    // Make available globally for debugging
    if (typeof window !== 'undefined') {
        window.crmTracker = globalTracker;
        window.TrackingDebugger = TrackingDebugger;
    }
    return globalTracker;
}
// ============================================================================
// EXPORTS
// ============================================================================
// Export everything for external usage
var index = {
    initializeTracking: initializeTracking,
    VisitorTracker: VisitorTracker,
    TrackingDebugger: TrackingDebugger,
    parseUserAgent: parseUserAgent,
    parseAffiliateCode: parseAffiliateCode,
    getBrowserGeolocation: getBrowserGeolocation,
    fetchLocationData: fetchLocationData,
    fetchUserIP: fetchUserIP,
    fetchLocationFromIP: fetchLocationFromIP,
    setCookie: setCookie,
    getCookie: getCookie,
    getUserTrackingData: getUserTrackingData,
    getBrowserInfo: getBrowserInfo,
    trackPageVisit: trackPageVisit,
    getPagesVisited: getPagesVisited,
    getPageCount: getPageCount
};

export { AFFILIATE_COOKIE, BATCH_INTERVAL, BATCH_STORAGE_KEY, ENTRY_URL_KEY, FIRST_VISIT_KEY, REFERRER_DOMAIN_KEY, REFERRER_KEY, SESSION_COOKIE, SESSION_TIMEOUT, TrackingDebugger, VISITOR_COOKIE, VisitorTracker, index as default, fetchLocationData, fetchLocationFromIP, fetchUserIP, getBrowserGeolocation, getBrowserInfo, getCookie, getPageCount, getPagesVisited, getUserTrackingData, getVisitorData, initializeTracking, parseAffiliateCode, parseUserAgent, reverseGeocode, saveVisitorData, setCookie, setGlobalTracker, trackPageVisit };
