/**
 * PS3 Browser & Firmware Detection
 * Compatible with PS3 NetFront browser (ES3/ES5 only)
 * 
 * This script sets two global variables:
 *   - isPS3          (boolean) true if a PlayStation 3 browser is detected
 *   - ps3Firmware    (string)  firmware version (e.g. "4.90") or empty string if not PS3
 */

(function() {
    var ua = navigator.userAgent;

    // 1. Detect if the browser is a PlayStation 3
    function detectPS3() {
        if (ua.indexOf('PLAYSTATION 3') > -1) return true;
        if (ua.indexOf('PS3') > -1) return true;
        // Older PS3 user agents sometimes identify as MSIE 6.0 on Windows NT 5.1
        if (ua.indexOf('MSIE 6.0') > -1 && ua.indexOf('Windows NT 5.1') > -1) return true;
        return false;
    }

    // 2. Extract firmware version from user agent string
    function getFirmwareVersion() {
        // The PS3 user agent looks like:
        // Mozilla/5.0 (PLAYSTATION 3; 4.90) AppleWebKit/...
        // We need to find the number between the semicolon and the closing parenthesis
        var start = ua.indexOf('PLAYSTATION 3;');
        if (start === -1) {
            start = ua.indexOf('PS3;');
        }
        if (start === -1) return '';

        // Move past the semicolon and any space
        start = ua.indexOf(';', start) + 1;
        while (ua.charAt(start) === ' ') start++;

        var end = ua.indexOf(')', start);
        if (end === -1) return '';

        // Extract and trim the version string
        var version = ua.substring(start, end);
        // Remove any trailing spaces or extra characters
        version = version.replace(/^\s+|\s+$/g, '');
        return version;
    }

    // 3. Set global variables
    window.isPS3 = detectPS3();
    window.ps3Firmware = window.isPS3 ? getFirmwareVersion() : '';

    // 4. Optional: Log to console (will be ignored on PS3 if console not available)
    if (window.isPS3) {
        // Use a simple fallback for older browsers that lack console
        var logMsg = 'PS3 detected. Firmware: ' + window.ps3Firmware;
        if (typeof console !== 'undefined' && console.log) {
            console.log(logMsg);
        }
    }
})();
