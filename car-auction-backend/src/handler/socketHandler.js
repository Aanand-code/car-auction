function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-auction', (auctionID) => {
      socket.join(auctionID);
      console.log(`Client ${socket.id} joined auction ${auctionID}`);
    });
    socket.on('leave-auction', (auctionID) => {
      socket.leave(auctionID);
      console.log(`Client ${socket.id} leave the auction ${auctionID}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
module.exports = socketHandler;
