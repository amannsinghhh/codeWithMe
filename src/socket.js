import { io } from "socket.io-client";
export const initSocket = () => {
    const options = {
        'force new connection': true,
        reconnection: true,
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket', 'polling'],
    };

    return io(process.env.REACT_APP_BACKEND_URL, options);

};



