const express = require("express");

const app = express();
const cors = require("cors");
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);
	
	//ye change kiya hai maine 
	socket.on("me", () => {
		socket.emit("me",socket.id)
	})

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
	socket.on("video", (data) => {
		io.to(data.idToCall).emit("handlevideo",data)
	});
	socket.on("audio", (data) => {
		console.log(data.message)
	});
	socket.on("codeshare", (data,idToShare) => {
		// console.log(to)
		io.to(idToShare).emit("updatecode",data)
	});


	socket.on("screenShare", (data) => {
		// console.log(screen,to)
		console.log("thiss is data ", data)
		// io.to(data.to).emit("userScreen",data.screen)
	});
});

server.listen(PORT, () => {
  console.log("Server is runing ");
});
