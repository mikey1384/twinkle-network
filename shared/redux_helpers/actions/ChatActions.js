import { URL } from './URL';
const connectSocket = () => io.connect(URL);

export function openChat() {
  const socket = connectSocket();
  return dispatch => {
    return;
  }
}
