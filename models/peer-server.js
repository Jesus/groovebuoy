const Peer = require('./peer');
const Room = require('./room');

class PeerServer {
  constructor({websocket}) {
    this.websocket = websocket;
    this.peers = [];
    this.rooms = [];

    this.websocket.on('connection', this._handleNewConnection);
  }

  ////
  // Websocket server event helpers
  //
  _handleNewConnection = (socket) => {
    const peer = new Peer({socket, server: this});
    this.peers.push(peer);

    socket.on('close', () => {
      if (peer.room !== null) {
        peer.room.removePeer(peer);
      }

      const i = this.peers.indexOf(peer);
      this.peers.splice(i, 1);
      console.log('Connection closed');
    });

    console.log(`New connection established: ${peer.id}`);
  }

  ////
  // Peer-invoked methods
  //
  createRoom = ({name}) => {
    const room = new Room({name, server: this});
    this.rooms.push(room);
    return room;
  }

  ////
  // Lifecycle methods
  //
  removeRoom = ({room}) => {
    const index = this.rooms.indexOf(room);
    this.rooms.splice(index, 1);
  }
}

module.exports = PeerServer;
