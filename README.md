# redux-worker
My third attempt to implement a redux application. Using [stressing-redux](https://github.com/jscriptcoder/stressing-redux), this time I'm moving the business logic layer into a Web Worker, leaving the UI layer in the main thread. It definitely improves the performance, although I see some issues when interacting with the app (scrolling, dragging range control). But definitely an interesting proof of concept where Redux helps a lot to make such separation an easy task.

The program is writen TypeScript using ES6 Module System, built with Webpack, and has RxJS and Redux as main dependencies.

[Click here for demo](https://toast-scale.codio.io/)

## Download source
Open a terminal or command line and run following commands:
```shell
$ git clone https://github.com/jscriptcoder/redux-worker.git
$ cd redux-worker
```

##Installing and running
```shell
$ npm install
$ npm run start
```

Have fun :-)
