"use strict";

const portfinder = require('portfinder');
const detect = require('detect-port');

portfinder.basePort = 30000;

export function getFreePort() {
    return new Promise((resolve, reject) => {
        portfinder.getPort(function (err, port) {
            if (err) {
                return reject(err);
            }
            resolve(port);
        });
    })
}

export function isFreePort(port) {
    port = parseInt(port);
    return detect(port)
        .then(_port => {
            return port === _port;
        })
}