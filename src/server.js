const { createServer } = require("node:http");
const { Server } = require("socket.io");
const app = require("./app");
const socketHandler = require("./socket");

const port = process.env.SERVER_PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

socketHandler(io);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
