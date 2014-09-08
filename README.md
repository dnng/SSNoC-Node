SSNoC User Interface
=========

Introduction

  - This repository contains code for browser part and Node.js server part.
  - SSNoC UI communicate with SSNoC JavaWS to store and retrieve business logic.
  - SSNoC UI support real time notification, message passing and status updating.



UI System Architecture
-----------

Introduction

* Front-end includes html5, css and javascript code to support platform independent redering.
* Back-end includes Node.js and Socket.io to support http request/response handling and real time features.

Installation
--------------

```sh
Install Node.js from http://nodejs.org/
git clone https://github.com/cmusv-fse/SSNoC-Node-UI
sudo npm install -g express
sudo npm install
sudo npm install -g supervisor
```
Run Server
--------------

```sh
sudo supervisor server.js
```

* To change the port on which node.js starts, please update line 21 of server.js file: `app.set("port", 80);` to provide the new port number.
* To change the port on which node.js should communicate with Java WS - update the port number on line 1 of `config/rest_api.js` : `var host_url = "http://localhost:1234/ssnoc";`
