"use strict";

import * as vscode from "vscode";

const FileAssociationCongigurationKey = "files.associations";

export default function createFileAssociation() {
    const configuration = vscode.workspace.getConfiguration();

    const currConfig = configuration.get(FileAssociationCongigurationKey);

    if (currConfig['*.wxml'] === "html" && currConfig['*.wxss'] === "css") {
        return;
    }
    // 添加文件关联：wxml->html, wxss->css
    return configuration['update'](FileAssociationCongigurationKey, Object.assign({}, currConfig, {
        "*.wxml": "html",
        "*.wxss": "css"
    })).then(() => {}, err => {
        vscode.window.showErrorMessage(`Create Files Association Failed: ${err}`)
    })
}