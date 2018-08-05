const net = require("net");

const ENTRY_PEER = process.env.ENTRY_PEER;
const PORT = process.env.PORT || 6969;

let isGenesisNode = true;
const peerList = {};

if (ENTRY_PEER) {
  isGenesisNode = false;
  peerList[ENTRY_PEER] = true;
}
console.log("Initial peerList: ", peerList);
const server = net.createServer(socket => {
  const socketAddr = socket.address().address.split(":");
  const peerIp = socketAddr[3];

  peerList[peerIp] = true;
  Object.keys(peerList).forEach(peerAddr => {
    console.log("initial connection debug, peerAddr", peerAddr);
    net.createConnection(PORT, peerAddr, socket => {
      socket.write(`/addpeer ${peerIp}`);
    });
  });
  console.log("PeerList after Adding: ", peerList);
  socket.write("You have connected to node-p2p-chat system...");

  console.log("Connected: ", socketAddr);
  socket.on("data", data => {
    const msg = data.toString();
    console.log("Incoming msg: ", msg);
    if (msg.includes("/addpeer")) {
      const newPeerIp = msg.split(" ")[1];
      peerList[newPeerIp] = true;
    }
    console.log(msg);
    Object.keys(peerList).forEach(peerIp => {
      net.createConnection(PORT, peerIp, socket => {
        socket.write("PING!");
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(`PEER LISTENING ON ${PORT}...`);
});
