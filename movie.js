var LINES_PER_FRAME = 14;
var DELAY_BASE = 85; 
var FILE_PATH = 'file:///mnt/us/documents/StarWars/starwars.txt';
var screenEl = document.getElementById('movie-screen');

function _readTextFile(filePath) {
    return new Promise(function(resolve) {
        var iframe = document.createElement("iframe");
        iframe.style.display = 'none';
        iframe.src = filePath;
        
        document.body.appendChild(iframe);
        
        iframe.addEventListener("load", function(e) {
            try {
                var src = e.target.contentDocument.documentElement.innerHTML;
                e.target.remove();

                var content = src.replace(/<[^>]+>/g, "").trim();
                
                resolve(content);
            } catch (err) {
                console.error("Failed To Read File via Iframe:", err);
                resolve(null); 
            }
        });
        
        setTimeout(function() { 
            if (iframe.parentNode) iframe.remove(); 
            resolve(null); 
        }, 3000); 
    });
}

function runMovie(rawData) {
    var filmData = rawData.split('\n');
    var i = 0;

    function nextFrame() {
        var delayMultiplier, frameContent, delayMS;

        if (i >= filmData.length) {
            console.log('Movie Finished!');
            return;
        }

        delayMultiplier = parseInt(filmData[i], 10);
        if (isNaN(delayMultiplier)) {
            delayMultiplier = 1;
        }

        frameContent = filmData.slice(i + 1, i + LINES_PER_FRAME).join('\n');
        screenEl.innerHTML = frameContent;
        delayMS = delayMultiplier * DELAY_BASE;
        i += LINES_PER_FRAME;

        setTimeout(nextFrame, delayMS);
    }

    nextFrame();
}

screenEl.innerHTML = 'Loading starwars.txt...';

_readTextFile(FILE_PATH).then(function(data) {
    if (data) {
        runMovie(data);
    } else {
        screenEl.innerHTML = 'ERROR: Failed to load movie data. Status: 0 is likely still active. Use the correct full file:// path or a web server.';
    }
}).catch(function(e) {
    screenEl.innerHTML = 'FATAL ERROR during file reading.';
    console.error(e);
});

window.onerror = function (message, url, line) {
    screenEl.innerHTML = 'FATAL ERROR: ' + message + ' on line ' + line;
    return true;
};

function audio(){
    var filepath="mnt/us/documents/StarWars/sox/playall.sh";
            (window.kindle || top.kindle).messaging.sendStringMessage(
            "com.kindlemodding.utild",
            "runCMD",
            filepath);
}