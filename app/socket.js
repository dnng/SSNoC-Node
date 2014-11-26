module.exports = function(_, io, participants) {
  io.on("connection", function(socket){
    socket.on("newUser", function(data) {
      console.log("socket data is:" + JSON.stringify(data));
      participants.online[data.id] = {'userName' : data.name, 'lastStatus': data.lastStatus};
      io.sockets.emit("newConnection", {participants: participants});
    });

    socket.on("disconnect", function() {
      delete participants.online[socket.id];
      io.sockets.emit("userDisconnected", {id: socket.id, sender:"system", participants:participants});
    });

  });
};
