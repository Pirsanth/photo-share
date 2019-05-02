var proxy = require('http-proxy-middleware');
var env = require("dotenv");
env.config();

const backendPort = +process.env.NODE_BACKEND_PORT;
const backendUrl = `http://localhost:${backendPort}`;


const regex = /^\/api\//;
function removeApiFromPaths(path, req){
  return path.replace(regex, "/");
}

const proxyOptions = {
      target: backendUrl,
      pathRewrite: removeApiFromPaths
};

const browserSyncPort = +process.env.BROWSER_SYNC_PORT;
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 --server \"PhotoShare/dist/PhotoShare\""
 */
module.exports = {
    "ui": {
        "port": 3001
    },
    "files": false,
    "watchEvents": [
        "change"
    ],
    "watch": false,
    "ignore": [],
    "single": true,
    "watchOptions": {
        "ignoreInitial": true
    },
    "server": "PhotoShare/dist/PhotoShare",

    proxy: false,

    "port": browserSyncPort,

    "middleware": [{
      route: "/api",
      handle: proxy(proxyOptions)
    }],

    "serveStatic": [],
    "ghostMode": {
        "clicks": true,
        "scroll": true,
        "location": true,
        "forms": {
            "submit": true,
            "inputs": true,
            "toggles": true
        }
    },
    "logLevel": "info",
    "logPrefix": "Browsersync",
    "logConnections": false,
    "logFileChanges": true,
    "logSnippet": true,
    "rewriteRules": [],
    "open": "local",
    "browser": "default",
    "cors": false,
    "xip": false,
    "hostnameSuffix": false,
    "reloadOnRestart": false,
    "notify": true,
    "scrollProportionally": true,
    "scrollThrottle": 0,
    "scrollRestoreTechnique": "window.name",
    "scrollElements": [],
    "scrollElementMapping": [],
    "reloadDelay": 0,
    "reloadDebounce": 500,
    "reloadThrottle": 0,
    "plugins": [],
    "injectChanges": true,
    "startPath": null,
    "minify": true,
    "host": null,
    "localOnly": false,
    "codeSync": true,
    "timestamps": true,
    "clientEvents": [
        "scroll",
        "scroll:element",
        "input:text",
        "input:toggles",
        "form:submit",
        "form:reset",
        "click"
    ],
    "socket": {
        "socketIoOptions": {
            "log": false
        },
        "socketIoClientConfig": {
            "reconnectionAttempts": 50
        },
        "path": "/browser-sync/socket.io",
        "clientPath": "/browser-sync",
        "namespace": "/browser-sync",
        "clients": {
            "heartbeatTimeout": 5000
        }
    },
    "tagNames": {
        "less": "link",
        "scss": "link",
        "css": "link",
        "jpg": "img",
        "jpeg": "img",
        "png": "img",
        "svg": "img",
        "gif": "img",
        "js": "script"
    }
};
