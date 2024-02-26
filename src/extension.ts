import { commands, window, TextEditorEdit, ExtensionContext, languages, CompletionItem, StatusBarAlignment, StatusBarItem } from 'vscode';
import axios from 'axios';

let myStatusBarItem: StatusBarItem;

export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand('KesimAiAutopilot.helloWorld', async () => {
        const editor = window.activeTextEditor;
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
                editor.edit((editBuilder: TextEditorEdit) => {
                    editBuilder.insert(selection.start, completion);
                });
                
            } catch (error) {
                console.error(error);
            }
        }
    });

    context.subscriptions.push(disposable);

    // Register a completion item provider for JavaScript
    languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems() {
            // TODO: Implement your autocomplete logic here
            return [new CompletionItem('YourCompletionItem')];
        }
    });

    // Create a status bar item
    myStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
    myStatusBarItem.command = 'KesimAiAutopilot.helloWorld';
    context.subscriptions.push(myStatusBarItem);

    // Show the status bar item
    myStatusBarItem.show();
}

export function deactivate() {
    // Hide the status bar item
    myStatusBarItem.hide();
}
