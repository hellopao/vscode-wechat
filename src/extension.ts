'use strict';

import * as fs from "fs";
import * as path from "path";

import * as vscode from 'vscode';

function exsist(dir) {
    return new Promise(resolve => {
        fs.exists(dir, exists => {
            return resolve(exists);
        })
    })
}

function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    })
}

function copyFile(file, dest) {
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

function readFile(file): Promise<string>{
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.toString());
        })
    })
}

export function activate(context: vscode.ExtensionContext) {

    const appConfigFile = path.join(vscode.workspace.rootPath, "app.json");
    
    readFile(appConfigFile)
        .then(data => {
            const config = JSON.parse(data);
            
            if(config['pages'] && Array.isArray(config['pages'])) {

                const configuration = vscode.workspace.getConfiguration().get('files.associations');
                
                // 添加文件关联：wxml->html, wxss->css
                vscode.workspace.getConfiguration()['update']('files.associations', Object.assign({}, configuration, {
                    "*.wxml": "html",
                    "*.wxss": "css"
                })).then(() => {}, err => {
                    vscode.window.showErrorMessage('Create Files Association Failed: %s', err)
                })
                
                // 安装wx.d.ts
                const typingsDestDir = path.join(vscode.workspace.rootPath, "typings");
                const typingsSrcFile = path.join(__dirname, "../../wx.d.ts");

                exsist(typingsDestDir) 
                    .then(exsists => {
                        if (exsists) {
                            return copyFile(typingsSrcFile, typingsDestDir)
                        }
                        return mkdir(typingsDestDir)
                            .then(() => {
                                return copyFile(typingsSrcFile, typingsDestDir)
                            })
                    })
                    .catch(err => {
                        vscode.window.showErrorMessage('Install wx.d.ts Failed: %s', err.message);
                    })
                    
                // 创建jsconfig.json
                const jsconfigDestDir = path.join(vscode.workspace.rootPath, "");
                const jsconfigSrcFile = path.join(__dirname, "../../jsconfig.json");
                
                copyFile(jsconfigSrcFile, jsconfigDestDir)
                    .catch(err => {
                        vscode.window.showErrorMessage('Create jsconfig.json Failed: %s', err.message);
                    })
            }
        })
            .catch(err => {
                vscode.window.showErrorMessage('Init Wechat App Project Failed: %s', err.message);
            })
}
