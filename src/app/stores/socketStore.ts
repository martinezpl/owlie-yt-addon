import { get, Writable, writable } from "svelte/store";

export const socket: Writable<WebSocket> = writable<WebSocket>(null);

export const initSocket = () => {
  const webSocket = new WebSocket(
    "wss://e4ndtvm8pj.execute-api.eu-west-1.amazonaws.com/staging"
  );

  // Event listener for WebSocket connection open
  webSocket.onopen = () => {
    console.log("WebSocket connection established.");

    // You can send additional data or perform other operations after the connection is open
  };

  // Event listener for WebSocket connection close
  webSocket.onclose = () => {
    console.log("WebSocket connection closed.");

    // Perform any cleanup or reconnection logic if necessary
  };

  // Event listener for WebSocket connection error
  webSocket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  socket.set(webSocket);
};

export const getSocket = () => {
  return get(socket);
};

export const closeSocket = () => {
  get(socket).close();
};
