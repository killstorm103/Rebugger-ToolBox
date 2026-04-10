/**
 * PS3 Browser & Firmware Detection
 * Compatible with PS3 NetFront browser (ES3/ES5 only)
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

    // 2. Extract firmware version using multiple reliable methods
    function getFirmwareVersion() {
        // Method A: Standard pattern "PLAYSTATION 3; X.XX)"
        var start = ua.indexOf('PLAYSTATION 3;');
        if (start === -1) start = ua.indexOf('PS3;');
        if (start !== -1) {
            start = ua.indexOf(';', start) + 1;
            while (ua.charAt(start) === ' ') start++;
            var end = ua.indexOf(')', start);
            if (end !== -1) {
                var version = ua.substring(start, end).replace(/^\s+|\s+$/g, '');
                if (version.length > 0) return version;
            }
        }

        // Method B: HEN installer offset method (works on all known PS3 firmwares)
        // Format: "Mozilla/5.0 (PLAYSTATION 3; 4.90) AppleWebKit/..."
        var prefix = '5.0 (';
        var suffix = ') Apple';
        var idxStart = ua.indexOf(prefix);
        var idxEnd = ua.indexOf(suffix);
        if (idxStart !== -1 && idxEnd !== -1) {
            // The firmware starts 19 characters after the beginning of "5.0 ("
            var fwStart = idxStart + 19;
            var version = ua.substring(fwStart, idxEnd);
            version = version.replace(/^\s+|\s+$/g, '');
            if (version.length > 0) return version;
        }

        // Method C: Last resort – extract any number after "PLAYSTATION 3"
        var match = ua.match(/PLAYSTATION 3[; ]+([\d.]+)/i);
        if (match && match[1]) return match[1];
        match = ua.match(/PS3[; ]+([\d.]+)/i);
        if (match && match[1]) return match[1];

        return ''; // Could not determine firmware
    }

    // 3. Set global variables
    window.isPS3 = detectPS3();
    window.ps3Firmware = window.isPS3 ? getFirmwareVersion() : '';
    window.ps3UserAgent = ua; // Expose full UA for debugging
})();
