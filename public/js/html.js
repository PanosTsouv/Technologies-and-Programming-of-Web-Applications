function addABookInListWithResults(work, ul, img_src)
{
    let div = createNode('div');
    let div_button = createNode('div');
    let li = createNode('li');
    let titleweb = createNode('p');
    let img = createNode('img');
    let authorweb = createNode('p');
    let saveButton = createInput('button', "save" + work.workid, "save", "", "block");
    let undoButton = createInput('button', "undo" + work.workid, "undo", "", "none");

    div.setAttribute("class", "text_container");
    div_button.setAttribute("class", "button_container");
    img.src = img_src
    titleweb.innerHTML = work.titleweb;
    authorweb.innerHTML = work.authorweb;

    append(li, div);
    append(div, titleweb);
    append(div, authorweb);
    append(li, img);
    append(li, div_button);
    append(div_button, saveButton);
    append(div_button, undoButton);
    append(ul, li);
}
function createInput(typeContent, idContent, classContent, valueContent, display)
{
    let button = createNode('INPUT');
    button.setAttribute("type", typeContent);
    button.setAttribute("id", idContent);
    button.setAttribute("class", classContent);
    button.setAttribute("value", valueContent);
    button.style.display = display;
    return button;
}

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}