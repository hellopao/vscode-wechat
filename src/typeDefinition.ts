"use strict";

import * as path from "path";
import * as fs from "./libs/fs";
import * as vscode from "vscode";
const download = require('download');

const definitionFileUrl = "https://raw.githubusercontent.com/hellopao/wx.d.ts/master/wx.d.ts";
const typingsDestDir = path.join(vscode.workspace.rootPath, "typings");
const typingsSrcFile = path.join(__dirname, "../../wx.d.ts");

function copyDefinitionFile() {
    return download(definitionFileUrl, typingsDestDir)
        .then(() => {
        }, () => {
            return fs.copyFile(typingsSrcFile, typingsDestDir)
        })
}

export default function createTypeDefinition() {
    // 安装wx.d.ts
    fs.exsist(typingsDestDir) 
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
            vscode.window.showErrorMessage('Install wx.d.ts Failed: %s', err.message);
        })
                   
}