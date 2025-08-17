const SelectVerb = () => {
    const identifier = "input_verb";
    const verbs = [
        "get",
        "post",
        "put",
        "delete",
        "patch"
    ];

    return `
        <select id="${identifier}">
            ${verbs.map(verb => 
            `<option value="${verb}">
                <b>${verb.toUpperCase()}</b>
            </option>`).join('')}
        </select>
    `;
};
export default SelectVerb;