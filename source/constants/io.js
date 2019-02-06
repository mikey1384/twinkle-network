import io from 'socket.io-client';
const { URL } = process.env;

export const socket = io.connect(URL);
