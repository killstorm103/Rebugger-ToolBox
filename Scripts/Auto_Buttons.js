(function() {

    // Simple safe trim
    function trimStr(str) { return str.replace(/^\s+|\s+$/g, ''); }

    function domReady(fn) {
        alert('domReady called');
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            alert('DOM already ready – calling init');
            setTimeout(fn, 0);
        } else if (window.addEventListener) {
            window.addEventListener('DOMContentLoaded', fn, false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', fn);
        } else {
            window.onload = function(old) {
                return function() {
                    if (old) old();
                    fn();
                };
            }(window.onload);
        }
    }

    function initAutoButtons() {
        alert('initAutoButtons started');

        var fixedHeader = document.querySelector('.fixed-header');
        alert('fixedHeader found = ' + (!!fixedHeader));

        if (!fixedHeader) return;

        var navContainer = fixedHeader.querySelector('.nav-container');
        alert('navContainer found = ' + (!!navContainer));

        if (!navContainer) return;

        // … (rest of your button‑building code) …
        alert('Buttons should now be visible');
    }

    domReady(initAutoButtons);

})();
