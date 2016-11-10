"use strict";

import * as fs from "fs";
import * as path from "path";

export function exsist(dir) {
    return new Promise(resolve => {
        fs.exists(dir, exists => {
            return resolve(exists);
        })
    })
}

export function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    })
}

export function copyFile(file, dest) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(file);
        const writeStream = fs.createWriteStream(path.resolve(dest, path.basename(file)));
        
        readStream.on('error', err => {
            reject(err);
        });

        writeStream.on('error', err => {
            reject(err);
        });

        writeStream.on('finish', () => {
            resolve();
        });

        readStream.pipe(writeStream);
    })

}

export function readFile(file): Promise<string>{
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.toString());
        })
    })
}


export function writeFile(file, data): Promise<any>{
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    })
}