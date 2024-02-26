import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.helloWorld', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const text = document.getText(selection);

            // Prepare the data for the DeepSeek API
            let data = JSON.stringify({
                "messages": [
                    {
                        "content": "You are a helpful assistant",
                        "role": "system"
                    },
                    {
                        "content": text,
                        "role": "user"
                    }
                ],
                "model": "deepseek-coder",
                "frequency_penalty": 0,
                "max_tokens": 2048,
                "presence_penalty": 0,
                "stop": null,
                "stream": false,
                "temperature": 1,
                "top_p": 1
            });

            // Prepare the config for the axios request
            let config = {
                method: 'post',
                url: 'https://api.deepseek.com/v1/chat/completions',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json', 
                    'Authorization': 'Bearer sk-5e9cd267d35644568ab55ba6f766f5a1'
                },
                data : data
            };

            // Make the request to the DeepSeek API
            try {
                const response = await axios(config);
                const completion = response.data;

                // Insert the completion at the current cursor position
                editor.edit(editBuilder => {
                    editBuilder.insert(selection.start, completion);
                });
            } catch (error) {
                console.error(error);
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
