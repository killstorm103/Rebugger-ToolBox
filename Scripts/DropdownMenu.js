/**
 * Dropdown Menu Library for PS3 (Normal & Silk) and PC
 * Dependencies:
 *   - Platform_Checker.js (provides window.isPS3SilkBrowserEngine)
 *   - Style.css (provides .dropdown-menu, .dropdown-absolute, .dropdown-table, etc.)
 */

(function() {
    // Helper: Normalize event listener (works on PS3)
    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, handler);
        } else {
            element['on' + event] = handler;
        }
    }

    // Track all open dropdown menus
    var openMenus = [];

    // Close all dropdown menus except the one that was clicked
    function closeAllMenus(exceptMenuId) {
        for (var i = 0; i < openMenus.length; i++) {
            var menuId = openMenus[i];
            if (menuId !== exceptMenuId) {
                var menu = document.getElementById(menuId);
                if (menu) menu.style.display = 'none';
            }
        }
        if (exceptMenuId !== undefined) {
            openMenus = [exceptMenuId];
        } else {
            openMenus = [];
        }
    }

    // Global click listener: close menus when clicking outside
    addEvent(document.body, 'click', function(e) {
        var target = e.target || e.srcElement;
        var clickedInsideMenu = false;
        
        // Check if clicked inside any dropdown container
        for (var i = 0; i < openMenus.length; i++) {
            var menuId = openMenus[i];
            var menu = document.getElementById(menuId);
            if (menu && (menu === target || menu.contains(target))) {
                clickedInsideMenu = true;
                break;
            }
        }
        
        // Check if clicked on a dropdown trigger image
        var clickedTrigger = (target.tagName === 'IMG' && target.getAttribute('data-dropdown-id'));
        
        if (!clickedInsideMenu && !clickedTrigger) {
            closeAllMenus();
        }
    });

    // Toggle a specific dropdown menu
    window.toggleDropdown = function(menuId) {
        var menu = document.getElementById(menuId);
        if (!menu) return;
        
        var isOpen = (menu.style.display === 'block');
        
        if (isOpen) {
            menu.style.display = 'none';
            // Remove from open list
            var index = openMenus.indexOf(menuId);
            if (index !== -1) openMenus.splice(index, 1);
        } else {
            closeAllMenus(menuId);
            menu.style.display = 'block';
            openMenus.push(menuId);
        }
    };

    /**
     * Create a dropdown menu
     * @param {string} containerId - ID of the element to place the dropdown in
     * @param {string} imageUrl - URL of the trigger image
     * @param {Array} menuItems - Array of objects: { text, url, isSeparator? }
     * @param {Object} options - Optional settings
     * @param {boolean} options.useSilkLayout - Force Silk layout (auto-detected if not set)
     * @param {string} options.menuId - Custom ID for the menu (auto-generated if not set)
     */
    window.createDropdown = function(containerId, imageUrl, menuItems, options) {
        options = options || {};
        var container = document.getElementById(containerId);
        if (!container) {
            console.error('Dropdown container not found: ' + containerId);
            return;
        }
        
        // Detect Silk engine
        var isSilk = (window.isPS3SilkBrowserEngine === true);
        if (options.useSilkLayout !== undefined) isSilk = options.useSilkLayout;
        
        // Generate unique IDs
        var menuId = options.menuId || ('dropdown_menu_' + Math.random().toString(36).substr(2, 9));
        var imgId = menuId + '_img';
        
        // Build menu HTML
        var menuHtml = '<div id="' + menuId + '" class="dropdown-menu" style="display:none;">';
        for (var i = 0; i < menuItems.length; i++) {
            var item = menuItems[i];
            if (item.isSeparator) {
                menuHtml += '<hr class="dropdown-separator">';
            } else {
                var onclickAttr = '';
                if (isSilk) {
                    onclickAttr = ' onclick="alert(\'Download not available on the Silk browser engine.\'); return false;"';
                }
                menuHtml += '<a href="' + item.url + '" target="_blank"' + onclickAttr + '>' + item.text + '</a>';
            }
        }
        menuHtml += '</div>';
        
        // Build outer HTML based on engine
        var html;
        if (isSilk) {
            // Silk engine: use table layout (more reliable)
            html = '<table class="dropdown-table">' +
                '<tr>' +
                '<td class="dropdown-cell-img">' +
                '<img id="' + imgId + '" src="' + imageUrl + '" width="150" height="150" style="cursor:pointer;" data-dropdown-id="' + menuId + '">' +
                '</td>' +
                '<td class="dropdown-cell-menu">' + menuHtml + '</td>' +
                '</tr>' +
                '</table>';
        } else {
            // Normal browsers: use absolute positioning
            html = '<div class="dropdown-absolute">' +
                '<img id="' + imgId + '" src="' + imageUrl + '" width="150" height="150" style="cursor:pointer;" data-dropdown-id="' + menuId + '">' +
                menuHtml +
                '</div>';
        }
        
        container.innerHTML = html;
        
        // Attach click event to the image
        var imgElement = document.getElementById(imgId);
        if (imgElement) {
            addEvent(imgElement, 'click', function(e) {
                e = e || window.event;
                if (e.stopPropagation) e.stopPropagation();
                if (e.cancelBubble !== undefined) e.cancelBubble = true;
                toggleDropdown(menuId);
                return false;
            });
        }
        
        return menuId;
    };
})();
