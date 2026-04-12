(function() {
    // Just the fucking buttons. No <h1>, no bullshit subtitles.
    var buttonsHTML = '' +
        '<div class="nav-container">' +
            '<a href="https://github.com/killstorm103/Rebugger-ToolBox/blob/main/README.md" class="nav-button" target="_blank">How to install</a>' +
            '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Changelog.html" class="nav-button" target="_blank">ChangeLogs</a>' +
            '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Social_Medias.html" class="nav-button" target="_blank">Social Medias</a>' +
            '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Services.html" class="nav-button" target="_blank">View Services</a>' +
            '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Known.html" class="nav-button" target="_blank">Known cunts list</a>' +
            '<a href="http://raw.githack.com/killstorm103/Rebugger-ToolBox/dev/Fixes_and_Other_Information.html" class="nav-button" target="_blank">Fixes and Other Information</a>' +
        '</div>';

    var placeholder = document.getElementById('nav-buttons');
    if (placeholder) {
        placeholder.innerHTML = buttonsHTML;
    }
})();
