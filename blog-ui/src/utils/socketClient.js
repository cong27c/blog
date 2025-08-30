import PusherJS from "pusher-js";

const socketClient = new PusherJS("soketi-key", {
  cluster: "eu-west-1",
  wsHost: "103.20.96.210",
  wsPort: 6001,
  forceTLS: false,
  authEndpoint: "http://localhost:3000/api/v1/pusher/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  },
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

export default socketClient;
