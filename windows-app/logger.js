// logger.js

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
    // get calling file name
    const caller = _getCallerFile();

    const timestamp = formatDate(new Date());
    console.log(`[${timestamp} ${caller}]`, ...args);
}

module.exports = { lwt };