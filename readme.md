# React Project Base

A boilerplate for React projects, honed over several internal and client projects for speed of work and collaborative working. Ideally used in conjunction with Docker (example Dockerfile provided) for simple, disposable development environments and super quick deploys to Docker based staging/live servers.

## Features

### Components
- Componentised by default with example provided
- Components contain jsx, css and optionally tests
- Components can be developed in isolation using a sandbox.jsx and hitting '/components' url

### Application
- Uses browserify for modularisation
- Data flow adheres to the flux model using a single store to hold the whole state

### Server
- Served over HTTP but HTTPS can be manually configured
- Stylus is compiled on request

### Devops
- Full suite of commands provided (with a heavy slant towards Docker)
- Rethinkdb spun up automatically in separate linked container when using commands

### CSS
- Stylus extended with the Nib library
- Normalize for baselining css and some optional resets in '/helpers'


## Requirements

* OSX
* git
* node
* [VirtualBox](https://www.virtualbox.org/)
* [docker-machine](https://docs.docker.com/machine/)
* [docker](https://docs.docker.com/)
* [dockerhub](https://hub.docker.com/) account


## Environment Setup

1. Install `VirtualBox`
1. Install `docker-machine`
1. Install `docker` client
1. `docker-machine create --driver virtualbox dev` to create a new docker service running locally within VirtualBox
1. `$(docker-machine env dev)` to point your docker client to the newly created docker service
1. `docker login` to enable us to fetch images from dockerhub (please sign up if you do not have an account)

## Application Setup

1. Open VirtualBox and open the settings for the newly created `dev` vm
1. Under the 'Network' tab click 'Port Forwarding'
1. Leave any existing entries and add the following...
  ```
  Name    Protocol   Host IP    Host Port   Guest IP    Guest Port
  ================================================================
  app     TCP        0.0.0.0    8888        0.0.0.0     8888
  db      TCP        0.0.0.0    8080        0.0.0.0     8080
  ```
1. Clone repo and `cd` in
1. `rm -Rf .git` to remove association with react-project-base git repo
1. Update manifests (`package.json`, `bower.json`) with project details (most importantly `name` and `version`)
1. `alias t="./bin/tasks"` to create a shortcut to the project task runner in the current shell
1. `t build` to prepare the app image
1. `t run` to initialise the db/app containers
1. `t compile` to compile the application code


## Usage

* [`http://localhost:8888/`](http://localhost:8888/) for the application
* `t compileApp` after any change to application js
* `t compileVendors` after any new vendor libs added
* `t restart` after any change to server js
* The stylus will recompile automatically on each request
* [`http://localhost:8080/`](http://localhost:8080/) for the lovely rethinkdb web interface

## Troubleshooting

* If `docker` is giving you a socket error ensure your docker server VM is running
  * `docker-machine ls` to view the state of your VM
  * `docker-machine start dev` to start up VM named `dev`
* If `docker` seems to not be responding ensure you have associated your docker client with a docker server.
  * `$(docker-machine env dev)` to point your docker client to your docker server instance running in VM `dev`
