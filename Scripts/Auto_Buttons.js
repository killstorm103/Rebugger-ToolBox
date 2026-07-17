/**
 * Auto_Buttons.js – PS3-safe (ES3/ES5)
 * Auto-generates navigation buttons, margin control, AND Cyclic Search (Deduplicated & Fixed Scroll)
 */

(function() {
    // Safe trim
    function trimStr(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    // Check if one node is inside another (Retro-safe deduplication)
    function isDescendant(parent, child) {
         var node = child.parentNode;
         while (node != null) {
             if (node == parent) { return true; }
             node = node.parentNode;
         }
         return false;
    }

    // Bulletproof Old-School way to find exact element position on PS3
    function getAbsoluteY(element) {
        var y = 0;
        while (element != null) {
            y += element.offsetTop || 0;
            element = element.offsetParent;
        }
        return y;
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
        { file: 'Fixes_and_Other_Information.html', name: 'Fixes & Other Information' },
        { file: 'Homebrew_Information.html',        name: 'Homebrew Information' },
        { file: 'Tutorials.html',                   name: 'Tutorials' },
        { file: 'Known.html',                       name: 'Known cunts list' },
        { file: 'Social_Medias.html',               name: 'Social Medias' },
        { file: 'Services.html',                    name: 'Services' },
        { file: 'Platform_Debugger.html',           name: 'Platform Debugger' },
        { file: 'beta_test.html',                   name: 'Beta Test Page' } 
    ];

    var BASE_URL = 'http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Pages/';
    var currentFile = getCurrentPage();

    // Build buttons HTML
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

    // Insert margin control AND the Search Bar
    var headerToolsHTML = '<div style="padding: 5px; background: #222; color: #fff; font-size: 14px;">'
                        + '<label for="marginInput">Header Offset (px):</label> '
                        + '<input type="text" id="marginInput" value="300" size="4" style="width: 60px; text-align: center;"> '
                        + '<button id="applyMarginBtn" style="margin-left: 5px; padding: 2px 10px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Apply</button> '
                        + '<span style="margin-left: 10px; font-size: 12px; color: #aaa;">(Current: <span id="marginValue">300</span>px)</span> '
                        + '<span style="margin-left: 15px; font-size: 15px; color: #ffa500;">Press L1 or R1 before pressing Start to stop PS3 from deleting your last inputted number</span>'
                        + '</div>'
                        + '<!-- SEARCH BAR -->'
                        + '<div style="background:#1a1a1a; border-bottom:3px solid #dc3545; padding:8px 15px; text-align:center;">'
                        + '  <div style="display:inline-flex; align-items:center; gap:10px; background:#111; border:2px solid #dc3545; border-radius:6px; padding:6px 12px; width:90%; max-width:600px; text-align:left;">'
                        + '    <span style="font-size: 18px;">🔍</span>'
                        + '    <input type="text" id="global-search-input" placeholder="Search... (Press Enter to find next)" autocomplete="off" style="flex:1; background:transparent; border:none; color:white; font-size:16px; outline:none;">'
                        + '    <button id="clear-search-btn" style="display:none; background:none; border:none; color:#dc3545; font-size:18px; cursor:pointer; padding: 0 5px; font-weight:bold;">✖</button>'
                        + '  </div>'
                        + '</div>';

    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = headerToolsHTML;
    
    while (tempDiv.firstChild) {
        navContainer.parentNode.insertBefore(tempDiv.firstChild, navContainer.nextSibling);
    }

    // ==========================================
    // 1. WIRE MARGIN CONTROL
    // ==========================================
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
            var isCtrl  = (kc === 8 || kc === 46 || kc === 13 || kc === 9 || kc === 37 || kc === 39 || kc === 38 || kc === 40);
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

        applyBtn.onclick = function() { updateMargin(marginInput.value); };
        if (marginInput.value !== '') { updateMargin(marginInput.value); }
    }

    // ==========================================
    // 2. WIRE SMART SEARCH ENGINE (PS3-SAFE)
    // ==========================================
    var searchInput = document.getElementById('global-search-input');
    var clearBtn = document.getElementById('clear-search-btn');
    var scrollTimer = null;

    var currentMatches = [];
    var currentMatchIndex = 0;
    var lastFilter = "";
    var allSearchItems = []; 

    if (searchInput && clearBtn) {
        
        function scrollToCurrentMatch() {
            if (currentMatches.length === 0) { return; }
            
            // Dim all matches slightly
            for (var i = 0; i < currentMatches.length; i++) {
                currentMatches[i].style.backgroundColor = 'rgba(220, 53, 69, 0.15)'; 
                currentMatches[i].style.boxShadow = '0 0 8px #dc3545';               
            }

            // Brighten the ACTIVE match
            var activeMatch = currentMatches[currentMatchIndex];
            if (activeMatch) {
                activeMatch.style.backgroundColor = 'rgba(220, 53, 69, 0.45)'; 
                activeMatch.style.boxShadow = '0 0 15px #dc3545';
                
                if (scrollTimer) clearTimeout(scrollTimer);
                
                // Set delay to let dropdowns render, then FORCE jump
                scrollTimer = setTimeout(function() {
                    var targetY = getAbsoluteY(activeMatch);
                    var finalScroll = targetY - 150; // Subtracts 150px to account for the header
                    
                    if (finalScroll < 0) { finalScroll = 0; }
                    
                    window.scrollTo(0, finalScroll);
                }, 200); 
            }
        }

        clearBtn.onclick = function() {
            searchInput.value = '';
            if ("createEvent" in document) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("input", false, true);
                searchInput.dispatchEvent(evt);
            } else if ("fireEvent" in searchInput) {
                searchInput.fireEvent("oninput");
            }
        };

        searchInput.onkeydown = function(e) {
            e = e || window.event;
            var kc = e.keyCode || e.which;
            
            if (kc === 13) { 
                if (currentMatches.length > 0) {
                    currentMatchIndex = (currentMatchIndex + 1) % currentMatches.length;
                    scrollToCurrentMatch();
                }
                if (e.preventDefault) { e.preventDefault(); }
                return false;
            }
            return true;
        };

        searchInput.oninput = function() {
            var filter = trimStr(searchInput.value.toLowerCase());
            var isSearching = filter.length >= 2; 
            clearBtn.style.display = filter.length > 0 ? 'block' : 'none';

            if (filter !== lastFilter) {
                currentMatchIndex = 0;
                lastFilter = filter;
            }

            // Clean up previous styles
            for (var s = 0; s < allSearchItems.length; s++) {
                allSearchItems[s].style.backgroundColor = '';
                allSearchItems[s].style.boxShadow = '';
                allSearchItems[s].style.borderRadius = '';
                if (allSearchItems[s].getAttribute('data-original-display')) {
                    allSearchItems[s].style.display = allSearchItems[s].getAttribute('data-original-display');
                }
            }

            currentMatches = [];
            allSearchItems = [];
            
            if (!isSearching) { return; }

            // 1. GATHER ALL POTENTIAL ITEMS
            var rawMatches = [];
            
            var srvRows = document.getElementsByClassName('srv-row');
            for (var i = 0; i < srvRows.length; i++) { allSearchItems.push(srvRows[i]); }
            
            var consolesList = document.getElementById('consoles-list');
            if (consolesList) {
                var consoleItems = consolesList.getElementsByTagName('li');
                for (var j = 0; j < consoleItems.length; j++) { allSearchItems.push(consoleItems[j]); }
            }

            var headers = document.getElementsByTagName('strong');
            for (var h = 0; h < headers.length; h++) { allSearchItems.push(headers[h]); }

            var spans = document.getElementsByClassName('spanned');
            for (var p = 0; p < spans.length; p++) { allSearchItems.push(spans[p]); }

            // 2. FIND ALL MATCHING ITEMS
            for (var m = 0; m < allSearchItems.length; m++) {
                var item = allSearchItems[m];
                var text = item.textContent || item.innerText || "";
                if (text.toLowerCase().indexOf(filter) > -1) {
                    rawMatches.push(item);
                }
            }

            // 3. DEDUPLICATE
            for (var x = 0; x < rawMatches.length; x++) {
                var isNested = false;
                for (var y = 0; y < rawMatches.length; y++) {
                    if (x !== y && isDescendant(rawMatches[y], rawMatches[x])) {
                        isNested = true;
                        break;
                    }
                }
                
                if (!isNested) {
                    var finalItem = rawMatches[x];
                    finalItem.style.borderRadius = '6px';
                    
                    var tag = finalItem.tagName.toLowerCase();
                    if (tag === 'strong' || tag === 'span') {
                        finalItem.setAttribute('data-original-display', finalItem.style.display || '');
                        finalItem.style.display = 'inline-block';
                    }
                    
                    currentMatches.push(finalItem);
                }
            }

            // 4. OPEN DROPDOWNS IF THEY CONTAIN A MATCH
            var allDetails = document.getElementsByTagName('details');
            for (var k = 0; k < allDetails.length; k++) {
                if (allDetails[k].className && allDetails[k].className.indexOf('srv-dropdown') > -1) {
                    var hasMatchInside = false;
                    for (var z = 0; z < currentMatches.length; z++) {
                        if (isDescendant(allDetails[k], currentMatches[z])) {
                            hasMatchInside = true;
                            break;
                        }
                    }
                    if (hasMatchInside) {
                        allDetails[k].setAttribute('open', 'true');
                    } else {
                        allDetails[k].removeAttribute('open');
                    }
                }
            }

            scrollToCurrentMatch();
        };
    }

})();
