function serchRequestWithKeywords(url, keywords)
{
    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    let init = {
        mode : "cors",
        method: "GET",
        headers : myHeaders
    }

    fetch(url, init)
    .then(resp => resp.json())
    .then(function(data) {
        console.log("Results from book api request are : ", data)
        let works = data.work;
        if(data.hasOwnProperty('work'))
        {
            document.getElementById('results_header').innerHTML = 'Results for keywords "' + keywords + '"';
            for(let work of works)
            {
                const ul = document.getElementById('results');
                let img_src = ''
                if(Array.isArray(work.titles.isbn))
                {
                    img_src = 'https://reststop.randomhouse.com/resources/titles/' + work.titles.isbn[0]['$']
                }
                else
                {
                    img_src = 'https://reststop.randomhouse.com/resources/titles/' + work.titles.isbn.$
                }
                addABookInListWithResults(work, ul, img_src)
                saveButtonAction(document.getElementById('save' + work.workid), document.getElementById('undo' + work.workid), {
                    id : work.workid,
                    title : work.titleweb,
                    author : work.authorweb,
                    image : img_src
                });
                undoButtonAction(document.getElementById('undo' + work.workid), work.workid)
            }
        }
        else
        {
            document.getElementById('results_header').innerHTML = 'No results found for keywords "' + keywords + '"';
        }
    })
    .catch(function(error) {
        console.log(error);
        document.getElementById('results_header').innerHTML = "Bad request. Add some keywords";
    });
}

function saveRequest(saveButton, undoButton, book)
{
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    console.log("Save Request As Object is : \n", book)
    let init = {
        mode : "cors",
        method: "POST",
        headers : myHeaders,
        body: JSON.stringify(book)
    }
    console.log("Save Request As JSON is : \n", 
                JSON.stringify(book))

    fetch('http://localhost:8080/book', init)
    .then(function(response){ 
        if(response.status == "409")
        {
            console.log("Response From Save Request Is : \n",
                    response)
            alert('Book aleady exist')
            undoButton.style.display = "block";
            saveButton.style.display = "none";
            throw new Error("Status 409")
        }
        else
        {
            console.log("Response From Save Request Is : \n",
                    response)
            return response.json()
        }
    })
    .then(data => {
        console.log('Success:', data);
        undoButton.style.display = "block";
        saveButton.style.display = "none";
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteRequest(id, undoButton)
{
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let init = {
        mode : "cors",
        method: "DELETE",
        headers : myHeaders
    }

    console.log("Request delete book with id : ", id )
    
    fetch('http://localhost:8080/book/' + id, init)
    .then(response => {
        console.log("Response From Delete Request Is : \n",
                    response)
        return response.json()
    })
    .then(data => {
        console.log('Success:', data);
        if(undoButton != undefined)
        {
            undoButton.style.display = "none";
            document.getElementById('save' + id).style.display = 'block';
        }
        else
        {
            document.getElementById('li' + id).style.display = 'none';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function detailsRequest(id)
{
    console.log("Request details of book with id :", id )
    window.location = 'http://localhost:8080/books/details/' + id
}

function filterRequest(keywords)
{
    keywords = keywords.toLowerCase()
    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    let init = {
        mode : "cors",
        method: "GET",
        headers : myHeaders
    }
    setTimeout(() => {
        if(keywords === "")
        {
            for(let li of document.querySelectorAll("li"))
            {
                li.style.display = 'grid'
            }
            return
        }
        fetch('http://localhost:8080/books/' + keywords.toLowerCase(), init)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let liList = document.querySelectorAll("li")
            for(let li of liList)
            {
                liExistInbook = false;
                let liId = li.getAttribute("id").substring(2)
                for(book of data)
                {
                    if(book.id === liId)
                    {
                        liExistInbook = true
                        break
                    }
                }
                if(liExistInbook)
                {
                    li.style.display = 'grid'
                }
                else
                {
                    li.style.display = 'none'
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, 500)
}