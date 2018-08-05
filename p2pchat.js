const net = require("net");

const ENTRY_PEER = process.env.ENTRY_PEER;

let isGenesisNode = true;
const peerList = [];

if (ENTRY_PEER) {
  isGenesisNode = false;
  peerList.push(ENTRY_PEER);
}

const server = net.createServer(socket => {
  const socketAddr = socket.address().address.split(":");
  const peerIp = socketAddr[3];

  peerList.push(peerIp);
  console.log("Connected: ", socketAddr);
  socket.on("data", data => {
    const msg = data.toString();
    peerList.forEach(peerIp => {
      net.createConnection(6969, peerIp, socket => {
        socket.write(msg);
      });
    });
  });
});

server.listen(6969, () => {
  console.log("PEER LISTENING ON 6969...");
});
