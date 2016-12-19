"use strict";

import * as fs from "mz/fs";
import * as path from "path";

export default function createCodeSnippets() {
    return fs.readFile(path.join(__dirname, '../../api.txt'), 'utf-8')
        .then(data => {
            let snippets = {};

            const cbTpl = data.match(/\bn\s+=\s+"(.*)";/)[1];

            data.replace(/\bo\s+=\s+"([^\(]+)(\(.*?)",[\s\S]*?i\s+=\s+"(.*?)"[,;]/g, (str, api, snippet, description) => {
                snippets[api] = {
                    snippet: `wx.${api}${snippet.replace(/"\s\+\sr\.cb\s\+\s"/, cbTpl)}`,
                    description
                }
                return str;
            });

            let wechat = {};

            Object.keys(snippets).forEach(api => {
                const {snippet, description} = snippets[api];

                let index = 0;

                wechat[`wx.${api}`] = {
                    prefix: `wx.${api}`,
                    body: snippet
                        .replace(/\{\{(.+?)\}\}/g, (str, placeholder) => {
                            index++;
                            return `${placeholder}$${index}`
                        })
                        .replace(/(\\n)\s{4}/g,'\t\t$1')
                        .replace(/(\\n)\s{2}/g,'\t$1')
                        .split('\\n'),
                    description
                }
            })

            return fs.writeFile(path.join(__dirname,'../../snippets/wechat.json'), JSON.stringify(wechat))
        })
        .catch(err => {
            console.log(`createCodeSnippets failed: ${err}`)
        })
}