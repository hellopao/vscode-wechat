"use strict";

import * as path from "path";
import * as child_process from "child_process";
import * as fs from "mz/fs";
import * as vscode from "vscode";

import * as portServices from "./libs/port";

const previewContentTpl = path.join(__dirname, "../../index.html");
const previewContent = path.join(__dirname, "../../content.html");
const previewUri = vscode.Uri.parse(`file:///${previewContent}`);

export function startWechatAppServer(port): PromiseLike<any> {
    return new Promise((resolve, reject) => {
        let cp = child_process.exec(`node ${path.join(__dirname, "../../node_modules/wept/bin/wept")} --port ${port}`, {
            cwd: vscode.workspace.rootPath,
            encoding: "utf-8"
        });

        cp.stdout.once('data', data => {
            resolve();
        });

        cp.stderr.on('data', err => {
            reject(err);
        })
    });
}

export function formatPreviewerContent(port) {
    return fs.readFile(previewContentTpl)
        .then(data => {
            return fs.writeFile(previewContent, data.toString().replace("$$PORT$$", port.toString()))
    })
}

export function createPreviewer() {
    const viewColumn = +vscode.window.activeTextEditor.viewColumn;

    return vscode.commands.executeCommand('vscode.previewHtml', previewUri, Math.min(viewColumn + 1, vscode.ViewColumn.Three), "wechat App")
}

export function registerServer(port) {
    return fs.writeFile(path.join(__dirname, "../../port"), port);
}

export function getRunningServer() {
    return fs.readFile(path.join(__dirname, "../../port"))
        .then(data => {
            return portServices.isFreePort(data.toString())
                .then(res => {
                    return !res;
                });
        })
        .catch(err => {
            return false;
        })
}

export function startPreviewWechatApp() {

    return getRunningServer()
        .then(running => {
            if (running) {
                return createPreviewer();                    
            }
            return portServices.getFreePort()
                .then(port => {
                    return Promise.all([
                        formatPreviewerContent(port), 
                        startWechatAppServer(port)
                    ])
                    .then(() => {
                        return Promise.all([createPreviewer(), registerServer(port)]);                    
                    })
                })
        })
        .catch(err => {
            vscode.window.showErrorMessage(`小程序预览失败,请稍后再试, 错误原因: ${err}`)
        })
    
}

