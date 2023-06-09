import { get, Writable, writable } from "svelte/store";

export const socket: Writable<WebSocket> = writable<WebSocket>(null);

export const initSocket = async (): Promise<void> => {
  const sock = get(socket);
  if (sock && sock.readyState === WebSocket.OPEN) {
    return;
  }

  const webSocket = new WebSocket("__SOCKET_ADDRESS__");

  // Event listener for WebSocket connection open
  webSocket.onopen = () => {
    console.log("Owlie web socket connection established.");
    // You can send additional data or perform other operations after the connection is open
  };

  // Event listener for WebSocket connection close
  webSocket.onclose = () => {
    console.log("Owlie web socket connection closed.");
    // Perform any cleanup or reconnection logic if necessary
  };

  // Event listener for WebSocket connection error
  webSocket.onerror = (error) => {
    console.error("Owlie web socket error:", error);
  };
  socket.set(webSocket);
};

export const getSocket = () => {
  return get(socket);
};
