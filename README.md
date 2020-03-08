# Event-Driven api architecture

This repo is a demonstration of a evnet based architecture based on socket connections.

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

## About performance

This POC uses dinamaicaly imported modules, for every call you'll need to evaluate the role module, turns out there within large modules causes this to be ineficciente, both occur on a OOP implementation where evenry call mens a new instance of a module.

To resolve this, you'll need to do it manually, importing every module and declare every endpoint by hand, causing the role program to be evaluated one time, resulting on a benefit, the program doesn't "sobrecharge" with evaluating new modules at every income call or creating new instances.

## About system design

In contrast with an OOP design that can lead to a better code readability and organizations, the large cost of creating a new instance on every income call turns out not ideal, but can lead to a better code.

This can be supressed with an imperative design within DRY method, but can lead to problems with the maintence of the structure. One change on a commom function can break a lot of things. Same on a functional way, ([besides the cost](https://github.com/lukaswilkeer/event-driven-architecture/issues/3)), so, make sure that you write tests carefully, this guarantees your code integrity.

---------

*Note 1:* This is a work in progress demonstration.

*Note 2:* Lacks performance measurements to decide either manually or dinamcally. One improve the development and it's better to work with it. But dealing with performance, sometimes hard is much better.
