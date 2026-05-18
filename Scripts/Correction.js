
(function() {
    function applyPs3MarginFix() {
        if (window.isPS3) {
            setTimeout(function() {
                var darkBoxes = document.querySelectorAll('div[style*="background:#222"]');
                for (var i = 0; i < darkBoxes.length; i++) {
                    darkBoxes[i].style.marginBottom = '4px';
                }
            }, 300);
        }
    }
    if (window.addEventListener) {
        window.addEventListener('load', applyPs3MarginFix, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', applyPs3MarginFix);
    } else {
        window.onload = applyPs3MarginFix;
    }
})();
