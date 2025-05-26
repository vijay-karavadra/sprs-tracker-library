(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["sperse-tracker"] = {}));
})(this, (function (exports) { 'use strict';

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

    // user-tracking.js
    // User agent parsing
    var parseUserAgent = function (userAgent) {
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
        var device = 'Desktop';
        if (/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent)) {
            device = 'Mobile';
        }
        else if (/iPad|Tablet/i.test(userAgent)) {
            device = 'Tablet';
        }
        var os = 'Unknown';
        if (userAgent.includes('Windows'))
            os = 'Windows';
        else if (userAgent.includes('Mac OS'))
            os = 'macOS';
        else if (userAgent.includes('Linux'))
            os = 'Linux';
        else if (userAgent.includes('Android'))
            os = 'Android';
        else if (/iOS|iPhone|iPad/.test(userAgent))
            os = 'iOS';
        return { browser: browser, browserVersion: browserVersion, device: device, os: os };
    };
    // Cookie helpers
    var setCookie = function (name, value, days) {
        if (days === void 0) { days = 30; }
        var expires = new Date(Date.now() + days * 86400000).toUTCString();
        document.cookie = "".concat(name, "=").concat(value, ";expires=").concat(expires, ";path=/");
    };
    var getCookie = function (name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    };
    var generateSessionId = function () { return "session_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 10)); };
    // Core tracking
    var trackPageVisit = function (url) {
        var data = getVisitorData() || createVisitorData();
        var cleanUrl = url.split('?')[0].split('#')[0];
        if (!data.pagesVisited.includes(cleanUrl)) {
            data.pagesVisited.push(cleanUrl);
            data.pageCount = data.pagesVisited.length;
            saveVisitorData(data);
            console.log("Tracked: ".concat(cleanUrl, " (").concat(data.pageCount, " total)"));
        }
    };
    var getPagesVisited = function () { var _a; return ((_a = getVisitorData()) === null || _a === void 0 ? void 0 : _a.pagesVisited) || []; };
    var getPageCount = function () { var _a; return ((_a = getVisitorData()) === null || _a === void 0 ? void 0 : _a.pageCount) || 0; };
    var parseAffiliateCode = function (url) {
        try {
            var params = new URL(url).searchParams;
            for (var _i = 0, _a = ['ref', 'a', 'aff', 'via']; _i < _a.length; _i++) {
                var key = _a[_i];
                var val = params.get(key);
                if (val)
                    return val;
            }
            var path = new URL(url).pathname;
            var patterns = [/\/ref\/([^\/]+)/, /\/a\/([^\/]+)/, /\/aff\/([^\/]+)/, /\/via\/([^\/]+)/];
            for (var _b = 0, patterns_1 = patterns; _b < patterns_1.length; _b++) {
                var regex = patterns_1[_b];
                var match = path.match(regex);
                if (match)
                    return match[1];
            }
        }
        catch (e) {
            console.error('Affiliate code error:', e);
        }
        return null;
    };
    var getBrowserGeolocation = function () {
        return new Promise(function (resolve) {
            if (!navigator.geolocation)
                return resolve(null);
            navigator.geolocation.getCurrentPosition(function (pos) { return __awaiter(void 0, void 0, void 0, function () {
                var geo, loc, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            geo = {
                                latitude: pos.coords.latitude,
                                longitude: pos.coords.longitude,
                                accuracy: pos.coords.accuracy,
                                timestamp: Date.now()
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, reverseGeocode(geo.latitude, geo.longitude)];
                        case 2:
                            loc = _a.sent();
                            if (loc)
                                Object.assign(geo, loc);
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            console.error('Reverse geocode failed', e_1);
                            return [3 /*break*/, 4];
                        case 4:
                            resolve(geo);
                            return [2 /*return*/];
                    }
                });
            }); }, function (err) { return resolve(null); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
        });
    };
    var reverseGeocode = function (lat, lng) { return __awaiter(void 0, void 0, void 0, function () {
        var res, data, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=".concat(lat, "&longitude=").concat(lng, "&localityLanguage=en"))];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error('Reverse geocode failed');
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, { city: data.city || data.locality, region: data.principalSubdivision, country: data.countryName }];
                case 3:
                    e_2 = _a.sent();
                    console.error('Reverse geocoding error:', e_2);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getBrowserInfo = function () { return ({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenResolution: "".concat(screen.width, "x").concat(screen.height),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: Date.now()
    }); };
    var getVisitorData = function () {
        try {
            var raw = localStorage.getItem('visitorData');
            return raw ? JSON.parse(raw) : null;
        }
        catch (e) {
            console.error('Visitor data load error:', e);
            return null;
        }
    };
    var saveVisitorData = function (data) {
        try {
            localStorage.setItem('visitorData', JSON.stringify(data));
        }
        catch (e) {
            console.error('Visitor data save error:', e);
        }
    };
    var createVisitorData = function () {
        var data = {
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
    var addVisitToTracker = function (visit) {
        var data = getVisitorData() || createVisitorData();
        data.visits.push(visit);
        data.totalVisits++;
        saveVisitorData(data);
    };

    exports.addVisitToTracker = addVisitToTracker;
    exports.createVisitorData = createVisitorData;
    exports.getBrowserGeolocation = getBrowserGeolocation;
    exports.getBrowserInfo = getBrowserInfo;
    exports.getCookie = getCookie;
    exports.getPageCount = getPageCount;
    exports.getPagesVisited = getPagesVisited;
    exports.getVisitorData = getVisitorData;
    exports.parseAffiliateCode = parseAffiliateCode;
    exports.parseUserAgent = parseUserAgent;
    exports.reverseGeocode = reverseGeocode;
    exports.saveVisitorData = saveVisitorData;
    exports.setCookie = setCookie;
    exports.trackPageVisit = trackPageVisit;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
