const vscode = acquireVsCodeApi();

// Send req
document.getElementById("send").addEventListener("click", () => {
  const method = document.getElementById("input_verb").value;
  const url = document.getElementById("input_url").value;
  const body = document.getElementById("input_body").value;

  vscode.postMessage({ type: "request", method, url, body });
});

window.addEventListener("message", (event) => {
  const message = event.data;
  if (message.type === "response") {
    document.getElementById("response").textContent = JSON.stringify(
      message.data,
      null,
      2
    );
  }
});

const selectVerb = document.getElementById("input_verb");
selectVerb.addEventListener("change", () => {
    switch (selectVerb.value) {
        case "get":
            selectVerb.style.backgroundColor = "#2ecc71";
            selectVerb.style.color = "white";
            break;
        case "post":
            selectVerb.style.backgroundColor = "#f1c40f";
            selectVerb.style.color = "black";
            break;
        case "put":
            selectVerb.style.backgroundColor = "#9b59b6";
            selectVerb.style.color = "white";
            break;
        case "delete":
            selectVerb.style.backgroundColor = "#d9534f";
            selectVerb.style.color = "white";
            break;
        case "patch":
            selectVerb.style.backgroundColor = "#e67e22";
            selectVerb.style.color = "white";
    }
});


