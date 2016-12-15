"use strict";

import * as path from "path";
import * as fs from "mz/fs";
import * as vscode from "vscode";
const download = require('download');

const definitionFileUrl = "https://raw.githubusercontent.com/hellopao/wx.d.ts/master/wx.d.ts";
const typingsDestDir = path.join(vscode.workspace.rootPath, "typings");
const typingsDestFile = path.join(typingsDestDir, "wx.d.ts");
const typingsSrcFile = path.join(__dirname, "../../wx.d.ts");

function copyDefinitionFile() {
    return Promise.race([
        download(definitionFileUrl, typingsDestDir),
        new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 5000);
        })
    ])
        .then(() => {
        }, () => {
            return fs.readFile(typingsSrcFile)
                .then(data => {
                    return fs.writeFile(typingsDestFile, data);
                })
        })
}

export default function createTypeDefinition() {
    // 安装wx.d.ts
    return fs.exists(typingsDestDir) 
        .then(exsists => {
            if (exsists) {
                return copyDefinitionFile();
            }
            return fs.mkdir(typingsDestDir)
                .then(() => {
                    return copyDefinitionFile();
                })
        })
        .catch(err => {
            vscode.window.showErrorMessage(`Install wx.d.ts Failed: ${err}`);
        })
                   
}