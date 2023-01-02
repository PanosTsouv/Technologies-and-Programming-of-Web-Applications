window.onload = function onLoadfunctions(){
    addFunctionToSearchButton()
};

function addFunctionToSearchButton()
{
    var keywords = ""
    const searchButton = document.getElementById('search');
    searchButton.addEventListener("click", function(){
        document.getElementById('results').innerHTML = '';
        document.getElementById('results_header').innerHTML = "Loading....";
        keywords = document.getElementById('keywords').value;
        document.getElementById('keywords').value = ''
        const url = 'https://reststop.randomhouse.com/resources/works?search=' + keywords;

        makeARequestWithSpecificKeywords(keywords)
    })
}

function makeARequestWithSpecificKeywords(keywords)
{
    const url = 'https://reststop.randomhouse.com/resources/works?max=40&search=' + keywords;

    serchRequestWithKeywords(url, keywords)
}

function saveButtonAction(saveButton, undoButton, book)
{
    saveButton.addEventListener("click", function(){
        saveRequest(saveButton, undoButton, book)
    })
}

function undoButtonAction(undoButton, id)
{
    undoButton.addEventListener("click", function(){
        deleteRequest(id, undoButton)
    })
}