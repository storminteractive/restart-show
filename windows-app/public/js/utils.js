// Custom date format function
function formatDate(date) {
    const yyyy = date.getFullYear();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${dd}-${mm} ${HH}:${MM}:${ss}`;
}

function _getCallerFile() {
    var originalFunc = Error.prepareStackTrace;
    var callerfile;
    
    try {
        var err = new Error();
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };
        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();
            if(currentfile !== callerfile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc; 

    // Check directory separator depending if linux or windows
    if (callerfile.includes('/')) callerfile = callerfile.split('/').pop();
    else if (callerfile.includes('\\')) callerfile = callerfile.split('\\').pop();

    return callerfile;
}

// log with timestamp
function lwt(...args) {
    const timestamp = formatDate(new Date());
    console.log(`[${timestamp} ${_getCallerFile()}]`, ...args);
}

async function isFilePresent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            lwt('File not found:', url);
            alert('File not found:'+url+'. Please place it in the video folder.');
            return; 
        }
        lwt('File found:', url);
        return true;
    } catch (error) {
        return false;
    }
}

function showVersionOnLoad(version) {
    const versionElement = document.createElement('div');
    versionElement.id = 'version-display';
    versionElement.style.position = 'absolute';
    versionElement.style.top = '10px';
    versionElement.style.right = '10px';
    versionElement.style.backgroundColor = 'rgba(0, 0, 255, 0.7)';
    versionElement.style.color = 'white';
    versionElement.style.padding = '5px 10px';
    versionElement.style.borderRadius = '5px';
    versionElement.style.zIndex = '1000';
    versionElement.innerText = `Version: ${version}`;

    document.body.appendChild(versionElement);

    // Remove the version display after 2 seconds
    setTimeout(() => {
        versionElement.remove();
    }, 10000);
}