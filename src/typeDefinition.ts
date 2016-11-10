"use strict";

import * as path from "path";
import * as fs from "./libs/fs";
import * as vscode from "vscode";

export default function createTypeDefinition() {
    // 安装wx.d.ts
    const typingsDestDir = path.join(vscode.workspace.rootPath, "typings");
    const typingsSrcFile = path.join(__dirname, "../../wx.d.ts");

    fs.exsist(typingsDestDir) 
        .then(exsists => {
            if (exsists) {
                return fs.copyFile(typingsSrcFile, typingsDestDir)
            }
            return fs.mkdir(typingsDestDir)
                .then(() => {
                    return fs.copyFile(typingsSrcFile, typingsDestDir)
                })
        })
        .catch(err => {
            vscode.window.showErrorMessage('Install wx.d.ts Failed: %s', err.message);
        })
                   
}