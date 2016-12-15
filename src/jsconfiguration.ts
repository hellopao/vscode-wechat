"use strict";

import * as path from "path";
import * as fs from "mz/fs";
import * as vscode from "vscode";

export default function createJSConfiguration() {
    // 创建jsconfig.json
    const jsconfigDestFile = path.join(vscode.workspace.rootPath, "jsconfig.json");
    const jsconfigSrcFile = path.join(__dirname, "../../jsconfig.json");
    
    return fs.readFile(jsconfigSrcFile)
        .then(data => {
            return fs.writeFile(jsconfigDestFile, data);
        })
        .catch(err => {
            vscode.window.showErrorMessage(`Create jsconfig.json Failed: %{err}`);
        })
                   
}