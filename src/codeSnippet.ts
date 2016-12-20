"use strict";

import * as fs from "mz/fs";
import * as path from "path";
import * as vscode from "vscode";

export function getWechatApiSnippets(data) {
    let snippets = {};

    const cbTpl = data.match(/\bn\s+=\s+"(.*)";/)[1];

    data.replace(/\b[no]\s+=\s+"([^\(]+)(\(.*?)",[\s\S]*?[ir]\s+=\s+"(.*?)"[,;]/g, (str, api, snippet, description) => {
        snippets[api] = {
            snippet: `${snippet.replace(/"\s\+\sr\.cb\s\+\s"/, cbTpl)}`,
            description
        }
        return str;
    });

    let wechat = {};

    Object.keys(snippets).forEach(api => {
        const {snippet, description} = snippets[api];

        let index = 0;
        const key = ["App", "Page"].indexOf(api) === -1 ? `wx.${api}`: api;

        wechat[key] = {
            prefix: key,
            body: `${key}${snippet}`
                .replace(/(\\n) {4}/g,'$1\t\t')
                .replace(/(\\n) {2}/g,'$1\t')
                .replace(/\{\{(.+?)\}\}/g, (str, placeholder) => {
                    index++;
                    return `${placeholder}$${index}`
                })
                .split('\\n'),
            description
        }
    });

    return wechat;
}

export default function createCodeSnippets() {
    return fs.readFile(path.join(__dirname, '../../api.txt'), 'utf-8')
        .then(data => {
           
            const wechat = getWechatApiSnippets(data);

            return fs.writeFile(path.join(__dirname,'../../snippets/wechat.json'), JSON.stringify(wechat))
        })
        .catch(err => {
            console.log(`createCodeSnippets failed: ${err}`)
        })
}