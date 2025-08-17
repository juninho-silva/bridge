import * as vscode from "vscode";
import InputBody from "./components/input-body";
import InputUrl from "./components/input-url";
import SelectVerb from "./components/select-verb";
import path from "path";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "bridge.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from Bridge!");
    }
  );

  context.subscriptions.push(disposable);

  const openWindow = vscode.commands.registerCommand(
    "bridge.openWindow",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "bridge",
        "Bridge",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      const scriptUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, "public", "events.js"))
      );

      const styleUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, "public", "style.css"))
      );

      const iconPath = vscode.Uri.file(
        path.join(context.extensionPath, "public/images", "icon.png")
      );
      panel.iconPath = iconPath;

      panel.webview.html = getWebviewContent(styleUri, scriptUri);
      panel.webview.onDidReceiveMessage(async (message) => {
        if (message.type === "request") {
          try {
            const response = await fetch(message.url, {
              method: message.method,
            });
            const statusCode = response.status;
            const json = await response.json();

            vscode.window.showInformationMessage(
              `👍 It's okay! @statusCode: ${statusCode}`
            );

            panel.webview.postMessage({
              type: "response",
              data: json,
            });
          } catch (err) {
            vscode.window.showErrorMessage(`👎 It's not okay!`);

            panel.webview.postMessage({
              type: "response",
              data: { error: err },
            });
          }
        }
      });
    }
  );

  context.subscriptions.push(openWindow);
}

export function deactivate() {};

function getWebviewContent(styleUri: vscode.Uri, scriptUri: vscode.Uri): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bridge</title>
	<link rel="stylesheet" href="${styleUri}">
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

		<script src="${scriptUri}"></script>
	</div>
</body>
</html>`;
};
