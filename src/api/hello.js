export const greeting = (socket, data) => {
  const name = data?.name;

  if (name !==  undefined) {
    socket.emit("message", `You're welcome ${name}`);
  } else {
    socket.emit("message", "Name is not defined");
  }

};
