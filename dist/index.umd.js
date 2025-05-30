(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('uuid')) :
    typeof define === 'function' && define.amd ? define(['exports', 'uuid'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["sperse-tracker"] = {}, global.uuid));
})(this, (function (exports, uuid) { 'use strict';

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

    // Configuration constants with defaults
    var DEFAULT_COOKIE_EXPIRE_DAYS = 30;
    var DEFAULT_SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
    var DEFAULT_BATCH_SEND_INTERVAL = 30 * 1000; // 30 seconds
    var DEFAULT_ATTRIBUTION_MODE = 'first-visit';
    var FIRST_VISIT_KEY = 'trk_first_visit';
    var SESSION_START_KEY = 'trk_session_start';
    // Global variables for tracking data
    var globalClientIp = '';
    var globalGeolocation = null;
    var globalLocationData = null;
    var dataSources = [];
    var currentConfig = {
        affiliateAttributionMode: DEFAULT_ATTRIBUTION_MODE,
        cookieExpireDays: DEFAULT_COOKIE_EXPIRE_DAYS,
        sessionTimeout: DEFAULT_SESSION_TIMEOUT,
        batchSendInterval: DEFAULT_BATCH_SEND_INTERVAL,
        enableGeolocation: true
    };
    // Cookie management functions
    var setCookie = function (name, value, days) {
        var cookieExpireDays = days || currentConfig.cookieExpireDays;
        var expires = new Date();
        expires.setTime(expires.getTime() + (cookieExpireDays * 24 * 60 * 60 * 1000));
        document.cookie = "".concat(name, "=").concat(value, ";expires=").concat(expires.toUTCString(), ";path=/;SameSite=Lax");
    };
    var getCookie = function (name) {
        var _a;
        var value = "; ".concat(document.cookie);
        var parts = value.split("; ".concat(name, "="));
        if (parts.length === 2) {
            return ((_a = parts.pop()) === null || _a === void 0 ? void 0 : _a.split(';').shift()) || '';
        }
        return '';
    };
    // Fetch user IP function
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
                    return [2 /*return*/, data.ip];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to fetch user IP:', error_1);
                    return [2 /*return*/, 'Unknown'];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Enhanced affiliate code extraction from URL parameters and path
    var extractAffiliateCode = function () {
        console.log('=== Enhanced Affiliate Code Extraction ===');
        // Check URL parameters first
        var urlParams = new URLSearchParams(window.location.search);
        var affiliateParams = ['ref', 'a', 'aff', 'affiliate', 'via', 'partner'];
        for (var _i = 0, affiliateParams_1 = affiliateParams; _i < affiliateParams_1.length; _i++) {
            var param = affiliateParams_1[_i];
            var value = urlParams.get(param);
            if (value && value.trim()) {
                console.log("Found affiliate code in URL parameter ".concat(param, ":"), value.trim());
                return value.trim();
            }
        }
        // Check URL path patterns like /a/<value>, /ref/<value>, etc.
        var pathname = window.location.pathname;
        var pathPatterns = [
            /\/a\/([^\/\?#]+)/i, // /a/partner123
            /\/ref\/([^\/\?#]+)/i, // /ref/partner123
            /\/aff\/([^\/\?#]+)/i, // /aff/partner123
            /\/affiliate\/([^\/\?#]+)/i, // /affiliate/partner123
            /\/via\/([^\/\?#]+)/i, // /via/partner123
            /\/partner\/([^\/\?#]+)/i // /partner/partner123
        ];
        for (var _a = 0, pathPatterns_1 = pathPatterns; _a < pathPatterns_1.length; _a++) {
            var pattern = pathPatterns_1[_a];
            var match = pathname.match(pattern);
            if (match && match[1]) {
                console.log("Found affiliate code in URL path with pattern ".concat(pattern.source, ":"), match[1]);
                return match[1];
            }
        }
        console.log('No affiliate code found in URL parameters or path');
        return null;
    };
    // Parse user agent for browser and device information
    var parseUserAgent = function (userAgent) {
        var browsers = [
            { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
            { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
            { name: 'Safari', regex: /Safari\/([0-9.]+)/ },
            { name: 'Edge', regex: /Edge\/([0-9.]+)/ },
            { name: 'Opera', regex: /Opera\/([0-9.]+)/ }
        ];
        var browser = 'Unknown';
        var browserVersion = '';
        for (var _i = 0, browsers_1 = browsers; _i < browsers_1.length; _i++) {
            var b = browsers_1[_i];
            var match = userAgent.match(b.regex);
            if (match) {
                browser = b.name;
                browserVersion = match[1];
                break;
            }
        }
        // Ensure device returns the correct union type
        var device = 'Unknown';
        if (/Mobile|Android|iPhone/.test(userAgent)) {
            device = 'Mobile';
        }
        else if (/iPad|Tablet/.test(userAgent)) {
            device = 'Tablet';
        }
        else if (!/Mobile|Android|iPhone|iPad|Tablet/.test(userAgent)) {
            device = 'Desktop';
        }
        var os = 'Unknown';
        if (/Windows/.test(userAgent))
            os = 'Windows';
        else if (/Mac OS/.test(userAgent))
            os = 'macOS';
        else if (/Linux/.test(userAgent))
            os = 'Linux';
        else if (/Android/.test(userAgent))
            os = 'Android';
        else if (/iOS/.test(userAgent))
            os = 'iOS';
        return { browser: browser, browserVersion: browserVersion, device: device, os: os };
    };
    // Affiliate code management with configurable attribution mode
    var manageAffiliateCode = function (newAffiliateCode) {
        console.log('=== Enhanced Affiliate Code Management ===');
        console.log('Affiliate Mode:', currentConfig.affiliateAttributionMode);
        console.log('New affiliate code from URL:', newAffiliateCode);
        var existingCookieAffiliate = getCookie('affiliateRefCode');
        var existingStorageAffiliate = localStorage.getItem('affiliateRefCode');
        console.log('Existing cookie affiliate:', existingCookieAffiliate);
        console.log('Existing storage affiliate:', existingStorageAffiliate);
        var finalAffiliateCode = '';
        if (currentConfig.affiliateAttributionMode === 'most-recent') {
            // Most recent mode: new affiliate code overwrites existing
            if (newAffiliateCode) {
                finalAffiliateCode = newAffiliateCode;
                setCookie('affiliateRefCode', newAffiliateCode);
                localStorage.setItem('affiliateRefCode', newAffiliateCode);
                console.log('Setting new affiliate code (most-recent mode):', newAffiliateCode);
            }
            else {
                // Use existing if no new one provided
                finalAffiliateCode = existingCookieAffiliate || existingStorageAffiliate || '';
                console.log('Using existing affiliate code (most-recent mode):', finalAffiliateCode);
            }
        }
        else {
            // First visit mode: existing affiliate code is preserved
            if (existingCookieAffiliate || existingStorageAffiliate) {
                finalAffiliateCode = existingCookieAffiliate || existingStorageAffiliate || '';
                console.log('Preserving existing affiliate code (first-visit mode):', finalAffiliateCode);
            }
            else if (newAffiliateCode) {
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
    var captureGeolocation = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!currentConfig.enableGeolocation) {
                console.log('Geolocation capture disabled in configuration');
                return [2 /*return*/, null];
            }
            return [2 /*return*/, new Promise(function (resolve) {
                    if (!navigator.geolocation) {
                        console.log('Geolocation API not supported');
                        resolve(null);
                        return;
                    }
                    console.log('Requesting geolocation permission...');
                    var timeoutId = setTimeout(function () {
                        console.log('Geolocation request timed out');
                        resolve(null);
                    }, 10000);
                    var options = {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000 // 5 minutes
                    };
                    navigator.geolocation.getCurrentPosition(function (position) {
                        clearTimeout(timeoutId);
                        var geolocationData = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: Date.now()
                        };
                        console.log('Geolocation captured successfully:', geolocationData);
                        globalGeolocation = geolocationData;
                        resolve(geolocationData);
                    }, function (error) {
                        clearTimeout(timeoutId);
                        console.log('Geolocation error:', error.code, error.message);
                        resolve(null);
                    }, options);
                })];
        });
    }); };
    // Enhanced tracking info generation
    var generateEnhancedTrackingInfo = function () {
        var referrer = document.referrer || 'Direct';
        var userAgent = navigator.userAgent;
        var parsed = parseUserAgent(userAgent);
        // Extract affiliate code using enhanced extraction
        var affiliateFromUrl = extractAffiliateCode();
        // Manage affiliate code based on attribution mode
        var affiliateCode = manageAffiliateCode(affiliateFromUrl);
        // Determine source and channel
        var sourceCode = 'direct';
        var channelCode = 'direct';
        if (referrer && referrer !== 'Direct') {
            try {
                var refererDomain = new URL(referrer).hostname;
                if (refererDomain !== window.location.hostname) {
                    sourceCode = 'organic';
                    channelCode = 'referral';
                }
            }
            catch (e) {
                console.warn('Error parsing referrer URL:', e);
            }
        }
        var urlParams = new URLSearchParams(window.location.search);
        var trackingInfo = {
            referrerUrl: referrer,
            refererDomain: referrer !== 'Direct' ? new URL(referrer).hostname : '',
            entryUrl: window.location.href,
            siteUrl: window.location.origin,
            userAgent: userAgent,
            browser: parsed.browser,
            browserVersion: parsed.browserVersion,
            deviceType: parsed.device,
            operatingSystem: parsed.os,
            platform: navigator.platform,
            screenSize: "".concat(screen.width, "x").concat(screen.height),
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            sourceCode: sourceCode,
            channelCode: channelCode,
            campaignCode: urlParams.get('utm_campaign') || urlParams.get('utm-campaign') || '',
            affiliateCode: affiliateCode,
            clientIp: globalClientIp,
            city: globalLocationData === null || globalLocationData === void 0 ? void 0 : globalLocationData.city,
            region: globalLocationData === null || globalLocationData === void 0 ? void 0 : globalLocationData.region,
            country: globalLocationData === null || globalLocationData === void 0 ? void 0 : globalLocationData.country,
            isp: globalLocationData === null || globalLocationData === void 0 ? void 0 : globalLocationData.isp,
            connectionType: globalLocationData === null || globalLocationData === void 0 ? void 0 : globalLocationData.connectionType,
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
    var parseUtmParameters = function () {
        var urlParams = new URLSearchParams(window.location.search);
        var utmParams = {
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
    var VisitorTracker = /** @class */ (function () {
        function VisitorTracker(siteId, apiEndpoint, config) {
            this.batchTimer = null;
            this.siteId = siteId;
            this.apiEndpoint = apiEndpoint;
            // Merge provided config with defaults
            this.config = {
                affiliateAttributionMode: (config === null || config === void 0 ? void 0 : config.affiliateAttributionMode) || DEFAULT_ATTRIBUTION_MODE,
                cookieExpireDays: (config === null || config === void 0 ? void 0 : config.cookieExpireDays) || DEFAULT_COOKIE_EXPIRE_DAYS,
                sessionTimeout: (config === null || config === void 0 ? void 0 : config.sessionTimeout) || DEFAULT_SESSION_TIMEOUT,
                batchSendInterval: (config === null || config === void 0 ? void 0 : config.batchSendInterval) || DEFAULT_BATCH_SEND_INTERVAL,
                enableGeolocation: (config === null || config === void 0 ? void 0 : config.enableGeolocation) !== undefined ? config.enableGeolocation : true
            };
            // Set global config for use by other functions
            currentConfig = this.config;
            console.log('VisitorTracker initialized with config:', this.config);
            // Initialize visitor UUID
            this.visitorUUID = getCookie('trk_visitor_uuid') || uuid.v4();
            setCookie('trk_visitor_uuid', this.visitorUUID, 365);
            // Initialize session
            this.sessionId = getCookie('trk_session_id') || "".concat(this.visitorUUID, "_").concat(Date.now());
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
            window.crmTracker = this;
        }
        VisitorTracker.prototype.initializeTracking = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.config.enableGeolocation) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, captureGeolocation()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error('Failed to capture geolocation:', error_2);
                            return [3 /*break*/, 4];
                        case 4:
                            // Track initial page view
                            this.trackPageView();
                            // Start batch timer
                            this.startBatchTimer();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VisitorTracker.prototype.trackPageView = function () {
            var visit = {
                pageUrl: window.location.href,
                timestamp: Date.now(),
                screenSize: "".concat(screen.width, "x").concat(screen.height),
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                pageTitle: document.title
            };
            // Get current batch and add visit
            var currentBatch = this.getCurrentBatch();
            currentBatch.visits.push(visit);
            // Save updated batch
            try {
                localStorage.setItem('trk_tracking_batch', JSON.stringify(currentBatch));
            }
            catch (error) {
                console.error('Error saving tracking batch:', error);
            }
        };
        VisitorTracker.prototype.getCurrentBatch = function () {
            try {
                var stored = localStorage.getItem('trk_tracking_batch');
                if (stored) {
                    return JSON.parse(stored);
                }
            }
            catch (error) {
                console.error('Error parsing stored batch:', error);
            }
            // Create new batch
            var newBatch = {
                siteId: this.siteId,
                visitorUUID: this.visitorUUID,
                sessionId: this.sessionId,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                trackingInfo: generateEnhancedTrackingInfo(),
                utmParameter: parseUtmParameters(),
                visits: [],
                geolocation: globalGeolocation || undefined
            };
            return newBatch;
        };
        VisitorTracker.prototype.sendBatch = function () {
            return __awaiter(this, void 0, void 0, function () {
                var batch, response, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            batch = this.getCurrentBatch();
                            if (!batch.visits.length) {
                                console.log('No visits to send in batch');
                                return [2 /*return*/];
                            }
                            console.log('Sending enhanced CRM-compatible batch:', batch);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
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
                                console.log('Tracking batch sent successfully');
                                // Clear the batch after successful send
                                localStorage.removeItem('trk_tracking_batch');
                            }
                            else {
                                console.error('Failed to send tracking batch - HTTP status:', response.status);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_3 = _a.sent();
                            console.error('Failed to send tracking batch:', error_3);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        VisitorTracker.prototype.startBatchTimer = function () {
            var _this = this;
            this.batchTimer = setInterval(function () {
                _this.sendBatch();
            }, this.config.batchSendInterval);
        };
        VisitorTracker.prototype.getVisitorUUID = function () {
            return this.visitorUUID;
        };
        VisitorTracker.prototype.getSessionId = function () {
            return this.sessionId;
        };
        VisitorTracker.prototype.destroy = function () {
            if (this.batchTimer) {
                clearInterval(this.batchTimer);
                this.batchTimer = null;
            }
        };
        // Get current configuration
        VisitorTracker.prototype.getConfig = function () {
            return __assign({}, this.config);
        };
        // Update configuration
        VisitorTracker.prototype.updateConfig = function (newConfig) {
            this.config = __assign(__assign({}, this.config), newConfig);
            currentConfig = this.config;
            // Restart batch timer if interval changed
            if (newConfig.batchSendInterval && this.batchTimer) {
                clearInterval(this.batchTimer);
                this.startBatchTimer();
            }
            console.log('Configuration updated:', this.config);
        };
        return VisitorTracker;
    }());
    // Initialize tracking function with configurable options
    var initializeTracking = function (siteId, apiEndpoint, config) {
        console.log('Initializing comprehensive tracking system with config:', config);
        return new VisitorTracker(siteId, apiEndpoint, config);
    };
    // Utility functions for getting tracking data
    var getUserTrackingData = function () {
        var affiliateCode = getCookie('affiliateRefCode') || localStorage.getItem('affiliateRefCode') || '';
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
            screenResolution: "".concat(screen.width, "x").concat(screen.height),
            referrer: document.referrer,
            entryUrl: window.location.href,
            locationData: globalLocationData || {},
            affiliateRefCode: affiliateCode
        };
    };
    var fetchLocationData = function (ip) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, locationData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ip) {
                        return [2 /*return*/, globalLocationData || {}];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://ipapi.co/".concat(ip, "/json/"))];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    locationData = {
                        city: data.city,
                        region: data.region,
                        country: data.country_name,
                        isp: data.org,
                        connectionType: data.connection_type || 'Unknown',
                        connection: data.connection_type || 'Unknown'
                    };
                    globalLocationData = locationData;
                    return [2 /*return*/, locationData];
                case 4:
                    error_4 = _a.sent();
                    console.error('Failed to fetch location data:', error_4);
                    return [2 /*return*/, globalLocationData || {}];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var getPagesVisited = function () {
        var _a;
        try {
            var batch = localStorage.getItem('trk_tracking_batch');
            if (batch) {
                var parsed = JSON.parse(batch);
                return ((_a = parsed.visits) === null || _a === void 0 ? void 0 : _a.map(function (visit) { return visit.pageUrl; })) || [];
            }
        }
        catch (error) {
            console.error('Error getting pages visited:', error);
        }
        return [];
    };
    var getPageCount = function () {
        return getPagesVisited().length;
    };
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

    exports.VisitorTracker = VisitorTracker;
    exports["default"] = index;
    exports.fetchLocationData = fetchLocationData;
    exports.fetchUserIP = fetchUserIP;
    exports.getCookie = getCookie;
    exports.getPageCount = getPageCount;
    exports.getPagesVisited = getPagesVisited;
    exports.getUserTrackingData = getUserTrackingData;
    exports.initializeTracking = initializeTracking;
    exports.parseUserAgent = parseUserAgent;
    exports.setCookie = setCookie;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
