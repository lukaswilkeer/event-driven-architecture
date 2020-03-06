# Event-Driven api architecture

This repo is a demonstration of a evnet based architecture based on socket connections.

_Note:_ This is a OOP version of a event-driven-architecture

## Main goal

Demonstrate that is possible to mantain a large event-driven api without pain.

## Principle

The system is designed on top on ES modules, and currecntley have a imperative style implementation. It uses a event dispatacher to match the query call with the correspondent module/function to be executed.

The system responds an api call via a protocol spec, where, by definition, have two specifications: _event_ and _data_.
The _event_ is correspondend to a system function call, and _data_ where data to be processed (base64+gzip, json, arays, Buffers, etc).

Example os a event call:

```json
{ "event": "api.services.test.testFunc", "data": "You`re welcome" }
```

To call, just emit a 'event' call from the socket client connect.

```
client.emit('event', buffer)
```

This way, the system matches for the current testFunc inside test module and send a socket instance with a buffer to be processed.
On the other way, this causes a problem. The system cannot handle stream events.


*Note:* This is a work in progress demonstration.
