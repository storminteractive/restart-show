const { lwt } = require('../common/logger');

const swapVideo = (sock) => {
    if (sock !== null) {
        lwt('Sending action:"swap-video" to website sock');
        sock.send(JSON.stringify({'action':'swap-video'}));
    } else {
        lwt('Website socket is not connected');
    }
}

const openDoor = (sock) => {
    if (sock !== null) {
        lwt('Sending action:"open-door" to website sock');
        sock.send(JSON.stringify({'action':'open-door'}));
    } else {
        lwt('Website socket is not connected');
    }
}

module.exports = { swapVideo, openDoor };