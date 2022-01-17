import sinon from "sinon";
import chai from "chai";
import { expect } from "chai";
import socketClient from "socket.io-client";
import io from "../index";
import { socketConnect } from "./__mocks__/connect";
import { userToken } from "./__mocks__/tokens";

describe("Connection", () => {
  it("should connect the user to the api", (done) => {
    const client = socketConnect(userToken);

    // get the clients connections
    let connections = [];
    Object.keys(io.engine.clients).map((key) => {
      connections[key] = io.engine.clients[key];
    });
    
    client.on("connect", (socket) => {
      expect(connections.length).to.be.gte(0);
      done();
    });
  });

  it("should block connection for unauthorized users", (done) => {
    let connections = [];
    
    // get the clients connections
    Object.keys(io.engine.clients).map((key) => {
      connections[key] = io.engine.clients[key];
    });

    const authorization = false;
    const client = socketConnect(authorization);

    expect(connections.length).to.be.eql(0);
    done();
  });

  it("should block users without permission headers", (done) => {
    const client = socketClient("http://localhost:3000", {
      path: "/",
      transports: ["pooling", "websocket"]
    });

    let connections = [];
    Object.keys(io.engine.clients).map((key) => {
      connections[key] = key;
    });

    expect(connections.length).to.equals(0);
    done();
  });

  it("should call services", (done) => {
    const client = socketConnect(userToken);

    const event = { event: "api.services.status" };

    client.emit("event", event);

    client.on("message", (data) => {
      expect(data).to.equals("online");
      done();
    });
  });

  it("should return an error message if a endpoint doesn`t exist", (done) => {
    const client = socketConnect(userToken);

    const event = {
      event: "api.service.test.testFuncFn",
      data: "You`re welcome"
    };

    client.emit("event", event);

    client.on("message", (data) => {
      expect(data).to.equals("TestFuncFn doesn't exist");
      done();
    });
  });

  it("should return an error message if a endpoint is nullish", (done) => {
    const client = socketConnect(userToken);

    const event = {
      data: "You`re welcome"
    };

    client.emit("event", event);

    client.on("message", (data) => {
      expect(data).to.equals("Event cannot be empty");
      done();
    });
  });
});
