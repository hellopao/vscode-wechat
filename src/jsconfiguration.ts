"use strict";

import * as path from "path";
import * as fs from "./libs/fs";
import * as vscode from "vscode";

export default function createJSConfiguration() {
    // 创建jsconfig.json
    const jsconfigDestDir = path.join(vscode.workspace.rootPath, "");
    const jsconfigSrcFile = path.join(__dirname, "../../jsconfig.json");
    
    fs.copyFile(jsconfigSrcFile, jsconfigDestDir)
        .catch(err => {
            vscode.window.showErrorMessage('Create jsconfig.json Failed: %s', err.message);
        })
                   
}