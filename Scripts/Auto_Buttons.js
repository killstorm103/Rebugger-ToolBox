/**
 * Auto_Buttons.js – PS3‑safe (ES3/ES5)
 * Auto‑generates navigation buttons + margin control.
 */

(function() {
    // Safe trim
    function trimStr(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    // Current page filename
    function getCurrentPage() {
        var url = window.location.href;
        var q = url.indexOf('?');
        if (q !== -1) { url = url.substring(0, q); }
        var h = url.indexOf('#');
        if (h !== -1) { url = url.substring(0, h); }
        var parts = url.split('/');
        return parts[parts.length - 1];
    }

    var allPages = [
        { file: 'How_To_Install.html',              name: 'How to Install' },
        { file: 'Changelog.html',                   name: 'ChangeLogs' },
        { file: 'Download_Page.html',               name: 'Downloads' },
        { file: 'Fixes_and_Other_Information.html',  name: 'Fixes & Other Information' },
        { file: 'Homebrew_Information.html',         name: 'Homebrew Information' },
        { file: 'Tutorials.html',                    name: 'Tutorials' },
        { file: 'Known.html',                        name: 'Known cunts list' },
        { file: 'Social_Medias.html',                name: 'Social Medias' },
        { file: 'Services.html',                     name: 'Services' },
        { file: 'Platform_Debugger.html',            name: 'Platform Debugger' }
    , {file: 'beta_test', name: 'Beta Test Page'}];

    var BASE_URL = 'http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Pages/';
    var currentFile = getCurrentPage();

    // Build buttons HTML – add a space between buttons
    var buttonsHTML = '';
    for (var i = 0; i < allPages.length; i++) {
        var page = allPages[i];
        if (page.file.toLowerCase() !== currentFile.toLowerCase()) {
            buttonsHTML += '<a href="' + BASE_URL + page.file + '" class="nav-button" target="_blank">'
                        + page.name + '</a> ';
        }
    }

    // Locate fixed-header
    var fixedHeaders = document.getElementsByClassName('fixed-header');
    if (fixedHeaders.length === 0) { return; }
    var fixedHeader = fixedHeaders[0];

    // Find nav-container inside it
    var navContainers = fixedHeader.getElementsByClassName('nav-container');
    if (navContainers.length === 0) { return; }
    var navContainer = navContainers[0];

    // Insert navigation bar
    navContainer.innerHTML = '<div style="background:#222; border-left:5px solid #dc3545; padding:15px; color:#fff; margin-bottom:0px;">'
                           + buttonsHTML + '</div>';

    // Insert margin control right after nav-container
    var marginHTML = '<div style="padding: 5px; background: #222; color: #fff; font-size: 14px;">'
                   + '<label for="marginInput">Header Offset (px):</label> '
                   + '<input type="text" id="marginInput" value="300" size="4" style="width: 60px; text-align: center;"> '
                   + '<button id="applyMarginBtn" style="margin-left: 5px; padding: 2px 10px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Apply</button> '
                   + '<span style="margin-left: 10px; font-size: 12px; color: #aaa;">(Current: <span id="marginValue">300</span>px)</span> '
                   + '<span style="margin-left: 15px; font-size: 15px; color: #ffa500;">Press L1 or R1 before pressing Start to stop PS3 from deleting your last inputted number</span>'
                   + '</div>';
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = marginHTML;
    var marginDiv = tempDiv.firstChild;
    navContainer.parentNode.insertBefore(marginDiv, navContainer.nextSibling);

    // Wire margin control
    var marginInput   = document.getElementById('marginInput');
    var applyBtn      = document.getElementById('applyMarginBtn');
    var valueDisplay  = document.getElementById('marginValue');
    var mainContainer = document.getElementById('mainContainer');

    if (marginInput && applyBtn && mainContainer) {

        function updateMargin(value) {
            var clean = String(value).replace(/[ .]/g, '');
            if (clean === '') { return; }
            var num = parseInt(clean, 10);
            if (isNaN(num)) { return; }
            if (num < 0) { num = 0; }
            mainContainer.style.marginTop = num + 'px';
            if (valueDisplay) { valueDisplay.innerHTML = num; }
            marginInput.value = num;
        }

        marginInput.onkeypress = function(e) {
            e = e || window.event;
            var kc = e.keyCode || e.which;
            var ch = String.fromCharCode(kc);
            var isDigit = /[0-9]/.test(ch);
            var isCtrl  = (kc === 8 || kc === 46 || kc === 13 || kc === 9 ||
                           kc === 37 || kc === 39 || kc === 38 || kc === 40);
            if (!isDigit && !isCtrl) {
                if (e.preventDefault) { e.preventDefault(); }
                return false;
            }
            if (kc === 13) {
                updateMargin(marginInput.value);
                if (e.preventDefault) { e.preventDefault(); }
                return false;
            }
            return true;
        };

        marginInput.oninput = function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        };

        applyBtn.onclick = function() {
            updateMargin(marginInput.value);
        };

        var initVal = marginInput.value;
        if (initVal !== '') {
            updateMargin(initVal);
        }
    }

})();
