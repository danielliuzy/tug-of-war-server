import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let topScore = 0;
let bottomScore = 0;

let counter = 0;

io.on("connection", (socket) => {
  // TODO: send scores back to client
  socket.emit("state", { topScore, bottomScore, counter });
  socket.on("clickedTop", () => {
    counter++;
    if (counter === 200) {
      topScore += 10;
      counter = 0;
      io.emit("won", "top");
    }
    io.emit("state", { topScore, bottomScore, counter });
  });
  socket.on("clickedBottom", () => {
    counter--;
    if (counter === -200) {
      bottomScore += 10;
      counter = 0;
      io.emit("won", "bottom");
    }
    io.emit("state", { topScore, bottomScore, counter });
  });

  socket.on("disconnect", (reason) => {
    console.log("player disconnected", reason);
  });
});

httpServer.listen(3000);

console.log("listening on port 3000");
