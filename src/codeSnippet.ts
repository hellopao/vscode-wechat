"use strict";

import * as fs from "mz/fs";
import * as path from "path";
import * as crypto from "crypto";
import * as vscode from "vscode";

const wechatSnippetFile = path.join(__dirname,'../../snippets/wechat.json');
const configSnippetFile = path.join(__dirname,'../../snippets/config.json');

export function getWechatApiSnippets() {
    return fs.readFile(path.join(__dirname, '../../api.txt'), 'utf-8')
        .then(data => {
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
                            return `$\{${index}:${placeholder}}`
                        })
                        .split('\\n'),
                    description
                }
            });

            return JSON.stringify(wechat);
        })
}

export function getCurrentSnippets(){
    return fs.exists(wechatSnippetFile)
        .then(exists => {
            if (exists) {
                return fs.readFile(wechatSnippetFile, 'utf-8');
            }
            return Promise.resolve("");
        })
}

export function getConfigSnippets(){
    return fs.readFile(path.join(__dirname, '../../config.txt'), 'utf-8')
        .then(data => {
            let snippets = {};

            data.replace(/\br\s+=\s+"([^"]+)",[\s\S]*?o\s+=\s+"(.*?)",[\s\S]*?i\s+=\s+'(.*?)';/g, (str, item, description, snippet) => {
                snippets[item] = {
                    snippet,
                    description
                }
                return str;
            });

            let config = {};

            Object.keys(snippets).forEach(item => {
                const {snippet, description} = snippets[item];

                let index = 0;

                config[item] = {
                    prefix: item,
                    body: snippet
                        .replace(/(\\n) {4}/g,'$1\t\t')
                        .replace(/(\\n) {2}/g,'$1\t')
                        .replace(/\{\{(.+?)\}\}/g, (str, placeholder) => {
                            index++;
                            return `$\{${index}:${placeholder}}`
                        })
                        .split('\\n'),
                    description
                }
            });

            return JSON.stringify(config);
        })

}

export default function createCodeSnippets() {
    return Promise.all([getCurrentSnippets(), getWechatApiSnippets(), getConfigSnippets()])
        .then(results => {
            const [current, wechatSnippets, configSnippets] = results;
            if (crypto.createHash('md5').update(current).digest('hex') === crypto.createHash('md5').update(wechatSnippets).digest('hex')) {
                return; 
            }
            return Promise.all([
                fs.writeFile(wechatSnippetFile, wechatSnippets),
                fs.writeFile(configSnippetFile, configSnippets)
            ]); 
        })
        .catch(err => {
            console.log(`createCodeSnippets failed: ${err}`)
        })
}