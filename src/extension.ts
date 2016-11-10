'use strict';

import * as fs from "./libs/fs";
import * as path from "path";
import * as vscode from 'vscode';

import createFileAssociation from "./fileAssociation";
import createTypeDefinition from "./typeDefinition";
import createJSConfiguration from "./jsconfiguration";
import * as wechatApp from "./wechatApp";

export function activate(context: vscode.ExtensionContext) {

    const appConfigFile = path.join(vscode.workspace.rootPath, "app.json");
    
    fs.readFile(appConfigFile)

        .then(data => {
            const config = JSON.parse(data);
            
            if(config['pages'] && Array.isArray(config['pages'])) {

                // 创建文件关联
                createFileAssociation();

                // 安装wx.d.ts
                createTypeDefinition();
                    
                // 创建jsconfig.json
                createJSConfiguration();


                let disposable = vscode.commands.registerCommand('extension.previewWechatApp', () => {
                    wechatApp.startPreviewWechatApp();
                });

                context.subscriptions.push(disposable);
            }
        })
            .catch(err => {
                vscode.window.showErrorMessage('Init Wechat App Project Failed: %s', err.message);
            })

}
