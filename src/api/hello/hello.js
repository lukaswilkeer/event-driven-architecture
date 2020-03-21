class Hello {
  constructor(socket, buffer) {
    this.socket = socket
    this.buffer = buffer
  }

  greeting() {
    this.socket.emit('message', `You're welcome ${this.buffer?.name}`)
  }
}

export default Hello
