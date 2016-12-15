'use strict';

import * as fs from "mz/fs";
import * as path from "path";
import * as vscode from 'vscode';

import createFileAssociation from "./fileAssociation";
import createTypeDefinition from "./typeDefinition";
import createJSConfiguration from "./jsconfiguration";
import * as wechatApp from "./wechatApp";

function checkWechatAppProj() {
    const appConfigFile = path.join(vscode.workspace.rootPath, "app.json");
    try {
        const data = fs.readFileSync(appConfigFile, 'utf-8');
        const config = JSON.parse(data);

        return config['pages'] && Array.isArray(config['pages']);
    } catch (err) {
        return false; 
    }
}

export function activate(context: vscode.ExtensionContext) {
    
    const isWechatAppProj = checkWechatAppProj();

    let disposable = vscode.commands.registerCommand('extension.previewWechatApp', () => {
        if (isWechatAppProj) {
            wechatApp.startPreviewWechatApp();
        } else {
            vscode.window.showErrorMessage('当前目录与小程序项目结构不符，请检查app.json')
        }
    });

    context.subscriptions.push(disposable);

    if (isWechatAppProj) {
        Promise.all([
            // 创建文件关联
            createFileAssociation(),
            // 安装wx.d.ts
            createTypeDefinition(),
            // 创建jsconfig.json
            createJSConfiguration()
        ]);
    }

}