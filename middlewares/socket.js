const socketIO = (app)=>{
	var io = require("socket.io")(app);
	var sockets = {};

	io.on("connection", (socket) =>{
	  console.log("Client connected...");
	  socket.emit('announcements', { message: 'A new user has joined!' });
	  socket.on('test', (data)=>{
	  	console.log(data);
	  });
	  // socket.on("join", (user)=> {
	  //   console.log(user.user); // this will contain only username of user/driver
	  //   sockets[user.user] = socket; // for driver and user to join socket
	  //   sockets[user.user].emit("socketConnected", { connected: true });
	  // });
	});
};

module.exports = socketIO;