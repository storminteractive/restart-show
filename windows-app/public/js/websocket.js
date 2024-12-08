const videoElement = document.getElementById('video');
let socket;
const connectionInterval = 2000; // 2 seconds
let retryTimeout;

// Function to establish WebSocket connection
function connect() {
    socket = new WebSocket('ws://localhost:3000?website');

    socket.addEventListener('open', function () {
        lwt('Connected to the WebSocket server');
        clearTimeout(retryTimeout); // Clear any existing reconnection timers
    });

    socket.addEventListener('message', function (event) {
        lwt('Received message from WebSocket server:', event.data);

        let cmd;

        try {
            cmd = JSON.parse(event.data);
        } catch (error) {
            lwt('Error parsing JSON:', error);
            return;
        }
        
        
        if (cmd.action === 'swap-video') {
            // Swap video to video2.mp4 and play it once, then return to video1.mp4 loop
            videoElement.src = 'videos/video2.mp4';
            videoElement.loop = false;

            videoElement.addEventListener('ended', function () {
                // Return to video1.mp4 loop
                videoElement.src = 'videos/video1.mp4';
                videoElement.loop = true;
                videoElement.play();
            }, { once: true });

            videoElement.play();
        }
    });

    socket.addEventListener('close', function () {
        lwt('Disconnected from WebSocket server. Attempting to reconnect...');
        retryConnection(); // Retry connection if disconnected
    });

    socket.addEventListener('error', function () {
        lwt('WebSocket error occurred. Closing connection and retrying...');
        socket.close(); // Ensure the connection is closed on error
    });
}

// Function to retry connection after a delay
function retryConnection() {
    retryTimeout = setTimeout(() => {
        lwt('Retrying WebSocket connection...');
        connect();
    }, connectionInterval);
}

// Initial connection attempt
connect();