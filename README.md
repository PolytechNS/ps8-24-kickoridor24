# PS8

The code of this repo is split in 2 folders:
* api/ manages the server. It contains a server which differentiate REST requests from HTTP file requests, and so
return either files or REST responses accordingly.
* front/ contains static files that should be returned by the HTTP server mentioned earlier.

Both folders contain a README with more details.

---

## Requirements to run the project

* [Node.js](https://nodejs.org/) should be installed.
* The repo should have been cloned.
* [Docker compose](https://docs.docker.com/compose/install/) should be installed.

---


## All runs

Run `docker-compose up --build`. That's it, unless you need other scripts to run before or while the server is launched,
but then you (probably?) know what you are doing.