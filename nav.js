// nav.js - Shared navigation bar (PS3‑compatible)

(function() 
 {
    var navHTML = '' +
        '<div class="fixed-header">' +
            '<h1>Rebugger - ToolBox: Updates & Patches</h1>' +
            '<h1_under>Click on the images to download</h1_under>' +
            '<div class="nav-container">' +
                '<a href="https://github.com/killstorm103/Rebugger-ToolBox/blob/main/README.md" class="nav-button" target="_blank">How to install</a>' +
                '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Changelog.html" class="nav-button" target="_blank">ChangeLogs</a>' +
                '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Social_Medias.html" class="nav-button" target="_blank">Social Medias</a>' +
                '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Services.html" class="nav-button" target="_blank">View Services</a>' +
                '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Known.html" class="nav-button" target="_blank">Known cunts list</a>' +
                '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Fixes_and_Other_Information.html" class="nav-button" target="_blank">Fixes & Other Information</a>' +
            '</div>' +
        '</div>';

    var placeholder = document.getElementById('shared-nav');

    if (placeholder)
    {
        placeholder.innerHTML = navHTML;
    }
    else 
    {
        // Fallback: insert at the very top of the body
        var body = document.body;
        if (body) {
            body.insertAdjacentHTML('afterbegin', navHTML);
        }
    }
})();
