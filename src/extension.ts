import * as vscode from 'vscode';
import { InputBody, InputUrl, SelectVerb } from './generator';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('bridge.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Bridge!');
	});

	context.subscriptions.push(disposable);
	
	const openWindow = vscode.commands.registerCommand('bridge.openWindow', () => {
		const panel = vscode.window.createWebviewPanel(
			'bridge',
			'Bridge',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);
		panel.webview.html = getWebviewContent();
		panel.webview.onDidReceiveMessage(async message => {
			if (message.type === 'request') {
              	vscode.window.showInformationMessage(message.url);
				console.log("teste");
				try {
					const response = await fetch(message.url, {
              			method: message.method
            		});
            		const json = await response.json();

            		panel.webview.postMessage({
              			type: "response",
              			data: json
            		});
				} catch (err) {
            		panel.webview.postMessage({
              			type: "response",
              			data: { error: err }
            		});
          		}
			}
		});
	});

	context.subscriptions.push(openWindow);
}

export function deactivate() {};

function getWebviewContent(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bridge</title>
	<style>

body {
  margin: 0;
  background-color: #1e1e1e;
  color: #f5f5f5;
  font-family: Arial, sans-serif;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 10px;
  gap: 10px;
}

/* Request Bar */
.request-bar {
  display: flex;
  gap: 8px;
}

.request-bar select {
  width: 100px; /* tamanho fixo para os verbos */
  padding: 8px;
  background: #2c2c2c;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}

.request-bar input {
  flex: 1; /* ocupa todo espaço disponível */
  padding: 8px;
  background: #2c2c2c;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}

.request-bar button {
  background: #007acc;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.request-bar button:hover {
  background: #005fa3;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #333;
  padding-bottom: 4px;
}

.tabs button {
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
}

.tabs button:hover {
  color: #fff;
  border-bottom: 2px solid #007acc;
}

/* Body Editor */
textarea {
  background: #2c2c2c;
  color: #00ff9d;
  font-family: monospace;
  font-size: 14px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  resize: vertical;
  min-height: 150px;
}

/* Response */
.response {
  flex: 1;
  background: #2c2c2c;
  border-radius: 4px;
  padding: 10px;
  overflow: auto;
}

.response pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #00e676;
}
    </style>
</head>
<body>
	<div class="container">
    	<h1>Bridge</h1>

	
		<div class="request-bar">
        		${SelectVerb()}
        		${InputUrl()}
        		<button id="send">Send</button>
    		</div>

			<div class="tabs">
        		<button>Params</button>
        		<button>Headers</button>
        		<button>Body</button>
    		</div>
	
			${InputBody()}
	
			<div class="response">
				<pre id="response"></pre>
			</div>

		<script>
			const vscode = acquireVsCodeApi();
			document.getElementById('send')
				.addEventListener('click', () => {
					const method = document.getElementById('input_verb').value;
					const url = document.getElementById('input_url').value;
					const body = document.getElementById('input_body').value;

					vscode.postMessage({ type: 'request', method, url, body });
				});

			window.addEventListener('message', event => {
        	const message = event.data;
        	if (message.type === "response") {
          		document.getElementById('response').textContent = JSON.stringify(message.data, null, 2);
        	}
      });
		</script>
	</div>
</body>
</html>`;
};

