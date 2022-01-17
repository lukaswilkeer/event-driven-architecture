export const getAuthHeader = (socket) => {
  return socket?.handshake?.headers?.authorization;
};

export const getData = (decoded) => {
  return decoded?.data;
};
