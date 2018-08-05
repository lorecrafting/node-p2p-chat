const net = require("net");

const ENTRY_PEER = process.env.ENTRY_PEER;

let isGenesisNode = true;
const peerList = {};

if (ENTRY_PEER) {
  isGenesisNode = false;
  peerList[ENTRY_PEER] = true;
}
Object.keys(peerList).forEach(peerIp => {
  console.log("peerIp: ", peerList[peerIp]);
});
const server = net.createServer(socket => {
  const socketAddr = socket.address().address.split(":");
  const peerIp = socketAddr[3];

  peerList[peerIp] = true;
  Object.keys(peerList).forEach(peerAddr => {
    net.createConnection(6060, peerList[peerAddr], socket => {
      socket.write(`/addpeer ${peerIp}`);
    });
  });
  console.log("PeerList after Adding: ", peerList);
  socket.write("You have connected to node-p2p-chat system...");

  console.log("Connected: ", socketAddr);
  socket.on("data", data => {
    const msg = data.toString();
    if (msg.includes("/addpeer")) {
      const newPeerIp = msg.split(" ")[1];
      peerList[newPeerIp] = true;
    }
    console.log(msg);
    Object.keys(peerList).forEach(peerIp => {
      net.createConnection(6969, peerList[peerIp], socket => {
        socket.write("PING!");
      });
    });
  });
});

server.listen(6969, () => {
  console.log("PEER LISTENING ON 6969...");
});
