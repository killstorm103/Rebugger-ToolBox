/**
 * PS3 Browser & Firmware Detection
 * Compatible with PS3 NetFront browser (ES3/ES5 only)
 */

(function() {
    var ua = navigator.userAgent;

    function DetectPS4 () // Untested
    {
        if (ua.indexOf('PLAYSTATION 4') > -1) return true;
        if (ua.indexOf('PS4') > -1) return true;
        
        return false;
    }
    function DetectPS3 () 
    {
        if (ua.indexOf('PLAYSTATION 3') > -1) return true;
        if (ua.indexOf('PS3') > -1) return true;
        
        // Older PS3 user agents sometimes identify as MSIE 6.0 on Windows NT 5.1
        if (ua.indexOf('MSIE 6.0') > -1 && ua.indexOf('Windows NT 5.1') > -1) return true;
        return false;
    }

    function getPS3FirmwareVersion () 
    {
        var start = ua.indexOf('PLAYSTATION 3;');
        if (start === -1) start = ua.indexOf('PS3;');
        if (start !== -1) 
        {
            start = ua.indexOf(';', start) + 1;
            while (ua.charAt(start) === ' ') start++;
            var end = ua.indexOf(')', start);
            if (end !== -1) 
            {
                var version = ua.substring(start, end).replace(/^\s+|\s+$/g, '');
                if (version.length > 0) return version;
            }
        }
        var prefix = '5.0 (';
        var suffix = ') Apple';
        var idxStart = ua.indexOf(prefix);
        var idxEnd = ua.indexOf(suffix);
        if (idxStart !== -1 && idxEnd !== -1)
        {
            var fwStart = idxStart + 19;
            var version = ua.substring(fwStart, idxEnd);
            version = version.replace(/^\s+|\s+$/g, '');
            if (version.length > 0) return version;
        }

        var match = ua.match(/PLAYSTATION 3[; ]+([\d.]+)/i);
        if (match && match[1]) return match[1];
        match = ua.match(/PS3[; ]+([\d.]+)/i);
        if (match && match[1]) return match[1];

        return ''; // Could not determine firmware
    }
    function getPS4FirmwareVersion () // Untested
    {
        var start = ua.indexOf('PLAYSTATION 4;');
        if (start === -1) start = ua.indexOf('PS4;');
        if (start !== -1) 
        {
            start = ua.indexOf(';', start) + 1;
            while (ua.charAt(start) === ' ') start++;
            var end = ua.indexOf(')', start);
            if (end !== -1) 
            {
                var version = ua.substring(start, end).replace(/^\s+|\s+$/g, '');
                if (version.length > 0) return version;
            }
        }
        var prefix = '5.0 (';
        var suffix = ') Apple';
        var idxStart = ua.indexOf(prefix);
        var idxEnd = ua.indexOf(suffix);
        if (idxStart !== -1 && idxEnd !== -1)
        {
            var fwStart = idxStart + 19;
            var version = ua.substring(fwStart, idxEnd);
            version = version.replace(/^\s+|\s+$/g, '');
            if (version.length > 0) return version;
        }

        var match = ua.match(/PLAYSTATION 4[; ]+([\d.]+)/i);
        if (match && match[1]) return match[1];
        match = ua.match(/PS4[; ]+([\d.]+)/i);
        if (match && match[1]) return match[1];

        return ''; // Could not determine firmware
    }

    // Set global variables
    window.isPS3 = DetectPS3();
    window.isPS4 = DetectPS4();
    window.ps3Firmware = window.isPS3 ? getPS3FirmwareVersion() : 'Unknown (could not parse)';
    window.ps4Firmware = window.isPS4 ? getPS4FirmwareVersion() : 'Unknown (could not parse)';
    window.isPS3SilkBrowserEngine = window.isPS3 && window.ps3Firmware.indexOf('1') === 0;
    window.UserAgent = ua; 
})();
