class Test {
  constructor(socket, buffer) {
    this.socket = socket
    this.buffer = buffer
  }

  testFunc() {
    console.log('Executando a função')
    this.socket.emit('message', this.buffer?.data)
  }
}

export default Test
