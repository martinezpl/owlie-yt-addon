import { get, Writable, writable } from "svelte/store";

export const socket: Writable<WebSocket> = writable<WebSocket>(null);

export const initSocket = async (): Promise<void> => {
  const sock = get(socket);
  if (sock && sock.readyState === WebSocket.OPEN) {
    return;
  }

  const webSocket = new WebSocket("__SOCKET_ADDRESS__");

  // Event listener for WebSocket connection error
  webSocket.onerror = (error) => {
    console.error("Owlie web socket error:", error);
  };

  socket.set(webSocket);
};

export const getSocket = () => {
  return get(socket);
};
