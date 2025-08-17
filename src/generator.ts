const verbs = [
    "get",
    "post",
    "put",
    "delete",
    "patch"
];
export const http = {
    verb: "input_verb",
    url: "input_url",
    headers: "input_headers",
    body: "input_body"    
};
export const SelectVerb = () => {
    return `
        <select id="${http.verb}">
            ${verbs.map(verb => `<option value="${verb}">${verb.toUpperCase()}</option>`).join('')}
        </select>
    `;
};
export const InputUrl = () => {
    return `
        <input type="text" id="${http.url}" placeholder="Enter URL" />
    `;
};
export const InputBody = () => {
    return `
        <textarea id="${http.body}" placeholder="Enter request body"></textarea>
    `;
};
function scriptJs() {
    return `<script>
		async function sendRequest() {
            const method = document.getElementById('input_verb').value;
            const url = document.getElementById('input_url').value;
            const body = document.getElementById('input_body').value;

            try {
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: method !== 'GET' && body ? body : undefined
                });
                const text = await res.text();
                document.getElementById('response').innerText = text;

                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.command) {
                        case 'teste':
                            console.log('teste feito');
                            break;
                    }
                });
                console.log(text);
            } catch (err) {
                document.getElementById('response').innerText = err;
                console.log(err);
            }
        }
	</script>`;
}